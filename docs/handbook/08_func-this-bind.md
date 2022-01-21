---
title: 函数的this绑定
author: 小何尖尖角
date: '2021-12-26'
---

## 函数的 this 绑定

### 1、为什么要有 this

```js
var obj100 = {
  name: 'hzy',
  eating: function () {
    console.log(this.name + '在吃东西')
  },
  running: function () {
    console.log(this.name + '在跑步')
  },
  studying: function () {
    console.log(this.name + '在学习')
  }
}

var info = {
  name: 'hzy',
  eating: function () {
    console.log(info.name + '在吃东西')
  },
  running: function () {
    console.log(info.name + '在跑步')
  },
  studying: function () {
    console.log(info.name + '在学习')
  }
}

var person = {
  name: 'kobe',
  eating: function () {
    console.log(this.name + '在吃东西')
  },
  running: function () {
    console.log(this.name + '在跑步')
  },
  studying: function () {
    console.log(this.name + '在学习')
  }
}

obj100.eating()
obj100.running()
obj100.studying()
```

- 上述代码，如果我们如果在 `info` 中如果不使用 `this`,那么当 `name` **改变**的时候，我们需要修改很多 `info.name` 的 `info`
- 从某些角度来说, 开发中如果没有 `this`, 很多的问题我们也是有**解决方案**。但是没有 `this`, 会让我们编写代码变得非常的不方便

### 2、this 在全局作用域指向

- 当 `this` 在浏览器中指向的是 `window`，在 `node` 环境中 `this` 指向是`{}`
- `node` 中 `this` 的细节，module -> 加载 -> 编译 -> 放到一个函数 -> `执行这个函数.apply({})`

### 3、this 的绑定规则

#### 1. this 绑定是什么

- 在浏览器中测试 `this` 指向的是 `window`
- 在全局环境下，我们可以认为 `this` 就是指向 `window`

#### 2. 几种绑定规则

1. **默认绑定**
   1. 普通函数调用 ： `window`
   2. 函数调用链（一个函数又调用另外一个函数） : `window`
   3. 将函数作为参数，传入到另一个函数中 : `window`
2. **隐式绑定**

   1. 通过对象调用函数：this 会绑定到对象上。如果对象之间存在调用，若 `obj2` 中有 `obj1`，那么 `obj2.obj1.foo() -> this` 指向为 `obj1`
   2. 隐式丢失：看最终调用位置

   ```js
   function foo() {
     console.log(this)
   }

   var obj1 = {
     name: 'obj1',
     foo: foo
   }

   // 将obj1的foo赋值给bar
   var bar = obj1.foo
   bar()
   ```

3. **显示绑定**

   1. **call、apply： 使用 call、apply 可以指定 this 绑定的对象**

   ```js
   // 实现一个bind函数

   // 方法一
   function foo() {
     console.log(this)
   }

   var obj = {
     name: 'hzy'
   }

   function bind(func, obj) {
     return function () {
       func.apply(obj, argument)
     }
   }

   var bar = bind(foo, obj)

   bar() // obj
   bar() // obj

   // 方法二： Function.prototype.bind
   function foo() {
     console.log(this)
   }

   var obj = {
     name: 'hzy'
   }

   var bar = foo.bind(obj)

   bar() // obj
   bar() // obj
   ```

   1. **内置函数**
      1. `setTimeout` : 默认指向 `window`
      2. 数组的 `forEach` ：默认指向 `window`，`forEach` 最后一个参数可以指定 `this` 的绑定
      3. `div` 点击： 我们添加点击事件中的函数 `this` 指定为获取的 `DOM` 元素

4. **new 绑定**
   1. 创建一个全新的对象
   2. 对这个对象执行 `Prototype` 的连接
   3. **这个新对象会绑定到函数调用的 this 上**（这不完成 this 绑定）
   4. 如果函数没有返回其他对象，表达式会返回这个新对象
   5. 注意点：`new 和 call、apply`**不可以同时使用**
5. **绑定优先级**
   1. new 绑定 -> 显示绑定(bind) -> 隐式绑定 -> 默认绑定
6. **this 规则之外**
   1. 忽略显示绑定： `null，Undefined -> window`
   2. 间接函数引用：创建一个函数间接引用，使用默认绑定规则

```js
function foo() {
  console.log(this)
}

var obj1 = {
  name: 'obj1',
  foo: foo
}

var obj2 = {
  name: 'obj2'
}

obj1.foo()(
  // obj1对象
  (obj2.foo = obj1.foo)
)() // window
```

7.  ES6 箭头函数
    1. 没有使用箭头函数，使用上层需要 `var _this = this;`
    2. 使用箭头函数，箭头函数的 `this` 默认是去上层查找

#### 3. this 题

1. 题目一

