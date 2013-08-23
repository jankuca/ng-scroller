goog.provide('ng.directive');


/**
 * @param {!Function} Constructor The constructor to turn into directive.
 * @return {function():(!Object)} A directive object factory.
 */
ng.directive = function (Constructor) {
  /**
   * @constructor
   */
  var Directive = function () {};
  Directive.prototype = Constructor.prototype;

  var factory = function () {
    var services = arguments;

    var directive = new Directive();
    directive.compile = function () {
      var instance = new Directive();
      Constructor.apply(instance, services);
      instance.compile.apply(instance, arguments);
      
      return {
        pre: instance.preLink ? goog.bind(instance.preLink, instance) : null,
        post: instance.postLink ? goog.bind(instance.postLink, instance) : null
      };
    };

    return directive;
  };

  /**
   * @expose
   */
  factory.$inject =
    Constructor['$inject'] ||
    Constructor.toString().match(/\((.*)\)/)[1].match(/\$?[^,\s]+/g) ||
    [];

  return factory;
};
