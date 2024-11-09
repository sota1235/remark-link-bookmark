export function isUrl(url: string): boolean {
  try {
    const instance = new URL(url);
    return instance.protocol === 'https:';
  } catch (e: unknown) {
    console.log(`${url} is not a valid URL. - ${e}`);
    return false;
  }
}
