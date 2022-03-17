---
title: 详细剖析Proxy
author: 小何尖尖角
date: '2021-02-27'
---

# 手写promise

## 1. 构造基础的promise类

- 注意点
  - 封装类，将调用promise的时候传入的回调默认执行
  - 声明promise的三种状态， 在执行 `pending`时刻才可以执行，执行完成将 promise状态改变(resolved,rejected)
  - 保存成功和失败两个回调传入的参数

```js
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'


class myPromise {
  constructor(executor){
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined

    const resolve = (value) => {
      if(this.status === PROMISE_STATUS_PENDING){
        this.status = PROMISE_STATUS_FULFILLED
        this.value = value
        console.log(`resolve被调用`,value);
      }
    };

    const reject = (reason) => {
      if(this.status === PROMISE_STATUS_PENDING){
        this.status = PROMISE_STATUS_REJECTED;
        this.reason = reason
        console.log(`reject被调用`,reason);
      }
    };


    executor(resolve, reject)
  }
}

const promise = new myPromise((resolve, reject) => {
  console.log("状态pending")
  reject(111)

  resolve(222)
})
```

## 2. 完善promise的then方法

- 注意点
  - 在类中，实现promise的then方法。默认then方法传入的 两个回调函数。
  - 由于同步函数，类在被promise第一次实例化的时候，就会执行then方法传入的两个回调（onFulfilled，onRejected）。故将then方法传入的回调执行时放入微任务队列。（建议使用queueMicrotask，而非setTimeOut）

```js
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'


class myPromise {
  constructor(executor){
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined

    const resolve = (value) => {
      if(this.status === PROMISE_STATUS_PENDING){
        queueMicrotask(
          () => {
            this.status = PROMISE_STATUS_FULFILLED
            this.value = value
            this.onFulfilled(this.value)
          }
        )
      }
    };

    const reject = (reason) => {
      if(this.status === PROMISE_STATUS_PENDING){
        queueMicrotask(() =>{
          this.status = PROMISE_STATUS_REJECTED;
          this.reason = reason
          this.onRejected(this.reason)
        })
      }
    };

    executor(resolve, reject)

  }

  then(onFulfilled,onRejected) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  }
}

const promise = new myPromise((resolve, reject) => {
  console.log("状态pending")
  // reject(111)

  resolve(222)
})

promise.then(res => {
  console.log('res1',res);
},err => {
  console.log('err1',err);
})
```

## 3. 进一步优化Promise的then方法

- 场景问题
  - 用户执行方式一

```js
promise.then(res => {
  console.log('res1',res);
},err => {
  console.log('err1',err);
})


promise.then(res => {
  console.log(`res2`,res);
},err => {
  console.log(`err2`,err);
})

// 这个在promise变成resolved的以后应该立即被调用
setTimeout(() => {
  promise.then(res => {
    console.log(res);
  })
},1000)
```

根据上述场景：promise变成resolved的以后应该立即被调用setTimeOut中的then回调。我们在将then加入数组的时候进行判断。进行代码修改：

- 完善then回调时候status的状态
- 对微任务队列的方法，进行判断status是否为pending

```js
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'


class myPromise {
  constructor(executor){
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if(this.status === PROMISE_STATUS_PENDING){
        queueMicrotask(
          () => {
            if (this.status !== PROMISE_STATUS_PENDING) return
            this.status = PROMISE_STATUS_FULFILLED
            this.value = value
            this.onFulfilledFns.forEach(fn => fn(this.value))
          }
        )
      }
    };

    const reject = (reason) => {
      if(this.status === PROMISE_STATUS_PENDING){
        queueMicrotask(() =>{
          // 主要修改代码2
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_REJECTED;
          this.reason = reason
          this.onRejectedFns.forEach(fn => fn(this.value))
        })
      }
    };
  
    executor(resolve, reject)

  }

  // 主要修改代码1
  then(onFulfilled,onRejected) {
     if(this.status === PROMISE_STATUS_FULFILLED && onFulfilled){
        onFulfilled(this.value)
     }

     if(this.status === PROMISE_STATUS_REJECTED && onRejected){
       onRejected(this.reason)
     }

     if(this.status === PROMISE_STATUS_PENDING){
        this.onFulfilledFns.push(onFulfilled)
        this.onRejectedFns.push(onRejected)
     }
  }
}

const promise = new myPromise((resolve, reject) => {
  console.log("状态pending")
  // reject(111)

  resolve(222)
})

promise.then(res => {
  console.log('res1',res);
},err => {
  console.log('err1',err);
})


promise.then(res => {
  console.log(`res2`,res);
},err => {
  console.log(`err2`,err);
})

setTimeout(() => {
  promise.then(res => {
    console.log(res);
  })
},1000)
```

