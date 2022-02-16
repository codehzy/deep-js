---
title: ES8知识点
author: 小何尖尖角
date: '2021-02-14'
---

# ES8知识点

## 1. Object-value获取

```js
const obj = {
  name: 'hzy',
  age:18
};

console.log(Object.keys(obj)); // [ 'name', 'age' ]
console.log(Object.values(obj)); // [ 'hzy', 18 ]

console.log(Object.values(["abc", "cba", "nba"])); // [ 'abc', 'cba', 'nba' ]
console.log(Object.values("abc")) // [ 'a', 'b', 'c' ]
```

## 2. Object.entries

```js
const obj = {
  name: "why",
  age:18
};

console.log(Object.entries(obj)); // [ [ 'name', 'why' ], [ 'age', 18 ] ]
for(const [k,v] of Object.entries(obj)){
  console.log(k,v);
}
// name why
// age 18

console.log(Object.entries(["abc", "cba", "nba"])); // [ [ '0', 'abc' ], [ '1', 'cba' ], [ '2', 'nba' ] ]
console.log(Object.entries("abc")) // [ [ '0', 'a' ], [ '1', 'b' ], [ '2', 'c' ] ]
```

## 3. padStart和padEnd

```js
const message = 'Hello world'

const newMessage = message.padStart(15,'*').padEnd(20,'&')
console.log(newMessage); // ****Hello world&&&&&

// 使用场景
const cardNumber = "321324234242342342341312"
const lastFourCard = cardNumber.slice(-4)
const finalCard = lastFourCard.padStart(18,'*')
console.log(finalCard); // **************1312
```

## 4. Trailing-Commas

```js
function foo(m, n,) {

}

foo(20, 30,)
```

## 5. aysnc的function

```js
async function foo(){
  // await
}
```