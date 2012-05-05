#!/usr/local/bin/node


var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var roots = [];
var exclude_roots = [];
var target = null;

process.argv.slice(2).forEach(function (arg) {
  if (arg.substr(0, 2) === '--') {
    var parts = arg.split('=');
    var key = parts[0].substr(2);
    var value = parts.slice(1).join('=');

    switch (key) {
    case 'root':
      roots.push(value);
      break;
    case 'exclude':
      exclude_roots.push(value);
      break;
    case 'target':
      target = value;
      break;
    }
  }
});

if (!target) {
  process.stderr.write(__filename + ': No target directory specified.\n');
  process.exit(1);
}


var files = [];

function iterateNextRoot() {
  var root = roots.shift();

  if (root) {
    root = path.resolve(__dirname, '..', root);
    process.stderr.write(__filename + ': Looking for soy files in ' + root + '\n');

    var data = '';
    var proc = exec('find ' + root + ' -name "*.soy"');
    proc.stdout.on('data', function (chunk) {
      data += chunk;
    });
    proc.stderr.on('data', function (chunk) {
      console.log(''+ chunk);
    });
    proc.on('exit', function (code) {
      var results = data.trim().split("\n");
      results = results.filter(function (root) {
        return exclude_roots.every(function (exclude_root) {
          return root.substr(0, exclude_root.length) !== exclude_root;
        });
      });

      files[root] = results.map(function (result) {
        return [ result, result.substr(root.length + 1) ]
      });
      iterateNextRoot();
    });

  } else {
    iterateFiles();
  }
}

function iterateFiles() {
  Object.keys(files).forEach(function (root) {
    files[root].forEach(function (file) {
      var source = fs.readFileSync(file[0], 'utf8');
      source = source.replace(/\{\{/g, '{lb}{lb}');
      source = source.replace(/\}\}/g, '{rb}{rb}');
      fs.writeFileSync(path.join(target, file[1]), source, 'utf8');
    });
  });

  process.stderr.write(__filename + ': Soy files fixed');
}


iterateNextRoot();
