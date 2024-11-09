import { ErrorResult, SuccessResult } from 'open-graph-scraper/types/lib/types';
import ogs from 'open-graph-scraper';
import * as fs from 'node:fs';
import { logger } from './logger.js';

export type OgpInfo = {
  title: string;
  description?: string;
  faviconSrc: string;
  ogImageSrc?: string;
  ogImageAlt?: string;
  url: string;
};

export type CacheOption = {
  cacheFilePath?: string;
  cacheFileName?: string;
};

function isError(result: ErrorResult | SuccessResult): result is ErrorResult {
  return result.error;
}

export async function fetchOgpInfo(
  url: string,
  { cacheFilePath, cacheFileName }: CacheOption,
): Promise<OgpInfo | undefined> {
  const cacheEnabled =
    cacheFilePath !== undefined && cacheFileName !== undefined;
  if (cacheEnabled) {
    const cacheData = await fs.promises.readFile(
      `${cacheFilePath}/${cacheFileName}`,
      'utf-8',
    );
    const cache = JSON.parse(cacheData);
    if (cache[url] !== undefined) {
      logger(`Cache hit: ${url}`);
      return cache[url];
    }
  }

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

  const result = {
    title: data.result.ogTitle || url,
    description: data.result.ogDescription,
    faviconSrc: `https://www.google.com/s2/favicons?domain=${url}`,
    ogImageSrc: ogImage.src,
    ogImageAlt: ogImage.alt,
    url,
  };

  if (cacheEnabled) {
    const cacheData = await fs.promises.readFile(
      `${cacheFilePath}/${cacheFileName}`,
      'utf-8',
    );
    const cache = JSON.parse(cacheData);
    cache[url] = result;
    await fs.promises.writeFile(
      `${cacheFilePath}/${cacheFileName}`,
      JSON.stringify(cache, null, 2),
    );
    logger(`Cache updated: ${url}`);
  }

  return result;
}
