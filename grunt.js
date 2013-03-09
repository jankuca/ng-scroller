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
      rework: {
        command: './build/rework.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', [
    'css',
    'js'
  ]);

  grunt.registerTask('css', [
    'concat:css',
    'exec:rework',
  ]);

  grunt.registerTask('js', [
    'exec:deps',
    'exec:compile'
  ]);
};
