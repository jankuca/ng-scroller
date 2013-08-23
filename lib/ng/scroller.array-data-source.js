goog.provide('ng.ArrayScrollerDataSource');


/**
 * @constructor
 * @param {!Array} items The array to wrap with the data source API.
 */
ng.ArrayScrollerDataSource = function (items) {
  this.items_ = items;

  var ids = [];
  for (var i = 0, ii = items.length; i < ii; ++i) {
    ids[i] = items[i]['id'] || '<index:' + i + '>';
  }
  this.ids_ = ids;
};


ng.ArrayScrollerDataSource.prototype.getRangeAfter = function (ref, len, cb) {
  window.console.log('%cref: ' + ref, 'color:red');
  if (ref === null) {
    return cb(null, this.items_.slice(0, len));
  }

  var index = this.ids_.indexOf(ref);
  if (index === -1) {
    cb(new Error('No such item id=' + ref + ' found in the data store'), null);
  }

  cb(null, this.items_.slice(index + 1, index + 1 + len));
};


ng.ArrayScrollerDataSource.prototype.getRangeBefore = function (ref, len, cb) {
  window.console.log('%cref: ' + ref, 'color:red');
  if (ref === null) {
    return cb(null, this.items_.slice(0, len));
  }

  var index = this.ids_.indexOf(ref);
  if (index === -1) {
    cb(new Error('No such item id=' + ref + ' found in the data store'), null);
  }

  var start = Math.max(0, index - len);
  cb(null, this.items_.slice(start, index));
};
