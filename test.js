class Heap {
  constructor(arr) {
    this.data = [...arr]
    this.size = this.data.length
  }
  left(i) {
    return (i*2) + 1
  }

  right(i) {
    return (i*2) + 2
  }

  swap(m, n) {
    [this.data[m], this.data[n]] = [this.data[n], this.data[m]]
  }

  rebuildHead() {
    const L = Math.floor(this.size / 2)
    for(let i=L-1; i>=0; i--) {
      this.maxHeapify(i)
    }
  }

  maxHeapify(i) {
    let max = i
    if(i>=this.size) return
    const l = this.left(i)
    const r = this.right(i)
    if(l < this.size && this.data[l] > this.data[max]) max = l
    if(r < this.size && this.data[i] > this.data[max]) max = r
    if(max === i) return
    swap(i, max)
    // 递归向下执行
    return this.maxHeapify(max) //todo
  }

  isHeap() {
    const L = Math.floor(this.size / 2)
    for(let i=L-1; i>=0; i--) {
      const l = this.data[this.left(i)] || Number.MIN_SAFE_INTEGER
      const r =this.data[this.right(i)] || Number.MIN_SAFE_INTEGER
      const max = Math.max(this.data[i], l, r)
      if(max !== this.data[i]) return false
      return true
    }
  }

  sort() {
    for(let i=this.size-1; i>0; i--) {
      this.swap(0, i)
      this.size--
      this.maxHeapify(0)
    }
  }

  insert(key) {
    this.data[this.size++] = key;
    if (this.isHeap()) {
      return;
    }
    this.rebuildHeap();
  }

  delete(index) {
    if (index >= this.size) {
      return;
    }
    this.data.splice(index, 1);
    this.size--;
    if (this.isHeap()) {
      return;
    }
    this.rebuildHeap();
  }
}