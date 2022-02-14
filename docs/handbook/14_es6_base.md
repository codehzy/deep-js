---
title: ES6知识点
author: 小何尖尖角
date: '2021-02-10'
---

# ES6知识点

## 1. 字面量增强写法

- 字面量增强写法
  - 1. property shorthand(属性的简写)
  - 2. method shorthand(方法的简写)
  - 3. computed property name(计算属性名)
```js
const name = 'hzy'
const age = 19

const obj = {
  // 1.property shorthand(属性的简写)
  // name: name,
  // age: age,
  name,
  age,

  //  2.method shorthand(方法的简写)
  foo: function(){
    console.log(this);
  },
  bar(){
    console.log(this);
  },
  baz:() => {
    console.log(this);
  },

  // 3. computed property name(计算属性名)
  [name + 123]: 'hehehe'
}


obj.baz() // {}
obj.bar() // obj
obj.foo() // obj

console.log(obj) // hzy123: 'hehehe'
```


## 2. 解构数组 & 对象

- 数组解构
  - 1. 对数组的解构: []
  - 2. 解构后面的元素
  - 3. 解构出一个元素,后面的元素放到一个新数组中
  - 4. 解构的默认值

```js
const names = ['hzy','nice','hello'];

// 对数组的解构: []
const [items,item2,item3] = names
console.log(items, item2,item3); // hzy nice hello

// 解构后面的元素
const [,,itemz] = names 
console.log(itemz); // hello

// 解构出一个元素,后面的元素放到一个新数组中
const [itemx,...newNames] = names
console.log(itemx,newNames); // hzy [ 'nice', 'hello' ]

// 解构的默认值
const [itema,itemb,itemc,itemd = 'aaa'] = names
console.log(itemd); // aaa
```

- 对象的解构

```js

const obj = {
  name: 'hzy',
  age: 18,
  height: 50
}

const { name, height,age  } = obj
console.log(name,age,height);

const { age } = obj
console.log(age);

const {name:newName} = obj
console.log(newName);

const { address: newAddress = '南京'} = obj
console.log(newAddress);

function foo(info){
  console.log(info.name,info.age);
}

foo(obj)

function bar({name,age}){
  console.log(name,age);
}

bar(obj)
```

## 3. let 和 const

### 3.1 基本使用

- 注意
  - 1) const本质上是传递的值不可以修改，但是如果传递的是一个引用类型(内存地址), 可以通过引用找到对应的对象, 去修改对象内部的属性, 这个是可以的
  - 2) 通过 `let/const` 定义的变量名是不可以重复定义
```js
var foo = "foo"
let bar = "bar"

// const constant(常量/衡量)
const name = "abc"
name = "cba"

// 注意事项一: const本质上是传递的值不可以修改
// 但是如果传递的是一个引用类型(内存地址), 可以通过引用找到对应的对象, 去修改对象内部的属性, 这个是可以的
const obj = {
  foo: "foo"
}

// // obj = {}
obj.foo = "aaa"
console.log(obj.foo)


// 注意事项二: 通过let/const定义的变量名是不可以重复定义
var foo = "abc"
var foo = "cba"

let foo = "abc"
// SyntaxError: Identifier 'foo' has already been declared
let foo = "cba"

console.log(foo)
```

### 3.2 作用域提升

- let & const 
  - 并非网上说的没有创建，`let` 和 `const` 只是因为没有作用域提升
  - `foo` 被创建出来了, 但是不能被访问，因为 `ES5` 作用域提升: 能提前被访问

```js

// console.log(foo)
// var foo = "foo"

// Reference(引用)Error: Cannot access 'foo' before initialization(初始化)
// let/const他们是没有作用域提升
// foo被创建出来了, 但是不能被访问
// 作用域提升: 能提前被访问
console.log(foo)
let foo = "foo"
```


### 3.3 let & const 与window的关系

- 根据下面代码
  - `ES5` 使用 `var` 声明的变量会被添加到 `GO` 上，`GO = Window`，因此可以使用 `window.xxx` 获取变量
  - 使用 `const` 和 `let` 不会被添加到 `window` 上

```js
var foo = "foo"
var message = "Hello World"

console.log(window.foo)
console.log(window.message)

window.message = "哈哈哈"
console.log(message)

let foo = "foo"
```


### 3.4 ES5作用域 和 ES6作用域

- ES5作用域
 - 1. 声明对象的字面量，不会形成作用域
 - 2. `ES5` 中没有块级作用域
 - 3. 在 `ES5` 中只有两个东西会形成作用域, 全局作用域 & 函数作用域

