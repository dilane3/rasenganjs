import type * as Express from 'express';
import { ManifestManager } from '../build/manifest.js';
import path from 'node:path';
import { RenderStreamFunction } from '../../entries/server/entry.server.js';
import { generateRoutes } from '../../routing/utils/index.js';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router';
import createRasenganRequest from './utils.js';
import {
  extractHeadersFromRRContext,
  extractMetaFromRRContext,
  isRedirectResponse,
  isStaticRedirectFromConfig,
} from '../dev/utils.js';
import { handleRedirectRequest } from '../dev/handlers.js';
import { AppConfig } from '../../core/config/type.js';
import { loadModuleSSR } from '../../core/config/utils/load-modules.js';
import { resolvePath } from '../../core/config/utils/path.js';
import { BuildOptions } from '../build/index.js';

interface CreateRequestHandlerOptions {
  build: BuildOptions;
}

export function createRequestHandler(options: CreateRequestHandlerOptions) {
  const { build: buildOptions } = options;

  const manifest = new ManifestManager(
    path.posix.join(
      buildOptions.buildDirectory,
      buildOptions.clientPathDirectory,
      buildOptions.manifestPathDirectory,
      'manifest.json'
    )
  );

  return async function requestHandler(
    req: Express.Request,
    res: Express.Response
  ) {
    try {
      // Get server entry
      const entry = await import(
        resolvePath(
          path.posix.join(
            buildOptions.buildDirectory,
            buildOptions.serverPathDirectory,
            buildOptions.entryServerPath
          )
        )
      );
      // Get AppRouter
      const AppRouter = await (
        await import(
          resolvePath(
            path.posix.join(
              buildOptions.buildDirectory,
              buildOptions.serverPathDirectory,
              'app.router.js'
            )
          )
        )
      ).default;
      // Get Config
      const configHandler: () => Promise<AppConfig> = await (
        await loadModuleSSR(
          path.posix.join(
            buildOptions.buildDirectory,
            buildOptions.serverPathDirectory,
            'config.js'
          )
        )
      ).default;
      const config = await configHandler();

      // extract render function
      const {
        render,
      }: {
        render: RenderStreamFunction;
      } = entry;

      // Get static routes
      const staticRoutes = generateRoutes(AppRouter);

      // Create static handler
      let handler = createStaticHandler(staticRoutes);

      // Create rasengan request for static routing
      let request = createRasenganRequest(req, res);
      let context = await handler.query(request);

      const redirects = await config.redirects();
      const redirectFound = await isStaticRedirectFromConfig(req, redirects);

      if (isRedirectResponse(context as Response) || redirectFound) {
        return await handleRedirectRequest(req, res, {
          context,
          redirects,
        });
      }

      if (!(context instanceof Response)) {
        // Extract meta from context
        const metadata = extractMetaFromRRContext(context);

        // Get assets tags
        const assets = manifest.generateMetaTags(''); // TODO: Add the correct path

        // Create static router
        let router = createStaticRouter(handler.dataRoutes, context);

        const headers = extractHeadersFromRRContext(context);

        // Set headers
        res.writeHead(context.statusCode, {
          ...Object.fromEntries(headers),
        });

        const Router = (
          <StaticRouterProvider router={router} context={context} />
        );

        // If stream mode enabled, render the page as a plain text
        return await render(Router, res, {
          metadata,
          assets,
          buildOptions,
        });
      }

      return context;
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
}

export function handleDocumentRequest() {}

export function handleDataRequest() {}
