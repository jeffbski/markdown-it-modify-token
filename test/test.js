'use strict';

var path = require('path');
var generate = require('markdown-it-testgen');
var expect = require('chai').expect;
var fs = require('fs');

describe('markdown-it-modify-token', function() {
  var md = require('markdown-it')({
    html: true,
    linkify: true,
    typography: true,
    modifyToken: function (token, env) {
      switch (token.type) {
      case 'image': // set all images to 200px width except for foo.gif
        if (token.attrObj.src !== 'foo.gif') {
          token.attrObj.width = '200px';
        }
        break;
      case 'link_open':
        token.attrObj.target = '_blank'; // set all links to open in new window
        if (env.linkPrefix && token.attrObj.href) {
          token.attrObj.href = env.linkPrefix + token.attrObj.href;
        }
        break;
      }
      // return a new or modified token otherwise it will use previous token
      return token;
    }
  }).use(require('../'));
  generate(path.join(__dirname, 'fixtures/attr-modification.txt'), md);

  it("Passes on env", function (done) {
    var html = md.render(fs.readFileSync(path.join(__dirname, 'fixtures/env.txt'), 'utf-8'), {
      linkPrefix: 'test/'
    });
    expect(html).to.equal("<p><a href=\"test/a\" target=\"_blank\">Hello</a></p>\n");
    done();
  });
});
