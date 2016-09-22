module.exports = function(grunt) {
	grunt.initConfig({
		copy: {
			css: {
				cwd: 'source/css',
				src: ['**/*.css', '!nomin/**'],
				dest: 'build/css/compiled',
				expand: true
			},
			css_nomin: {
				cwd: 'source/css/nomin',
				src: ['**/*.css'],
				dest: 'build/css',
				expand: true
			},
			js: {
				cwd: 'source/js',
				src: ['**/*.js', '!nomin/**'],
				dest: 'build/js/compiled',
				expand: true
			},
			js_nomin: {
				cwd: 'source/js/nomin',
				src: ['**/*.js'],
				dest: 'build/js',
				expand: true
			},
			update_ngreen_css: {
				cwd: '.',
				src: ['D:/prg/proj/web/ngreen_css/dist/ngreen.css'],
				dest: 'source/css/ngreen.css'
			},
			update_ngreen_js: {
				cwd: '.',
				src: ['D:/prg/proj/web/ngreen_css/js/ngreen.js'],
				dest: 'source/js/ngreen.js'
			},
			build: {
				cwd: 'source',
				src: ['**', '!pug/**', '!css/**', '!scss/**', '!js/**'],
				dest: 'build',
				expand: true
			}
		},
		clean: {
			js: {
				src: ['build/js']
			},
			js_compiled: {
				src: ['build/js/compiled']
			},
			css: {
				src: ['build/css']
			},
			css_compiled: {
				src: ['build/css/compiled']
			},
			pug: {
				src: ['build/**/*.html']
			},
			build: {
				src: ['build']
			}
		},
		sass: {
			build: {
				options: {
					style: 'expanded'
				},
				files: [{
					expand: true,
					cwd: 'source/scss',
					src: ['style.scss'],
					dest: 'build/css/compiled',
					ext: '.css',
					loadPath: ['.']
				}]
			}
		},
		postcss: {
			options: {
				map: true,
				processors: [
					require('autoprefixer')({browsers: ['> 1%', 'last 2 versions', 'Firefox < 20']})
				]
			},
			build: {
				expand: true,
				cwd: 'build',
				src: ['**/*.css'],
				dest: 'build'
			}
		},
		cssmin: {
			build: {
				files: {
					'build/css/application.css': ['build/css/compiled/*.css']
				}
			}
		},
		uglify: {
			dev: {
				options: {
					compress: false,
					beautify: true,
					preserveComments: 'all'
				},
				files: {
					'build/js/application.js': ['build/js/compiled/**/*.js']
				}
			},
			rel: {
				files: {
					'build/js/application.js': ['build/js/compiled/**/*.js']
				}
			}
		},
		pug: {
			dev: {
				options: {
					data: {},
					pretty: true
				},
				files: [{
					expand: true,
					cwd: 'source/pug',
					src: ['**/*.pug', '!templates/**'],
					dest: 'build',
					ext: '.html'
				}]
			},
			rel: {
				options: {
					data: {},
					pretty: false
				},
				files: [{
					expand: true,
					cwd: 'source/pug',
					src: ['**/*.pug', '!templates/**'],
					dest: 'build',
					ext: '.html'
				}]
			}
		},
		watch: {
			scripts: {
				files: 'source/js/**/*.*',
				tasks: ['scripts-dev']
			},
			pug: {
				files: 'source/pug/**/*.*',
				tasks: ['pug-dev']
			},
			styles: {
				files: 'source/scss/**/*.*',
				tasks: ['style-dev']
			},
			build: {
				files: ['source/**', '!source/pug/**', '!source/scss/**', '!source/js/**'],
				tasks: ['copy:build']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-pug');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// cleans js folder; copies ngreen js to source; uglifies all source in a readable format; copies jquery to build directory
	grunt.registerTask(
		'scripts-dev',
		['clean:js', 'copy:update_ngreen_js', 'copy:js', 'uglify:dev', 'copy:js_nomin']
	);
	// cleans js folder; copies ngreen js to source; uglifies all source; copies jquery to build directory
	grunt.registerTask(
		'scripts-rel',
		['clean:js', 'copy:update_ngreen_js', 'copy:js', 'uglify:rel', 'copy:js_nomin', 'clean:js_compiled']
	);

	// builds scss, post-processes css, minifies into one, but keeps compiled css folder
	grunt.registerTask(
		'style-dev',
		['clean:css', 'copy:update_ngreen_css', 'sass', 'copy:css', 'postcss', 'cssmin', 'copy:css_nomin']
	);
	// builds scss, post-processes css, minifies into one, and removes compiles css folder
	grunt.registerTask(
		'style-rel',
		['clean:css', 'copy:update_ngreen_css', 'sass', 'copy:css', 'postcss', 'cssmin', 'copy:css_nomin', 'clean:css_compiled']
	);

	// builds all pug into a prettified readable format
	grunt.registerTask(
		'pug-dev',
		['clean:pug', 'pug:dev']
	);
	// builds all pug into a compressed format
	grunt.registerTask(
		'pug-rel',
		['clean:pug', 'pug:rel']
	);

	// builds everything in dev mode
	grunt.registerTask(
		'build-dev',
		['clean:build', 'scripts-dev', 'style-dev', 'pug-dev', 'copy:build']
	);
	// builds everything in rel mode
	grunt.registerTask(
		'build-rel',
		['clean:build', 'scripts-rel', 'style-rel', 'pug-rel', 'copy:build']
	);

	// default to dev mode with watching
	grunt.registerTask(
		'default',
		['build-dev', 'watch']
	);
}
