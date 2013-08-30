
module.exports = function (runner, args, callback) {
  runner.runTasks([
    'compile',
    'rework'
  ], callback);
};
