export default {
    text: function (el, value) {
        el.textContent = value || ''
    },
    show: function (el, value) {
        el.style.display = value ? '' : 'none'
    },
    class: function (el, value, classname) {
        el.classList[value ? 'add' : 'remove'](classname)
    },
    on: {
        update: function (el, handler, event, directive) {
            if (!directive.handlers) {
                directive.handlers = {}
            }
            var handlers = directive.handlers
            if (handlers[event]) {
                el.removeEventListener(event, handlers[event])
            }
            if (handler) {
                handler = handler.bind(el)
                el.addEventListener(event, handler)
                handlers[event] = handler
            }
        },
        unbind: function (el, event, directive) {
            if (directive.handlers) {
                el.removeEventListener(event, directive.handlers[event])
            }
        },
        customFilter: function (handler, selectors) {
            return function (e) {
                var match = selectors.every(function (selector) {
                    return e.target.webkitMatchesSelector(selector) //常常用于事件委托、判断当前DOM节点是否能完全匹配对应的CSS选择器规则，匹配成功返回true
                })
                if (match) handler.apply(this, arguments)
            }
        }
    }
}
