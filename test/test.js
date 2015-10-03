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

exports.gruntPostcss = {

    defaults: function(test) {
        var actual = {
            css: grunt.file.read('tmp/defaults.css'),
        };

        var expected = {
            css: grunt.file.read('test/expected/defaults.css'),
        };

        test.strictEqual(actual.css, expected.css);
        test.ok(!grunt.file.exists('tmp/defaults.css.map'));
        test.done();
    },

    mapInline: function(test) {
        var actual = {
            css: grunt.file.read('tmp/mapInline.css'),
        };

        var expected = {
            css: grunt.file.read('test/expected/mapInline.css'),
        };

        test.strictEqual(actual.css, expected.css);
        test.ok(!grunt.file.exists('tmp/mapInline.css.map'));
        test.done();
    },

    mapSeparate: function(test) {
        var actual = {
            css: grunt.file.read('tmp/mapSeparate.css'),
            map: grunt.file.read('tmp/mapSeparate.css.map'),
        };

        var expected = {
            css: grunt.file.read('test/expected/mapSeparate.css'),
            map: grunt.file.read('test/expected/mapSeparate.css.map'),
        };

        test.strictEqual(actual.css, expected.css);
        test.strictEqual(actual.map, expected.map);
        test.done();
    },

    mapAnnotationPath: function(test) {
        var actual = {
            css: grunt.file.read('tmp/mapAnnotationPath.css'),
            map: grunt.file.read('tmp/maps/mapAnnotationPath.css.map'),
        };

        var expected = {
            css: grunt.file.read('test/expected/mapAnnotationPath.css'),
            map: grunt.file.read('test/expected/maps/mapAnnotationPath.css.map'),
        };

        test.strictEqual(actual.css, expected.css);
        test.strictEqual(actual.map, expected.map);
        test.ok(!grunt.file.exists('tmp/mapAnnotationPath.css.map'));
        test.done();
    },

    diff: function(test) {
        var actual = {
            css: grunt.file.read('tmp/diff.css'),
            map: grunt.file.read('tmp/diff.css.diff'),
        };

        var expected = {
            css: grunt.file.read('test/expected/diff.css'),
            map: grunt.file.read('test/expected/diff.css.diff'),
        };

        test.strictEqual(actual.css, expected.css);
        test.strictEqual(actual.map, expected.map);
        test.done();
    },

    syntax: function(test) {
        var actual = {
            scss: grunt.file.read('tmp/syntax.scss'),
        };

        var expected = {
            scss: grunt.file.read('test/expected/syntax.scss'),
        };

        test.strictEqual(actual.scss, expected.scss);
        test.done();
    },

    writeDest: function(test) {
        test.ok(grunt.file.exists('tmp/doWriteDest.scss'));
        test.ok(!grunt.file.exists('tmp/noWriteDest.scss'));
        test.done();
    },
};
