var path = require('path');

module.exports = function (grunt) {


	var cssFiles = [
		'node_modules/ui-select/dist/select.css'
		, 'node_modules/angularjs-toaster/toaster.min.css'
		, 'node_modules/font-awesome/css/font-awesome.min.css'
		, 'node_modules/feedback-directive/dist/feedback.css'
		, 'client/css/font.css'
		, 'client/css/style.css'
	];

	var vendorJsFiles = [

		'node_modules/jquery/dist/jquery.min.js'

		// Angular
		, 'node_modules/angular/angular.js'
		, 'node_modules/angular-cookies/angular-cookies.js'
		, 'node_modules/angular-animate/angular-animate.js'
		, 'node_modules/angular-messages/angular-messages.js'
		, 'node_modules/bootstrap/dist/js/bootstrap.js'
		, 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'
		, 'node_modules/@uirouter/angularjs/release/angular-ui-router.js'

		// Ui-Select2
		, 'node_modules/ui-select/dist/select.js'

		// Toaster
		, 'node_modules/angularjs-toaster/toaster.js'

		// feedback-directive
		, 'node_modules/feedback-directive/dist/feedback.js'

		// File Upload - - danial.farid
		, 'node_modules/ng-file-upload/dist/ng-file-upload.js'
		, 'node_modules/angular-file-saver/dist/angular-file-saver.bundle.js'

		, 'node_modules/bootstrap-rtl/dist/js/holder.js'

		// localForage
		, 'node_modules/angular-local-storage/dist/angular-local-storage.js'
		, 'node_modules/localforage/dist/localforage.js'
		, 'node_modules/angular-localforage/dist/angular-localForage.js'
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
		, 'client/js/components/dashboard-header-component.js'
		, 'client/js/components/dashboard-component.js'
		, 'client/js/components/dashboard-content-component.js'
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
			case ('css') : {
				preFix = "\t<link href=\"";
				postFix = "\" rel=\"stylesheet\">\n";
				break;
			}
			case ('js') : {
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
		var try1 = filePath.replace(/node_modules/, ".");
		return try1.replace(/client/, ".");
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
				tasks: ['template'],
				options: {
					reload: true
				}
			},
			server: {
				files: ['server.js'],
				options: {
					reload: true
				}
			},
			js: {
				files: 'client/js/**/*.js',
				options: {
					livereload: true,
				},
			},
			html: {
				files: ['client/views/**/*.html', 'client/index-tpl.html'],
				tasks: ['template'],
				options: {
					livereload: true,
				},
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


