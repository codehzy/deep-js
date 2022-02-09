---
title: With & eval
author: 小何尖尖角
date: '2021-02-06'
---

## JS 面向对象

### 1. 创建对象的方式

```js
// 创建方式一
const obj = new Object()
obj.name = 'hzy'
obj.running = function () {
  console.log(this.name + `在跑步`)
}

// 创建方式二
const info = {
  name: 'kobe',
  age: 40,
  eating: function () {
    console.log(this.name + '在吃东西')
  }
}
```

### 2. 数据属性描述符 & 存取属性描述符

[MDN-Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

|            | configurable | enumerable | value  | writable | get    | set    |
| ---------- | ------------ | ---------- | ------ | -------- | ------ | ------ |
| 数据描述符 | 可以         | 可以       | 可以   | 可以     | 不可以 | 不可以 |
| 存取描述符 | 可以         | 可以       | 不可以 | 不可以   | 可以   | 可以   |

- **数据描述符**

```js
Object.defineProperty(obj, 'address', {
  // 很多配置
  value: '北京市', // 默认值undefined
  // 该特殊不可删除/也不可以重新定义属性描述符
  configurable: false, // 默认值false
  // // 该特殊是配置对应的属性(address)是否是可以枚举
  enumerable: true, // 默认值false
  // // 该特性是属性是否是可以赋值(写入值)
  writable: false // 默认值false
})
```

- **存取描述符**
  - 1.隐藏某一个私有属性被希望直接被外界使用和赋值
  - 2.如果我们希望截获某一个属性它访问和设置值的过程时, 也会使用存储属性描述符

```js
Object.defineProperty(obj, 'address', {
  enumerable: true,
  configurable: true,
  get: function () {
    foo()
    return this._address
  },
  set: function (value) {
    bar()
    this._address = value
  }
})

console.log(obj.address)

obj.address = '上海市'
console.log(obj.address)

function foo() {
  console.log('获取了一次address的值')
}

function bar() {
  console.log('设置了addres的值')
}
```

2.1 **getOwnPropertyDescriptor** 获取对象的某个属性的所有属性描述符

```js
const obj1 = {
  // 私有属性
  _age: 18
}

Object.defineProperties(obj1, {
  name: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: 'hzy'
  },
  age: {
    configurable: true,
    enumerable: true,
    get: function () {
      return this._age
    },
    set: function (value) {
      this._age = value
    }
  }
})

// console.log(obj1.age);
// obj1.age = 19

// console.log(obj1);

console.log(Object.getOwnPropertyDescriptor(obj1, 'name'))
console.log(Object.getOwnPropertyDescriptor(obj1, 'age'))

// { value: 'hzy', writable: true, enumerable: true, configurable: true }
// {
//   get: [Function: get],
//   set: [Function: set],
//   enumerable: true,
//   configurable: true
// }
```

2.2 **getOwnPropertyDescriptors** 获取某个对象所有的属性描述符

```js
console.log(Object.getOwnPropertyDescriptors(obj1))

// {
//   _age: { value: 18, writable: true, enumerable: true, configurable: true },
//   name: {
//     value: 'hzy',
//     writable: true,
//     enumerable: true,
//     configurable: true
//   },
//   age: {
//     get: [Function: get],
//     set: [Function: set],
//     enumerable: true,
//     configurable: true
//   }
// }
```

2.3 阻止对象操作

[seal](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)

- 阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。

[freeze 冻结](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

- 相当于将 writable: false
