import { OgpInfo } from './ogp';

export const buildBookmarkHtml = ({
  title,
  description,
  faviconSrc,
  ogImageSrc,
  ogImageAlt,
  url,
  displayUrl,
}: OgpInfo): string => {
  const faviconElement = faviconSrc
    ? `<img class="rlc-favicon" src="${faviconSrc}" alt="${title} favicon" width="16" height="16">`.trim()
    : '';

  const descriptionElement = description
    ? `<div class="rlc-description">${description}</div>`
    : '';

  // create image element
  const imageElement = ogImageSrc
    ? `<div class="rlc-image-container">
      <img class="rlc-image" src="${ogImageSrc}" alt="${ogImageAlt}" />
    </div>`.trim()
    : '';

  // create output HTML
  const outputHTML = `
<a class="rlc-container" href="${url}">
  <div class="rlc-info">
    <div class="rlc-title">${title}</div>
    ${descriptionElement}
    <div class="rlc-url-container">
      ${faviconElement}
      <span class="rlc-url">${displayUrl}</span>
    </div>
  </div>
  ${imageElement}
</a>
`.trim();

  return outputHTML;
};
