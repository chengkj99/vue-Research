
# vue源码研究学习 - vue的第二次commit

## 指令和过滤器的解析

> 第一次学习了解到了，通过正则对插值表达式的匹配结合Object.defineProperty实现对插值表达式的解析。

尤大的第二次提交实现的是对指令的解析，指令的解析本质就是对dom节点的attributes的解析，将解析的内容进行必要的绑定，达到目的。

由于在跑尤大的源码时，报错
`Fatal error: failed to lookup "seed"'s dependency "component-emitter"`
据说是版本的问题，不得不，自己将源码copy出来，使用webpack跑起来。

尤大的提交地址：[yyx990803 committed on 29 Jul 2013](https://github.com/vuejs/vue/commit/a5e27b1174e9196dcc9dbb0becc487275ea2e84c)

由于html中，指令的前缀是`sd`开头，所以定义一个前缀为`sd`的变量，结合directives.js中存在的指令，我们通过`document.querySelectorAll(selector)`很容易获得带有指令的集合组成的数组。

这是一个开始，想总结以下思路再进行分析。


1. 初始化实例，绑定给实例 el（根元素）、 scope({})。
2. 获取带有指令的节点和根节点。
3. 使用`cloneAttributes()`方法copy节点的属性值attributes的name和value。
```
如节点：<p sd-text="msg | capitalize"></p>,
返回：
  name : sd-text
  value : msg | capitalize
```

4. 对每一种指令（attributes的name和value）使用`parseDirective()`对节点指令进行解析获得指令的（attr(name, value)、name、value、filters：参数）、（definition、argument、update：方法）。

5. 对每个带有指令的节点使用`bindDirective()`对指令信息参数以及所含的方法进行绑定。

```
在bindDirective方法中：
1. 删除指令；
2. Object.defineProperty定义set() 和get()
其中set() 方法中涉及到过滤器对值的改变和指令对应处理方法的更新。

```
