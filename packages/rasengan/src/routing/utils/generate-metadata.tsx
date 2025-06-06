import { Metadata, MetadataLink, MetaTag } from '../types.js';
import { JSX } from 'react';

/**
 * This function generates metadata useful for pages to show images when sharing on social media
 * @param {Metadata[]} metadatas
 */
export const generateMetadata = (metadatas: Metadata[]) => {
  const metadataElements: JSX.Element[] = [];

  metadatas.forEach((metadata) => {
    const { openGraph, twitter, links, metaTags } = metadata;

    // Handling openGraph
    if (openGraph) {
      const { title, description, url, image, width, height, type } = openGraph;

      if (title) {
        metadataElements.push(
          <meta
            key="og:title"
            property="og:title"
            content={title}
            data-rg="true"
          />
        );
      }

      if (description) {
        metadataElements.push(
          <meta
            key="og:description"
            property="og:description"
            content={description}
            data-rg="true"
          />
        );
      }

      if (url) {
        metadataElements.push(
          <meta key="og:url" property="og:url" content={url} data-rg="true" />
        );
      }

      if (image) {
        metadataElements.push(
          <meta
            key="og:image"
            property="og:image"
            content={image}
            data-rg="true"
          />
        );
      }

      if (width) {
        metadataElements.push(
          <meta
            key="og:image:width"
            property="og:image:width"
            content={width}
            data-rg="true"
          />
        );
      }

      if (height) {
        metadataElements.push(
          <meta
            key="og:image:height"
            property="og:image:height"
            content={height}
            data-rg="true"
          />
        );
      }

      metadataElements.push(
        <meta
          key="og:type"
          property="og:type"
          content={type || 'website'}
          data-rg="true"
        />
      );
    }

    // Handling twitter
    if (twitter) {
      const { card, site, creator, image, title, description } = twitter;

      metadataElements.push(
        <meta
          key="twitter:card"
          name="twitter:card"
          content={card || 'summary_large_image'}
          data-rg="true"
        />
      );

      if (site) {
        metadataElements.push(
          <meta
            key="twitter:site"
            name="twitter:site"
            content={site}
            data-rg="true"
          />
        );
      }

      if (creator) {
        metadataElements.push(
          <meta
            key="twitter:creator"
            name="twitter:creator"
            content={creator}
            data-rg="true"
          />
        );
      }

      if (image) {
        metadataElements.push(
          <meta
            key="twitter:image"
            name="twitter:image"
            content={image}
            data-rg="true"
          />
        );
      }

      if (title) {
        metadataElements.push(
          <meta
            key="twitter:title"
            name="twitter:title"
            content={title}
            data-rg="true"
          />
        );
      }

      if (description) {
        metadataElements.push(
          <meta
            key="twitter:description"
            name="twitter:description"
            content={description}
            data-rg="true"
          />
        );
      }
    }

    // Handling links
    if (links) {
      metadataElements.push(...generateLinks(links));
    }

    // Handling metadata tags
    if (metaTags) {
      metadataElements.push(...generateMetaTags(metaTags));
    }
  });

  return metadataElements;
};

/**
 * This function generates links for metadata
 */
const generateLinks = (links: MetadataLink[]) => {
  return links.map((link) => {
    const { rel, sizes, type, href } = link;

    return (
      <link
        key={rel}
        rel={rel}
        sizes={sizes || '32x32'}
        type={type || 'image/png'}
        href={href}
        data-rg="true"
      />
    );
  });
};

/**
 * This function generates meta tags for metadata
 * @param metaTags
 * @returns
 */
const generateMetaTags = (metaTags: MetaTag[]) => {
  return metaTags.map((metaTag) => {
    const { content, name, property } = metaTag;

    return (
      <meta
        key={property ?? name}
        property={property ?? name}
        content={content}
        data-rg="true"
      />
    );
  });
};
