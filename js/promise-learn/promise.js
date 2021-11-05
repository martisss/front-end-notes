class HD{
  static PENDING = 'pending'
  static FUFILLED = 'fulfilled'
  static REJECTED = 'rejected'
  constructor(executor) {
    this.status = HD.PENDING
    this.value = null
    executor(this.resolve, this.reject)
  }
  resolve(value) {
    this.status = HD.FUFILLED
  }
  reject(reason) {

  }
}