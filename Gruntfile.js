var path = require('path');

module.exports = function (grunt) {


	var cssFiles = [
		'client/lib/angular-ui-select/dist/select.css'
		, 'client/lib/angularjs-toaster/toaster.min.css'
		, 'client/lib/font-awesome/css/font-awesome.min.css'
		, 'client/lib/feedback-directive/dist/feedback.css'
		, 'client/css/font.css'
		, 'client/css/style.css'
	];

	var vendorJsFiles = [

		'client/lib/jquery/dist/jquery.min.js'

		// Angular
		, 'client/lib/angular/angular.js'
		, 'client/lib/angular-cookies/angular-cookies.js'
		, 'client/lib/angular-animate/angular-animate.js'
		, 'client/lib/angular-messages/angular-messages.js'
		, 'client/lib/bootstrap/dist/js/bootstrap.js'
		, 'client/lib/angular-bootstrap/ui-bootstrap-tpls.js'
		, 'client/lib/angular-ui-router/release/angular-ui-router.js'

		// Ui-Select2
		, 'client/lib/angular-ui-select/dist/select.js'

		// Toaster
		, 'client/lib/angularjs-toaster/toaster.js'

		// feedback-directive
		, 'client/lib/feedback-directive/dist/feedback.js'

		// File Upload - - danial.farid
		, 'client/lib/ng-file-upload/ng-file-upload.js'
		, 'client/lib/angular-file-saver/dist/angular-file-saver.bundle.js'

		, 'client/lib/bootstrap-rtl/dist/js/holder.js'

		// localForage
		, 'client/lib/angular-local-storage/dist/angular-local-storage.js'
		, 'client/lib/localforage/dist/localforage.js'
		, 'client/lib/angular-localforage/dist/angular-localForage.js'
	];

	var appJsFiles = [
		'client/js/app.js'

		, 'client/js/routingConfig.js'
		, 'client/js/controllers/header-controller.js'
		, 'client/js/controllers/footer-controller.js'
		, 'client/js/controllers/job-board-controller.js'
		, 'client/js/controllers/company-board-controller.js'
		, 'client/js/controllers/company-controller.js'
		, 'client/js/controllers/home-controller.js'
		, 'client/js/controllers/dashboard-controller.js'
		, 'client/js/controllers/dashboard-list-controller.js'
		, 'client/js/controllers/user-controller.js'
		, 'client/js/controllers/job-controller.js'
		, 'client/js/controllers/job-full-controller.js'
		, 'client/js/controllers/company-details-controller.js'
		, 'client/js/controllers/job-details-controller.js'
		, 'client/js/controllers/login-register-controller.js'
		, 'client/js/controllers/empty-controller.js'
		, 'client/js/controllers/logo-gallery-controller.js'
		, 'client/js/controllers/send-cv-dialog-controller.js'
		, 'client/js/controllers/yesNoModal-controller.js'
		, 'client/js/controllers/unsuscribe-controller.js'
		, 'client/js/controllers/cv-controller.js'
		, 'client/js/controllers/login-controller.js'
		, 'client/js/controllers/register-controller.js'

		, 'client/js/services/api-helper-service.js'
		, 'client/js/services/app-manager-service.js'
		, 'client/js/services/data-manager-service.js'
		, 'client/js/services/auth-service.js'
		, 'client/js/services/mail-service.js'
		, 'client/js/services/common-service.js'
		, 'client/js/services/utils-services.js'
		, 'client/js/services/cv-service.js'
		, 'client/js/services/login-register-service.js'

		, 'client/js/models/job.js'
		, 'client/js/models/modelTransformer.js'

		, 'client/js/directives/directives.js'
		, 'client/js/directives/company-card.js'
		, 'client/js/directives/cv-card.js'

		, 'client/js/upload-cv/upload-cv-directive.js'
		, 'client/js/cv-doc-view/cv-doc-view-directive.js'
	]

	var isDevMode = function () {
		return process.env.NODE_ENV === 'development' || grunt.option('environment') === 'development';
	}

	var generateFilesList = function (files, minifiedFileName, fileType, forceDevMode) {
		var result = "";

		var preFix = "";
		var postFix = "";

		switch (fileType) {
			case ('css') :
			{
				preFix = "\t<link href=\"";
				postFix = "\" rel=\"stylesheet\">\n";
				break;
			}
			case ('js') :
			{
				preFix = "\t<script type=\"text/javascript\" src=\"";
				postFix = "\"></script>\n";
				break;
			}
		}

		if (isDevMode() || forceDevMode) {
			for (var i = 0, len = files.length; i < len; i++) {
				var filePath = removeClientDirFromPath(files[i]);
				result += preFix + filePath + postFix;
			}
		}
		else { // Production
			var filePath = removeClientDirFromPath(minifiedFileName);
			result = preFix + filePath + postFix;
		}

		return result;
	}

	var removeClientDirFromPath = function (filePath) {
		return filePath.replace(/client/, ".");
	}

	var minifiedCssFile     = 'client/dist/app.css',
	    minifiedVendorsFile = 'client/dist/vendors.js',
	    minifiedAppFile     = 'client/dist/app.js';

	grunt.initConfig({

		express: { // Start Express server
			options: {
				port: process.env.PORT || 3000
				// Override defaults here
			},
			dev: {
				options: {
					script: 'server.js',
					//debug : true //enable debugging
				}
			},
			prod: {
				options: {
					script: 'server.js',
				}
			}
		},
		template: { // Generate index.html
			'process-html-template': {
				'options': {
					'data': {
						cssFiles: generateFilesList(cssFiles, minifiedCssFile, "css"),
						vendorJsFiles: generateFilesList(vendorJsFiles, minifiedVendorsFile, "js"),
						appJsFiles: generateFilesList(appJsFiles, minifiedAppFile, "js")
					}
				},
				'files': {
					'client/index.html': ['client/index-tpl.html']
				}
			}
		},
		watch: { // Watch for file changes
			configFiles: {
				files: ['Gruntfile.js'],
				options: {
					reload: true
				}
			},
			html: {
				files: 'client/index-tpl.html',
				tasks: ['template'],
				options: {
					livereload: true,
				},
			},
			bower: {
				files: ['bower.json'],
				tasks: ['dev'],
				options: {
					reload: true
				}
			},
			css: {
				files: 'client/css/**/*.scss',
				tasks: ['sass']
			},
			options: {
				debounceDelay: 100,
				options: {
					livereload: true,
				},
			},
		},
		sass: {
			dist: {
				files: {
					'client/css/style.css': 'client/css/style.scss'
				}
			}
		},
		open: { // Open browser
			express: {
				// Gets the port from the connect configuration
				path: 'http://localhost:3000'
			}
		},
		ngAnnotate: { // Concat and annotate JS files
			options: {
				singleQuotes: true,
			},
			prod: {
				files: {
					'client/dist/vendors.js': vendorJsFiles,
					'client/dist/app.js': appJsFiles
				},
			},
		},
		cssmin: { // Concat CSS files
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'client/dist/app.css': cssFiles
				}
			}
		},
		uglify: { // uglify (compress) JS files
			prod: {
				files: {
					'client/dist/vendors.js': minifiedVendorsFile,
					'client/dist/app.js': minifiedAppFile
				}
			}
		},
		clean: { // Delete directories / files
			dist: {
				src: ['dist', 'client/index.html']
			}
		}
	});

	grunt.loadNpmTasks('grunt-template');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default', ['express:dev', 'watch']);
	grunt.registerTask('dev', ['template', 'express:dev', 'watch']);
	grunt.registerTask('prod', ['clean', 'template', 'cssmin', 'ngAnnotate', 'uglify:prod']);
	// grunt.registerTask('runTemplate', ['clean', 'template']);
};


