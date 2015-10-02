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
					script: 'path/to/prod/server.js',
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
        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            dist: {
                files: [{
                    src: ['client/js/models/**.js'],
                    expand: true,
                    //ext: '.annotated.js',
                    //extDot: 'last'
                    //ext: '.annotated.js', // Dest filepaths will have this extension.
                    //extDot: 'last',       // Extensions in filenames begin after the last dot
                    //dest: '.tmp'
                }],
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ng-annotate');

	grunt.registerTask('default', ['express:dev', 'open', 'watch' ])
	grunt.registerTask('annotate', ['ngAnnotate'])
}
;

