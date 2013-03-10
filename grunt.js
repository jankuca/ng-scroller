module.exports = function (grunt) {

  grunt.initConfig({
    concat: {
      css: {
        src: [
          './public/app/css/reset.css'
        ],
        dest: './public/build/app.css'
      }
    },

    exec: {
      deps: {
        command: './build/deps.sh'
      },
      compile: {
        command: './build/compile.sh 2>&1 > /dev/null'
      },
      soy: {
        command: './build/soy.sh'
      },
      rework: {
        command: './build/rework.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', [
    'css',
    'soy',
    'js'
  ]);

  grunt.registerTask('css', [
    'concat:css',
    'exec:rework',
  ]);

  grunt.registerTask('soy', [
    'exec:soy',
  ]);

  grunt.registerTask('js', [
    'exec:deps',
    'exec:compile'
  ]);
};
