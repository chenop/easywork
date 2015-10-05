var path = require('path');

module.exports = function (grunt) {

	grunt.initConfig({
		express: {
			options: {
				port : process.env.PORT || 3000
				// Override defaults here
			},
			dev: {
				options: {
					script: 'server.js'
//					debug : true //enable debugging
				}
			},
			prod: {
				options: {
					script: 'dist/app.js',
					node_env: 'production'
				}
			},
			test: {
				options: {
					script: 'path/to/test/server.js'
				}
			}
		},
		watch: {
			scripts: {
				files: ['client/js/**/*.js', 'client/views/**/*.html', 'client/css/**/*.css'],
				//tasks: ['default'],
				options: {
					livereload: true,
				},
			},
			server: {
				files: [ 'server.js', 'server/**/*.js'],
				tasks: ['express:dev'],
				options: {
					livereload: true,
					spawn: false // Without this option specified express won't be reloaded
				}
			},
            configFiles: {
                files: [ 'Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            options: {
                debounceDelay: 100,
            },
		},
		open: {
			express: {
				// Gets the port from the connect configuration
				path: 'http://localhost:3000'
			}
		},
		html2js: {
			dist: {
				src: [ 'client/views/**/*.html' ],
				dest: 'tmp/templates.js'
			}
		},
        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            dist: {
                files: {
                    'dist/app.js' : ['client/lib/**/*.js', 'client/css/**/*.js', 'client/js/**/*.js', 'tmp/templates.js' ],
                },
            },
        },
		uglify: {
			dist: {
				files: {
					'dist/app.js': [ 'dist/app.js' ]
				}
			}
		},
		clean: {
			temp: {
				src: [ 'tmp' ]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-uglify')

	grunt.registerTask('default', ['express:dev', 'open', 'watch' ])
	grunt.registerTask('minify', ['html2js', 'ngAnnotate:dist', 'clean'])
}
;

