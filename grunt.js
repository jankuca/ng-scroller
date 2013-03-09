module.exports = function (grunt) {

  grunt.initConfig({
    exec: {
      deps: {
        command: './build/deps.sh'
      },
      compile: {
        command: './build/compile.sh 2>&1 > /dev/null'
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', [
    'js'
  ]);

  grunt.registerTask('js', [
    'exec:deps',
    'exec:compile'
  ]);
};