```js
var name = "window";
var person = {
  name: "person",
  sayName: function () {
    console.log(this.name);
  }
};
function sayName() {
  var sss = person.sayName;
  sss();
  person.sayName();
  (person.sayName)();
  (b = person.sayName)();
sayName();





function sayName() {
  var sss = person.sayName;
  // 独立函数调用，没有和任何对象关联
  sss(); // window
  // 关联
  person.sayName(); // person
  (person.sayName)(); // person
  (b = person.sayName)(); // window
}
```

2. 题目二

```js
var name = 'window'
var person1 = {
  name: 'person1',
  foo1: function () {
    console.log(this.name)
  },
  foo2: () => console.log(this.name),
  foo3: function () {
    return function () {
      console.log(this.name)
    }
  },
  foo4: function () {
    return () => {
      console.log(this.name)
    }
  }
}

var person2 = { name: 'person2' }

person1.foo1() // person1
person1.foo1.call(person2) // person2

person1.foo2() // window
person1.foo2.call(person2) // window

person1.foo3()() // window
person1.foo3.call(person2)() // window
person1.foo3().call(person2) // person2

person1.foo4()() // person1
person1.foo4.call(person2)() // person2
person1.foo4().call(person2) // person1

// 隐式绑定，肯定是person1
person1.foo1() // person1
// 隐式绑定和显示绑定的结合，显示绑定生效，所以是person2
person1.foo1.call(person2) // person2

// foo2()是一个箭头函数，不适用所有的规则
person1.foo2() // window
// foo2依然是箭头函数，不适用于显示绑定的规则
person1.foo2.call(person2) // window

// 获取到foo3，但是调用位置是全局作用于下，所以是默认绑定window
person1.foo3()() // window
// foo3显示绑定到person2中
// 但是拿到的返回函数依然是在全局下调用，所以依然是window
person1.foo3.call(person2)() // window
// 拿到foo3返回的函数，通过显示绑定到person2中，所以是person2
person1.foo3().call(person2) // person2

// foo4()的函数返回的是一个箭头函数
// 箭头函数的执行找上层作用域，是person1
person1.foo4()() // person1
// foo4()显示绑定到person2中，并且返回一个箭头函数
// 箭头函数找上层作用域，是person2
person1.foo4.call(person2)() // person2
// foo4返回的是箭头函数，箭头函数只看上层作用域
person1.foo4().call(person2) // person1
```

3. 题目三

```js
var name = 'window'
function Person(name) {
  this.name = name
  ;(this.foo1 = function () {
    console.log(this.name)
  }),
    (this.foo2 = () => console.log(this.name)),
    (this.foo3 = function () {
      return function () {
        console.log(this.name)
      }
    }),
    (this.foo4 = function () {
      return () => {
        console.log(this.name)
      }
    })
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo1() // person1
person1.foo1.call(person2) // person2

person1.foo2() // person1
person1.foo2.call(person2) // person1

person1.foo3()() // window
person1.foo3.call(person2)() // window
person1.foo3().call(person2) // person2

person1.foo4()() // person1
person1.foo4.call(person2)() // person2
person1.foo4().call(person2) // person1

// 隐式绑定
person1.foo1() // peron1
// 显示绑定优先级大于隐式绑定
person1.foo1.call(person2) // person2

// foo是一个箭头函数，会找上层作用域中的this，那么就是person1
person1.foo2() // person1
// foo是一个箭头函数，使用call调用不会影响this的绑定，和上面一样向上层查找
person1.foo2.call(person2) // person1

// 调用位置是全局直接调用，所以依然是window（默认绑定）
person1.foo3()() // window
// 最终还是拿到了foo3返回的函数，在全局直接调用（默认绑定）
person1.foo3.call(person2)() // window
// 拿到foo3返回的函数后，通过call绑定到person2中进行了调用
person1.foo3().call(person2) // person2

// foo4返回了箭头函数，和自身绑定没有关系，上层找到person1
person1.foo4()() // person1
// foo4调用时绑定了person2，返回的函数是箭头函数，调用时，找到了上层绑定的person2
person1.foo4.call(person2)() // person2
// foo4调用返回的箭头函数，和call调用没有关系，找到上层的person1
person1.foo4().call(person2) // person1
```

4. 题目四

