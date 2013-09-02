var fs = require('fs');
var path = require('path');


module.exports = function (runner, args, callback) {
  var project_dirname = runner.getProjectDirname();
  var directories = runner.getConfigValue('watch') || {};
  var task_ids = Object.keys(directories);

  var running = {};
  var queued = {};

  task_ids.forEach(function (task_id) {
    var directory = directories[task_id];

    var onChange = function (event, filename) {
      runner.log('\033[2;37m');
      runner.log(event + ': ./' + path.join(directory, filename));
      runner.log(' -> \033[0m' + task_id + '\n');

      runTask();
    };

    var runTask = function () {
      if (running[task_id]) {
        queued[task_id] = true;
      } else {
        running[task_id] = true;
        runner.runTask(task_id, onTaskComplete);
      }
    };

    var onTaskComplete = function (err) {
      if (err) {
        runner.log(err.message + '\n');
      }

      running[task_id] = false;
      if (queued[task_id]) {
        queued[task_id] = false;
        runTask();
      }
    };

    var dirname = path.join(project_dirname, directory);
    var watcher = fs.watch(dirname, onChange);
  });

  // allow multiple apps
  callback(null);
};
