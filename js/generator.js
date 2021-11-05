function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
  for(let i = 0; i < end; i += step) {
    yield i
  }
}

let a = makeRangeIterator(1, 10, 1)
console.log(a.next())
console.log(a.next())
console.log(a.next())
console.log(a.next())
console.log(a.next())
console.log(a.next())
console.log(a.next())
console.log(a.next())
console.log(a.next())
console.log(a.next())
console.log(a.next())

const myIterable = {
  *[Symbol.iterator](){
    yield 1;
    yield 2;
    yield 3;
  }
}
for(let value of myIterable) {
  console.log(value)
}

function* fibonacci() {
  let f1 = 0
  let f2 = 1
  while(true) {
    let cur = f1
    f1 = f2
    f2 = cur + f1
    let reset = yield cur
    if(reset) {
      f1 = 0 
      f2 = 1
    }
  }
}

var sequence = fibonacci();
// for(let num of sequence) {
//   console.log(num)
// }

console.log(sequence.next().value);     // 0
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 2
console.log(sequence.next().value);     // 3
console.log(sequence.next().value);     // 5
console.log(sequence.next().value);     // 8
console.log(sequence.next(true).value); // 0
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 2


function* gen() {
  try {
    let ask1 = yield '今天周几？'
    console.log(`今天周${ask1}`)
    let ask2 = yield '明天周几？'
    console.log(`明天周${ask2}`)
    let ask3 = yield '后天周几？'
  } catch(err) {
    console.log(err)
  }
}
let generator = gen()
let question = generator.next().value
console.log(question)
question = generator.next('三').value
console.log(question)
console.log(generator.next('四').value)
console.log(generator.throw('我不太清楚').done)




