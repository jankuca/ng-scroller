#!/usr/local/bin/node


var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var attributes = [];
var roots = [];
var exclude_roots = [];
var extensions = [];
var namespace = 'app.htmlReferences';

process.argv.slice(2).forEach(function (arg) {
  if (arg.substr(0, 2) === '--') {
    var parts = arg.split('=');
    var key = parts[0].substr(2);
    var value = parts.slice(1).join('=');

    switch (key) {
    case 'attribute':
      attributes.push(value);
      break;
    case 'root':
      roots.push(value);
      break;
    case 'exclude':
      exclude_roots.push(value);
      break;
    case 'extension':
      extensions.push(value);
      break;
    case 'namespace':
      namespace = value;
      break;
    }
  }
});


if (!extensions.length) {
  process.stderr.write('No file extensions specified\n');
  process.stderr.write('Use the --extension parameter.');
  process.exit(1);
}


var files = [];
var lines = [];
lines.push(
  '\'use strict\';',
  '',
  '/* This is an auto-generated file conatining all JavaScript references found in HTML files. */',
  '',
  'goog.provide(\'' + namespace + '\');',
  ''
);

function iterateNextRoot() {
  var root = roots.shift();

  if (root) {
    root = path.resolve(__dirname, '..', root);
    process.stderr.write(__filename + ': Looking for ' +
      '*.' + extensions.join(', *.') + ' files in ' + root + '\n');

    var data = '';
    var i = 0;
    (function iterateNextExtension() {
      var extension = extensions[i++];

      var proc = exec('find ' + root + ' -name "*.' + extension + '"');
      process.stderr.write('find ' + root + ' -name "*.' + extension + '"\n');
      proc.stdout.on('data', function (chunk) {
        data += chunk;
      });
      proc.stderr.on('data', function (chunk) {
        process.stderr.write(chunk.toString());
      });
      proc.on('exit', function (code) {
        if (i !== extensions.length) {
          iterateNextExtension();

        } else {
          var results = data.trim().split("\n");
          if (!results[0]) {
            results = [];
          }
          results = results.filter(function (root) {
            return exclude_roots.every(function (exclude_root) {
              return root.substr(0, exclude_root.length) !== exclude_root;
            });
          });

          files[root] = results;
          iterateNextRoot();
        }
      });
    }());

  } else {
    iterateFiles();
  }
}

function iterateFiles() {
  Object.keys(files).forEach(function (root) {
    files[root].forEach(function (file) {
      lines.push('// ' + file.substr(root.length + 1));

      var source = fs.readFileSync(file, 'utf8');
      attributes.forEach(function (attr) {
        var rx = new RegExp('\\s' + attr + '=([\'"]).+?\\1', 'g');
        var matches = source.match(rx);
        if (matches) {
          matches.forEach(function (match) {
            var parts = match.split('=');
            var value = parts[1].substr(1, parts[1].length - 2);

            lines.push('goog.require(\'' + value + '\');');
            lines.push('goog.exportSymbol(\'' + value + '\', ' + value + ');');
          });
        }
      });
    });
  });

  process.stdout.write(lines.join('\n') + '\n');
  process.stderr.write(__filename + ': JavaScript references extracted ' +
    'to the namespace "' + namespace + '".');
}


iterateNextRoot();
