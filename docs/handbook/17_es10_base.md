---
title: ES10知识点
author: 小何尖尖角
date: '2021-02-14'
---

# ES10知识点

## 1. flat和flatMap

```js
const nums = [10, 20, [2, 9], [[30, 40], [10, 45]], 78, [55, 88]]
const newNums = nums.flat()
console.log(newNums); // [ 10, 20, 2, 9, [ 30, 40 ], [ 10, 45 ], 78, 55, 88 ]

const nums2 = [10,20,30,]
const newNums3 = nums2.flatMap(item => {
  return item * 2
})
const newNums4 = nums2.map(item => {
  return item * 2
})

console.log(newNums3) // [ 20, 40, 60 ]
console.log(newNums4) // [ 20, 40, 60 ]


const message = ["Hello World", "hello lyh", "my name is coderwhy"]
const newArr = []
for(const item of message){
  const res = item.split(' ');
  for(const ele of res){
    newArr.push(ele)
  }
}
console.log(newArr); 

// [
//   'Hello', 'World',
//   'hello', 'lyh',
//   'my',    'name',
//   'is',    'coderwhy'
// ]

const message1 = ["Hello World", "hello lyh", "my name is coderwhy"]
const words = message1.flatMap(item => {
  return item.split(' ')
})

console.log(words);

// [
//   'Hello', 'World',
//   'hello', 'lyh',
//   'my',    'name',
//   'is',    'coderwhy'
// ]
```

## 2. Object.fromEntries

```js
const obj = {
  name: "why",
  age: 18,
  height: 1.88
};

const entries = Object.entries(obj);
console.log(entries);  // [ [ 'name', 'why' ], [ 'age', 18 ], [ 'height', 1.88 ] ]

const res = entries.flatMap(item => item)
console.log(res); // [ 'name', 'why', 'age', 18, 'height', 1.88 ]

const newObj1 = Object.create({})
for(const entry of entries) {
  newObj1[entry[0]] = entry[1];
}
console.log(newObj1); // { name: 'why', age: 18, height: 1.88 }

// 1.ES10中新增了Object.fromEntries方法
const newObj = Object.fromEntries(entries)

console.log(newObj); // { name: 'why', age: 18, height: 1.88 }


// Object.fromEntries的应用场景
const queryString = 'name=why&age=18&height=1.88'
const queryParams = new URLSearchParams(queryString)
console.log(queryParams); // URLSearchParams { 'name' => 'why', 'age' => '18', 'height' => '1.88' }
const newObj3 = {}
for(const param of queryParams) {
  newObj3[param[0]] = param[1]
}
console.log(newObj3); // { name: 'why', age: '18', height: '1.88' }

const paramObj1 = Object.fromEntries(queryParams)
console.log(paramObj1); // { name: 'why', age: '18', height: '1.88' }
```

## 3. trimStart和trimEnd

```js
const message = "    Hello World    "

console.log(message.trim())  // Hello World
console.log(message.trimStart()) // Hello World   
console.log(message.trimEnd()) //     Hello World
```