var path = require('path');

module.exports = function (grunt) {

  grunt.initConfig({
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'server.js'
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
      express: {
        files:  [ '**/*.js', '**/*.html' ],
        tasks:  [ 'express:dev' ],
        options: {
          livereload: true,
          spawn: false // Without this option specified express won't be reloaded
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

  grunt.registerTask('default', [ 'express:dev', 'open', 'watch' ])
}
;

