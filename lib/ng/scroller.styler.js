goog.provide('ng.ScrollerStyler');

goog.require('goog.events.EventHandler');
goog.require('goog.events.MouseWheelHandler');


/**
 * @constructor
 */
ng.ScrollerStyler = function (scroller, container, carousel) {
  this.$scroller = scroller;
  this.container = container;
  this.viewport = container;
  this.carousel = carousel;

  /**
   * The number of items to request at once.
   * @type {number}
   */
  this.buffer_length_ = 5;

  this.handler = new goog.events.EventHandler(this);

  /**
   * The number of px the carousel element is overflowing at the top.
   * @type {number}
   */
  this.skew = 0;

  this.offset = 0;

  /**
   * The scroll position from the last scroll event.
   * @type {number}
   */
  this.last_pos = 0;

  this.margin_before = 0;
  this.margin_after = 0;

  this.loading_items_before = false;
  this.loading_items_after = false;

  /**
   * The items that are in the DOM in any given moment.
   * @type {!Array.<{ scope: !angular.Scope, element: !Element }>}
   */
  this.items = [];
};


ng.ScrollerStyler.prototype.registerEvents = function () {
  this.handler.listen(this.viewport, 'scroll', this.handleScroll);
  this.handler.listen(this.viewport, 'touchmove', this.handleScroll);
  this.handler.listen(this.mousewheel_handler, 'mousewheel', this.handleMouseWheel);
};


ng.ScrollerStyler.prototype.init = function () {
  this.mousewheel_handler = new goog.events.MouseWheelHandler(this.viewport);

  this.registerEvents();
  this.collectLoadingSpinner();

  var scroll = this.viewport.scrollTop || this.viewport.scrollY || 0;
  var offset = scroll + this.container.getBoundingClientRect().top;
  this.offset = offset;
  this.skew += offset;

  this.last_pos = this.getViewportScrollPosition();

  this.loadMoreItemsAfter(null);
};


ng.ScrollerStyler.prototype.collectLoadingSpinner = function () {
  this.loading_spinner_template = null;

  var nodes = this.carousel.childNodes;
  for (var i = 0, ii = nodes.length; i < ii; ++i) {
    var node = nodes[i];
    if (node.nodeType === 1 && node.hasAttribute('ng-scroller-loading')) {
      this.loading_spinner_template = node;
      this.carousel.removeChild(node);
      break;
    }
  }
};


ng.ScrollerStyler.prototype.getItemElementById = function (id) {
  var item_index = this.getItemIndexById(id);
  var item = this.items[item_index];

  return item ? item.element : null;
};


ng.ScrollerStyler.prototype.handleScroll = function (e) {
  var pos = this.getViewportScrollPosition();

  var viewport_height = this.getViewportHeight();
  var carousel_height = this.carousel.clientHeight;

  var frame_start = this.margin_before + this.offset;
  var frame_end = frame_start + carousel_height - viewport_height;
  frame_end = Math.max(frame_start, frame_end);

  var framed_pos = pos;

  if (this.loading_items_before) {
    framed_pos = Math.max(frame_start, framed_pos);
  }
  if (this.loading_items_after) {
    framed_pos = Math.min(frame_end, framed_pos);
  }

  var delta = framed_pos - this.last_pos;
  window.console.log('%cframe: [%d %d] pos: %d->%d skew: %d', 'color:navy', frame_start, frame_end, pos, framed_pos, this.skew);
  this.scroll(delta);
  this.last_pos += delta;

  if (framed_pos !== pos) {
    this.setViewportScrollPosition(framed_pos);
  }
};


ng.ScrollerStyler.prototype.handleMouseWheel = function (e) {
  if (e.deltaY > 0) {
    var viewport = this.viewport;
    var viewport_height = viewport.offsetHeight || viewport.innerHeight || 0;
    var content_height = viewport.scrollHeight || document.body.clientHeight;
    var is_at_end = (viewport_height + this.getViewportScrollPosition() >=
      content_height);
    if (is_at_end) {
      e.preventDefault();
    }
  } else {
    var is_at_beginning = (this.getViewportScrollPosition() === 0);
    if (is_at_beginning) {
      e.preventDefault();
    }
  }
};