```js

// 声明对象的字面量
// var obj = {
//   name: "why"
// }

// ES5中没有块级作用域
// 块代码(block code)
// {
//   // 声明一个变量
//   var foo = "foo"
// }

// console.log(foo)


// 在ES5中只有两个东西会形成作用域
// 1.全局作用域
// 2.函数作用域
// function foo() {
//   var bar = "bar"
// }

// console.log(bar)

function foo() {

  function demo() {
    
  }

}
```

- ES6作用域
  - 代码块级作用域,对 `let/const/function/class` 声明的类型是有效
  - 代码中的 `function demo` 会被添加到 `window` 上，不同的浏览器有不同实现的(大部分浏览器为了兼容以前的代码, 让function是没有块级作用域)

```js
// ES6的代码块级作用域
// 对let/const/function/class声明的类型是有效
{
  let foo = "why"
  function demo() {
    console.log("demo function")
  }
  class Person {}
}

// console.log(foo) // foo is not defined
// 不同的浏览器有不同实现的(大部分浏览器为了兼容以前的代码, 让function是没有块级作用域)
// demo()
var p = new Person() // Person is not defined
```
### 3.5 块级作用域

- 形成块级作用域
  - 1. if语句的代码就是块级作用域
  - 2. switch语句的代码也是块级作用域
  - 3. for语句的代码也是块级作用域

```js
{

}

// if语句的代码就是块级作用域
if (true) {
  var foo = "foo"
  let bar = "bar"
}

console.log(foo)
console.log(bar)

// switch语句的代码也是块级作用域
var color = "red"

switch (color) {
  case "red":
    var foo = "foo"
    let bar = "bar"
}

console.log(foo)
console.log(bar)

// for语句的代码也是块级作用域
for (var i = 0; i < 10; i++) {
  console.log("Hello World" + i)
}

console.log(i)

for (let i = 0; i < 10; i++) {
}

console.log(i)
```

### 3.6 块级作用域使用场景

- 块级作用域使用场景
  - 使用 `var，我们每次点击按钮则会找到最上方的全局变量，因此达不到我们预期。从而使用立即执行函数来解决。`
  - 在 `ES6` 中，我们可以将使用 `var` 声明更改为使用 `let` 声明，每一次 i 都是独立的区域

```js
const btns = document.getElementsByTagName('button')

// for (var i = 0; i < btns.length; i++) {
//   (function(n) {
//     btns[i].onclick = function() {
//       console.log("第" + n + "个按钮被点击")
//     }
//   })(i)
// }

// console.log(i)

for (let i = 0; i < btns.length; i++) {
  btns[i].onclick = function() {
    console.log("第" + i + "个按钮被点击")
  }
}

// console.log(i)
```


### 3.7 在let & const 暂时性死区

- 在声明之前，不可以去访问变量。
- 函数中某个变量有声明，则找函数中的变量，并且再也不会找全局的变量。

```js
var foo = "foo"

// if (true) {
//   console.log(foo)

//   let foo = "abc"
// }


function bar() {
  console.log(foo)

  let foo = "abc"
}

bar()

var name1 = "abc"
let name2 = "cba"
const name3 = "nba"

// 构建工具的基础上创建项目\开发项目 webpack/vite/rollup
// babel
// ES6 -> ES5

const info = {name: "why"}

info = {name: "kobe"}
```

## 4. 模板字符串

- 模板字符串
  - 模板字符串的拼接
  - 模板字符串执行函数

```js
// ES6之前拼接字符串和其他标识符
const name = "hzy"
const age = 18
const height = 1.88

// console.log("my name is " + name + ", age is " + age + ", height is " + height)

// ES6提供模板字符串 ``
const message = `my name is ${name}, age is ${age}, height is ${height}`
console.log(message)

const info = `age double is ${age * 2}`
console.log(info)

function doubleAge() {
  return age * 2
}

const info2 = `double age is ${doubleAge()}`
console.log(info2)
```

- 标签模板字符串
 - 第一个参数依然是模块字符串中整个字符串, 只是被切成多块,放到了一个数组中
 - 第二个参数是模块字符串中, 第一个 ${}
```js
function foo(m,n,x,z){
  console.log(m,n,x,z,'--------------------');
}

// foo``

const name = 'hzy'
const age = 18
const height = 1.88

foo`Hell${name}oWor${age}l${height}d` // [ 'Hell', 'oWor', 'l', 'd' ] hzy 18 1.88 --------------------
```

## 5. 默认参数

- 默认参数
  - 1. ES6可以给函数参数提供默认值
  - 2.对象参数和默认值以及解构
  - 3.有默认值的形参最好放到最后

