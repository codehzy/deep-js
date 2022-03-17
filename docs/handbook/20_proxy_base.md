---
title: 详细剖析Proxy
author: 小何尖尖角
date: '2021-02-15'
---

# Proxy

## 1. Object.defineProperty 弊端

- Object.defineProperty 弊端
  - Object.defineProperty 目的是给我们设置属性值的
  - 对对象的属性进行新增或者删除无能为力
  - 存储数据描述符的初衷并不是为了去监听一个完整的对象

## 2. Proxy

```js
const obj = {
  name: 'hzy',
  age: 12
}

const objProxy = new Proxy(obj, {
  get: function (target, key) {
    console.log(`监听对象的${key}属性被访问了`, target)
    return target[key]
  },

  set: function (target, key, newValue) {
    console.log(`监听到对象的${key}属性被设置值`, target)
    return (target[key] = newValue)
  }
})

console.log(objProxy.name) // 监听对象的name属性被访问了 { name: 'hzy', age: 12 } hzy
console.log(objProxy.age) // 监听对象的age属性被访问了 { name: 'hzy', age: 12 } 12

objProxy.name = 'kobe' // 监听到对象的name属性被设置值 { name: 'hzy', age: 12 }
objProxy.age = 22 // 监听到对象的age属性被设置值 { name: 'kobe', age: 12 }

console.log(obj.name) // kobe
console.log(obj.age) // 22
```

### 2.1 [Proxy 捕获器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

- Proxy 常用捕获器
  - get
  - set
  - has
  - in

```js
const obj = {
  name: 'why', // 数据属性描述符
  age: 18
}

const objProxy = new Proxy(obj, {
  get: function (target, key) {
    console.log(`监听到对象的${key}属性被访问了`, target)
    return target[key]
  },

  set: function (target, key, newValue) {
    console.log(`监听到对象的${key}属性设置值`, newValue)
    target[key] = newValue
  },

  has: function (target, key) {
    console.log(`监听到对象的${key}属性in操作`, target)
    return key in target
  },

  deleteProperty: function (target, key) {
    console.log(`监听到对象的${key}属性in操作`, target)
    delete target[key]
  }
})

objProxy.name // 监听到对象的name属性被访问了 { name: 'why', age: 18 }
objProxy.age = 20 // 监听到对象的age属性设置值 20
console.log('name' in objProxy) // 监听到对象的name属性in操作 { name: 'why', age: 20 }   true
delete objProxy.age // 监听到对象的age属性in操作 { name: 'why', age: 20 }
```

- Proxy 对函数对象监听捕获器
  - apply
  - construct -> new

```js
function foo() {}

const fooProxy = new Proxy(foo, {
  apply: function (target, thisArgs, argArray) {
    console.log(`对foo函数进行apply调用`)
    return target.apply(thisArgs, argArray)
  },
  construct: function (target, argArray) {
    console.log(`对foo函数进行new调用`)
    return new target(...argArray)
  }
})

fooProxy.apply({}, ['abc', 'cba']) // 对foo函数进行apply调用
new fooProxy('abc', 'cba') // 对foo函数进行new调用
```
