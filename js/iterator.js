function makeRangeIterator(start = 0, end = Infinity, step =1) {
  let nextIndex = start
  let countValue = 0
  const rangeIterator = {
    next: function() {
      let result
      if(nextIndex < end) {
        result = {value: nextIndex, done: false}
        nextIndex += step
        countValue++
        return result
      }
      return {value: countValue, done: true}
    }
  }
  return rangeIterator
}


let myIterator = new makeRangeIterator(0, 50, 1)
let result = myIterator.next()
while(!result.done){
  console.log(result.value)
  result = myIterator.next()
}
console.log(`最终长度为${result.value}`)