## 4. promise的then方法链式调用

- 注意点
  - 链式调用第二次需要接收到第一次的值（并且这个值是个`promise`），我们将整体的then方法返回一个新的`promise`。在对函数执行方面，我们根据status状态值判断是否是第一次执行之后，**如果是不是第一次执行，那么直接执行传入的函数得到返回值，并用 `resolve` 和 `reject`将第一次的promise推到已决状态。**
  - 如果判断是第一次执行，那么将其回调函数放到数组中。此时注意，因后续需要遍历数组中的函数执行，而又想将每次的执行结果返回给下一次，故**不能直接push一个回调函数本身进去，如此执行函数得到返回值并将`promise`推到已决，其返回值返回给下次`promise`。**

```js
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

class myPromise {
  constructor(executor){
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if(this.status === PROMISE_STATUS_PENDING){
        queueMicrotask(
          () => {
            if (this.status !== PROMISE_STATUS_PENDING) return
            this.status = PROMISE_STATUS_FULFILLED
            this.value = value
            this.onFulfilledFns.forEach(fn => fn(this.value))
          }
        )
      }
    };

    const reject = (reason) => {
      if(this.status === PROMISE_STATUS_PENDING){
        queueMicrotask(() =>{
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_REJECTED;
          this.reason = reason
          this.onRejectedFns.forEach(fn => fn( this.reason))
        })
      }
    };
  
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }

  }

  then(onFulfilled,onRejected) {

    return new myPromise((resolve, reject) =>{
       // 第二次传入回调则直接执行，并将返回值返回，再将promise推到已决
        if(this.status === PROMISE_STATUS_FULFILLED && onFulfilled){
          try {
            const value = onFulfilled(this.value)
            resolve(value)
          } catch (error) {
            reject(error)
          }
        }

        if(this.status === PROMISE_STATUS_REJECTED && onRejected){
          try {
            const reason = onRejected(this.reason)
            resolve(reason)
          } catch (error) {
            reject(error)
          }
        }

      	// 第一次判断状态值是pending，则将传入回调包裹一个回调，执行函数返回值返回给第二次promise
        if(this.status === PROMISE_STATUS_PENDING){
            this.onFulfilledFns.push(() => {
              try {
                const value = onFulfilled(this.value)
                resolve(value)
              } catch (error) {
                reject(error)
              }
            })
            this.onRejectedFns.push(() => {
              try {
                const reason = onRejected(this.reason)
                resolve(reason)
              } catch (error) {
                reject(error)
              }
            })
        }
    })
  }
}

const promise = new myPromise((resolve, reject) => {
  console.log("状态pending")
  reject(111)
  // resolve(222)

  // throw new Error("报错了")
})

promise.then(res => {
  console.log('res1',res);
},err => {
  console.log('err1',err);
}).then(res => {
  console.log('res2',res);
},err => {
  console.log(`err2`,err);
})
```

## 5. 将try catch封装

```js
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    resolve(result)
  } catch (error) {
    reject(error)
  }
}
```

修改后的代码:

```js
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    resolve(result)
  } catch (error) {
    reject(error)
  }
}

class myPromise {
  constructor(executor){
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if(this.status === PROMISE_STATUS_PENDING){
        queueMicrotask(
          () => {
            if (this.status !== PROMISE_STATUS_PENDING) return
            this.status = PROMISE_STATUS_FULFILLED
            this.value = value
            this.onFulfilledFns.forEach(fn => fn(this.value))
          }
        )
      }
    };

    const reject = (reason) => {
      if(this.status === PROMISE_STATUS_PENDING){
        queueMicrotask(() =>{
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_REJECTED;
          this.reason = reason
          this.onRejectedFns.forEach(fn => fn( this.reason))
        })
      }
    };
  
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }

  }

  then(onFulfilled,onRejected) {

    return new myPromise((resolve, reject) =>{
        if(this.status === PROMISE_STATUS_FULFILLED && onFulfilled){
          execFunctionWithCatchError(onFulfilled, this.value.resolve,reject)
        }

        if(this.status === PROMISE_STATUS_REJECTED && onRejected){
          execFunctionWithCatchError(onRejected, this.reason,resolve,reject)
        }

        if(this.status === PROMISE_STATUS_PENDING){
            this.onFulfilledFns.push(() => {
              execFunctionWithCatchError(onFulfilled, this.value.resolve,reject)
            })
            this.onRejectedFns.push(() => {
              execFunctionWithCatchError(onRejected, this.reason,resolve,reject)
            })
        }
    })
  }
}

const promise = new myPromise((resolve, reject) => {
  console.log("状态pending")
  reject(111)
  // resolve(222)

  // throw new Error("报错了")
})

promise.then(res => {
  console.log('res1',res);
},err => {
  console.log('err1',err);
}).then(res => {
  console.log('res2',res);
},err => {
  console.log(`err2`,err);
})
```

