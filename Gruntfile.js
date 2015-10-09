var path = require('path');

module.exports = function (grunt) {

	var cssFiles = [
			'https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css'
			, './lib/bootstrap-rtl/dist/css/bootstrap-rtl.css'
			, './lib/jasny-bootstrap/dist/css/jasny-bootstrap.min.css'
			, './lib/select2/select2.css'
			, './lib/select2/select2.css'
			, './lib/angularjs-toaster/toaster.min.css'
			, '//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css'
			, './css/style.css'
		];


	var generateFilesList = function(files, isConcat, fileType) {
		//var files = grunt.config('files'),
		//	isConcat = grunt.config('isConcat');

		var result = "";

		if(isConcat) {
			result = '<script type="text/javascript" src="' + grunt.config('concat.dist.dest') + '"></script>\n';
		} else {
			var preFix = "";
			var postFix = "";

			switch (fileType) {
				case ('css') : {
					preFix = "\t<script type=\"text/javascript\" src=\"";
					postFix = "\"></script>\n";
				}
			}

			for(var i = 0, len = files.length; i < len; i++) {
				result += preFix + files[i] + postFix;
				console.log(preFix + files[i] + postFix)
			}
		}

		return result;
	}

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
		template: {
			'process-html-template': {
				'options': {
					'data': {
						'cssFiles': generateFilesList(cssFiles, false, "css")
					}
				},
				'files': {
					'client/index.html': ['client/index-tpl.html']
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
				src: [ 'tmp' , 'client/index.html']
			}
		}
	});

	grunt.loadNpmTasks('grunt-template');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['express:dev', 'open', 'watch' ]);
	grunt.registerTask('minify', ['html2js', 'ngAnnotate:dist', 'clean']);
	grunt.registerTask('runTemplate', ['clean', 'template']);
}
;

