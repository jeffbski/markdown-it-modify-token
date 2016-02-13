'use strict';

function modifyToken(token, modifyFn, env) {
  // create attrObj for convenient get/set of attributes
  var attrObj = (token.attrs) ? token.attrs.reduce(function (acc, pair) {
    acc[pair[0]] = pair[1];
    return acc;
  }, {}) : {};
  token.attrObj = attrObj;
  modifyFn(token, env);
  // apply any overrides or new attributes from attrObj
  Object.keys(token.attrObj).forEach(function (k) {
    token.attrSet(k, token.attrObj[k]);
  });
}

function noop() { }

module.exports = function (md) {
    md.core.ruler.push(
        'modify-token',
        function (state) {
          var modifyFn = md.options.modifyToken || noop;
          state.tokens.forEach(function (token) {
            if (token.children && token.children.length) {
              token.children.forEach(function (token) {
                modifyToken(token, modifyFn, state.env);
              });
            }
            modifyToken(token, modifyFn, state.env);
          });
          return false;
        }
    );
};
