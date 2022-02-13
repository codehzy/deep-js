---
title: 类
author: 小何尖尖角
date: '2021-02-10'
---

## 类

### 1. 定义类的方式

```js
class Person {}

console.log(Person.prototype) // {}
console.log(Person.prototype.__proto__) // [Object: null prototype] {}
console.log(Person.prototype.constructor) // [class Person]
console.log(typeof Person) // function

const p = new Person()
console.log(p.__proto__ === Person.prototype) // true
```

- 根据上述代码，可以看到 ES6 类只是 ES5 构造函数的语法糖，其表现形式和 ES5 构造函数基本一致。

### 2. 类中的方法

- 构造方法(constructor) : 一个类只能有一个构造函数
  - 1. 在内存中创建一个对象 p1 = {}
  - 2. 将类的原型 prototype 赋值给创建的对象 p1.\_\_proto\_\_ = Person.prototype
  - 3. 将对象赋值给函数的 this, new 绑定 this = p1
  - 4. 执行函数体中的代码
  - 5. 自动返回创建出的对象

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

const p1 = new Person('kobe', 18)
const p2 = new Person('hzy', 18)
console.log(p1, p2) // Person { name: 'kobe', age: 18 } Person { name: 'hzy', age: 18 }
```

- 类中的方法和静态方法
  - 方法是实例访问
  - 静态方法直接用类访问

```js
const names = ['abc', 'cba', 'nba']

class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
    this._address = '广州市'
  }

  eating() {
    console.log(this.name + ' eating')
  }

  running() {
    console.log(this.name + ' running')
  }

  // 类的访问器方法
  get address() {
    console.log('拦截访问操作')
    return this._address
  }

  set address(newAddress) {
    console.log('拦截设置操作')
    this._address = newAddress
  }

  // 类的静态方法
  static randomPerson() {
    const nameIndex = Math.floor(Math.random() * names.length)
    const name = names[nameIndex]
    const age = Math.floor(Math.random() * 100)
    return new Person(name, age)
  }
}

p1.eating()
p2.running()

console.log(Object.getOwnPropertyDescriptors(Person.prototype)) // 方法共用

console.log(p1.address)
p1.address = '北京市'
console.log(p1.address)

for (let i = 0; i < 100; i++) {
  console.log(Person.randomPerson())
}
```

### 3. 类的继承

- 类继承
  - super
    - super()
    - super.xxx -> 调用父类的方法
  - extends
    - 子类继承父类
  - 子类重写父类方法
    - 定义同名方法（覆盖）
  - 子类重写父类的静态方法
    - 定义同名静态方法（覆盖）

```js
class Person {
  constructor(name, age) {
    this.name = name,
    this.age = age，
  }

  running() {
    console.log(this.name + ' running...')
  }

  eating() {
    console.log(this.name + ' eating~')
  }

  personMethod() {
    console.log('处理逻辑1')
    console.log('处理逻辑2')
    console.log('处理逻辑3')
  }

  static staticMethod() {
    console.log('PersonStaticMethod')
  }
}

// 核心代码一
class Student extends Person {
  constructor(name, age, sno) {
    // 核心代码二
    super(name, age)
    this.sno = sno
  }

  studying() {
    console.log(this.name + ' studying~')
  }

  // 子类对父类的方法的重写
  running() {
    console.log('student ' + this.name + ' running')
  }

  personMethod() {
    // 子类对父类方法的调用
    super.personMethod()

    console.log('处理逻辑4')
    console.log('处理逻辑5')
    console.log('处理逻辑6')
  }

  // 子类对父类静态方法的重写
  static staticMethod() {
    super.staticMethod()
    console.log('StudentStaticMethod')
  }
}

const p1 = new Student('hzy', 23, 121)
console.log(p1) // Student { name: 'hzy', age: 23, sno: 121 }

p1.eating() // hzy eating~

console.log(Object.getOwnPropertyDescriptors(Person)) // 包含 eating 和 running

p1.personMethod() // PersonStaticMethod
Student.staticMethod() // StudentStaticMethod
```

### 4. ES6 转 ES5 代码

- \_createClass 方法封装

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  eating() {
    console.log(this.name + ' eating~')
  }
}

// babel转换
;('use strict')

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

// /*#__PURE__*/ 纯函数
// webpack 压缩 tree-shaking
// 这个函数没副作用
var Person = /*#__PURE__*/ (function () {
  function Person(name, age) {
    this.name = name
    this.age = age
  }

  _createClass(Person, [
    {
      key: 'eating',
      value: function eating() {
        console.log(this.name + ' eating~')
      }
    }
  ])

  return Person
})()
```

### 5. ES6 转 ES5 的继承

