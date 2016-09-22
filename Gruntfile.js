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
				cwd: 'source',
				src: ['js/**/*.js'],
				dest: 'build',
				expand: true
			},
			jquery: {
				cwd: '.',
				src: ['source/js/jquery-3.1.0.min.js'],
				dest: 'build/js/jquery-3.1.0.min.js'
			},
			update_ngreen_css: {
				cwd: '.',
				src: ['D:/prg/proj/web/ngreen_css/dist/ngreen.css'],
				dest: 'source/css/ngreen.css'
			},
			ngreen_js: {
				cwd: '.',
				src: ['D:/prg/proj/web/ngreen_css/js/ngreen.js'],
				dest: 'source/js/ngreen.js'
			},
			build: {
				cwd: 'source',
				src: ['**', '!pug/**', '!scss/**', '!js/**'],
				dest: 'build',
				expand: true
			}
		},
		clean: {
			js: {
				src: ['build/js']
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
					'build/css/application.css': ['build/**/*.css']
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
					'build/js/application.js': ['source/**/*.js', '!source/js/jquery-3.1.0.min.js']
				}
			},
			rel: {
				files: {
					'build/js/application.js': ['source/**/*.js', '!source/js/jquery-3.1.0.min.js']
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
		['clean:js', 'copy:ngreen_js', 'uglify:dev', 'copy:jquery']
	);
	// cleans js folder; copies ngreen js to source; uglifies all source; copies jquery to build directory
	grunt.registerTask(
		'scripts-rel',
		['clean:js', 'copy:ngreen_js', 'uglify:rel', 'copy:jquery']
	);

	// builds scss, post-processes css, minifies into one, but keeps compiled css folder
	grunt.registerTask(
		'style-dev',
		['clean:css', 'copy:update_ngreen_css', 'sass', 'copy:css', 'postcss', 'cssmin', 'copy:css_nomin']
		// ['clean:css', 'sass', 'postcss', 'cssmin', 'copy:css', 'copy:ngreen_css']
	);
	// builds scss, post-processes css, minifies into one, and removes compiles css folder
	grunt.registerTask(
		'style-rel',
		['clean:css', 'copy:update_ngreen_css', 'sass', 'copy:css', 'postcss', 'cssmin', 'copy:css_nomin', 'clean:css_compiled']
		// ['clean:css', 'sass', 'postcss', 'cssmin', 'clean:css_compiled', 'copy:css', 'copy:ngreen_css']
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
