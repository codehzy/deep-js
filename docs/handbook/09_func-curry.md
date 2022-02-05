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

## 3、柯里化的应用

### 3.1 函数的单一职责

```js
// 函数的单一职责

// 柯里化前
function add(x,y,z){
  x = x + 2
  y = y + 2
  z = z + 2
  return x + y + z
}

console.log(add(10,20,30))

// 柯里化后
function sum(x,y,z){
  x  = x + 2

  return function (y){
    y = y + 2
    return function (z){
      z = z + 2
      return x + y + z
    }
  }
}

console.log(sum(10)(20)(30))
```

- 根据上述代码，我们可以看到函数在柯里化之前是将多个函数封装到了一个函数里面，如果某个函数的处理的逻辑过于复杂，那么**后期的代码就很难维护。**
- **柯里化以后**，我们可以很清楚的看到某个函数的单一职责，每个函数只会执行自己的功能，并且不会影响到其他的函数。

### 3.2 柯里化函数的逻辑复用

```js
// 普通函数
function log(date,type,message){
  console.log(`[${date.getHours()}:${date.getMinutes()}][${type}]: [${message}]`)
}

log(new Date(),'DEBUG','查找到轮播图的bug')
log(new Date(), "DEBUG", "查询菜单的bug")
log(new Date(), "DEBUG", "查询数据的bug")

// 柯里化的优化
const log = date => type => message => {
  console.log(`[${date.getHours()}:${date.getMinutes()}][${type}]: [${message}]`)
}

let nowLog = log(new Date())
nowLog("DEBUG")("查找到轮播图的bug")
nowLog("FETURE")("新增了添加用户的功能")

let nowAndDebugLog = log(new Date())("DEBUG")
nowAndDebugLog("查找到轮播图的bug")
nowAndDebugLog("查找到轮播图的bug")
nowAndDebugLog("查找到轮播图的bug")
nowAndDebugLog("查找到轮播图的bug")

let nowAndFetureLog = log(new Date())("FETURE")
nowAndFetureLog("添加新功能~")
```

- 根据上述代码，我们可以看到柯里化以前的函数，每次执行的时候都需要传入三个参数来调用。没有很好的去实现**复用**。
- **柯里化以后的函数**，我们可以生成一个传入第一个（或者多个值的函数），使其**生成一个新的函数**，后续的调用只需要使用这个函数，并且**传入剩余的需要传入的参数就可以了**。
  
::: tip
调用柯里化函数的时候，需要使用多个括号传入参数，**因为柯里化是一层一层处理函数，下一个函数在上一个函数执行完成以后再执行。**
:::

## 4、手写柯里化
```js
function add1(x,y,z){
    return x + y + z
}

function hyCurrying(fn){
    function curried(...args){
        if(args.length >= fn.length){
            return fn.apply(this,args)
        }else{
            function curried2(...args2){
                return curried.apply(this,[...args,...args2])
            }
            return curried2
        }
    }

    return curried
}

const curryAdd = hyCurrying(add1)

console.log(curryAdd(10,20,30))
console.log(curryAdd(10, 20)(30))
console.log(curryAdd(10)(20)(30))
```

- 上述代码，可以看到我们通过传入的`args`的长度和`fn`的参数长度来进行判断。
- 只有当args长度 `>=` fn的参数的长度，那么此时就意味着可以满足了`fn`的函数执行。
- 如果传入的`args`长度不满足`fn`的参数的长度，那么我们就对参数进行拼接。(直至传入的`args`的长度满足`fn`执行时的参数的长度。)

## 5、组合函数

```js
function hyCompose(...fns){
    let length = fns.length
    for(let i =0;i < length;i++){
        if(typeof fns[i] !== 'function'){
            throw new TypeError('请输入函数类型的参数')
        }
    }

    function compose(...args){
        let index = 0
        let result = length ? fns[index].apply(this,args) : args
        while(++index < length){
            result = fns[index].apply(this,[result])
        }
        return result
    }

    return compose
}

const double = (m) => {
    return m * 2
}

const square = (n) => {
    return n ** 2
}

const newFn = hyCompose(double,square)
console.log(newFn(10)) // 400
```

- 根据上述代码，**实现一个新的函数**，参数接受两个（或者两个以上的函数类型参数）。
- **根据传入的参数，依次执行传入的函数**。从而来实现函数的组合。