var processors = [
    require('cssnano')
];

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        clean: {
            tests: ['tmp'],
        },

        postcss: {
            defaults: {
                options: {
                    processors: processors
                },
                src: 'test/fixtures/a.css',
                dest: 'tmp/defaults.css'
            },
            mapInline: {
                options: {
                    map: true,
                    processors: processors
                },
                src: 'test/fixtures/a.css',
                dest: 'tmp/mapInline.css'
            },
            mapSeparate: {
                options: {
                    map: {
                        inline: false
                    },
                    processors: processors
                },
                src: 'test/fixtures/a.css',
                dest: 'tmp/mapSeparate.css'
            },
            mapAnnotationPath: {
                options: {
                    map: {
                        inline: false,
                        annotation: 'tmp/maps/'
                    },
                    processors: processors
                },
                src: 'test/fixtures/a.css',
                dest: 'tmp/mapAnnotationPath.css'
            },
            diff: {
                options: {
                    diff: true,
                    processors: processors
                },
                src: 'test/fixtures/a.css',
                dest: 'tmp/diff.css'
            },
            syntax: {
                options: {
                    syntax: require('postcss-scss'),
                    processors: []
                },
                src: 'test/fixtures/a.scss',
                dest: 'tmp/syntax.scss'
            },
            doWriteDest: {
                options: {
                    syntax: require('postcss-scss'),
                    writeDest: true
                },
                src: 'test/fixtures/a.scss',
                dest: 'tmp/doWriteDest.scss'
            },
            noWriteDest: {
                options: {
                    syntax: require('postcss-scss'),
                    writeDest: false
                },
                src: 'test/fixtures/a.scss',
                dest: 'tmp/noWriteDest.scss'
            }
        },

        nodeunit: {
            tests: ['test/test.js'],
        },

    });

    grunt.loadTasks('tasks');

    grunt.registerTask('test', ['clean', 'postcss', 'nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);

};
