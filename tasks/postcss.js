'use strict';

var path = require('path');
var postcss = require('postcss');
var diff = require('diff');
var chalk = require('chalk');

module.exports = function(grunt) {

    var options;
    var processor;

    /**
     * Returns an input map contents if a custom map path was specified
     * @param {string} from Input CSS path
     * @returns {?string}
     */
    function getPrevMap(from) {
        if (typeof options.map.prev === 'string') {
            var mapPath = options.map.prev + path.basename(from) + '.map';

            if (grunt.file.exists(mapPath)) {
                return grunt.file.read(mapPath);
            }
        }
    }

    /**
     * @param {string} to Output CSS path
     * @returns {string}
     */
    function getSourcemapPath(to) {
        if (options.map.annotation.match(/[\/\\]$/)) {
            return path.join(options.map.annotation, path.basename(to)) + '.map';
        } else {
            return options.map.annotation;
        }
    }

    /**
     * @param {string} to Output CSS path
     * @returns {boolean|string}
     */
    function getAnnotation(to) {
        var annotation = true;

        if (typeof options.map.annotation === 'boolean') {
            annotation = options.map.annotation;
        }

        if (typeof options.map.annotation === 'string') {
            annotation = getSourcemapPath(to);
        }

        return annotation;
    }

    /**
     * @param {string} input Input CSS contents
     * @param {string} from Input CSS path
     * @param {string} to Output CSS path
     * @returns {{css: string, map: ?string}}
     */
    function process(input, from, to) {
        return processor.process(input, {
            map: (typeof options.map === 'boolean') ? options.map : {
                prev: getPrevMap(from),
                inline: (typeof options.map.inline === 'boolean') ? options.map.inline : true,
                annotation: getAnnotation(to),
                sourcesContent: (typeof options.map.sourcesContent === 'boolean') ? options.map.sourcesContent : true
            },
            from: from,
            to: to,
            safe: options.safe
        });
    }

    /**
     * @param {string} msg Log message
     */
    function log(msg) {
        grunt.verbose.writeln(msg);
    }

    grunt.registerMultiTask('postcss', 'Process CSS files.', function() {
        options = this.options({
            processors: [],
            map: false,
            diff: false,
            safe: false
        });

        var tally = {
            sheets: 0,
            maps: 0,
            diffs: 0
        };

        processor = postcss(options.processors);

        var done = this.async();
        var finished = 0;
        var processed = this.files.length;

        if (!this.files.length) {
            done();
        }

        this.files.forEach(function(f) {
            var src = f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file ' + chalk.cyan(filepath) + ' not found.');

                    return false;
                }

                return true;
            });

            if (src.length === 0) {
                grunt.log.error('No source files were found.');

                return done();
            }

            src.forEach(function(filepath) {
                var dest = f.dest || filepath;
                var input = grunt.file.read(filepath);

                process(input, filepath, dest).then(function(result) {
                    result.warnings().forEach(function(msg) {
                        grunt.log.error(msg.toString());
                    });

                    grunt.file.write(dest, result.css);
                    log('File ' + chalk.cyan(dest) + ' created.');
                    tally.sheets += 1;

                    if (result.map) {
                        var mapDest = dest + '.map';

                        if (typeof options.map.annotation === 'string') {
                            mapDest = path.join(path.dirname(dest), getSourcemapPath(dest));
                        }

                        grunt.file.write(mapDest, result.map.toString());
                        log('File ' + chalk.cyan(dest + '.map') + ' created (source map).');
                        tally.maps += 1;
                    }

                    if (options.diff) {
                        var diffPath = (typeof options.diff === 'string') ? options.diff : dest + '.diff';

                        grunt.file.write(diffPath, diff.createPatch(dest, input, result.css));
                        log('File ' + chalk.cyan(diffPath) + ' created (diff).');
                        tally.diffs += 1;
                    }

                    finished += 1;

                    if (finished === processed) {
                        if (tally.sheets) {
                            grunt.log.ok(tally.sheets + ' ' + 'processed ' + grunt.util.pluralize(tally.sheets, 'stylesheet/stylesheets') + ' created.');
                        }

                        if (tally.maps) {
                            grunt.log.ok(tally.maps + ' ' + grunt.util.pluralize(tally.maps, 'sourcemap/sourcemaps') + ' created.');
                        }

                        if (tally.diffs) {
                            grunt.log.ok(tally.diffs + ' ' + grunt.util.pluralize(tally.diffs, 'diff/diffs') + ' created.');
                        }

                        done();
                    }
                }).catch(function(error) {
                    if (error.name === 'CssSyntaxError') {
                        grunt.fatal(error.message + error.showSourceCode());
                    } else {
                        grunt.fatal(error);
                    }
                });
            });
        });
    });
};
