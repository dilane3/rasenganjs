import React from "react";
import ReactDOMServer from "react-dom/server";
// @ts-ignore
import AppRouter from "./../../../../src/app/app.router";
// @ts-ignore
import App from "./../../../../src/main";
// @ts-ignore
import Template from "./../../../../src/template";

// @ts-ignore
import { generateStaticRoutes } from "../routing/utils/index.js";
import {
  StaticHandlerContext,
  StaticRouterProvider,
} from "react-router-dom/server.js";
import { Router } from "@remix-run/router";

// @ts-ignore
import config from "./../../../../rasengan.config.js";
import {
  Component,
  ErrorBoundary,
  Heads,
  Body,
  Scripts,
} from "../core/components/index.js";
import * as H from "react-helmet-async";

// const ABORT_DELAY = 5000;

const TemplateHtml = ({
  helmetContext,
  bootstrap,
}: {
  helmetContext: any;
  bootstrap: string;
}) => {
  return (
    <Template
      Head={({ children }) => (
        <Heads data={helmetContext} bootstrap={bootstrap}>
          {children}
        </Heads>
      )}
      Body={({ children }) => <Body>{children}</Body>}
      Script={({ children }) => (
        <Scripts bootstrap={bootstrap}>{children}</Scripts>
      )}
    />
  );
};


/**
 * Function used to render the app on the server
 * @param router 
 * @param context 
 * @param helmetContext 
 * @returns 
 */
export function render(
  router: Router,
  context: StaticHandlerContext,
  helmetContext: any = {}
) {
  const html = ReactDOMServer.renderToString(
    config.reactStrictMode ? (
      <React.StrictMode>
        <H.HelmetProvider context={helmetContext}>
          <ErrorBoundary>
            <App Component={Component}>
              <StaticRouterProvider router={router} context={context} />
            </App>
          </ErrorBoundary>
        </H.HelmetProvider>
      </React.StrictMode>
    ) : (
      <H.HelmetProvider context={helmetContext}>
        <ErrorBoundary>
          <App Component={Component}>
            <StaticRouterProvider router={router} context={context} />
          </App>
        </ErrorBoundary>
      </H.HelmetProvider>
    )
  );

  return { html };
}

export const staticRoutes = generateStaticRoutes(AppRouter);
export const loadTemplateHtml = (helmetContext: any, bootstrap: string) => {
  const html = ReactDOMServer.renderToString(
    <TemplateHtml helmetContext={helmetContext} bootstrap={bootstrap} />
  );

  return `
  <!DOCTYPE html>
  ${html}
  `;
};
