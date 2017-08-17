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
        els = root.querySelectorAll(selector),
        bindings = {}; // internal real data

    self.scope = {} // external interface

    // process nodes for directives
    ;[].forEach.call(els, processNode);
    processNode(root);

    // initialize all variables by invoking setters
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

// clone attributes so they don't change
function cloneAttributes(attributes) {
    return [].map.call(attributes, function (attr) {
        return {
            name: attr.name,
            value: attr.value
        };
    });
}

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
    // invoke bind hook if exists
    if (directive.bind) {
        directive.bind(el, binding.value);
    }
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
            binding.value = value;
            binding.directives.forEach(function (directive) {
                if (value && directive.filters) {
                    value = applyFilters(value, directive);
                }
                directive.update(directive.el, value, directive.argument, directive, seed);
            });
        }
    });
}

function parseDirective(attr) {

    if (attr.name.indexOf(prefix) === -1) return;

    // parse directive name and argument
    var noprefix = attr.name.slice(prefix.length + 1),
        argIndex = noprefix.indexOf('-'),
        dirname = argIndex === -1 ? noprefix : noprefix.slice(0, argIndex),
        def = _directives2.default[dirname],
        arg = argIndex === -1 ? null : noprefix.slice(argIndex + 1);

    // parse scope variable key and pipe filters
    var exp = attr.value,
        pipeIndex = exp.indexOf('|'),
        key = pipeIndex === -1 ? exp.trim() : exp.slice(0, pipeIndex).trim(),
        filters = pipeIndex === -1 ? null : exp.slice(pipeIndex + 1).split('|').map(function (filter) {
        return filter.trim();
    });

    return def ? {
        attr: attr,
        key: key,
        filters: filters,
        definition: def,
        argument: arg,
        update: typeof def === 'function' ? def : def.update
    } : null;
}

function applyFilters(value, directive) {
    if (directive.definition.customFilter) {
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
                    return e.target.webkitMatchesSelector(selector);
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