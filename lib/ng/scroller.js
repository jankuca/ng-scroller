goog.provide('ng.Scroller');
goog.provide('ng.ScrollerItem');

goog.require('ng.ArrayScrollerDataSource');
goog.require('ng.InPageScrollerStyler');
goog.require('ng.ScrollerStyler');


/**
 * @typedef {{
 *   id: (number|string|null),
 *   element: !Element,
 *   scope: !angular.Scope,
 *   watchers: Array,
 *   listeners: !Object.<string, !Array>
 * }}
 */
ng.ScrollerItem;


/**
 * @typedef {{
 *   getRangeBefore: function(
 *     (number|string|null),
 *     number,
 *     function(Error, Array.<!ng.ScrollerItem>)
 *   ),
 *   getRangeAfter: function(
 *     (number|string|null),
 *     number,
 *     function(Error, Array.<!ng.ScrollerItem>)
 *   )
 * }}
 */
ng.ScrollerDataSource;


/**
 * @constructor
 * @ngInject
 */
ng.Scroller = function ($compile, $q, $timeout) {
  this.$compile = $compile;
  this.$q = $q;
  this.$timeout = $timeout;

  this.styler = null;

  /**
   * @type {ng.ScrollerDataSource|null}
   */
  this.data_source = null;

  this.requests_ = {};

  /**
   * @type {!Array.<!ng.ScrollerItem>}
   */
  this.item_pool_ = [];
};


/**
 * @expose
 */
ng.Scroller.prototype.terminal = true;


/**
 * @param {!angular.JQLite} $viewport The root directive element.
 * @param {!Object.<string, string>} attrs Attributes of the element.
 */
ng.Scroller.prototype.compile = function ($viewport, attrs) {
  var viewport = $viewport[0];
  this.viewport = viewport;

  var $carousel = viewport.querySelectorAll('[ng-scroller-repeat]');
  var carousel = $carousel[0];
  this.carousel = carousel;

  var template = carousel.children[0];
  this.template = this.$compile(template);

  var exp = carousel.getAttribute('ng-scroller-repeat');
  var keys = exp.split(/\s+in\s+/);
  this.data_source_key = keys[1];
  this.child_key = keys[0];

  var mode = this.viewport.getAttribute('ng-scroller') || 'widget';
  this.mode = mode;

  this.carousel.removeChild(template);
};


ng.Scroller.prototype.createStyler = function () {
  var styler;
  if (this.mode === 'content') {
    styler = new ng.InPageScrollerStyler(this, this.viewport, this.carousel);
  } else {
    styler = new ng.ScrollerStyler(this, this.viewport, this.carousel);
  }

  return styler;
};


ng.Scroller.prototype.postLink = function ($scope) {
  this.$scope = $scope;

  var data_source = this.$scope[this.data_source_key];
  if (goog.isArray(data_source)) {
    data_source = new ng.ArrayScrollerDataSource(data_source);
  }

  this.data_source = data_source;

  this.init_();
};


ng.Scroller.prototype.init_ = function () {
  this.styler = this.createStyler();
  this.styler.init();
};


ng.Scroller.prototype.loadRangeBefore = function (next_id, length, callback) {
  return this.loadRangeInDirection_(-1, next_id, length, callback);
};


ng.Scroller.prototype.loadRangeAfter = function (prev_id, length, callback) {
  return this.loadRangeInDirection_(1, prev_id, length, callback);
};


ng.Scroller.prototype.loadRangeInDirection_ = function (dir, ref_id, length, callback) {
  var req_key = (dir > 0 ? '+' : '-') + (ref_id === null ? '<null>' : ref_id);

  var prev_req = this.requests_[req_key];
  if (prev_req) {
    return null;
  }

  var self = this;
  var styler = this.styler;
  var parent_scope = this.$scope;
  var child_key = this.child_key;

  var onResults = function (err, results) {
    if (err) {
      callback(err, null);
      return;
    }

    var items = results.map(function (result) {
      var item_id = result['id'];

      var item = self.getItem_();
      item.id = result['id'];
      item.scope[child_key] = result;
      item.scope['$id'] = item_id;

      return item;
    });

    callback(null, items);
    window.console.log('scroller: applying');
  };

  var onResultsSafe = function (err, items) {
    delete self.requests_[req_key];

    if (err) {
      return onResults(err, null);
    }

    if (self.$scope.$$phase) {
      self.$scope.$evalAsync(function () {
        onResults(err, items);
      });
    } else {
      self.$scope.$apply(function () {
        onResults(err, items)
      });
    }
  };

  if (dir > 0) {
    this.data_source.getRangeAfter(ref_id, length, onResultsSafe);
  } else {
    this.data_source.getRangeBefore(ref_id, length, onResultsSafe);
  }

  this.requests_[req_key] = true;
};


/**
 * @return {!ng.ScrollerItem} An item element.
 */
ng.Scroller.prototype.getItem_ = function () {
  var pool_item = this.item_pool_.pop();
  if (pool_item) {
    pool_item.scope.__disabled__ = false;
    pool_item.scope.$$watchers = pool_item.watchers;
    pool_item.scope.$$listeners = pool_item.listeners;

    return pool_item;
  }

  var item_scope = this.$scope.$new();
  var item = /** @type {!ng.ScrollerItem} */ ({
    id: null,
    element: this.createItemElement_(item_scope),
    scope: item_scope,
    watchers: null,
    listeners: {}
  });

  return item;
};


ng.Scroller.prototype.createItemElement_ = function (item_scope) {
  var element = null;
  this.template(item_scope, function (cloned) {
    element = cloned[0];
  });

  return element;
};


/**
 * Detaches an item from the angular's digest cycle and adds it to the pool.
 * @param {!ng.ScrollerItem} item The item to dispose.
 */
ng.Scroller.prototype.disposeItem = function (item) {
  if (item.element.parentNode) {
    item.element.parentNode.removeChild(item.element);
  }

  item.scope[this.child_key] = null;
  item.scope['$id'] = null;
  item.id = null;
  item.watchers = item.scope.$$watchers;
  item.listeners = item.scope.$$listeners;

  item.scope.__disabled__ = true;
  item.scope.$$watchers = null;
  item.scope.$$listeners = {
    '$destroy': item.listeners['$destroy'] || []
  };

  this.item_pool_.push(item);
};
