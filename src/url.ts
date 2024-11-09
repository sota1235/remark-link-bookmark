import { logger } from './logger';

export function isUrl(url: string): boolean {
  try {
    const instance = new URL(url);
    return instance.protocol === 'https:';
  } catch (e: unknown) {
    logger(`${url} is not a valid URL. - ${e}`);
    return false;
  }
}
