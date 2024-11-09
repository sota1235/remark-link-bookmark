@sota1235/remark-link-bookmark
====

Remark plugin to convert link to bookmark component.

### Usage

```shell
npm i -E @sota1235/remark-link-bookmark
```

Then use like this.

```javascript
import { remark } from 'remark';
import { remarkLinkBookmark } from './dist/index.js';

const exampleMarkdown = `
# remark-link-bookmark

https://example.com/
`;

const result = await remark()
  .use(remarkLinkBookmark, {})
  .process(exampleMarkdown);

console.log(result.toString());
```

You will get the following output.

```markdown
# remark-link-bookmark

<div class="rlb-container">
  <div class="rlb-content">
    <div class="rlb-info">
      <h2 class="rlb-title">
        <a rel="noopener noreferrer" href="https://example.com/" class="rlb-title-link">
          Example Domain
        </a>
      </h2>
    </div>
  </div>
  <div class="rlb-footer">
    <a rel="noopener noreferrer" href="https://example.com/" class="rlb-footer-link">
      <img alt="example.com" src="https://www.google.com/s2/favicons?domain=https://example.com/" class="rlb-favicon">
      example.com
    </a>
  </div>
</div>
```

#### Options

```typescript
export type Options = {
  // class prefix for all each element
  classPrefix?: string;
  // class names for each element
  // for example, if you want to add extra class names for some compoentns, you can use this option.
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
  // cache options
  cache?: {
    // cache directory path
    cacheFilePath?: string;
    // cache file name  
    cacheFileName?: string;
  };
};
```

### Licence

This software is released under the MIT License, see LICENSE.txt.

## Author

[@sota1235](https://github.com/sota1235)
