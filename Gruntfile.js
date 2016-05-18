var path = require('path');

module.exports = function (grunt) {


    var cssFiles = [
        //'client/lib/bootstrap/dist/css/bootstrap.min.css'
        //, 'client/lib/bootstrap-rtl/dist/css/bootstrap-rtl.css'
        'client/lib/select2/select2.css'
        , 'client/lib/angularjs-toaster/toaster.min.css'
        , 'client/lib/components-font-awesome/css/font-awesome.min.css'
        , 'client/css/style.css'
    ];

    var vendorJsFiles = [

        'client/lib/jquery/dist/jquery.min.js'
        , 'client/lib/bootstrap-rtl/dist/js/html5shiv.js'
        , 'client/lib/bootstrap-rtl/dist/js/respond.min.js'
        , 'client/lib/ng-file-upload/angular-file-upload-shim.min.js'

        // Angular
        , 'client/lib/angular/angular.js'
        , 'client/lib/angular-cookies/angular-cookies.js'
        , 'client/lib/angular-animate/angular-animate.js'
        , 'client/lib/angular-sanitize/angular-sanitize.js'
        , 'client/lib/angular-messages/angular-messages.js'
        , 'client/lib/angular-bootstrap/ui-bootstrap-tpls.js'
        , 'client/lib/angular-ui-router/release/angular-ui-router.js'

        // Ui-Select2
        , 'client/lib/select2/select2.js'
        , 'client/lib/angular-ui-select2/src/select2.js'

        // Toaster
        , 'client/lib/angularjs-toaster/toaster.js'

        // Parsing CVs
        , 'client/lib/jszip/dist/jszip.js'
        , 'client/lib/docx/docx.js'

        // File Upload - - danial.farid
        , 'client/lib/ng-file-upload/angular-file-upload.js'

        , 'client/lib/bootstrap-rtl/dist/js/holder.js'

        // localForage
        , 'client/lib/localforage/dist/localforage.js'
        , 'client/lib/angular-localforage/dist/angular-localForage.js'
    ];

    var appJsFiles = [
        'client/js/app.js'

        , 'client/js/routingConfig.js'
        , 'client/js/controllers/header-controller.js'
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

        , 'client/js/services/app-manager-service.js'
        , 'client/js/controllers/login-controller.js'
        , 'client/js/controllers/register-controller.js'
        , 'client/js/services/data-manager-service.js'
        , 'client/js/services/auth-service.js'
        , 'client/js/services/mail-service.js'
        , 'client/js/services/cv-parser.js'
        , 'client/js/services/common-service.js'
        , 'client/js/services/utils-services.js'

        , 'client/js/models/job.js'
        , 'client/js/models/modelTransformer.js'

        , 'client/js/directives/directives.js'
        , 'client/js/directives/company-card.js'
        , 'client/js/directives/user-card.js'
        , 'client/js/directives/upload-cv-directive.js'
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

    var minifiedCssFile = 'client/dist/app.css',
        minifiedVendorsFile = 'client/dist/vendors.js',
        minifiedAppFile = 'client/dist/app.js';

    grunt.initConfig({

        cssFiles: generateFilesList(cssFiles, minifiedCssFile, "css"),
        vendorJsFiles: generateFilesList(vendorJsFiles, minifiedVendorsFile, "js"),
        appJsFiles: generateFilesList(appJsFiles, minifiedAppFile, "js"),

        express: { // Start Express server
            options: {
                port: process.env.PORT || 3000
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'server.js',
//					debug : true //enable debugging
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
                        cssFiles: '<%= cssFiles %>',
                        vendorJsFiles: '<%= vendorJsFiles %>',
                        appJsFiles: '<%= appJsFiles %>',
                    }
                },
                'files': {
                    'client/index.html': ['client/index-tpl.html']
                }
            }
        },
        watch: { // Watch for file changes
            scripts: {
                files: ['client/js/**/*.js', 'client/views/**/*.html', 'client/css/**/*.css', 'client/dist/*.*'],
                //tasks: ['default'],
                options: {
                    livereload: true,
                },
            },
            server: {
                files: ['server.js', 'server/**/*.js'],
                tasks: ['default'],
                options: {
                    livereload: true,
                    spawn: false // Without this option specified express won't be reloaded
                }
            },
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            bower: {
                files: ['bower.json'],
                tasks: ['dev'],
                options: {
                    reload: true
                }
            },
            options: {
                debounceDelay: 100,
            },
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

    grunt.registerTask('default', ['express:dev', 'open', 'watch']);
    grunt.registerTask('dev', ['template', 'default']);
    grunt.registerTask('prod', ['clean', 'template', 'cssmin', 'ngAnnotate', 'uglify:prod']);
    // grunt.registerTask('runTemplate', ['clean', 'template']);
};


