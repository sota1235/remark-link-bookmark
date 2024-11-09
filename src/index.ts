import { remarkLinkBookmark as plugin } from './plugin.js';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import type { Options } from './plugin.js';

export type RemarkLinkBookmarkOptions = Options;
export const remarkLinkBookmark: Plugin<[options: Options], Root> = plugin;
