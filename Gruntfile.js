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
			options: {
				livereload: true
			},
			html: {
				files: [ '**/*.html'],
				options: {
					livereload: true
				}
			},
			server: {
				files: [ 'server.js'],
				tasks: ['express:dev'],
				options: {
					livereload: true,
					spawn: false // Without this option specified express won't be reloaded
				}
			},
			js: {
				files: [ '**/*.js'],
				options: {
					livereload: true
				}
			},
			css: {
				files: [ '**/*.css'],
				options: {
					livereload: true
				}
			}
		},
		open: {
			express: {
				// Gets the port from the connect configuration
				path: 'http://localhost:3000'
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-open');

	grunt.registerTask('default', ['express:dev', 'open', 'watch' ])
}
;

