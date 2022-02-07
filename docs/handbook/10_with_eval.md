---
title: With & eval
author: 小何尖尖角
date: '2021-02-06'
---

## With

```js
const message = 'hello world'

const obj = {
  name: 'hzy',
  age: 18,
  message: 'obj message'
}

function foo() {
  function bar() {
    with (obj) {
      console.log(message) // obj message
    }
  }
  bar()
}

foo()
```

- 根据上述代码，我们想象一下如果不是使用 `with` 语句，那么我们知道 `message` 肯定通过作用域找到全局的 `message`
- 那么 **`with` 语句会生成作用域**，此时 `message` 会去 `with` 语句的参数 `obj` 中找 `message`

## eval

```js
const jsString = 'const message = "Hello world!"; console.log(message);'

eval(jsString)
```

- 根据上述代码可以看到，可以看到`eval`可以执行 js 代码字符串

## 严格模式

- **定义**

  - 严格模式通过跑车不错误来消除一些原有的静默错误。
  - 严格模式让 JS 引擎在执行代码可以进行更多的优化（不需要对一些特殊的语法进行处理）。
  - 严格模式禁用了在 ECMAScript 未来版本中可能会定义到的一些语法错误，比如保留字。

- **限制**
  - 1.禁止以外创建全局变量
  - 2.不允许函数有相同的参数名称
  - 3.静默错误,如 `true.123`
  - 4.不允许使用原先的`八进制模式`
  - 5.不允许使用 with 语句
  - 6.eval 函数不会向上引用变量
  - 7.在严格模式下，自执行函数指向的是 window
