'use strict';

var path = require('path');
var postcss = require('postcss');
var diff = require('diff');
var chalk = require('chalk');
var CssSyntaxError = require('postcss/lib/css-syntax-error');

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
                annotation: (typeof options.map.annotation === 'boolean') ? options.map.annotation : true,
                sourcesContent: (typeof options.map.sourcesContent === 'boolean') ? options.map.sourcesContent : true
            },
            from: from,
            to: to
        });
    }

    /**
     * @param {string} msg Log message
     */
    function log(msg) {
        if (!options.silent) {
            grunt.log.writeln(msg);
        }
    }

    grunt.registerMultiTask('postcss', 'Process CSS files.', function() {
        options = this.options({
            diff: false,
            map: false,
            processors: [],
            silent: false
        });

        processor = postcss(options.processors);

        var done = this.async();
        var finished = 0;
        var processed = this.files.length;

        this.files.forEach(function(f) {
            if (!f.src.length) {
                return grunt.fail.warn('No source files were found.');
            }

            f.src.forEach(function(filepath) {
                var dest = f.dest || filepath;
                var input = grunt.file.read(filepath);
                process(input, filepath, dest).then(function (result) {
                    result.warnings().forEach(function (msg) {
                        grunt.log.error(msg.toString());
                    });

                    grunt.file.write(dest, result.css);
                    log('File ' + chalk.cyan(dest) + ' created.');

                    if (result.map) {
                        grunt.file.write(dest + '.map', result.map.toString());
                        log('File ' + chalk.cyan(dest + '.map') + ' created (source map).');
                    }

                    if (options.diff) {
                        var diffPath = (typeof options.diff === 'string') ? options.diff : dest + '.diff';

                        grunt.file.write(diffPath, diff.createPatch(dest, input, result.css));
                        log('File ' + chalk.cyan(diffPath) + ' created (diff).');
                    }

                    finished += 1;
                    if (finished === processed) {
                        done();
                    }
                }).catch(function (error) {
                    if ( error instanceof CssSyntaxError ) {
                        grunt.fatal(error.message + error.showSourceCode());
                    } else {
                        grunt.fatal(error);
                    }
                });
            });
        });
    });
};