ng.ScrollerStyler.prototype.handleItemContentLoad = function (e) {
  var element = e.target;
  while (element.parentNode !== this.carousel) {
    element = element.parentNode;

    if (!element) {
      return;
    }
  }

  var item = this.getItemByElement(element);
  var height = element.clientHeight;

  var img_rect = e.target.getBoundingClientRect();
  if (img_rect.top < 0) {
    var delta = height - item.height;
    var scroll_pos = this.getViewportScrollPosition();
    this.setViewportScrollPosition(scroll_pos + delta);
    this.skew -= delta;
  }

  item.height = height;
};


ng.ScrollerStyler.prototype.getItemByElement = function (element) {
  var items = this.items;
  for (var i = 0, ii = items.length; i < ii; ++i) {
    if (items[i].element === element) {
      return items[i];
    }
  }
  return null;
};


/**
 * @param {number} delta The scroll position delta from the last scroll event.
 */
ng.ScrollerStyler.prototype.scroll = function (delta) {
  this.skew -= delta;

  if (delta > 0) {
    this.shift();
    if (this.canPush()) {
      this.loadMoreItemsAfter(this.getLastItemId());
    }
  } else {
    this.pop();
    if (this.canUnshift() && this.isInScrollerArea()) {
      this.loadMoreItemsBefore(this.getFirstItemId());
    }
  }
};


ng.ScrollerStyler.prototype.getFirstItemId = function () {
  var items = this.items;
  var first_item = items[0];

  return first_item ? first_item.id : null;
};


ng.ScrollerStyler.prototype.getLastItemId = function () {
  var items = this.items;
  var last_item = items[items.length - 1];

  return last_item ? last_item.id : null;
};


ng.ScrollerStyler.prototype.requestMoreItemsBefore = function (next_id, callback) {
  window.console.log('styler: request %d before %d', this.buffer_length_, next_id);
  this.$scroller.loadRangeBefore(next_id, this.buffer_length_, callback);
};


ng.ScrollerStyler.prototype.requestMoreItemsAfter = function (prev_id, callback) {
  window.console.log('styler: request %d after %d', this.buffer_length_, prev_id);
  this.$scroller.loadRangeAfter(prev_id, this.buffer_length_, callback);
};


/**
 * @param {*} next_id An item id.
 */
ng.ScrollerStyler.prototype.loadMoreItemsBefore = function (next_id) {
  var spinner, spinner_height;

  var self = this;

  /**
   * @param {!Array.<!ng.ScrollerItem>} items Newly loaded items.
   */
  var onRangeLoad = function (err, items) {
    // TODO: add error handler

    window.console.log('styler: got items before %d', next_id);
    self.insertItemsBefore(next_id, items);

    if (spinner) {
      self.skew += spinner_height;
      spinner.parentNode.removeChild(spinner);
      self.setViewportScrollPosition(
        self.getViewportScrollPosition() - spinner_height);
    }

    self.loading_items_before = false;

    var next_item_index = self.getItemIndexById(next_id);
    var item_splice_args = [ next_item_index, 0 ].concat(items); 
    self.items.splice.apply(self.items, item_splice_args);

    // TODO: handle empty arrays
    if (self.canUnshift()) {
      self.loadMoreItemsBefore(items[0].id);
    }
  };

  this.loading_items_before = true;

  window.console.log('styler: add spinner before %d', next_id);
  spinner = this.insertLoadingSpinnerBefore(next_id);
  if (spinner) {
    spinner_height = this.getElementHeight(spinner);
    this.skew -= spinner_height;
    self.setViewportScrollPosition(
      self.getViewportScrollPosition() + spinner_height);
  }

  this.requestMoreItemsBefore(next_id, onRangeLoad);
};


/**
 * @param {*} prev_id An item id.
 */
