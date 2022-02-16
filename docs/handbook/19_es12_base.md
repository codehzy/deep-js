---
title: ES12知识点
author: 小何尖尖角
date: '2021-02-14'
---

# ES12知识点

## 1. finalizationRegistry

```js
// ES12: FinalizationRegistry类
const finalRegistry = new FinalizationRegistry((value) => {
  console.log("注册在finalRegistry的对象, 某一个被销毁", value)
})

let obj = { name: "why" }
let info = { age: 18 }

finalRegistry.register(obj, "obj")
finalRegistry.register(info,123)

obj = null
info = null
```

## 2. WeakRef

```js
const finalRegistry = new FinalizationRegistry((value) => {
  console.log("注册在finalRegistry的对象, 某一个被销毁", value)
});

let obj = {name:'why'}
let info = new WeakRef(obj)

finalRegistry.register(obj, "obj")

obj = null // 注册在finalRegistry的对象, 某一个被销毁 obj

setTimeout(() => {
  console.log(info.deref()?.name) // undefined
  console.log(info.deref() && info.deref().name) // undefined
}, 10000)
```

## 3. logical-assign-operator

```js
// 1.||= 逻辑或赋值运算
let message = ""
message ||= "default value" 
console.log(message) // default value

// &&=
let info = {
  name: "nice"
}

// 1.判断info
// 2.有值的情况下, 取出info.name
// info = info && info.name
info &&= info.name
console.log(info) // nice

// 3. ??= 逻辑空赋值运算
let message1 = 0
message1 ??= "default value"
console.log(message1) // 0
```