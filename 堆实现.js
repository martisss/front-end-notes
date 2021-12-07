class Heap {
  constructor(compare) {
    this.arr = [0]
    this.compare = (typeof compare === 'function') ? compare : this._defaultCompare
    }
    static heapify(data, compare=undefined) {
      let heap = new Heap(compare)
      for(let item of data) {
        heap.push(item)
      }
      return heap
    }

    push(item) {
      let {arr} = this
      arr.push(item)
      this._up(arr.length - 1)
    }

    pop() {
      if(this.size === 0) return null
      let {arr} = this
      this._swap(1, arr.length - 1)
      let res = arr.pop()
      this._down(1)
      return res
    }

    get size() {
      return this.arr.length - 1
    }

    peek() {
      return this.arr[1]
    }

    _up(k) {
      let {arr, compare, _parent} = this
      while(k>1 && compare(arr[k], arr[_parent(k)])) {
        this._swap(_parent(k), k)
        k = _parent(k)
      }
    }

    _down(k) {
      let {arr, compare, _left, _right} = this
      let size = this.size
      while(_left(k) <= size) {
        let child = _left(k)
        if(_right(k) <= size && compare(arr[_right(k)], arr[child])) {
          child = _right(k)
        }
        if(compare(arr[k], arr[child])) return
        this._swap(k, child)
        k = child
      }
    }

    _left(k) { return k*2 }
    _right(k) { return k*2 + 1}
    _parent(k) { return Math.floor(k/2)}
    _swap(i, j) {
      let arr = this.arr;
      [ arr[i], arr[j] ] = [ arr[j], arr[i] ]
    }
    // 默认小顶堆
    _defaultCompare(a, b) {
      return a < b
    }
}

let arr = [ 3, 2, 3, 1, 2, 4, 5, 5, 6 ];
let heap = Heap.heapify(arr);

while (heap.size) {
  console.log(heap.pop());
}