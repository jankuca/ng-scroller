#!/usr/local/bin/node


var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var roots = [];
var exclude_roots = [];
var target = null;
var plugins = [];

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
    case 'plugin':
      plugins.push(value);
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
  var plugins = loadPlugins();

  Object.keys(files).forEach(function (root) {
    files[root].forEach(function (file) {
      var source = fs.readFileSync(file[0], 'utf8');
      plugins.passes.forEach(function (pass) {
        source = pass(source);
      });

      source = applyDirectivesTo(source, plugins.directives);

      fs.writeFileSync(path.join(target, file[1]), source, 'utf8');
    });
  });

  process.stderr.write(__filename + ': Soy files fixed');
}

function loadPlugins() {
  var passes = [];
  var directives = {};

  plugins.forEach(function (file_path) {
    var plugin = require(file_path);
    if (plugin.passes) {
      passes = passes.concat(plugin.passes);
    }
    if (plugin.directives) {
      Object.keys(plugin.directives).forEach(function (key) {
        directives[key] = plugin.directives[key];
      });
    }
  });

  return {
    passes: passes,
    directives: directives
  };
}

function applyDirectivesTo(source, directives) {
  var rx = /\{\$([^}]+)\s*\|((?:\w+(?::[^\s}]+)?\s)*\w+(?::[^\s}]+)?)\}/;

  var matches = source.match(new RegExp(rx.source, 'g')) || [];
  matches.forEach(function (match) {
    var m = match.match(rx);

    var args = [ m[1] ];
    var key_parts = [];

    var parts = m[2].split(/\s/);
    parts.forEach(function (part) {
      part = part.split(':');
      key_parts.push(part[0]);
      args.push(part[1] || null);
    });

    var directive = directives[key_parts.join(':')];
    if (directive) {
      var output = directive.apply(null, args);
      source = source.replace(match, output);
    }
  });

  return source;
}

iterateNextRoot();
