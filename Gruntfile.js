module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        files: {
            lib: [
                'app/js/lib/jquery.js',
                'app/js/lib/jquery.cookie.js',
                'app/js/lib/lodash.underscore.js',
                'app/js/lib/backbone.js',
                'app/js/lib/backbone.marionette.js',
                'app/js/lib/handlebars.runtime.js',
                'app/js/lib/moment.js',
                'app/js/lib/moment.isocalendar.js',
                'app/js/lib/moment.lang.de.js',
                'app/js/lib/add2home.js',
                'app/js/lib/nprogress.js',
                'app/js/lib/numeral.min.js',
                'app/js/lib/numeral.lang.de.js'
            ],
            src: [
                'app/js/src/Setup.js',
                'app/js/src/App.js',
                'app/js/src/TemplateHelpers.js',
                'app/js/src/Core/Models.js',
                'app/js/src/Core/Collections.js',
                'app/js/src/Core/**/*.js',
                'app/js/src/User/Models.js',
                'app/js/src/User/Collections.js',
                'app/js/src/Groups/Models.js',
                'app/js/src/Groups/Collections.js',
                'app/js/src/Payments/Models.js',
                'app/js/src/Payments/Collections.js',
                'app/js/src/**/Controller.js',
                'app/js/src/**/*.js'
            ],
            less: 'app/less/main.less',
            templates: 'app/templates/**/*.html',
            index: 'app/index.html'
        },


        concat: {
            options: {
                separator: ';',

                banner: '/*!\n* <%= pkg.name %> by Sebastian Slomski and Dana Nedamaldeen - v<%= pkg.version %>\n' +
                        '* Created: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '* Author: <%= pkg.author.name %>\n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n*/'

            },
            dist: {
                src: ['<%= files.lib %>', 'dist/templates.js', '<%= files.src %>'],
                dest: 'dist/static/build.js'
            }
        },


        uglify: {
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: 'dist/static/build.js'
            }
        },


        handlebars: {
            compile: {
                options: {
                    namespace: 'Handlebars.templates',
                    wrapped: true,
                    processName: function(filePath) {
                        return filePath.replace(/^app\//, '');
                    }
                },
                files: {
                    'dist/templates.js': '<%= files.templates %>'
                }
            }
        },


        less: {
            development: {
                files: {
                    'dist/static/build.css': '<%= files.less %>'
                }
            },
            production: {
                options: {
                    compress: true
                },
                files: {
                    'dist/static/build.css': '<%= files.less %>'
                }
            }
        },


        jshint: {
            all: ['grunt.js', '<%= files.src %>'],
            options: {
                browser: true,
                devel: true,
                curly: true,
                quotmark: 'single',
                strict: true,
                globals: {
                    self: true,
                    jQuery: true,
                    '$': true,
                    CL: true,
                    Backbone: true,
                    moment: true,
                    Handlebars: true,
                    Modernizr: true,
                    '_': true
                }
            }
        },


        watch: {
            files: ['<%= files.lib %>', '<%= files.src %>', '<%= files.templates %>'],
            tasks: 'default'
        },


        copy: {
            images: {
                expand: true,
                cwd: 'app/images/',
                src: '**/*',
                dest: 'dist/static/images/',
            }
        },


        clean: {
            build: ['dist']
        },


        connect: {
            server: {
                options: {
                    port: 5001,
                    base: 'dist',
                    keepalive: true
                }
            }
        }
    });


    grunt.registerTask('compile-index', function(target) {
        /*
         * Compiles the index template. Adds all the variables in the settings file
         * to the App object
         * */
        var data = grunt.file.readJSON('settings/' + target + '.json');
        var template = grunt.file.read(grunt.config.get('files').index);
        data = {
            data: data,
            json: JSON.stringify(data),
            now: +new Date()
        };
        template = grunt.template.process(template, {data: data});
        grunt.file.write('dist/index.html', template);
    });


    grunt.registerTask('default', ['clean', 'handlebars', 'concat', 'less:development', 'compile-index:development', 'copy']);
    grunt.registerTask('staging', ['clean', 'handlebars', 'concat', 'less:development', 'compile-index:staging', 'copy']);
    grunt.registerTask('production', ['clean', 'handlebars', 'concat', 'less:production', 'compile-index:production', 'copy']);
};
