var postcss = require('postcss');

module.exports = postcss.plugin('test-plugin', function () {
    return function (css, result) {
        result.warn('Test warning');
    }
});
