'use strict';

var pkg = require('./package.json');
module.exports = function (grunt) {

  var importOnce = require('node-sass-import-once');
  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    clean: {
      css: ['css'],
      bower: ['bower_components'],
      reports: ['reports']
    },

    sass: {
      options: {
        importer: importOnce,
        importOnce: {
          index: true,
          bower: true
        }
      },
      dist: {
        files: {
          'css/noprefix/px-drawer-sketch.css': 'sass/px-drawer-sketch.scss',
          'css/noprefix/px-drawer.css': 'sass/px-drawer-predix.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'Safari 8']
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'css/noprefix/*.css',
        dest: 'css'
      }
    },

    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      bower: {
        command: 'bower install'
      }
    },

    jshint: {
      all: [
				'Gruntfile.js',
				'js/**/*.js'
			],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      sass: {
        files: ['sass/**/*.scss'],
        tasks: ['sass', 'autoprefixer'],
        options: {
          interrupt: true,
          livereload: true
        }
      },
      css: {
        files: ['css/*.css'],
        tasks: ['cssmin', 'polymer-css-compiler'],
        options: {
          interrupt: true,
          livereload: true
        }
      },
      htmljs: {
        files: ['*.html', '*.js'],
        options: {
          interrupt: true,
          livereload: true
        }
      }
    },

    depserve: {
      options: {
        open: '<%= depserveOpenUrl %>'
      }
    },
    webdriver: {
      options: {
        specFiles: ['test/*spec.js']
      },
      local: {
        webdrivers: ['chrome']
      }
    },
    concurrent: {
      devmode: {
        tasks: ['watch', 'depserve'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'css/<%= pkg.name %>.min.css': ['css/<%= pkg.name %>.css']
        }
      }
    },
    'polymer-css-compiler': {
      target: {
        filename: '-styles',
        files: {
          './<%= pkg.name %>.html': ['css/<%= pkg.name %>.min.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-dep-serve');
  grunt.loadNpmTasks('webdriver-support');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('polymer-css-compiler');
  // Default task.
  grunt.registerTask('default', 'Basic build', [
    'clean:css',
    'sass',
    'autoprefixer',
    'cssmin',
    'polymer-css-compiler'
  ]);

  grunt.registerTask('devmode', 'Development Mode', [
		'concurrent:devmode'
	]);

  // First run task.
  grunt.registerTask('firstrun', 'Basic first run', function () {
    grunt.config.set('depserveOpenUrl', '/index.html');
    grunt.task.run('default');
    grunt.task.run('depserve');
  });
  grunt.registerTask('serve', 'Basic first run', function () {
    grunt.config.set('depserveOpenUrl', '/index.html');
    grunt.task.run('default');
    grunt.task.run('depserve');
    grunt.task.run('watch');
  });

  // Default task.
  grunt.registerTask('test', 'Test', [
		'jshint',
		'webdriver'
	]);
  grunt.registerTask('watch-styles', [
		'watch'
	]);

  grunt.registerTask('release', 'Release', [
		'clean',
		'shell:bower',
		'default',
		'test'
	]);

};
