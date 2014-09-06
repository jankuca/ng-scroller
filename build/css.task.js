var async = require('async');
var autoprefixer = require('autoprefixer');
var fs = require('fs');
var path = require('path');
var rework = require('rework');
var svg = require('rework-svg');


module.exports = function (runner, args, callback) {
  var rework_flags = {
    autoprefixer: runner.getAppConfigValue('css.autoprefixer'),
    at2x: !!runner.getAppConfigValue('css.at2x'),
    colors: !!runner.getAppConfigValue('css.colors'),
    extend: !!runner.getAppConfigValue('css.inheritance'),
    ease: !!runner.getAppConfigValue('css.ease'),
    references: !!runner.getAppConfigValue('css.references')
  };

  var minify = !!runner.getAppConfigValue('css.minify');


  async.waterfall([
    function (callback) {
      var project_dirname = runner.getProjectDirname();
      var groups = runner.getAppConfigValue('css') || {};
      var targets = Object.keys(groups);

      var onTarget = function (target, callback) {
        var target_filename = path.join(project_dirname, target);

        var css_files = groups[target] || [];
        var css_code = '';

        css_files.forEach(function (file) {
          var filename = path.join(project_dirname, file);
          var css_part_code = fs.readFileSync(filename, 'utf8');
          var css_part = rework(css_part_code);

          var filename_rel_to_target = path.relative(
            path.dirname(target_filename),
            path.dirname(filename)
          );

          var fixUrl = function (url) {
            if (url[0] === '.') {
              var url_rel_to_target = path.join(filename_rel_to_target, url);
              return url_rel_to_target;
            }
            return url;
          };
          css_part.use(rework.url(fixUrl));

          css_code += css_part.toString();
        });

        var css = rework(css_code);
        css.use(svg(path.dirname(target)));
        if (rework_flags.autoprefixer) {
          css.use(autoprefixer(rework_flags.autoprefixer).rework);
        }
        if (rework_flags.at2x) {
          css.use(rework.at2x());
        }
        if (rework_flags.colors) {
          css.use(rework.colors());
        }
        if (rework_flags.extend) {
          css.use(rework.extend());
        }
        if (rework_flags.ease) {
          css.use(rework.ease());
        }
        if (rework_flags.references) {
          css.use(rework.references());
        }

        var css_result = css.toString({
          compress: minify
        });

        fs.writeFile(target_filename, css_result, callback);
      };

      async.forEachSeries(targets, onTarget, callback);
    }

  ], callback);
};
