
module.exports = function (runner, args, callback) {
  var be_verbose = args['v'];

  var rework_script_filename = path.join(__dirname, 'rework.js');
  var proc = child_process.spawn(rework_script_filename);

  if (be_verbose) {
    proc.stdout.on('data', function (chunk) {
      runner.log(String(chunk));
    });
  }

  proc.stdout.on('data', function (chunk) {
    runner.log(String(chunk));
  });

  proc.on('exit', function (code) {
    if (code !== 0) {
      callback(new Error('Failed to preprocess CSS via rework'));
    } else {
      callback(null);
    }
  });
};
