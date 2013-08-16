goog.provide('app.PostRepository');


/**
 * @constructor
 * @ngInject
 */
app.PostRepository = function () {
  this.cache = [];
  this.cache_ids = [];
};


/**
 * @param {*} next_id The ID of the item before which to fetch the range.
 * @param {number} length The (maximum) number of items to fetch.
 */
app.PostRepository.prototype.getRangeBefore = function (next_id, length, callback) {
  window.console.log('datastore: request %d before %d', length, next_id);

  var cache_after_key = goog.array.indexOf(this.cache_ids, next_id);
  if (cache_after_key >= length) {
    var items = this.cache.slice(cache_after_key - length, cache_after_key);
    if (items.length === length) {
      window.console.log('datastore: return cached %d before %d', length, next_id);
      setTimeout(function () {
        callback(null, items);
      }, 0);
      return;
    }
  }

  var self = this;
  setTimeout(function () {
    var items = self.generateItems_(length);
    self.cacheItemsBefore_(next_id, items);

    window.console.log('datastore: return %d before %d', length, next_id);
    callback(null, items);
  }, 2000);
};


/**
 * @param {*} prev_id The ID of the item after which to fetch the range.
 * @param {number} length The (maximum) number of items to fetch.
 */
app.PostRepository.prototype.getRangeAfter = function (prev_id, length, callback) {
  window.console.log('datastore: request %d after %d', length, prev_id);

  var cache_before_key = goog.array.indexOf(this.cache_ids, prev_id);
  if (cache_before_key !== -1 && this.cache.length >= cache_before_key + length) {
    var items = this.cache.slice(cache_before_key + 1, cache_before_key + 1 + length);
    if (items.length === length) {
      window.console.log('datastore: return cached %d after %d', length, prev_id);
      setTimeout(function () {
        callback(null, items);
      }, 0);
      return;
    }
  }

  var self = this;
  setTimeout(function () {
    var items = self.generateItems_(length);
    self.cacheItemsAfter_(prev_id, items);

    window.console.log('datastore: return %d after %d', length, prev_id);
    callback(null, items);
  }, 2000);
};


app.PostRepository.prototype.generateItems_ = function (length) {
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

  return items;
};


app.PostRepository.prototype.cacheItemsBefore_ = function (next_id, items) {
  var length = items.length;
  var cache_after_key = goog.array.indexOf(this.cache_ids, next_id);

  var cache_splice_args = [ cache_after_key - length, length ].concat(items);
  this.cache.splice.apply(this.cache, cache_splice_args);

  var ids = goog.array.map(items, function (item) {
    return item['id'];
  });
  var cache_ids_splice_args = [ cache_after_key - length, length ].concat(ids);
  this.cache_ids.splice.apply(this.cache_ids, cache_ids_splice_args);
};


app.PostRepository.prototype.cacheItemsAfter_ = function (prev_id, items) {
  var length = items.length;
  var cache_before_key = goog.array.indexOf(this.cache_ids, prev_id);

  var cache_splice_args = [ cache_before_key + 1, length ].concat(items);
  this.cache.splice.apply(this.cache, cache_splice_args);

  var ids = goog.array.map(items, function (item) {
    return item['id'];
  });
  var cache_ids_splice_args = [ cache_before_key + 1, length ].concat(ids);
  this.cache_ids.splice.apply(this.cache_ids, cache_ids_splice_args);
};
