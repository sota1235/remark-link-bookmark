import { ErrorResult, SuccessResult } from 'open-graph-scraper/types/lib/types';
import ogs from 'open-graph-scraper';

export type OgpInfo = {
  title: string;
  description?: string;
  faviconSrc?: string;
  ogImageSrc?: string;
  ogImageAlt?: string;
  displayUrl?: string;
  url: string;
};

function isError(result: ErrorResult | SuccessResult): result is ErrorResult {
  return result.error;
}

export async function fetchOgpInfo(url: string): Promise<OgpInfo | undefined> {
  const data = await ogs({ url });

  if (isError(data)) {
    return undefined;
  }

  const ogImage: {
    src: string | undefined;
    alt: string | undefined;
  } = {
    src: undefined,
    alt: undefined,
  };

  if (data.result.ogImage !== undefined) {
    ogImage.src = data.result.ogImage[0].url;
    ogImage.alt = data.result.ogImage[0].alt;
  }

  return {
    title: data.result.ogTitle || url,
    description: data.result.ogDescription,
    faviconSrc: `https://www.google.com/s2/favicons?domain=${url}`,
    ogImageSrc: ogImage.src,
    ogImageAlt: ogImage.alt,
    displayUrl: data.result.requestUrl,
    url,
  };
}
