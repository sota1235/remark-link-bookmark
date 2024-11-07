import { OgpInfo } from './ogp';

export const buildBookmarkHtml = (
  {
    title,
    description,
    faviconSrc,
    ogImageSrc,
    ogImageAlt,
    url,
    displayUrl,
  }: OgpInfo,
  {
    classPrefix,
  }: {
    classPrefix?: string;
  },
): string => {
  const faviconElement = faviconSrc
    ? `<img class="${classPrefix}-favicon" src="${faviconSrc}" alt="${title} favicon" width="16" height="16">`.trim()
    : '';

  const descriptionElement = description
    ? `<div class="${classPrefix}-description">${description}</div>`
    : '';

  // create image element
  const imageElement = ogImageSrc
    ? `<div class="${classPrefix}-image-container">
      <img class="${classPrefix}-image" src="${ogImageSrc}" alt="${ogImageAlt}" />
    </div>`.trim()
    : '';

  // create output HTML
  return `
<a class="${classPrefix}-container" href="${url}">
  <div class="${classPrefix}-info">
    <div class="${classPrefix}-title">${title}</div>
    ${descriptionElement}
    <div class="${classPrefix}-url-container">
      ${faviconElement}
      <span class="${classPrefix}-url">${displayUrl}</span>
    </div>
  </div>
  ${imageElement}
</a>
`.trim();
};
