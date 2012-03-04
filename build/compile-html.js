#!/usr/bin/node


var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var attributes = [];
var roots = [];
var exclude_roots = [];

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
    }
  }
});


var files = [];
var lines = [];
lines.push(
  '\'use strict\';',
  '',
  '/* This is an auto-generated file conatining all JavaScript references found in HTML files. */',
  '',
  'goog.provide(\'app.controllers\');',
  ''
);

function iterateNextRoot() {
  var root = roots.shift();

  if (root) {
    root = path.resolve(__dirname, '..', root);
    process.stderr.write(__filename + ': Looking for HTML files in ' + root + '\n');

    var data = '';
    var proc = exec('find ' + root + ' -name "*.html"');
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

      files[root] = results;
      iterateNextRoot();
    });

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

            lines.push('goog.exportSymbol(\'' + value + '\', ' + value + ');');
          });
        }
      });
    });
  });

  process.stdout.write(lines.join('\n') + '\n');
}


iterateNextRoot();
