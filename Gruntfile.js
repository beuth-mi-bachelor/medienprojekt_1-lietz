module.exports = function(grunt) {
    "use strict";
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> by VideoChop-Team <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                preserveComments: false,
                mangle: {
                    except: ['jQuery']
                },
                compress: {
                    drop_console: true
                }
            },
            app: {
                src: ['<%= pkg.name %>/js/app.js'],
                dest: '<%= pkg.name %>/build/js/app.js'
            },
            vendor: {
                src: ['<%= pkg.name %>/js/lib/jquery-2.1.1.min.js', '<%= pkg.name %>/js/lib/modernizr.js'],
                dest: '<%= pkg.name %>/build/js/lib/vendor.js'
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
                files: ['<%= uglify.app.src %>', '<%= uglify.vendor.src %>'],
                tasks: ['uglify']
            },
            scss: {
                files: ['<%= pkg.name %>/scss/*.scss'],
                tasks: ['compass', 'autoprefixer']
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 4 versions']
            },
            single_file: {
                src: '<%= pkg.name %>/css/main.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');

    // Default task(s).
    grunt.registerTask('default', []);

    grunt.registerTask('build', ["uglify"]);

    grunt.registerTask('dev', ['watch']);

};