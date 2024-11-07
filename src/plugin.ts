import type { Html, Root } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { isUrl } from './url';
import { fetchOgpInfo } from './ogp';
import { buildBookmarkHtml } from './view';

type Options = {
  className?: string;
};

const remarkLinkBookmark: Plugin<[options: Options], Root> = ({
  className = 'link-bookmark',
}: Options) => {
  console.log(className);
  return async (tree: Root) => {
    const transformers: (() => Promise<void>)[] = [];
    visit(
      tree,
      'paragraph',
      (node, index) => {
        if (index === undefined) {
          console.log('index is undefined');
          return;
        }

        // Only process if the paragraph has only one child
        if (node.children.length !== 1) {
          console.log('node children length is not 1');
          return;
        }

        const child = node.children[0];

        if (child.type !== 'text') {
          console.log('child type is not text');
          return;
        }

        const text = child.value;

        if (!isUrl(text)) {
          console.log('text is not url');
          return;
        }

        transformers.push(async () => {
          const ogpInfo = await fetchOgpInfo(text);
          if (ogpInfo === undefined) {
            return;
          }
          const linkCardNode: Html = {
            type: 'html',
            value: buildBookmarkHtml(ogpInfo),
          };

          tree.children.splice(index, 1, linkCardNode);
        });

        return;
      },
      undefined,
    );
    await Promise.all(transformers.map((transformer) => transformer()));
  };
};

export default remarkLinkBookmark;
