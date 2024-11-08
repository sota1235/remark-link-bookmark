import { OgpInfo } from './ogp';
import createDOMPurify from 'dompurify';
import clsx from 'clsx';
import { Options } from './plugin.js';
import { JSDOM } from 'jsdom';

function buildDescriptionHtml(
  description: string | undefined,
  className: string,
): string {
  return description !== undefined
    ? `<p class="${className}">${description}</p>`
    : '';
}

function buildOgpImageHtml(
  ogImageSrc: string | undefined,
  ogImageAlt: string | undefined,
  className: string,
): string {
  return ogImageSrc !== undefined
    ? `<img class="${className}" src="${ogImageSrc}" alt="${ogImageAlt}" />`
    : '';
}

export const buildBookmarkHtml = (
  { title, description, faviconSrc, ogImageSrc, ogImageAlt, url }: OgpInfo,
  { classPrefix = 'rlb', mergeClassNames }: Options,
): string => {
  const host = new URL(url).host;
  const dompurify = createDOMPurify(new JSDOM('').window);

  const containerClassName = clsx(
    `${classPrefix}-container`,
    mergeClassNames?.container,
  );
  const contentClassName = clsx(
    `${classPrefix}-content`,
    mergeClassNames?.content,
  );
  const infoClassName = clsx(`${classPrefix}-info`, mergeClassNames?.info);
  const titleClassName = clsx(`${classPrefix}-title`, mergeClassNames?.title);
  const titleLinkClassName = clsx(
    `${classPrefix}-title-link`,
    mergeClassNames?.titleLink,
  );
  const descriptionClassName = clsx(
    `${classPrefix}-description`,
    mergeClassNames?.description,
  );
  const imageClassName = clsx(`${classPrefix}-image`, mergeClassNames?.image);
  const footerClassName = clsx(
    `${classPrefix}-footer`,
    mergeClassNames?.footer,
  );
  const footerLinkClassName = clsx(
    `${classPrefix}-footer-link`,
    mergeClassNames?.footerLink,
  );
  const faviconImageClassName = clsx(
    `${classPrefix}-favicon`,
    mergeClassNames?.favicon,
  );

  // create output HTML
  return dompurify
    .sanitize(
      `
<div class="${containerClassName}">
  <div class="${contentClassName}">
    <div class="${infoClassName}">
      <h2 class="${titleClassName}">
        <a 
          class="${titleLinkClassName}"
          href="${url}" 
          target="_blank"
          rel="noopener noreferrer"  
        >
          ${title}
        </a>
      </h2>${buildDescriptionHtml(description, descriptionClassName)}
    </div>${buildOgpImageHtml(ogImageSrc, ogImageAlt, imageClassName)}
  </div>
  <div class="${footerClassName}">
    <a
      class="${footerLinkClassName}"
      href="${url}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img class="${faviconImageClassName}" src="${faviconSrc}" alt="${host}" />
      ${host}
    </a>
  </div>
</div>
`,
    )
    .trim();
};
