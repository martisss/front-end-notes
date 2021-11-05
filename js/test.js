let range = {
  from: 1,
  to: 5,
  *[Symbol.iterator]() {
    for(let i = this.from; i < this.to; i++) {
      yield i
    }
  }

  // [Symbol.iterator]() { // 在 for..of 循环开始时被调用一次
  //   return {
  //     current: this.from,
  //     last: this.to,

  //     next() { // 每次迭代时都会被调用，来获取下一个值
  //       if (this.current <= this.last) {
  //         return { done: false, value: this.current++ };
  //       } else {
  //         return { done: true };
  //       }
  //     }
  //   };
  // }
};

for(let value of range) {
  console.log(value); // 1，然后 2，然后 3，然后 4，然后 5
}