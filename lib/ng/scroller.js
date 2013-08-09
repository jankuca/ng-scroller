goog.provide('ng.Scroller');
goog.provide('ng.ScrollerItem');

goog.require('ng.ScrollerStyler');


/**
 * @typedef {{
 *   id: (number|string|null),
 *   element: !Element,
 *   scope: !angular.Scope,
 *   watchers: !Array,
 *   listeners: !Object.<string, !Array>
 * }}
 */
ng.ScrollerItem;



/**
 * @constructor
 * @ngInject
 */
ng.Scroller = function () {
  this.styler = null;

  this.requests_ = {};

  /**
   * @type {!Array.<!ng.ScrollerItem>}
   */
  this.item_pool_ = [];
};


/**
 * @expose
 */
ng.Scroller.prototype.priority = 1000;

/**
 * @expose
 */
ng.Scroller.prototype.transclude = 'element';


ng.Scroller.prototype.transcluder = goog.abstractMethod;


/**
 * @param {!angular.JQLite} element The root directive element.
 * @param {!Object.<string, string>} attrs Attrbutes of the element.
 * @param {function(!angular.Scope, function(!Element))} transclude Linker fn.
 */
ng.Scroller.prototype.compile = function (element, attrs, transclude) {
  window.console.log(arguments);
  this.transcluder = transclude;

  var viewport = element[0];
  while ((!viewport.hasAttribute || !viewport.hasAttribute('ng-scroller')) &&
      viewport !== document.body) {
    viewport = viewport.parentNode;
  }
  this.viewport = viewport;

  var styler_exp = viewport.getAttribute('ng-scroller') || 'ng.ScrollerStyler';
  this.styler = this.createStyler(styler_exp);

  var exp = attrs['ngScrollerRepeat'];
  var keys = exp.split(/\s+in\s+/);
  this.data_source_key = keys[1];
  this.child_key = keys[0];
};


// TODO: improve, do not just use globals
ng.Scroller.prototype.createStyler = function (styler_exp) {
  var path = styler_exp.split('.');
  var Constructor = window;

  var key;
  while (key = path.shift()) {
    Constructor = Constructor[key];
  }

  if (typeof Constructor !== 'function') {
    throw new Error('No such scroller styler');
  }

  var styler = new Constructor(this, this.viewport);
  return styler;
};


ng.Scroller.prototype.postLink = function ($scope) {
  this.$scope = $scope;
  this.data_source = this.$scope[this.data_source_key];

  this.init_();
};


ng.Scroller.prototype.init_ = function () {
  this.styler.init();
};


ng.Scroller.prototype.loadRangeBefore = function (next_id, length) {
  return this.loadRangeInDirection_(-1, next_id, length);
};


ng.Scroller.prototype.loadRangeAfter = function (prev_id, length) {
  return this.loadRangeInDirection_(1, prev_id, length);
};


ng.Scroller.prototype.loadRangeInDirection_ = function (dir, ref_id, length) {
  var req_key = (dir > 0 ? '+' : '-') + (ref_id === null ? '<null>' : ref_id);

  var prev_req = this.requests_[req_key];
  if (prev_req) {
    return null;
  }

  var self = this;
  var styler = this.styler;
  var parent_scope = this.$scope;
  var child_key = this.child_key;

  var onResults = function (results) {
    delete self.requests_[req_key];

    var items = results.map(function (result) {
      var item = self.getItem_();
      item.id = result['id'];
      item.scope[child_key] = result;
      item.scope['$id'] = result['id'];

      return item;
    });

    return items;
  };

  var req;
  if (dir > 0) {
    req = this.data_source.getRangeAfter(ref_id, length);
  } else {
    req = this.data_source.getRangeBefore(ref_id, length);
  }

  this.requests_[req_key] = req;
  // TODO: add error handler
  return req.then(onResults);
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

  var item = /** @type {!ng.ScrollerItem} */ ({
    id: null,
    element: null,
    scope: this.$scope.$new(),
    watchers: [],
    listeners: {}
  });
  this.transcluder(item.scope, function (cloned) {
    item.element = cloned[0];
  });

  return item;
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
  item.scope.$$watchers = [];
  item.scope.$$listeners = {
    '$destroy': item.listeners['$destroy'] || []
  };

  this.item_pool_.push(item);
};
