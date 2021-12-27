---
title: 深入函数执行
author: 小何尖尖角
date: '2021-12-26'
---

## 深入函数执行

### 1、函数执行上下文和作用域

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

### 2、函数执行作用域链

![函数执行作用域链](../.vuepress/public/scope-link.png)

```js
var name = 'hzy'

foo(123)
function foo(num) {
  console.log(m)
  var m = 10
  var n = 20

  function bar() {
    console.log(name)
  }

  bar()
}
```

- 上方 name 查找根据函数一层一层向上查找，最终找到了全局（`GO`）上的 name

![函数的父级作用域](../.vuepress/public/scope-special.png)

```js
var message = 'Hello Global'

function foo() {
  console.log(message)
}

function bar() {
  var message = 'Hello Bar'
  foo()
}

bar()
```

- 上方的 `foo` 在执行时候的父级作用域是 `GO`，因此找到的 `message` 是全局（GO）
- 函数**定义**的时候的作用域就已经确定了，**函数的父级作用域和函数执行的位置没有关系**。

::: tip
**ECMA 版本规范标准**

**早期：**
每一个执行上下文会被关联到一个环境变量（variable object，VO），在源代码中的变量和函数声明会作为属性添加到 VO 中。对于函数来说，参数也会被添加到 VO 中。

**最新：**
每一个执行上下文会关联到一个变量环境中(VariableEnvironment)中，在执行代码中变量和函数的声明会作为环境记录（Environment Record）添加到变量环境中。对于函数来说，参数也会被环境记录添加到变量环境中。
:::

### 3、几个函数执行的面试题

#### 第一题

```js
var n = 100

function foo() {
  n = 200
}

foo()

console.log(n)
```

**答案**

```js
200
```

**解析**

- 全局定义 `n`，函数 `foo` 执行修改 `n` 的值，因为函数内没有定义 `n` 所以修改了全局的 `n`，因此打印出 `200`

#### 第二题

```js
function foo() {
  console.log(n)
  var n = 200
  console.log(n)
}

var n = 100
foo()
```

**答案**

```js
undefined
200
```

**解析**

- `var n` 是有提升，先定义 `n` 为 `undefined`，因此函数 `foo` 内部有 `n` 的定义，不需要去外层找
- 接着 `n=200`，则打印 `n` 肯定为 `200`

#### 第三题

```js
var a = 100

function foo() {
  console.log(a)
  return
  var a = 200
}

foo()
```

**答案**

```js
undefined
```

**解析**

- 函数在解析的时候是忽略 `return` 的，因此函数内会定义一个 `a=undefined`
- 函数执行打印 `a`，则为 `undefined`

#### 第四题

```js
var n = 100

function foo1() {
  console.log(n) // 2. 100
}

function foo2() {
  var n = 200
  console.log(n) // 1. 200
  foo1()
}

foo2()
console.log(n) // 3. 100
```

**答案**

```js
200
100
100
```

**解析**

- 函数先执行到 `foo2` 则打印为函数内定义的 `200`
- 紧接着 `foo1` 执行，则打印全局定义的 `n=100`
- 再就是外部打印的 `n` 则为全局的 `100`

#### 第五题

```js
function foo() {
  var a = (b = 100)
}

foo()

console.log(a)
console.log(b)
```

**答案**

```js
a is not defined

b = 100
```

**解析**

- 函数执行，函数内部会将定义变量那一行转换成两行代码
- `var a = 10; b = 10;`
- 因此 `a` 是在函数内的变量，我们访问不到，但是 `b` 前面**没有声明函数，会被提升到全局**，故可以访问到 `b`
