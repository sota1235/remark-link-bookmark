import type { Html, Root } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { isUrl } from './url.js';
import { CacheOption, fetchOgpInfo } from './ogp.js';
import { buildBookmarkHtml } from './view.js';
import { logger } from './logger';

export type Options = {
  classPrefix?: string;
  mergeClassNames?: {
    container?: string;
    content?: string;
    info?: string;
    title?: string;
    titleLink?: string;
    description?: string;
    image?: string;
    footer?: string;
    footerLink?: string;
    favicon?: string;
  };
  cache?: CacheOption;
};

export const remarkLinkBookmark: Plugin<[options: Options], Root> = (
  options: Options,
) => {
  return async (tree: Root) => {
    const transformers: (() => Promise<void>)[] = [];
    visit(
      tree,
      'paragraph',
      (node, index) => {
        if (index === undefined) {
          logger('index is undefined');
          return;
        }

        // Only process if the paragraph has only one child
        if (node.children.length !== 1) {
          logger('node children length is not 1');
          return;
        }

        visit(node, 'text', (textNode) => {
          const text = textNode.value;

          if (!isUrl(text)) {
            logger(`text is not url: ${text}`);
            return;
          }

          transformers.push(async () => {
            const ogpInfo = await fetchOgpInfo(text, options.cache ?? {});
            if (ogpInfo === undefined) {
              return;
            }
            const linkCardNode: Html = {
              type: 'html',
              value: buildBookmarkHtml(ogpInfo, options),
            };

            tree.children.splice(index, 1, linkCardNode);
          });

          return;
        });
      },
      undefined,
    );
    await Promise.all(transformers.map((transformer) => transformer()));
  };
};
