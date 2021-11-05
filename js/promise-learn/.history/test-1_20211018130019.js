const isFunction = obj => typeof obj === 'function'
const isObject = obj => obj && typeof  obj == 'object'
const isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj

const PENDING = 'pending'
const FULFILLED 