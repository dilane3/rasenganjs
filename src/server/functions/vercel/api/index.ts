import fs from "node:fs/promises";
import path, { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  StaticHandlerContext,
  createStaticHandler,
  createStaticRouter,
} from "react-router-dom/server.js";
// @ts-ignore
import { createFetchRequest } from "rasengan";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create server for production only
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Get URL
    const url = req.url;
    const host = req.headers.host;

    // Get app path
    const appPath = join(__dirname, "..");

    // ! Favicon Fix
    if (url === "/favicon.ico") {
      return res.send(path.resolve(join(appPath, "dist/client/rasengan.png")));
    }

    // ! Robots Fix
    if (url === "/robots.txt") {
      return res.send(`
      user-agent: *
      disallow: /downloads/
      disallow: /private/
      allow: /
      
      user-agent: magicsearchbot
      disallow: /uploads/
    `);
    }

    // ! Sitemap Fix
    if (url === "/sitemap.xml") {
      return res.send(path.resolve(join(appPath, "dist/client/sitemap.xml")));
    }

    // ! Manifest Fix
    if (url === "/manifest.json") {
      return res.send(path.resolve(join(appPath, "dist/client/manifest.json")));
    }

    let template;
    let entry;
    // let manifest;

    // Always read fresh template in development
    const htmlFilePath = join(appPath, "dist/client/index.html");
    const serverFilePath = join(appPath, "dist/server/entry-server.js");
    // const ssrManifestFilePath = join(
    //   appPath,
    //   "dist/client/.vite/ssr-manifest.json"
    // );

    // Read template, server-renderer and manifest in production
    template = await fs.readFile(htmlFilePath, "utf-8");
    entry = await import(serverFilePath);
    // manifest = await fs.readFile(ssrManifestFilePath, "utf-8");

    // Extract render and staticRoutes from entry
    const { render, staticRoutes } = entry;

    // Create static handler
    let handler = createStaticHandler(staticRoutes);

    // Create fetch request for static routing
    // @ts-ignore
    let fetchRequest = createFetchRequest(req, host);
    let context = await handler.query(fetchRequest);

    // Handle redirects
    const status = (context as Response).status;

    if (status === 302) {
      const redirect = (context as Response).headers.get("Location");

      if (redirect) return res.redirect(redirect);
    }

    // Helmet context
    const helmetContext = {} as { helmet: any };

    // Create static router
    let router = createStaticRouter(
      handler.dataRoutes,
      context as StaticHandlerContext
    );

    const rendered = await render(router, context, helmetContext);

    // Get metadata
    const helmet = helmetContext.helmet;

    let head = `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
    `;

    let html = template
      .replace(`<!--app-head-->`, head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "");

    res
      .status(200)
      .setHeader("Content-Type", "text/html")
      .setHeader("Cache-Control", "max-age=31536000")
      .end(html);
  } catch (e: any) {
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
}