```js
// class Person {
//   constructor(name, age) {
//     this.name = name
//     this.age = age
//   }

//   running() {
//     console.log(this.name + " running~")
//   }

//   static staticMethod() {

//   }
// }

// class Student extends Person {
//   constructor(name, age, sno) {
//     super(name, age)
//     this.sno = sno
//   }

//   studying() {
//     console.log(this.name + " studying~")
//   }
// }

// babel转换后的代码
'use strict'

function _typeof(obj) {
  '@babel/helpers - typeof'
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj
    }
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj
    }
  }
  return _typeof(obj)
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function')
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  })
  // 目的静态方法的继承
  // Student.__proto__ = Person
  if (superClass) _setPrototypeOf(subClass, superClass)
}

// o: Student
// p: Person
// 静态方法的继承
function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p
      return o
    }
  return _setPrototypeOf(o, p)
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct()
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor
      result = Reflect.construct(Super, arguments, NewTarget)
    } else {
      result = Super.apply(this, arguments)
    }
    return _possibleConstructorReturn(this, result)
  }
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call
  } else if (call !== void 0) {
    throw new TypeError(
      'Derived constructors may only return object or undefined'
    )
  }
  return _assertThisInitialized(self)
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return self
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false
  if (Reflect.construct.sham) return false
  if (typeof Proxy === 'function') return true
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {})
    )
    return true
  } catch (e) {
    return false
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
      }
  return _getPrototypeOf(o)
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

var Person = /*#__PURE__*/ (function () {
  function Person(name, age) {
    _classCallCheck(this, Person)

    this.name = name
    this.age = age
  }

  _createClass(Person, [
    {
      key: 'running',
      value: function running() {
        console.log(this.name + ' running~')
      }
    }
  ])

  return Person
})()

var Student = /*#__PURE__*/ (function (_Person) {
  // 实现之前的寄生式继承的方法(静态方法的继承)
  _inherits(Student, _Person)

  var _super = _createSuper(Student)

  function Student(name, age, sno) {
    var _this

    _classCallCheck(this, Student)

    // Person不能被当成一个函数去调用
    // Person.call(this, name, age)

    debugger
    // 创建出来的对象 {name: , age: }
    _this = _super.call(this, name, age)
    _this.sno = sno
    // {name: , age:, sno: }
    return _this
  }

  _createClass(Student, [
    {
      key: 'studying',
      value: function studying() {
        console.log(this.name + ' studying~')
      }
    }
  ])

  return Student
})(Person)

var stu = new Student()

// Super: Person
// arguments: ["why", 18]
// NewTarget: Student
// 会通过Super创建出来一个实例, 但是这个实例的原型constructor指向的是NewTarget
// 会通过Person创建出来一个实例, 但是这个实例的原型constructor指向的Person
Reflect.construct(Super, arguments, NewTarget)
```

### 6. 扩展系统内置类

- 通过类继承实现在**已有的方法中添加新方法**

```js
class myArray extends Array {
  firstItem() {
    return this[0]
  }

  lastItem() {
 ****   return this[this.length - 1]
  }
}

const arr = new myArray(1, 2, 3, 4)
console.log(arr.firstItem())
console.log(arr.lastItem())
```


### 7. JS中实现混入效果

- 根据下面代码可以看出，我们利用函数返回某个类 `extends` 某个基类，从而实现JS类继承的混入（多继承）。

```js
class Person{

}

// JS只支持单继承

function mixinRunner(BaseClass){
  return class extends BaseClass{
    running(){
      console.log('running');
    }
  }
}

function mixinEater(BaseClass) {
  return class extends BaseClass{
    eating(){
      console.log(`eating!`);
    }
  }
}

// 在JS中类只能有一个父类：单继承
class Student extends Person{

}

const newStudent = mixinEater(mixinRunner(Student))
const stu1 = new newStudent()

stu1.running()
stu1.eating()
```

### 8. 面向对象多态

- 传统的面向对象多态是有三个前提:
  - 必须有继承(是多态的前提)
  - 必须有重写(子类重写父类的方法)
  - 必须有父类引用指向子类对象

```ts
class Shape {
  getArea(){

  }
}

class Rectangle extends Shape{
  getArea(){
    return 100
  }
}

class Circle extends Shape{
  getArea(){
    return 200
  }
}

const r1 = new Rectangle()
const r2 = new Circle()

// 多态:当不同的数据类型执行同一操作时候，如果表现出来的行为不一样，那么就是多态
function calcArea(shape: Shape) {
  console.log(shape.getArea());
}

calcArea(r1)
calcArea(r2)
```

- JS的多态

```js
function calcArea(foo) {
  console.log(foo.getArea());
}

const obj1 = {
  name:'hzy',
  getArea: function() {
    return 100
  }
}

class Person {
  getArea() {
    return 2000
  }
}

const p = new Person();

calcArea(obj1) // 100
calcArea(p) // 2000

// 也是多态的体现
function sum(m, n) {
  return m + n
}

sum(20, 30)
sum("abc", "cba")
```