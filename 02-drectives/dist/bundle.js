/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _directives = __webpack_require__(2);

var _directives2 = _interopRequireDefault(_directives);

var _filters = __webpack_require__(3);

var _filters2 = _interopRequireDefault(_filters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefix = 'sd';

debugger;
var selector = Object.keys(_directives2.default).map(function (d) {
  return '[' + prefix + '-' + d + ']';
}).join();

function Seed(opts) {
  var self = this,
      root = this.el = document.getElementById(opts.id),
      //root el
  els = root.querySelectorAll(selector),
      // 获得带有vue指令的节点组成的数组
  bindings = {}; //internal real data

  self.scope = {} // external interface

  // 处理带有指令的节点
  ;[].forEach.call(els, processNode);
  processNode(root);

  for (var key in bindings) {
    self.scope[key] = opts.scope[key];
  }

  function processNode(el) {
    cloneAttributes(el.attributes).forEach(function (attr) {
      var directive = parseDirective(attr);
      if (directive) {
        bindDirective(self, el, bindings, directive);
      }
    });
  }
}

// 返回指令的属性 name 和 value
function cloneAttributes(attributes) {
  return [].map.call(attributes, function (attr) {
    return {
      name: attr.name,
      value: attr.value
    };
  });
}
// seed, el, bindings 是之前就存在的参数
// directive是刚刚准备好的参数
function bindDirective(seed, el, bindings, directive) {
  el.removeAttribute(directive.attr.name);
  var key = directive.key,
      binding = bindings[key];
  if (!binding) {
    bindings[key] = binding = {
      value: undefined,
      directives: []
    };
  }
  directive.el = el;
  binding.directives.push(directive);

  if (directive.bind) {
    directive.bind(el, binding.value);
  } // ?

  if (!seed.scope.hasOwnProperty(key)) {
    bindAccessors(seed, key, binding);
  }
}

function bindAccessors(seed, key, binding) {
  Object.defineProperty(seed.scope, key, {
    get: function get() {
      return binding.value;
    },
    set: function set(value) {
      binding.vaue = value;
      binding.directives.forEach(function (directive) {
        if (value && directive.filters) {
          // 如果带有过滤器，则执行过滤器方法
          value = applyFilters(value, directive);
        }
        directive.update(directive.el, value, directive.argument, directive, seed); // text() or update()
      });
    }
  });
}

// 对不同形式的指令 进行分解和处理 ,带“-”的 带“|”的
function parseDirective(attr) {
  if (attr.name.indexOf(prefix) === -1) return;

  // 处理属性名 sd-text or sd-on-update
  var noprefix = attr.name.slice(prefix.length + 1),
      //text or on-update
  argIndex = noprefix.indexOf('-'),
      dirname = argIndex === -1 ? noprefix : noprefix.slice(0, argIndex),
      // text or on
  def = _directives2.default[dirname],
      // text() or on {}
  arg = argIndex === -1 ? null : noprefix.slice(argIndex + 1); // update

  //处理属性值

  var exp = attr.value,
      pipeIndex = exp.indexOf('|'),
      key = pipeIndex === -1 ? exp.trim() : exp.slice(0, pipeIndex).trim(),
      filters = pipeIndex === -1 ? null : exp.slice(pipeIndex + 1).split('|').map(function (filter) {
    return filter.trim();
  });

  return def ? {
    attr: attr, // name, value
    key: key, // value
    filters: filters, // filter-name
    definition: def, // 指令对应的方法
    argument: arg, // null or update
    update: typeof def === 'function' ? def : def.update //text() or on.update()
  } : null;
}

function applyFilters(value, directive) {
  if (directive.definition.customFilter) {
    //  监听事件触发
    return directive.definition.customFilter(value, directive.filters);
  } else {
    directive.filters.forEach(function (filter) {
      if (_filters2.default[filter]) {
        value = _filters2.default[filter](value);
      }
    });
    return value;
  }
}
exports.default = {
  create: function create(opts) {
    return new Seed(opts);
  },

  filters: _filters2.default,
  directives: _directives2.default
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _main = __webpack_require__(0);

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var app = _main2.default.create({
        id: 'test',
        // template
        scope: {
            msg: 'hello',
            hello: 'WHWHWHW',
            changeMessage: function changeMessage() {
                app.scope.msg = 'hola';
            }
        }
    });
})();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    text: function text(el, value) {
        el.textContent = value || '';
    },
    show: function show(el, value) {
        el.style.display = value ? '' : 'none';
    },
    class: function _class(el, value, classname) {
        el.classList[value ? 'add' : 'remove'](classname);
    },
    on: {
        update: function update(el, handler, event, directive) {
            if (!directive.handlers) {
                directive.handlers = {};
            }
            var handlers = directive.handlers;
            if (handlers[event]) {
                el.removeEventListener(event, handlers[event]);
            }
            if (handler) {
                handler = handler.bind(el);
                el.addEventListener(event, handler);
                handlers[event] = handler;
            }
        },
        unbind: function unbind(el, event, directive) {
            if (directive.handlers) {
                el.removeEventListener(event, directive.handlers[event]);
            }
        },
        customFilter: function customFilter(handler, selectors) {
            return function (e) {
                var match = selectors.every(function (selector) {
                    return e.target.webkitMatchesSelector(selector); //常常用于事件委托、判断当前DOM节点是否能完全匹配对应的CSS选择器规则，匹配成功返回true
                });
                if (match) handler.apply(this, arguments);
            };
        }
    }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    capitalize: function capitalize(value) {
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map