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
ng.Scroller = function ($compile, $q) {
  this.$compile = $compile;
  this.$q = $q;

  this.styler = null;

  this.requests_ = {};

  /**
   * @type {!Array.<!ng.ScrollerItem>}
   */
  this.item_pool_ = [];

  /**
   * @type {!Object.<string, function(
   *   !angular.Scope,
   *   function(!angular.JQLite)
   * )>}
   */
  this.templates_ = {};
};


/**
 * @expose
 */
ng.Scroller.prototype.priority = 1000;

/**
 * @expose
 */
ng.Scroller.prototype.terminal = true;


/**
 * @param {!angular.JQLite} $carousel The root directive element.
 * @param {!Object.<string, string>} attrs Attributes of the element.
 */
ng.Scroller.prototype.compile = function ($carousel, attrs) {
  var $compile = this.$compile;

  var carousel = $carousel[0];
  this.carousel = carousel;

  var viewport = carousel;
  while ((!viewport.hasAttribute || !viewport.hasAttribute('ng-scroller')) &&
      viewport !== document.body) {
    viewport = viewport.parentNode;
  }
  this.viewport = viewport;

  var templates = this.templates_;
  var template_count = 0;

  var template_el;
  while (template_el = carousel.firstChild) {
    if (template_el.nodeType === 1) {
      var template_key = template_el.getAttribute('ng-scroller-template');
      if (!template_key) {
        if (template_count === 0) {
          template_key = '_';
        } else {
          break;
        }
      }

      templates[template_key] = $compile(template_el);
      template_count += 1;
    }

    carousel.removeChild(template_el);
  }

  var styler_exp = viewport.getAttribute('ng-scroller') || 'ng.ScrollerStyler';
  this.styler = this.createStyler(styler_exp);

  var exp = attrs['ngScrollerRepeat'];
  var keys = exp.split(/\s+in\s+/);
  this.data_source_key = keys[1];
  this.child_key = keys[0];

  var template_callback_key = viewport.getAttribute('ng-scroller-template-callback');
  this.template_callback_key = template_callback_key;
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
    throw new Error('No such scroller styler "' + styler_exp + '"');
  }

  var styler = new Constructor(this, this.viewport, this.carousel);
  return styler;
};


ng.Scroller.prototype.postLink = function ($scope) {
  this.$scope = $scope;
  this.data_source = this.$scope[this.data_source_key];

  if (this.template_callback_key) {
    this.getItemTemplateKey = this.$scope[this.template_callback_key];
  }

  this.init_();
};


ng.Scroller.prototype.init_ = function () {
  this.styler.init();
};


ng.Scroller.prototype.getItemTemplateKey = function () {
  return null;
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

  var req = this.$q.defer();

  var self = this;
  var styler = this.styler;
  var parent_scope = this.$scope;
  var child_key = this.child_key;

  var onResults = function (err, results) {
    if (err) {
      req.reject(err);
      return;
    }

    var multiple_templates = !self.templates_['_'];

    var items = results.map(function (result) {
      var item_id = result['id'];
      var template_key = self.getItemTemplateKey(result, item_id);
      if (multiple_templates && (!template_key || template_key === '_')) {
        throw new Error('Invalid template key returned by the styler');
      }

      var item = self.getItem_(template_key || '_');
      item.id = result['id'];
      item.scope[child_key] = result;
      item.scope['$id'] = item_id;

      if (!item.element) {
        item.element = self.createItemElement_(item);
      }

      return item;
    });

    req.resolve(items);
    console.log('applying');
  };

  var onResultsSafe = function (err, items) {
    self.$scope.$apply(function () {
      onResults(err, items)
    });
  };

  if (dir > 0) {
    this.data_source.getRangeAfter(ref_id, length, onResultsSafe);
  } else {
    this.data_source.getRangeBefore(ref_id, length, onResultsSafe);
  }

  this.requests_[req_key] = req;

  return req.promise;
};


/**
 * @param {string} template_key A template key.
 * @return {!ng.ScrollerItem} An item element.
 */
ng.Scroller.prototype.getItem_ = function (template_key) {
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
    template_key: template_key,
    scope: this.$scope.$new(),
    watchers: [],
    listeners: {}
  });

  return item;
};


ng.Scroller.prototype.createItemElement_ = function (item) {
  var template = this.templates_[item.template_key];
  if (!template) {
    throw new Error('Unknown item template "' + item.template_key + '"');
  }

  var element = null;
  template(item.scope, function (cloned) {
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

  item.scope.$apply();

  item.scope.__disabled__ = true;
  item.scope.$$watchers = [];
  item.scope.$$listeners = {
    '$destroy': item.listeners['$destroy'] || []
  };

  this.item_pool_.push(item);
};
