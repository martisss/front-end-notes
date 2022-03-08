class Heap {
  constructor(compare) {
    this.arr = []
    this.compare = (typeof compare === 'function') ? compare : this._defaultCompare
    }
    // static heapify(data, compare=undefined) {
    //   let heap = new Heap(compare)
    //   for(let item of data) {
    //     heap.push(item)
    //   }
    //   return heap
    // }

    push(item) {
      let {arr} = this
      arr.push(item)
      this._up(arr.length - 1)
    }

    pop() {
      if(this.size === 0) return null
      let {arr} = this
      this._swap(0, arr.length - 1)
      let res = arr.pop()
      this._down(0)
      return res
    }

    get size() {
      return this.arr.length
    }

    peek() {
      return this.arr[0]
    }

    _up(k) {
      let {arr, compare, _parent} = this
      while(k>0 && compare(arr[k], arr[_parent(k)])) {
        this._swap(_parent(k), k)
        k = _parent(k)
      }
    }

    _down(k) {
      let {arr, compare, _left, _right} = this
      let size = this.size
      while(_left(k) < size) {
        let child = _left(k)
        if(_right(k) < size && compare(arr[_right(k)], arr[child])) {
          child = _right(k)
        }
        if(compare(arr[k], arr[child])) return
        this._swap(k, child)
        k = child
      }
    }

    _left(k) { return k*2 +1 }
    _right(k) { return k*2 + 2}
    _parent(k) { return Math.floor((k-1)/2)}
    _swap(i, j) {
      let arr = this.arr;
      [ arr[i], arr[j] ] = [ arr[j], arr[i] ]
    }
    // 默认小顶堆
    _defaultCompare(a, b) {
      return a < b
    }
}

// let arr = [ 3, 2, 3, 1, 2, 4, 5, 5, 6 ];
// let heap = Heap.heapify(arr);
let heap = new Heap((a, b)=> a<b)
heap.push(3)
heap.push(5)
heap.push(7)
heap.push(1)
heap.push(2)

// while (heap.size) {
//   console.log(heap.pop());
// }
console.log(heap)
console.log(heap.pop())
console.log(heap.pop())
console.log(heap.pop())
console.log(heap.pop())
console.log(heap.pop())
console.log(heap.pop())

