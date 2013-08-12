goog.provide('ng.InPageScrollerStyler');

goog.require('ng.ScrollerStyler');


/**
 * @constructor
 * @extends {ng.ScrollerStyler}
 */
ng.InPageScrollerStyler = function (scroller, container, carousel) {
  ng.ScrollerStyler.call(this, scroller, container, carousel);

  this.viewport = window;
};

goog.inherits(ng.InPageScrollerStyler, ng.ScrollerStyler);

/*
ng.InPageScrollerStyler.prototype.init = function () {
  this.initial_margins = this.getMargins(this.container);
  this.margin_before = this.initial_margins.before;
  this.margin_after = this.initial_margins.after;

  goog.base(this, 'init');
};
*/

/**
 * @override
 */
ng.InPageScrollerStyler.prototype.registerEvents = function () {
  // Be ready for subclasses that override the default `this.viewport`
  var target = this.viewport.nodeType ? this.viewport : this.viewport.document;

  this.handler.listen(target, 'scroll', this.handleScroll);
  // this.handler.listen(target, 'mousewheel', this.handleMouseWheel);  
};

/*
ng.InPageScrollerStyler.prototype.handleScroll = function (e) {
  var rect = this.container.getBoundingClientRect();

  this.margin_before += this.initial_margins.before - rect.top;
  this.margin_before = Math.max(this.margin_before, this.initial_margins.before);
  this.applyMargins();

  var delta = this.getViewportScrollPosition() - this.last_pos;
  this.scroll(delta);

  this.last_pos += delta;
};


ng.InPageScrollerStyler.prototype.scroll = function (delta) {
  goog.base(this, 'scroll', delta);

  this.applySkew();
};


ng.InPageScrollerStyler.prototype.getMargins = function (el) {
  var style = el.style;
  var computed = getComputedStyle(el, null);

  return {
    before: parseInt(computed.marginTop, 10) || 0,
    after: parseInt(computed.marginBottom, 10) || 0
  };
};


ng.InPageScrollerStyler.prototype.applyMargins = function () {
  this.container.style.marginTop = this.margin_before + 'px';
  this.container.style.marginBottom = this.margin_after + 'px';
};


ng.InPageScrollerStyler.prototype.applySkew = function () {
  // var t = [ 0, this.skew + 'px', 0];
  // this.carousel.style['webkitTransform'] = 'translate3d(' + t.join(',') + ')';
};


ng.InPageScrollerStyler.prototype.canUnshift = function () {
  return (this.skew > 0);
};


ng.InPageScrollerStyler.prototype.canShift = function () {
  var first_item = this.items[0];
  if (!first_item) {
    return false;
  }

  var first_height = first_item.element.clientHeight;
  return (-this.skew >= first_height);
};


ng.InPageScrollerStyler.prototype.canPush = function () {
  var viewport_height = this.getViewportHeight_();
  var carousel_height = this.carousel.clientHeight;

  return (viewport_height >= carousel_height + this.skew);
};


ng.InPageScrollerStyler.prototype.canPop = function () {
  var last_item = this.items[this.items.length - 1];
  if (!last_item) {
    return false;
  }

  var viewport_height = window.innerHeight;
  var carousel_height = this.carousel.clientHeight;
  var last_height = last_item.element.clientHeight;

  return (carousel_height + this.skew - viewport_height - last_height >= 0);
};


ng.InPageScrollerStyler.prototype.getViewportHeight_ = function () {
  // Be ready for subclasses that override the default `this.viewport`
  if (this.viewport.nodeType) {
    return this.viewport.clientHeight || 0;
  }

  // window:
  return this.viewport.innerHeight;
};
*/
