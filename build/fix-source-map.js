#!/usr/local/bin/node


var fs = require('fs');
var path = require('path');


var filename = null;
var root = '/';

process.argv.slice(2).forEach(function (arg) {
  if (arg.substr(0, 2) === '--') {
    var parts = arg.split('=');
    var key = parts[0].substr(2);
    var value = parts.slice(1).join('=');

    switch (key) {
    case 'map':
      filename = value;
      break;
    case 'root':
      root = value;
      break;
    }
  }
});

if (!filename) {
  process.stderr.write('No source map name specified');
  process.exit(1);
}

root = path.resolve(root) + '/';
filename = path.resolve(__dirname, '..', filename);

process.stderr.write('Fixing source map ' + filename + '\n');

var json = fs.readFileSync(filename, 'utf8');
var map = JSON.parse(json);

map['sources'] = map['sources'].map(function (source) {
  return '../' + source.substr(root.length);
});

json = JSON.stringify(map);
fs.writeFileSync(filename, json, 'utf8');
