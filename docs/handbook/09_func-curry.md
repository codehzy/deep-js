---
title: 函数的柯里化
author: 小何尖尖角
date: '2021-12-26'
---

## 函数的柯里化

## 1、JavaScript 纯函数

- **概念**

  - 确定的输入，一定会产生确定的输出
  - 函数在执行过程中，不能产生副作用

- 副作用
  - 编写函数时，不去修改外部变量，也就不会产生副作用

## 2、柯里化

- 定义
  - 如果你固定某些参数，你将得到接受余下参数的一个函数。
  - 只传递给函数一部分参数来调用它，让他返回一个函数去处理剩余的参数，这个过程称为**柯里化**。

```js
function add1(x, y, z) {
  return x + y + z
}

console.log(add1(10, 20, 30))

// 柯里化处理的函数
function add2(x) {
  return function (y) {
    return function (z) {
      return x + y + z
    }
  }
}

console.log(add2(10)(20)(30))

var add3 = (x) => (y) => (z) => {
  return x + y + z
}

console.log(add3(10)(20)(30))
```
