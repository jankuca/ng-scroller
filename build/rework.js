#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var rework = require('rework');

var read = fs.readFileSync;
var write = fs.writeFileSync;


var mime_types = {
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};


var handleURLs = function (url) {
  if (!/^\./.test(url)) {
    return url;
  }

  var file_path = path.resolve('./public/app/css/', url);
  var ext = path.extname(file_path);

  var size = fs.statSync(file_path).size;
  if (size > 6 * 1024 || !mime_types[ext]) {
    return '../app/css/' + url;
  }

  console.log('Inlining ' + url);

  var buf = read(file_path);
  return 'data:' + mime_types[ext] + ';base64,' + buf.toString('base64');
};


var items = {
  './public/build/app.min.css': {
    source: './public/build/app.css',
    output: { compress: true },
    plugins: {
      vendors: [
        '-webkit-',
        '-moz-',
        '-ms-'
      ],
      prefix: [
        'border-radius',
        'box-shadow',
        'transform',
        'transition'
      ],
      prefixValue: [
        'transform',
        'linear-gradient'
      ],
      url: handleURLs
    }
  }
};


Object.keys(items).forEach(function (target_path) {
  var item = items[target_path];

  var plugins = item.plugins || {};
  var css = rework(read(item.source, 'utf8'));

  if (plugins.extend) {
    css.extend();
  }
  if (plugins.media) {
    css.media(plugins.media);
  }
  if (plugins.ease) {
    css.ease(plugins.ease || plugins.vendors);
  }
  if (plugins.at2x) {
    css.at2x(plugins.at2x || plugins.vendors);
  }
  if (plugins.vendors) {
    css.vendors(plugins.vendors);
  }
  if (plugins.prefix) {
    css.use(rework.prefix(plugins.prefix));
  }
  if (plugins.prefix_value) {
    css.use(rework.prefixValue(plugins.prefix_value));
  }
  if (plugins.prefix_selectors) {
    css.use(rework.prefixSelectors(plugins.prefix_selectors));
  }
  if (plugins.opacity) {
    css.use(rework.opacity(plugins.opacity));
  }
  if (plugins.url) {
    css.use(rework.url(plugins.url));
  }
  if (plugins.mixin) {
    css.use(rework.mixin(plugins.mixin));
  }
  if (plugins.references) {
    css.use(rework.references());
  }
  if (plugins.vars) {
    css.use(rework.vars());
  }
  if (plugins.colors) {
    css.use(rework.colors());
  }
  var keyframes = plugins.keyframes;
  if (keyframes) {
    keyframes = Array.isArray(keyframes) ? keyframes : plugins.vendors;
    css.use(rework.keyframes(keyframes));
  }

  write(target_path, css.toString(item.output || {}), 'utf8');
});
