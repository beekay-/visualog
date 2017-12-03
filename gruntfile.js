module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Concat
        concat: {
            map: {
                src: [
                    'app/static/js/vendor/jquery.js',
                    'app/static/js/global.js',
                    'app/static/js/map.js'
                ],
                dest: 'app/static/js/app.js'
            }
        },
        // Uglify
        uglify: {
            development: {
                options: {
                    preserveComments: false
                },
                files: {
                    'app/static/js/app.min.js': 'app/static/js/app.js',
                }
            }
        },
        // CSS Autoprefixer
        /*autoprefixer: {
            dist: {
                files: {
                    'build/css/app-prefixed.css': 'build/css/app.css'
                }
            }
        },*/
        // CSS Minify
        cssmin: {
            options: {
                shorthandCompacting: true,
                keepSpecialComments: 0
            },
			target: {
				files: {
					'app/static/css/style.min.css': [
                        'app/static/css/style.css'
					]
				}
			}
        },
        watch: {
            scripts: {
                files: ['app/static/js/*.js','app/static/css/*.css'],
                tasks: ['concat','uglify','cssmin'],
                options: {
                    spawn: false,
                },
            },
        }
    });
    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Run Tasks
    grunt.registerTask('default', ['concat:map', 'uglify', /*'autoprefixer',*/ 'cssmin', 'watch']);
};