```js
var name = 'window'
function Person(name) {
  this.name = name
  this.obj = {
    name: 'obj',
    foo1: function () {
      return function () {
        console.log(this.name)
      }
    },
    foo2: function () {
      return () => {
        console.log(this.name)
      }
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.obj.foo1()() // window
person1.obj.foo1.call(person2)() // window
person1.obj.foo1().call(person2) // person2

person1.obj.foo2()() // obj
person1.obj.foo2.call(person2)() // person2
person1.obj.foo2().call(person2) // obj

// obj.foo1()返回一个函数
// 这个函数在全局作用于下直接执行（默认绑定）
person1.obj.foo1()() // window
// 最终还是拿到一个返回的函数（虽然多了一步call的绑定）
// 这个函数在全局作用于下直接执行（默认绑定）
person1.obj.foo1.call(person2)() // window
person1.obj.foo1().call(person2) // person2

// 拿到foo2()的返回值，是一个箭头函数
// 箭头函数在执行时找上层作用域下的this，就是obj
person1.obj.foo2()() // obj
// foo2()的返回值，依然是箭头函数，但是在执行foo2时绑定了person2
// 箭头函数在执行时找上层作用域下的this，找到的是person2
person1.obj.foo2.call(person2)() // person2
// foo2()的返回值，依然是箭头函数
// 箭头函数通过call调用是不会绑定this，所以找上层作用域下的this是obj
person1.obj.foo2().call(person2) // obj
```

[原文链接(coderwhy)](https://mp.weixin.qq.com/s/hYm0JgBI25grNG_2sCRlTA)

## call、apply、bind 手动实现

### 1. call

```js
// apply/call/bind的用法
// js模拟它们的实现? 难度

// 给所有的函数添加一个hycall的方法
Function.prototype.hycall = function (thisArg, ...args) {
  // 在这里可以去执行调用的那个函数(foo)
  // 问题: 得可以获取到是哪一个函数执行了hycall
  // 1.获取需要被执行的函数
  var fn = this

  // 2.对thisArg转成对象类型(防止它传入的是非对象类型)
  thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window

  // 3.调用需要被执行的函数
  thisArg.fn = fn
  var result = thisArg.fn(...args)
  delete thisArg.fn

  // 4.将最终的结果返回出去
  return result
}

function foo() {
  console.log('foo函数被执行', this)
}

function sum(num1, num2) {
  console.log('sum函数被执行', this, num1, num2)
  return num1 + num2
}

// 系统的函数的call方法
foo.call(undefined)
var result = sum.call({}, 20, 30)
// console.log("系统调用的结果:", result)

// 自己实现的函数的hycall方法
// 默认进行隐式绑定
// foo.hycall({name: "why"})
foo.hycall(undefined)
var result = sum.hycall('abc', 20, 30)
console.log('hycall的调用:', result)

// var num = {name: "why"}
// console.log(Object(num))
```

### 2. apply

```js
// 自己实现hyapply
Function.prototype.hyapply = function (thisArg, argArray) {
  // 1.获取到要执行的函数
  var fn = this

  // 2.处理绑定的thisArg
  thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window

  // 3.执行函数
  thisArg.fn = fn
  var result
  // if (!argArray) { // argArray是没有值(没有传参数)
  //   result = thisArg.fn()
  // } else { // 有传参数
  //   result = thisArg.fn(...argArray)
  // }

  // argArray = argArray ? argArray: []
  argArray = argArray || []
  result = thisArg.fn(...argArray)

  delete thisArg.fn

  // 4.返回结果
  return result
}

function sum(num1, num2) {
  console.log('sum被调用', this, num1, num2)
  return num1 + num2
}

function foo(num) {
  return num
}

function bar() {
  console.log('bar函数被执行', this)
}

// 系统调用
// var result = sum.apply("abc", 20)
// console.log(result)

// 自己实现的调用
// var result = sum.hyapply("abc", [20, 30])
// console.log(result)

// var result2 = foo.hyapply("abc", [20])
// console.log(result2)

// edge case
bar.hyapply(0)
```

### 3. bind

```js
Function.prototype.hybind = function (thisArg, ...argArray) {
  // 1.获取到真实需要调用的函数
  var fn = this

  // 2.绑定this
  thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window

  function proxyFn(...args) {
    // 3.将函数放到thisArg中进行调用
    thisArg.fn = fn
    // 特殊: 对两个传入的参数进行合并
    var finalArgs = [...argArray, ...args]
    var result = thisArg.fn(...finalArgs)
    delete thisArg.fn

    // 4.返回结果
    return result
  }

  return proxyFn
}

function foo() {
  console.log('foo被执行', this)
  return 20
}

function sum(num1, num2, num3, num4) {
  console.log(num1, num2, num3, num4)
}

// 系统的bind使用
var bar = foo.bind('abc')
bar()

// var newSum = sum.bind("aaa", 10, 20, 30, 40)
// newSum()

// var newSum = sum.bind("aaa")
// newSum(10, 20, 30, 40)

// var newSum = sum.bind("aaa", 10)
// newSum(20, 30, 40)

// 使用自己定义的bind
// var bar = foo.hybind("abc")
// var result = bar()
// console.log(result)

var newSum = sum.hybind('abc', 10, 20)
var result = newSum(30, 40)
```
