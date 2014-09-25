'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.autoprefixer = {

    sm: function(test) {
        var actual = {
            css: grunt.file.read('tmp/a.css'),
            map: JSON.parse(grunt.file.read('tmp/a.css.map'))
        };

        var expected = {
            css: grunt.file.read('test/expected/a.css'),
            map: JSON.parse(grunt.file.read('test/expected/a.css.map'))
        };

        test.strictEqual(actual.css, expected.css);
        test.deepEqual(actual.map, expected.map);
        test.done();
    }

};
