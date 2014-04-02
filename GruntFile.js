module.exports = function(grunt) {
	grunt.initConfig({
		compress: {
			package: {
				options: {
					archive: 'torch.zip'
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
