---
title: 深入函数执行
author: 小何尖尖角
date: '2021-12-26'
---

## 深入函数执行

### 函数执行上下文和作用域

![函数执行上下文和作用域](../.vuepress/public/func-exec.png)

```js
var name = 'hzy'

foo(123)
function foo(num) {
  console.log(m)
  var m = 10
  var n = 20

  console.log(m)
}
```

- 1. 整个代码执行的时候，先创建 `ECStack`(调用栈),在代码解析的时候，创建**全局执行上下文**`GEO(global execution context)`。同时**创建全局对象** `VO（variable Object）：GO`。将代码 `name` 放到全局对象中为 `undefined` 并赋值为 `hzy`。继续执行，发现有个函数，那么 `js` 将函数名放到全局对象中，然后为函数**创建新的存储空间**`(foo 0xa00)`
- 2. 创建函数新的空间后，将函数中**代码块放到空间中**。此时代码执行时，为创建**函数执行上下文**`(Functional Execution Context)`。在**函数的执行上下文中创建** `VO（variable Object）：AO`，函数 foo 的 AO 中将包含代码中的 `num:123,m=10,n=20`
- 3. 执行函数 `console.log(m)`则会获得 10
