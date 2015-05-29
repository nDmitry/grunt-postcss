module.exports = function(grunt) {

    'use strict';

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
            dist: {
                options: {
                    map: {
                        inline: false
                    },
                    processors: [
                        require('csswring'),
                        require('./test/plugin')
                    ]
                },
                src: 'test/fixtures/a.css',
                dest: 'tmp/a.css'
            },
        },

        nodeunit: {
            tests: ['test/test.js'],
        },

    });

    grunt.loadTasks('tasks');

    grunt.registerTask('test', ['clean', 'postcss', 'nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);

};
