interface Iterator<T> {
  next(): IteratorResult<T>
}

class BinaryTreeNode<T> {
  value: T
  left: BinaryTreeNode<T> | undefined
  right: BinaryTreeNode<T> | undefined

  constructor(value: T) {
    this.value = value
  }
}

class BinaryTreeIterator<T> implements Iterator<T> {
  private values: T[]
  private root: BinaryTreeNode<T>

  constructor(root: BinaryTreeNode<T>) {
    this.values = []
    this.root = root
    this.inOrder(root)
  }
  next(): IteratorResult<T> {
    const result: T | undefined = this.values.shift()
    if(!result) {
      return {done: true, value: this.root.value}
    }
    return {done: false, value: result}
  }
  private inOrder(node: BinaryTreeNode<T>): void {
    node.left && this.inOrder(node.left)
    this.values.push(node.value)
    node.right && this.inOrder(node.right)
  }
}