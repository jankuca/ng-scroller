goog.provide('app.PostRepository');


/**
 * @constructor
 * @ngInject
 */
app.PostRepository = function ($q, $timeout) {
  this.$q = $q;
  this.$timeout = $timeout;
};


/**
 * @param {*} next_id The ID of the item before which to fetch the range.
 * @param {number} length The (maximum) number of items to fetch.
 */
app.PostRepository.prototype.getRangeBefore = function (next_id, length) {
  var deferred = this.$q.defer();

  window.console.log('datastore: request %d after %d', length, next_id);
  this.$timeout(function () {
    var items = [];
    for (var i = 0; i < length; ++i) {
      var id = Math.round(Math.random() * 1000000);
      var item = {
        'id': id,
        'image_id': id % 20,
        'ts_ago': '5 minutes ago',
        'text': 'Post contents'
      };

      if (Math.round(Math.random())) {
        var h = 150 + Math.round(Math.random() * 200);
        item['photo_url'] = 'http://placekitten.com/400/' + h + '?image=' + (id % 20);
      }

      items.push(item);
    }

    window.console.log('datastore: return %d after %d', length, next_id);
    deferred.resolve(items);
  }, 2000);

  return deferred.promise;
};


/**
 * @param {*} prev_id The ID of the item after which to fetch the range.
 * @param {number} length The (maximum) number of items to fetch.
 */
app.PostRepository.prototype.getRangeAfter = function (prev_id, length) {
  var deferred = this.$q.defer();

  window.console.log('datastore: request %d after %d', length, prev_id);
  this.$timeout(function () {
    var items = [];
    for (var i = 0; i < length; ++i) {
      var id = Math.round(Math.random() * 1000000);
      var item = {
        'id': id,
        'image_id': id % 20,
        'ts_ago': '5 minutes ago',
        'text': 'Post contents'
      };

      if (Math.round(Math.random())) {
        var h = 150 + Math.round(Math.random() * 200);
        item['photo_url'] = 'http://placekitten.com/400/' + h + '?image=' + (id % 20);
      }

      items.push(item);
    }

    window.console.log('datastore: return %d after %d', length, prev_id);
    deferred.resolve(items);
  }, 2000);

  return deferred.promise;
};