```js
// ES5以及之前给参数默认值
/**
 * 缺点:
 *  1.写起来很麻烦, 并且代码的阅读性是比较差
 *  2.这种写法是有bug
 */
// function foo(m, n) {
//   m = m || "aaa"
//   n = n || "bbb"

//   console.log(m, n)
// }

// 1.ES6可以给函数参数提供默认值
function foo(m = "aaa", n = "bbb") {
  console.log(m, n)
}

// foo()
foo(0, "")

// 2.对象参数和默认值以及解构
function printInfo({name, age} = {name: "why", age: 18}) {
  console.log(name, age)
}

printInfo({name: "kobe", age: 40})

// 另外一种写法
function printInfo1({name = "why", age = 18} = {}) {
  console.log(name, age)
}

printInfo1()

// 3.有默认值的形参最好放到最后
function bar(x, y, z = 30) {
  console.log(x, y, z)
}

// bar(10, 20)
bar(undefined, 10, 20)

// 4.有默认值的函数的length属性
function baz(x, y, z, m, n = 30) {
  console.log(x, y, z, m, n)
}

console.log(baz.length) // 4
```

## 6. 剩余参数

- rest参数必须放到最后

```js
function foo(m,n,...args){
  console.log(m,n,args);

  console.log(arguments); // [Arguments] { '0': 20, '1': 30, '2': 40, '3': 50, '4': 60 }
}

foo(20, 30, 40, 50, 60) // 20 30 [ 40, 50, 60 ]
```

## 7. 箭头函数

- 箭头函数不能用new调用，也没有原型

```js
function foo(){}

console.log(foo.prototype);

const f = new foo()
f.__proto__ = foo.prototype


const bar = () => {
  console.log(this,arguments);
}

console.log(bar.prototype); // undefined

const b = new bar() // bar is not a constructor
```

## 8. 展开语法使用

- 使用...来使用展开语法,分别在
  - 函数调用时
  - 构造数组时
  - 构建对象字面量时ES2018(ES9)
```js
const names = ["abc", "cba", "nba"]
const name = "why"
const info = {name: "why", age: 18}

// 1.函数调用时
function foo(x, y, z) {
  console.log(x, y, z)
}

// foo.apply(null, names)
foo(...names)
foo(...name)

// 2.构造数组时
const newNames = [...names, ...name]
console.log(newNames)

// 3.构建对象字面量时ES2018(ES9)
const obj = { ...info, address: "广州市", ...names }
console.log(obj)
```

## 9. ES6中的数值

- 进制
  - 十进制
  - 二进制
  - 八进制
  - 十六进制

```js
const num1 = 100 // 十进制

// b -> binary
const num2 = 0b100 // 二进制
// o -> octonary
const num3 = 0o100 // 八进制
// x -> hexadecimal
const num4 = 0x100 // 十六进制

console.log(num1, num2, num3, num4)

// 大的数值的连接符(ES2021 ES12)
const num = 10_000_000_000_000_000
console.log(num) // 10000000000000000
```

## 10.Symbol

- Symbol
  - 1. ES6之前, 对象的属性名(key)
  - 2. ES6中Symbol的基本使用
  - 3. Symbol值作为key
    - 3.1.在定义对象字面量时使用
    - 3.2.新增属性
    - 3.3.Object.defineProperty方式
  - 4. 使用Symbol作为key的属性名,在遍历/Object.keys等中是获取不到这些Symbol值，需要 `Object.getOwnPropertySymbols` 来获取所有Symbol的key
  - 5. Symbol.for(key)/Symbol.keyFor(symbol)
```js
// 1.ES6之前, 对象的属性名(key)
// var obj = {
//   name: "why",
//   friend: { name: "kobe" },
//   age: 18
// }

// obj['newName'] = "james"
// console.log(obj)


// 2.ES6中Symbol的基本使用
const s1 = Symbol()
const s2 = Symbol()

console.log(s1 === s2)

// ES2019(ES10)中, Symbol还有一个描述(description)
const s3 = Symbol("aaa")
console.log(s3.description)


// 3.Symbol值作为key
// 3.1.在定义对象字面量时使用
const obj = {
  [s1]: "abc",
  [s2]: "cba"
}

// 3.2.新增属性
obj[s3] = "nba"

// 3.3.Object.defineProperty方式
const s4 = Symbol()
Object.defineProperty(obj, s4, {
  enumerable: true,
  configurable: true,
  writable: true,
  value: "mba"
})

console.log(obj[s1], obj[s2], obj[s3], obj[s4])
// 注意: 不能通过.语法获取
// console.log(obj.s1)

// 4.使用Symbol作为key的属性名,在遍历/Object.keys等中是获取不到这些Symbol值
// 需要Object.getOwnPropertySymbols来获取所有Symbol的key
console.log(Object.keys(obj))
console.log(Object.getOwnPropertyNames(obj))
console.log(Object.getOwnPropertySymbols(obj))
const sKeys = Object.getOwnPropertySymbols(obj)
for (const sKey of sKeys) {
  console.log(obj[sKey])
}

// 5.Symbol.for(key)/Symbol.keyFor(symbol)
const sa = Symbol.for("aaa")
const sb = Symbol.for("aaa")
console.log(sa === sb)

const key = Symbol.keyFor(sa)
console.log(key)
const sc = Symbol.for(key)
console.log(sa === sc)
```

