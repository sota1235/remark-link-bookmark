import { expect, test, vi } from 'vitest';
import { remark } from 'remark';
import { remarkLinkBookmark } from './plugin.js';

vi.mock('./ogp.js', () => ({
  fetchOgpInfo: vi.fn().mockResolvedValue({
    title: 'Example Domain',
    description: undefined,
    faviconSrc: 'https://www.google.com/s2/favicons?domain=https://example.com',
    ogImageSrc: undefined,
    ogImageAlt: undefined,
    url: 'https://example.com',
  }),
}));

test('Input markdown should be expected', async () => {
  const document = `
  # Sample

  https://example.com
  
  Not url text.
  
  [example](https://example.com/) is inline link

  [remark-link-card](https://www.npmjs.com/package/remark-link-card) is inline link
  
  ## 2nd section
  
  normal text.
  
  https://example.com
  `.trim();

  const file = await remark().use(remarkLinkBookmark, {}).process(document);

  expect(file.toString()).toMatchFileSnapshot('snapshots/output.md');
});