## 6. promise的catch方法实现

- 注意
  - 调用 `then` 方法，第一个参数传入`undefined`，并在传入数组的回调函数时进行第一参数的空值判断。
  - 让方法链式调用走 `catch`，判断 `onRejected` 是否有值，没值则抛出错误，则自动会走 `catch`

```js
// ES6 ES2015
// https://promisesaplus.com/
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

// 工具函数
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    resolve(result)
  } catch(err) {
    reject(err)
  }
}

class myPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        // 添加微任务
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_FULFILLED
          this.value = value
          this.onFulfilledFns.forEach(fn => {
            fn(this.value)
          })
        });
      }
    }

    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        // 添加微任务
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_REJECTED
          this.reason = reason
          this.onRejectedFns.forEach(fn => {
            fn(this.reason)
          })
        })
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    // 主要修改代码2 
    const defaultOnRejected = err => { throw err }
    onRejected = onRejected || defaultOnRejected

    return new myPromise((resolve, reject) => {
      // 1.如果在then调用的时候, 状态已经确定下来
      if (this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
      }
      if (this.status === PROMISE_STATUS_REJECTED && onRejected) {
        execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
      }

      // 2.将成功回调和失败的回调放到数组中
      if (this.status === PROMISE_STATUS_PENDING) {
        if (onFulfilled) this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
        })
        if (onRejected) this.onRejectedFns.push(() => {
          execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
        })
      }
    })
  }

  // 主要修改代码1
  catch(onRejected) {
    this.then(undefined, onRejected)
  }
}

const promise = new myPromise((resolve, reject) => {
  console.log("状态pending")
  // resolve(1111) // resolved/fulfilled
  reject(2222)
})

// 调用then方法多次调用
promise.then(res => {
  console.log("res:", res)
}).catch(err => {
  console.log("err:", err)
})
```

## 7. promise的finally方法实现

- 注意
  - 调用 `then` 方法，传入两个 `finally` 回调函数
  - 如果和catch连用，设置 `resolve`的时候，`onFinally`值要交给下一个`resolve`，不可只设置`onReject`

```js
// ES6 ES2015
// https://promisesaplus.com/
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

// 工具函数
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    resolve(result)
  } catch(err) {
    reject(err)
  }
}

class myPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        // 添加微任务
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_FULFILLED
          this.value = value
          this.onFulfilledFns.forEach(fn => {
            fn(this.value)
          })
        });
      }
    }

    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        // 添加微任务
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_REJECTED
          this.reason = reason
          this.onRejectedFns.forEach(fn => {
            fn(this.reason)
          })
        })
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    const defaultOnRejected = err => { throw err }
    onRejected = onRejected || defaultOnRejected

    // 主要修改代码2: 链式调用finally和catch联用，记得设置
    const defaultOnFulfilled = value => { return value }
    onFulfilled = onFulfilled || defaultOnFulfilled

    return new myPromise((resolve, reject) => {
      // 1.如果在then调用的时候, 状态已经确定下来
      if (this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
      }
      if (this.status === PROMISE_STATUS_REJECTED && onRejected) {
        execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
      }

      // 2.将成功回调和失败的回调放到数组中
      if (this.status === PROMISE_STATUS_PENDING) {
        if (onFulfilled) this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
        })
        if (onRejected) this.onRejectedFns.push(() => {
          execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
        })
      }
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  // 主要修改代码1
  finally(onFinally) {
    this.then(() => {
      onFinally()
    }, () => {
      onFinally()
    })
  }
}

const promise = new myPromise((resolve, reject) => {
  console.log("状态pending")
  resolve(1111) // resolved/fulfilled
  // reject(2222)
})

// 调用then方法多次调用
promise.then(res => {
  console.log("res1:", res)
  return "aaaaa"
}).then(res => {
  console.log("res2:", res)
}).catch(err => {
  console.log("err:", err)
}).finally(() => {
  console.log("finally")
})
```

