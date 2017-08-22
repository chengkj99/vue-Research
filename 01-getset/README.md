
# vue源码研究学习 - vue的第一次commit

## 实现对插值表达式的替换

这是vue源码的第一次学习，对应了尤大的vue项目的第二次提交[yyx990803 committed on 29 Jul 2013](https://github.com/vuejs/vue/commit/871ed9126639c9128c18bb2f19e6afd42c0c5ad9)，这是一个历史性时刻，这是vue真正创作的开始。

vue让我专注于业务，提升了我的开发效率，也让开发变得更加简单，基于此，研究学习其源码也是有必要的。

本来是想直接阅读vue稳定项目的源码，考虑到挑战性是极大的，于是考虑还是从尤大的第一次commit开始学习吧，这样也能够了解到vue的历史。

尤大的第一次提交实现的功能就是将插值表达式 `{{msg}}`里的内容，转化为在实例中绑定的数据。

源码在 `getset.html` 文件中，直接在浏览器中打开就可以看到效果。

##### 通过阅读，可以看出作者第一次的思路如下：


1. 初始化实例，绑定给实例 el（根元素）、 data({})。  
2. 通过正则匹配到 `{{variable}}` ，使用`replace()`将其替换为带有标记的 `<span mark = variable></span>` 标签，并将`{{variable}}`中的variable值存到一个对象中去`bindings = { variable1: {}, variable2: {}, ...} ` 。  
3. 通过对bindings的遍历中`{{variable}}`的值进行`bind(variable)`处理。  
4. bind()方法的作用一个是移除span的mark标签，另一个作用是通过`Object.defineProperty`将variable定义为`data = {}`的属性，并定义其 `set()` 和 `get()` 方法。  
5. 初始化实例中的数据，这时就开始执行`set()和get()`方法了。  

##### 代码的执行顺序如下：

```
/* 第一步：*/
var self = this,
  el = self.el = document.getElementById(id)
  bindings = {}
  data = self.data = {}
  content = el.innerHTML.replace(/\{\{(.*)\}\}/g, markToken)
  el.innerHTML = content

/* 第三步： */
  for (var variable in bindings) {
    bind(variable)
  }

/* 第五步： */
  if (initData) {
    for (var variable in initData) {
      data[variable] = initData[variable]
    }
  }
/* 第二步： */
  function markToken (match, variable) {
    bindings[variable] = {}
    return `<span ${bindingMark} = ${variable} ></span>`
  }

/* 第四步： */
  function bind (variable) {
    // 选择 自定义的属性bindingMark， 并移除
    bindings[variable].els = el.querySelectorAll(`[${bindingMark} = ${variable}]`)
    ;[].forEach.call(bindings[variable].els, e => {
      e.removeAttribute(bindingMark)
    })
    // bindings[variable].els.forEach(e => {
    //   e.removeAttribute(bindingMark)
    // })

    Object.defineProperty(data, variable, {
      set: function (newVal) {
        [].forEach.call(bindings[variable].els, e => {
          bindings[variable].value = e.textContent = newVal
        })
      },
      get: function() {
        return bindings[variable].value
      }
    })
  }
```
