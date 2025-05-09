import React, { JSX, use, useMemo } from 'react';
import { RootComponentProps } from '../types.js';
import { generateMetadata, getRouter } from '../utils/index.js';
import { Outlet } from 'react-router';
import {
  LayoutComponent,
  Metadata,
  MetadataWithoutTitleAndDescription,
} from '../types.js';

/**
 * App component that represent the entry point of the application
 */
export const RootComponent = ({
  router: AppRouterPromise,
  children = undefined,
}: RootComponentProps) => {
  // Return children if they exist
  if (children) return children;

  const AppRouter = use(AppRouterPromise);

  // Otherwise, get the router and return it
  let Router = getRouter(AppRouter);

  return <Router />;
};

/**
 * Head component
 * @params data - Helmet context
 * @returns
 */
export const HeadComponent = ({
  metadata,
  assets = [],
  children = undefined,
}: {
  metadata: {
    page: Metadata;
    layout: MetadataWithoutTitleAndDescription;
  };
  assets?: JSX.Element[];
  children?: React.ReactNode;
  bootstrap?: string;
  styles?: string;
}) => {
  // Generate meta tags
  const metaTags = React.useMemo(() => {
    const metadatas = [];

    if (metadata) {
      if (metadata.page) metadatas.push(metadata.page);
      if (metadata.layout) metadatas.push(metadata.layout);
    }

    return generateMetadata(metadatas);
  }, [metadata]);

  const { title, description } = useMemo(() => {
    if (!metadata) return { title: 'Rasengan', description: '' };

    const title = metadata.page.title;
    const description = metadata.page.description;

    return { title, description };
  }, [metadata]);

  return (
    <head>
      <meta name="generator" content="Rasengan.js"></meta>
      {metaTags}

      {assets}

      <title>{title}</title>
      <meta name="description" content={description} data-rg="true" />

      {children}
    </head>
  );
};

/**
 * Body component
 */
export const BodyComponent = ({
  children = undefined,
  asChild = false,
  AppContent = undefined,
}: {
  children?: React.ReactNode;
  asChild?: boolean;
  AppContent?: React.ReactNode;
}) => {
  return (
    <body>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<b>Enable JavaScript to run this app.</b>`,
        }}
      />

      <div id="root">{asChild && AppContent}</div>

      {children}
    </body>
  );
};

/**
 * Scripts component
 */
export const ScriptComponent = ({
  children = undefined,
}: {
  children?: React.ReactNode;
}) => {
  return <React.Fragment>{children}</React.Fragment>;
};

/**
 * Default layout component
 */
const DefaultLayout: LayoutComponent = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};
DefaultLayout.path = '/';

export { DefaultLayout };