## 8.实现Promise的resolve和reject的实现

```js
class myPromise {
  static resolve(value){
    return new myPromise((resolve) => {resolve(value)})
  }

  static reject(reason){
    return new myPromise((reject) => {reject(reason)})
  }
}



// 使用
myPromise.resolve("hello world").then(res => {
  console.log(`res`,res);
})

myPromise.reject("nohello world").then(err => {
  console.log(`err`,err);
})
```

## 9. 实现Promise的all方法

- 注意
  - 将 `promise`的执行结果放到数组，最终用 `resolve`来执行
  - 只要有任何的错误就调用 `reject`方法

```js
class myPromise {
  
  static all(promises){
    // 问题关键: 什么时候要执行resolve, 什么时候要执行reject
    return new myPromise((resolve,reject) => {
      const values = []
      promises.forEach(promise => {
        promise.then(res => {
          values.push(res)
          if(values.length === promises.length){
            resolve(values)
          }
        },err => {
          // 只要有任何错误就调用reject
          reject(err)
        })
      })
    })
  }
}


// 使用
const p1 = new myPromise((resolve) => {
  setTimeout(() => {
    resolve(111)
  }, 1000);
})

const p2 = new myPromise((resolve,reject) => {
  setTimeout(() => {
    reject(222)
  }, 2000);
})

const p3 = new myPromise((resolve) => {
  setTimeout(() => {
    resolve(333)
  }, 3000);
})

myPromise.all([p1,p2,p3]).then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
})
```

## 10. 实现Promise的allSettled方法

- 注意
  - 区别于 `promise.all`方法返回的 `promise`结果更为细致，数组包含对象以及结果对应状态值
  - 在 `resolve` 和 `reject`都需要收集 `promise`

```js
// 实现
static allSettled(promises){
  return new myPromise((resolve,reject) => {
    const results = []
    promises.forEach(promise => {
      promise.then(res => {
        results.push({ status: PROMISE_STATUS_FULFILLED , value: res})
        if(results.length === promises.length){
          resolve(results)
        }
      },err => {
        results.push({ status: PROMISE_STATUS_REJECTED , value: res})
        if(results.length === promises.length){
          resolve(results)
        }
      })
    })
  })
}



// 使用
const p1 = new myPromise((resolve) => {
  setTimeout(() => {
    resolve(111)
  }, 1000);
})

const p2 = new myPromise((resolve) => {
  setTimeout(() => {
    resolve(222)
  }, 2000);
})

const p3 = new myPromise((resolve) => {
  setTimeout(() => {
    resolve(333)
  }, 3000);
})

myPromise.allSettled([p1,p2,p3]).then(res => {
  console.log(res);
})
```

## 11. 实现promise的race&any方法

- 注意
  - `race` 则是有一个 `resolve` 则立马返回
  - 实现 `any` 要注意收集错误

```js
static race(promises){
  return new myPromise((resolve,reject) => {
    promises.forEach(promise => {
      promise.then(res => {
        resolve(res)
      },err => {
        reject(err)
      })
    })
  })
}


static any(promises){
  const reasons = []
  return new myPromise((resolve,reject) => {
    promises.forEach(promise => {
      promise.then(res => {
        resolve(res)
      },err => {
        reasons.push(err)
        if(reasons.length === promises.length){
          reject(new AggregateError(reasons))
        }
      })
    })
  })
}


const p1 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject(111)
  }, 1000);
})

const p2 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject(222)
  }, 2000);
})

const p3 = new myPromise((resolve,reject) => {
  setTimeout(() => {
    reject(333)
  }, 3000);
})

// 使用
// myPromise.race([p1,p2,p3]).then(res => {
//   console.log(`res`,res);
// }).catch(err => {
//   console.log(`err`,err);
// })


myPromise.any([p1,p2,p3]).then(res => {
  console.log(`res`,res);
}).catch(err => {
  console.log(`err`,err.errors);
})
```

