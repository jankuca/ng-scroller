
var BIND_ATTR = 'ng:bind';

var FIRST_LEVEL = /^[a-zA-Z\$_:]+/;
var DEEPER_LEVEL = new RegExp('(' +
  '\\[[a-zA-Z\\$_.:]+\\]|' +
  '\\.[a-zA-Z\\$_:]+' +
')', 'g');

function parseLevels(exp) {
  var levels = [];

  var match = exp.match(FIRST_LEVEL) || [];
  levels.push(match[0] || '');
  exp = exp.substr(match.length);

  if (exp) {
    var matches = exp.match(DEEPER_LEVEL) || [];
    matches.forEach(function (match) {
      if (match[0] === '.') {
        levels.push(match.substr(1));
      } else {
        levels.push(match.substr(1, match.length - 2));
      }
    });
  }

  return levels;
};


exports.passes = [
  function (source) {
    source = source.replace(/\{\{/g, '{lb}{lb}');
    source = source.replace(/\}\}/g, '{rb}{rb}');
    return source;
  }
];

exports.directives = {
  'bind': function (value, key) {
    var key = (key || value);
    key = key.replace(/'/g, '');

    var levels = parseLevels(key);
    var cond_level = '$' + levels[0];
    var cond_start = '{if ' + cond_level + '}';
    var cond_end = '{/if}';
    levels.slice(1).forEach(function (level, i) {
      cond_level += '[\'' + level + '\']';
      cond_start += '{if ' + cond_level + '}';
      cond_end += '{/if}';
    });

    return '<span ' + BIND_ATTR + '="' + key + '">' +
      cond_start + '{$' + value + '}' + cond_end +
    '</span>';
  },

  'bind:tag': function (value, key, tag) {
    var key = (key || value);
    key = key.replace(/'/g, '');

    var output = '<' + (tag || 'span');
    output += ' ' + BIND_ATTR + '="' + key + '">'
    output += value;
    output += '</' + (tag || 'span') + '>';
    return output;
  }
};
