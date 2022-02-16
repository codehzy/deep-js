---
title: ES11知识点
author: 小何尖尖角
date: '2021-02-14'
---

# ES11知识点

## 1. 大整数BigInt

```js
const maxInt = Number.MAX_SAFE_INTEGER
console.log(maxInt) // 9007199254740991
console.log(maxInt + 1)
console.log(maxInt + 2)

// es11 : BigInt
const bigInt = BigInt(Number.MAX_SAFE_INTEGER)
console.log(bigInt + 10n) // 9007199254740991;
```

## 2. Nullish-Coalescing-operator

```js
// ES11: 空值合并运算 ??

const foo = undefined
// const bar = foo || "default value"
const bar = foo ?? "defualt value"

console.log(bar)

// ts 是 js 的超级
```

## 3. OptionalChaining

```js
const info = {
  name: "why",
  // friend: {
  //   girlFriend: {
  //     name: "hmm"
  //   }
  // }
}


// console.log(info.friend.girlFriend.name)
// if (info && info.friend && info.friend.girlFriend) {
//   console.log(info.friend.girlFriend.name)
// }

// ES11提供了可选链(Optional Chainling)
console.log(info.friend?.girlFriend?.name);
```

## 4. 获取全局对象globalThis

```js
// 获取某一个环境下的全局对象(Global Object)

// 在浏览器下
// console.log(window)
// console.log(this)

// 在node下
// console.log(global)

// ES11
console.log(globalThis)
```

## 5. for-in操作的标准化

```js
// for...in 标准化: ECMA
const obj = {
  name: "why",
  age: 18
}

for(const item in obj){
  console.log(item);
}
```