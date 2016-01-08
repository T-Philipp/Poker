module.exports = function (grunt) {
	grunt.initConfig({

		// SCSS in CSS wandeln
		sass: {
			custom: {
				options: {
					sourcemap: 'none'
				},
				files: {
					'css/style.css': 'css/style.scss'
				}
			}
		},

		// JS-Dateien in eine packen
		concat: {
			js: {
				src: [
					'js/jquery.min.js',
					'js/ng/angular.js',
					'js/ng/angular-*.js',
					'js/ng/i18n/angular-locale_de-de.js',
					'js/angular.rangeSlider.js',
					'js/angular-timer.js',
					'js/poker/*.js'
				],
				dest: 'dst/script.js'
			},
			css: {
				src: [
					'css/bootstrap.min.css',
					'css/angular.rangeSlider.css',
					'css/style.css'
				],
				dest: 'dst/style.css'
			}
		},

		// JS-Datei komprimieren
		uglify: {
			js: {
				src: 'dst/script.js',
				dest: 'dst',
				expand: true,
				flatten: true,
				ext: '.min.js'
			},
			options: {
				mangle: false
			}
		},

		// CSS komprimieren
		cssmin: {
			options: {
				sourceMap: false
			},
			target: {
				files: {
					'dst/style.min.css': 'dst/style.css'
				}
			}
		},

		// Watcher
		watch: {
			js: {
				files: ['js/poker/*.js'],
				tasks: ['concat']
			},
			css: {
				files: [
					'css/style.scss'
				],
				tasks: ['sass:custom']
			}
		}

	});

	// Plugins laden
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Tasks, die bei "grunt" ausgeführt werden sollen
	grunt.registerTask('default', ['sass']);
	grunt.registerTask('pack', ['concat', 'uglify', 'cssmin']);

};