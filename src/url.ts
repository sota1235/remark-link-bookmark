export function isUrl(url: string): boolean {
  const instance = new URL(url);
  return instance.protocol === 'https:';
}
