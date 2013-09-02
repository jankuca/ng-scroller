
module.exports = function (runner, args, callback) {
  runner.runTasks([
    'css',
    'compile'
  ], callback);
};
