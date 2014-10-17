module.exports = function(grunt) {
    "use strict";
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> by Michael Duve <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                preserveComments: false,
                mangle: {
                    except: ['jQuery', 'Backbone']
                },
                compress: {
                    drop_console: true
                }
            },
            app: {
                src: ['<%= pkg.name %>/src/js/app.js'],
                dest: '<%= pkg.name %>/build/js/app.js'
            },
            entry: {
                src: ['<%= pkg.name %>/src/js/entry.js'],
                dest: '<%= pkg.name %>/build/js/entry.js'
            },
            data: {
                src: ['<%= pkg.name %>/src/js/data.js'],
                dest: '<%= pkg.name %>/build/js/data.js'
            },
            world: {
                src: ['<%= pkg.name %>/src/js/world.js'],
                dest: '<%= pkg.name %>/build/js/world.js'
            },
            vendor: {
                src: ['<%= pkg.name %>/src/js/vendor/jquery-2.1.1.min.js', '<%= pkg.name %>/src/js/vendor/jquery-ui.min.js', '<%= pkg.name %>/src/js/vendor/modernizr.js', '<%= pkg.name %>/src/js/vendor/jquery.dataTables.min.js'],
                dest: '<%= pkg.name %>/build/js/vendor/vendor.js'
            }
        },
        compass: {
            options: {
                basePath: '<%= pkg.name %>',
                config: '<%= pkg.name %>/config.rb'
            },
            dev: {
                options: {
                    environment: "development"
                }
            },
            prod: {
                options: {
                    environment: "production"
                }
            }
        },
        watch: {
            js: {
                files: ['<%= uglify.app.src %>', '<%= uglify.entry.src %>', '<%= uglify.data.src %>', '<%= uglify.world.src %>'],
                tasks: ['uglify']
            },
            css: {
                files: ['<%= pkg.name %>/scss/main.scss', '<%= pkg.name %>/scss/_jquery.dataTables.scss'],
                tasks: ['compass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', []);

    grunt.registerTask('build', ["uglify"]);

    grunt.registerTask('dev', ['watch']);

};