ng.ScrollerStyler.prototype.loadMoreItemsAfter = function (prev_id) {
  var spinner;

  var self = this;

  /**
   * @param {!Array.<!ng.ScrollerItem>} items Newly loaded items.
   */
  var onRangeLoad = function (err, items) {
    // TODO: add error handler

    window.console.log('styler: got items after %d', prev_id);
    self.insertItemsAfter(prev_id, items);

    if (spinner) {
      spinner.parentNode.removeChild(spinner);
    }

    self.loading_items_after = false;

    var prev_item_index = self.getItemIndexById(prev_id);
    var item_splice_args = [ prev_item_index + 1, 0 ].concat(items); 
    self.items.splice.apply(self.items, item_splice_args);

    // TODO: handle empty arrays
    if (self.canPush()) {
      self.loadMoreItemsAfter(items[items.length - 1].id);
    }
  };

  this.loading_items_after = true;

  window.console.log('styler: add spinner after %d', prev_id);
  spinner = this.insertLoadingSpinnerAfter(prev_id);

  this.requestMoreItemsAfter(prev_id, onRangeLoad);
};


ng.ScrollerStyler.prototype.getItemIndexById = function (id) {
  // TODO: keep ids in a separate array to allow faster (indexOf) lookup?
  var items = this.items;
  for (var i = 0, ii = items.length; i < ii; ++i) {
    if (items[i].id === id) {
      return i;
    }
  }

  return items.length - 1;
};


ng.ScrollerStyler.prototype.insertElementBefore = function (next_id, el) {
  var next_item_el;
  if (next_id) {
    next_item_el = this.getItemElementById(next_id);
  }
  next_item_el = next_item_el || this.carousel.firstChild;

  this.carousel.insertBefore(el, next_item_el);
};


ng.ScrollerStyler.prototype.insertElementAfter = function (prev_id, el) {
  var next_item_el = null;
  if (prev_id) {
    var prev_item_el = this.getItemElementById(prev_id);
    if (prev_item_el) {
      next_item_el = prev_item_el.nextSibling;
    }
  }

  this.carousel.insertBefore(el, next_item_el);
};


/**
 * @param {*} next_id An item id.
 * @return {Element} A spinner element.
 */
ng.ScrollerStyler.prototype.insertLoadingSpinnerBefore = function (next_id) {
  if (!this.loading_spinner_template) {
    return null
  }

  var spinner = this.loading_spinner_template.cloneNode(true);
  this.insertElementBefore(next_id, spinner);

  return spinner;
};


/**
 * @param {*} prev_id An item id.
 * @return {Element} A spinner element.
 */
ng.ScrollerStyler.prototype.insertLoadingSpinnerAfter = function (prev_id) {
  if (!this.loading_spinner_template) {
    return null
  }

  var spinner = this.loading_spinner_template.cloneNode(true);
  this.insertElementAfter(prev_id, spinner);

  return spinner;
};


/**
 * @param {*} next_id An item id.
 * @param {!Array.<!ng.ScrollerItem>} items The items to insert.
 */
ng.ScrollerStyler.prototype.insertItemsBefore = function (next_id, items) {
  var frag = document.createDocumentFragment();
  for (var i = 0, ii = items.length; i < ii; ++i) {
    frag.appendChild(items[i].element);
  }

  var prev_height = this.carousel.clientHeight;
  this.insertElementBefore(next_id, frag);


  for (var i = 0, ii = items.length; i < ii; ++i) {
    var item = items[i];
    item.height = item.element.clientHeight;

    var imgs = item.element.getElementsByTagName('img');
    for (var o = 0, oo = imgs.length; o < oo; ++o) {
      this.handler.listenOnce(imgs[o], 'load', this.handleItemContentLoad);
    }
  }

  var unshifted_height = this.carousel.clientHeight - prev_height;
  this.skew -= unshifted_height;

  var margin_before = this.margin_before;
  if (unshifted_height < margin_before) {
    this.margin_before -= unshifted_height;
  } else {
    this.setViewportScrollPosition(
      this.getViewportScrollPosition() + unshifted_height - margin_before);
    this.margin_before = 0;
  }
  this.applyMargins();
};


/**
 * @param {*} prev_id An item id.
 * @param {!Array.<!ng.ScrollerItem>} items The items to insert.
 */
