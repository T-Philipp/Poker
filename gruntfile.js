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

		// Watcher
		watch: {
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

	// Tasks, die bei "grunt" ausgeführt werden sollen
	grunt.registerTask('default', ['sass']);

};