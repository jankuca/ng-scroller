var async = require('async');
var autoprefixer = require('autoprefixer');
var fs = require('fs');
var path = require('path');
var rework = require('rework');


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
        var css_files = groups[target] || [];
        var css_code = '';

        css_files.forEach(function (file) {
          var filename = path.join(project_dirname, file);
          css_code += fs.readFileSync(filename, 'utf8');
        });

        var css = rework(css_code);
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

        var target_filename = path.join(project_dirname, target);
        fs.writeFile(target_filename, css_result, callback);
      };

      async.forEachSeries(targets, onTarget, callback);
    }

  ], callback);
};