ng.ScrollerStyler.prototype.insertItemsAfter = function (prev_id, items) {
  var frag = document.createDocumentFragment();
  for (var i = 0, ii = items.length; i < ii; ++i) {
    frag.appendChild(items[i].element);
  }

  var prev_height = this.carousel.clientHeight;
  this.insertElementAfter(prev_id, frag);

  for (var i = 0, ii = items.length; i < ii; ++i) {
    var item = items[i];
    item.height = item.element.clientHeight;

    var imgs = item.element.getElementsByTagName('img');
    for (var o = 0, oo = imgs.length; o < oo; ++o) {
      this.handler.listenOnce(imgs[o], 'load', this.handleItemContentLoad);
    }
  }

  // TODO: handle empty arrays
  if (items[items.length - 1].element.nextSibling) {
    this.margin_after -= this.carousel.clientHeight - prev_height;
    this.margin_after = Math.max(0, this.margin_after);
    this.applyMargins();
  }
};


ng.ScrollerStyler.prototype.shift = function () {
  var items = this.items;

  while (this.canShift()) {
    var item = items[0];
    var height = this.getElementHeight(item.element);
    
    this.skew += height;
    this.margin_before += height;

    // TODO: prevent layout on each iteration
    this.carousel.removeChild(item.element);
    this.$scroller.disposeItem(items.shift());

    this.applyMargins();
    window.console.log('styler: shift 1');
  }
};


ng.ScrollerStyler.prototype.pop = function () {
  var items = this.items;

  while (this.canPop()) {
    var item = items[items.length - 1];
    var height = this.getElementHeight(item.element);
    
    this.margin_after += height;

    // TODO: prevent layout on each iteration
    this.carousel.removeChild(item.element);
    this.$scroller.disposeItem(items.pop());

    this.applyMargins();
    window.console.log('styler: pop 1');
  }
};


ng.ScrollerStyler.prototype.canUnshift = function () {
  if (this.loading_items_before) {
    return false;
  }

  window.console.log('canUnshift: %d > 0', this.skew);
  return (this.skew > -50);
};


ng.ScrollerStyler.prototype.canShift = function () {
  var first_item = this.items[0];
  if (!first_item) {
    return false;
  }

  var first_height = this.getElementHeight(first_item.element);
  return (-this.skew >= first_height + 50);
};


ng.ScrollerStyler.prototype.canPush = function () {
  if (this.loading_items_after) {
    return false;
  }

  var viewport_height = this.getViewportHeight();
  var carousel_height = this.carousel.clientHeight;

  return (viewport_height + 50 >= carousel_height + this.skew);
};

  
ng.ScrollerStyler.prototype.canPop = function () {
  var last_item = this.items[this.items.length - 1];
  if (!last_item) {
    return false;
  }

  var viewport_height = this.getViewportHeight()
  var carousel_height = this.carousel.clientHeight;
  var last_height = this.getElementHeight(last_item.element);

  window.console.log('canPop: %d + %d - %d - %d >= 0', carousel_height, this.skew, viewport_height, last_height);
  return (carousel_height + this.skew - viewport_height - last_height >= 50);
};


ng.ScrollerStyler.prototype.isInScrollerArea = function () {
  var rect = this.container.getBoundingClientRect();
  return (rect.top - this.margin_before <= 0);
};


ng.ScrollerStyler.prototype.getViewportHeight = function () {
  return this.viewport.clientHeight || this.viewport.innerHeight || 0;
};


ng.ScrollerStyler.prototype.getViewportScrollPosition = function () {
  return this.viewport.scrollTop || this.viewport.scrollY || 0;
};


ng.ScrollerStyler.prototype.setViewportScrollPosition = function (pos) {
  if ('scrollTop' in this.viewport) {
    this.viewport.scrollTop = pos;
  } else {
    this.viewport.scrollTo(this.viewport.scrollX, pos);
  }

  this.last_pos = pos;
};


ng.ScrollerStyler.prototype.getElementHeight = function (el) {
  var style = goog.global.getComputedStyle(el, null);
  var border_top_width = parseInt(style.borderTopWidth, 10) || 0;
  var border_bottom_width = parseInt(style.borderBottomWidth, 10) || 0;

  return el.clientHeight + border_top_width + border_bottom_width;
};


ng.ScrollerStyler.prototype.applyMargins = function () {
  this.carousel.style.marginTop = this.margin_before + 'px';
  this.carousel.style.marginBottom = this.margin_after + 'px';
};
