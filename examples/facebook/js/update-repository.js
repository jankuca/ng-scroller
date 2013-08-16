goog.provide('app.UpdateRepository');


/**
 * @constructor
 * @ngInject
 */
app.UpdateRepository = function () {
};


/**
 * @param {*} next_id The ID of the item before which to fetch the range.
 * @param {number} length The (maximum) number of items to fetch.
 */
app.UpdateRepository.prototype.getRangeBefore = function (next_id, length, callback) {
  window.console.log('datastore: request %d before %d', length, next_id);
  setTimeout(function () {
    var items = [];
    for (var i = 0; i < length; ++i) {
      var id = Math.round(Math.random() * 1000000);
      items.push({
        'id': id,
        'image_id': id % 20,
        'ts_ago': '5 minutes ago',
        'text': 'Update text ' + id
      });
    }

    window.console.log('datastore: return %d before %d', length, next_id);
    callback(null, items);
  }, 1000);
};


/**
 * @param {*} prev_id The ID of the item after which to fetch the range.
 * @param {number} length The (maximum) number of items to fetch.
 */
app.UpdateRepository.prototype.getRangeAfter = function (prev_id, length, callback) {
  window.console.log('datastore: request %d after %d', length, prev_id);
  setTimeout(function () {
    var items = [];
    for (var i = 0; i < length; ++i) {
      var id = Math.round(Math.random() * 1000000);
      items.push({
        'id': id,
        'image_id': id % 20,
        'ts_ago': '5 minutes ago',
        'text': 'Update text ' + id
      });
    }

    window.console.log('datastore: return %d after %d', length, prev_id);
    callback(null, items);
  }, 1000);
};
