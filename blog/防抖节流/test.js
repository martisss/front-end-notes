function thumpUp(target) {
  let timer = setInterval(() => target.click(), 100)
  setTimeout(() => {
    clearInterval(timer)
  }, 5000);
}


let target = document.getElementsByClassName('like-btn')[0]
window.onmousemove = throttle(() => target.click())

// 防抖
// 1
function debounce(func, delay = 500) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 2
function debounce(func, delay) {
  let timer
  return (...args) => {
    if(!timer) {
      func.apply(this, args)
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
      timer = null
    })
  }
}


// 节流
// 使用时间戳
function throttle(func, wait = 500) {
  let pre = 0
  return (...args) => {
    let now = +new Date()
    if(now - pre > wait) {
      func.apply(this, args)
      pre = now
    }
  }
}

// 使用定时器
/* 当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时
器存在，就不执行，直到定时器执行，然后执行函数，
清空定时器，这样就可以设置下个定时器。 */
function throttle(func, wait = 500) {
  let timer
  return (...args) => {
    if(!timer) {
      timer = setTimeout(() => {
        timer = null
        func.apply(this, args)
      }, wait)
    }
  }
}