## 11 Set & WeakSet

- Set
  -  创建Set结构
  -  添加对象时特别注意，对象为引用地址，同一引用地址会被覆盖
  -  size
  -  set
  -  delete
  -  clear
  -  has
  -  forEach , for... of

```js
// 10, 20, 40, 333
// 1.创建Set结构
const set = new Set()
set.add(10)
set.add(20)
set.add(40)
set.add(333)

set.add(10)

// 2.添加对象时特别注意:
set.add({})
set.add({})

const obj = {}
set.add(obj)
set.add(obj)

// console.log(set)

// 3.对数组去重(去除重复的元素)
const arr = [33, 10, 26, 30, 33, 26]
// const newArr = []
// for (const item of arr) {
//   if (newArr.indexOf(item) !== -1) {
//     newArr.push(item)
//   }
// }

const arrSet = new Set(arr)
// const newArr = Array.from(arrSet)
// const newArr = [...arrSet]
// console.log(newArr)

// 4.size属性
console.log(arrSet.size)

// 5.Set的方法
// add
arrSet.add(100)
console.log(arrSet)

// delete
arrSet.delete(33)
console.log(arrSet)

// has
console.log(arrSet.has(100))

// clear
// arrSet.clear()
console.log(arrSet)

// 6.对Set进行遍历
arrSet.forEach(item => {
  console.log(item)
})

for (const item of arrSet) {
  console.log(item)
}
```

- WeakSet
  - 只能存放对象类型
  - 弱引用，当 `obj` 为 `null`，则GC自动回收 `WeakSet` 对 `obj` 的引用
  - WeakSet用于弱引用帮助 GC 回收场景
  - 不可遍历

```js
const weakSet = new WeakSet()

// 1.区别一: 只能存放对象类型
// TypeError: Invalid value used in weak set
// weakSet.add(10)

// 强引用和弱引用的概念(看图)

// 2.区别二: 对对象是一个弱引用
let obj = { 
  name: "why"
}

// weakSet.add(obj)

const set = new Set()
// 建立的是强引用
set.add(obj)

// 建立的是弱引用
weakSet.add(obj)

// 3.WeakSet的应用场景
const personSet = new WeakSet()
class Person {
  constructor() {
    personSet.add(this)
  }

  running() {
    if (!personSet.has(this)) {
      throw new Error("不能通过非构造方法创建出来的对象调用running方法")
    }
    console.log("running~", this)
  }
}

let p = new Person()
p.running()
p = null

p.running.call({name: "why"})
```

- Map
  - 拓展JS中只能用字符串作为key
  - Map就是允许我们对象类型来作为key的
  - 常见的属性和方法
    - set
    - get(key)
    - has(key)
    - clear
    - 遍历map, forEach, for ... of

```js
// 1.JavaScript中对象中是不能使用对象来作为key的
const obj1 = { name: "why" }
const obj2 = { name: "kobe" }

// const info = {
//   [obj1]: "aaa",
//   [obj2]: "bbb"
// }

// console.log(info)

// 2.Map就是允许我们对象类型来作为key的
// 构造方法的使用
const map = new Map()
map.set(obj1, "aaa")
map.set(obj2, "bbb")
map.set(1, "ccc")
console.log(map)

const map2 = new Map([[obj1, "aaa"], [obj2, "bbb"], [2, "ddd"]])
console.log(map2)

// 3.常见的属性和方法
console.log(map2.size)

// set
map2.set("why", "eee")
console.log(map2)

// get(key)
console.log(map2.get("why"))

// has(key)
console.log(map2.has("why"))

// delete(key)
map2.delete("why")
console.log(map2)

// clear
// map2.clear()
// console.log(map2)

// 4.遍历map
map2.forEach((item, key) => {
  console.log(item, key)
})

for (const item of map2) {
  console.log(item[0], item[1])
}

for (const [key, value] of map2) {
  console.log(key, value)
}
```

- WeakMap
  - 不能使用基本数据类型
  - 常见方法
    - get(key)
    - has(key)
    - delete(key)
    - 不可遍历
```js

const obj = {name: "obj1"}
// 1.WeakMap和Map的区别二:
const map = new Map()
map.set(obj, "aaa")

const weakMap = new WeakMap()
weakMap.set(obj, "aaa")

// 2.区别一: 不能使用基本数据类型
// weakMap.set(1, "ccc")

// 3.常见方法
// get方法
console.log(weakMap.get(obj))

// has方法
console.log(weakMap.has(obj))

// delete方法
console.log(weakMap.delete(obj))
// WeakMap { <items unknown> }
console.log(weakMap)
```