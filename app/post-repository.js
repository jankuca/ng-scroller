goog.provide('app.PostRepository');


/**
 * @construtor
 * @ngInject
 */
app.PostRepository = function ($q, $timeout) {
  this.$q = $q;
  this.$timeout = $timeout;
};


/**
 * @param {*} prev_id The ID of the item before which to fetch the range.
 * @param {number} length The (maximum) number of items to fetch.
 */
app.PostRepository.prototype.getRangeBefore = function (next_id, length) {
  var deferred = this.$q.defer();

  console.log('datastore: request %d after %d', length, next_id);
  this.$timeout(function () {
    var items = [];
    for (var i = 0; i < length; ++i) {
      var id = Math.round(Math.random() * 1000000);
      items.push({
        'id': id,
        'image_id': id % 20,
        'ts_ago': '5 minutes ago',
        'text': 'Post contents'
      });
    }

    console.log('datastore: return %d after %d', length, next_id);
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

  console.log('datastore: request %d after %d', length, prev_id);
  this.$timeout(function () {
    var items = [];
    for (var i = 0; i < length; ++i) {
      var id = Math.round(Math.random() * 1000000);
      items.push({
        'id': id,
        'image_id': id % 20,
        'ts_ago': '5 minutes ago',
        'text': 'Post contents'
      });
    }

    console.log('datastore: return %d after %d', length, prev_id);
    deferred.resolve(items);
  }, 2000);

  return deferred.promise;
};
