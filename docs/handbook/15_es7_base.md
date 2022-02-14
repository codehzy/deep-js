---
title: ES7知识点
author: 小何尖尖角
date: '2021-02-14'
---

# ES7知识点

## 1. includes

- `include` 查看某个元素是否在某个数组中，优于使用 `indexOf`

```js
const names = ["abc", "cba", "nba", "mba", NaN]

if (names.indexOf("cba") !== -1) {
  console.log("包含abc元素")
}

// ES7 ES2016
if (names.includes("cba", 2)) {
  console.log("包含abc元素")
}

if (names.indexOf(NaN) !== -1) {
  console.log("包含NaN")
}

if (names.includes(NaN)) {
  console.log("包含NaN")
}
```

## 2. 指数运算

- ES5 -> Math.pow
- ES7 -> xx ** xx

```js
const result1 = Math.pow(3, 3)
// ES7: **
const result2 = 3 ** 3
console.log(result1, result2)
```