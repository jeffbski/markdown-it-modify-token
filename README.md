# markdown-it-modify-token

> markdown-it plugin for modifying tokens including content or element attributes in the markdown document. For example it can modify image or link attributes.

## Usage

#### Enable plugin

```js
var md = require('markdown-it')({
  modifyToken: function (token, env) {
    // see API https://markdown-it.github.io/markdown-it/#Token
    // token will also have an attrObj property added for convenience
    // which allows easy get and set of attribute values.
    // It is prepopulated with the current attr values.
    // Values returned in token.attrObj will override existing attr values.
    // env will contain any properties passed to markdown-it's render
    // Token can be modified in place, no return is necessary
    switch (token.type) {
    case 'image': // set all images to 200px width except for foo.gif
      if (token.attrObj.src !== 'foo.gif') {
        token.attrObj.width = '200px';
      }
      break;
    case 'link_open':
      token.attrObj.target = '_blank'; // set all links to open in new window
      break;
    }
  }
}).use(require('markdown-it-modify-token')); // <-- this use(package_name) is required
```

#### Example

```md
[Hello](test)
![Image](foo.gif)
```

with this config

```js
var md = require('markdown-it')({
  modifyToken: function (token, env) {
    switch (token.type) {
    case 'image': // set all images to 200px width
      token.attrObj.width = '200px';
      break;
    case 'link_open':
      token.attrObj.target = '_blank'; // set all links to open in new window
      break;
    }
  }
}).use(require('markdown-it-modify-token')); // <-- this use(package_name) is required
```

Will result in roughly

```html
<a href="test" target="_blank">Hello</a>
<img src="foo.gif" width="200px"/>
```

Due to the token types we are handling in our switch statement, we can affect both image and link attributes.

### Testing

```bash
npm test
```

### Inspiration

Thanks to Martin Heidegger for https://github.com/martinheidegger/markdown-it-replace-link which I used as a starting point for building this plugin.
