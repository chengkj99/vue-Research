var prefix = 'sd'

import Directives from './directives.js'
import Filters from './filters.js'
debugger;
var selector = Object.keys(Directives).map( d => {
  return `[${prefix}-${d}]`
}).join()

function Seed(opts) {
  var self = this,
      root = this.el = document.getElementById(opts.id), //root el
      els = root.querySelectorAll(selector), // 获得带有vue指令的节点组成的数组
      bindings = {}  //internal real data

      self.scope = {} // external interface

      // 处理带有指令的节点
      ;[].forEach.call(els, processNode)
      processNode(root)

      for (var key in bindings) {
        self.scope[key] = opts.scope[key]
      }

      function processNode(el) {
        cloneAttributes(el.attributes).forEach( attr => {
          let directive = parseDirective(attr)
          if (directive) {
            bindDirective(self, el, bindings, directive)
          }
        })
      }
}

// 返回指令的属性 name 和 value
function cloneAttributes(attributes) {
  return [].map.call(attributes, attr => {
    return {
      name: attr.name,
      value: attr.value
    }
  })
}
// seed, el, bindings 是之前就存在的参数
// directive是刚刚准备好的参数
function bindDirective(seed, el, bindings, directive) {
  el.removeAttribute(directive.attr.name)
  var key = directive.key,
  binding = bindings[key]
  if (!binding) {
    bindings[key] = binding = {
      value: undefined,
      directives: []
    }
  }
  directive.el = el
  binding.directives.push(directive)

  if (directive.bind) {
    directive.bind(el, binding.value)
  } // ?

  if (!seed.scope.hasOwnProperty(key)) {
    bindAccessors(seed, key, binding)
  }
}

function bindAccessors(seed, key, binding) {
  Object.defineProperty(seed.scope, key, {
    get () {
      return binding.value
    },
    set (value) {
      binding.vaue = value
      binding.directives.forEach( directive => {
        if (value && directive.filters) {
          // 如果带有过滤器，则执行过滤器方法
          value = applyFilters(value, directive)
        }
        directive.update(
          directive.el,
          value,
          directive.argument,
          directive,
          seed
        ) // text() or update()
      })
    }
  })
}

// 对不同形式的指令 进行分解和处理 ,带“-”的 带“|”的
function parseDirective(attr) {
  if (attr.name.indexOf(prefix) === -1) return

  // 处理属性名 sd-text or sd-on-update
  let noprefix = attr.name.slice(prefix.length + 1), //text or on-update
      argIndex = noprefix.indexOf('-'),
      dirname = argIndex === -1 ? noprefix : noprefix.slice(0, argIndex), // text or on
      def = Directives[dirname], // text() or on {}
      arg = argIndex === -1 ? null : noprefix.slice(argIndex + 1) // update

 //处理属性值

 let exp = attr.value,
     pipeIndex = exp.indexOf('|'),
     key = pipeIndex === -1 ? exp.trim() : exp.slice(0, pipeIndex).trim(),
     filters = pipeIndex === -1 ? null : exp.slice(pipeIndex + 1).split('|').map(
       filter => { return filter.trim() }
     )

 return def
 ? {
   attr: attr, // name, value
   key: key, // value
   filters: filters, // filter-name
   definition: def, // 指令对应的方法
   argument: arg, // null or update
   update: typeof def === 'function' ? def : def.update //text() or on.update()
 }
 : null
}



function applyFilters(value, directive) {
  if (directive.definition.customFilter) {
    //  监听事件触发
    return directive.definition.customFilter(value, directive.filters)
  } else {
    directive.filters.forEach( filter => {
      if (Filters[filter]) {
        value = Filters[filter](value)
      }
    })
    return value
  }
}
export default {
  create (opts) {
    return new Seed(opts)
  },
  filters: Filters,
  directives: Directives
}
