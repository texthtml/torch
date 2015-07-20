module.exports = function(grunt) {
	grunt.initConfig({
		compress: {
			package: {
				options: {
					archive: 'build/torch.zip'
				},
				files: [
					{cwd: 'src/', expand: true, src: '**', dest: '/'}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('default', ['compress']);
};
