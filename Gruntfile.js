var path = require('path');

module.exports = function (grunt) {

	var cssFiles = [
			'https://maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css'
			, './lib/bootstrap-rtl/dist/css/bootstrap-rtl.css'
			, './lib/select2/select2.css'
			, './lib/select2/select2.css'
			, './lib/angularjs-toaster/toaster.min.css'
			, '//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css'
			, './css/style.css'
		];

	var vendorJsFiles = [

		'https://code.jquery.com/jquery-2.1.1.min.js'
		, './lib/bootstrap-rtl/dist/js/html5shiv.js'
		, './lib/bootstrap-rtl/dist/js/respond.min.js'
		, './lib/ng-file-upload/angular-file-upload-shim.min.js'

		// Angular
		, './lib/angular/angular.js'
		, './lib/angular-cookies/angular-cookies.js'
		, './lib/angular-animate/angular-animate.js'
		, './lib/angular-sanitize/angular-sanitize.js'
		, './lib/angular-messages/angular-messages.js'
		, './lib/angular-bootstrap/ui-bootstrap-tpls.js'
		, './lib/angular-ui-router/release/angular-ui-router.js'

		// Ui-Select2
		, './lib/select2/select2.js'
		, './lib/angular-ui-select2/src/select2.js'

		// Toaster
		, './lib/angularjs-toaster/toaster.js'

		// Parsing CVs
		, './lib/jszip/dist/jszip.js'
		, './lib/docx/docx.js'

		// File Upload - - danial.farid
		, './lib/ng-file-upload/angular-file-upload.js'

		, './lib/bootstrap-rtl/dist/js/holder.js'

		// localForage
		, './lib/localforage/dist/localforage.js'
		, './lib/angular-localforage/dist/angular-localForage.js'
	];

	var appJsFiles = [
		'./js/app.js'

		,'./js/routingConfig.js'
		,'./js/controllers/header-controller.js'
		,'./js/controllers/job-board-controller.js'
		,'./js/controllers/company-board-controller.js'
		,'./js/controllers/company-controller.js'
		,'./js/controllers/home-controller.js'
		,'./js/controllers/dashboard-controller.js'
		,'./js/controllers/dashboard-list-controller.js'
		,'./js/controllers/user-controller.js'
		,'./js/controllers/job-controller.js'
		,'./js/controllers/job-full-controller.js'
		,'./js/controllers/company-details-controller.js'
		,'./js/controllers/job-details-controller.js'
		,'./js/controllers/login-register-controller.js'
		,'./js/controllers/empty-controller.js'
		,'./js/controllers/logo-gallery-controller.js'
		,'./js/controllers/send-cv-dialog-controller.js'

		,'./js/services/app-manager-service.js'
		,'./js/controllers/login-controller.js'
		,'./js/controllers/register-controller.js'
		,'./js/services/data-manager-service.js'
		,'./js/services/auth-service.js'
		,'./js/services/mail-service.js'
		,'./js/services/cv-parser.js'
		,'./js/services/common-service.js'
		,'./js/services/utils-services.js'

		,'./js/models/job.js'
		,'./js/models/modelTransformer.js'

		,'./js/directives/directives.js'
		,'./js/directives/company-card.js'
		,'./js/directives/user-card.js'
		,'./js/directives/upload-cv-directive.js'
	]


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
					preFix = "\t<link href=";
					postFix = " rel=\"stylesheet\">\n";
					break;
				}
 				case ('js') : {
					preFix = "\t<script type=\"text/javascript\" src=\"";
					postFix = "\"></script>\n";
					break;
				}
			}

			for(var i = 0, len = files.length; i < len; i++) {
				result += preFix + files[i] + postFix;
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
						cssFiles: generateFilesList(cssFiles, false, "css"),
						vendorJsFiles: generateFilesList(vendorJsFiles, false, "js"),
						appJsFiles: generateFilesList(appJsFiles, false, "js")
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

