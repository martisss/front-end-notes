Object.assign = (obj, ...source) => {
  if(obj == null) return new TypeError()
  let res = Object(obj)
  source.forEach( item => {
    for(let key in item) {
      if(item.hasOwnProperty(key)) {
        res[key] = item[key]
      }
    }
  })
  return res
}

let user = { name: "John" };

let permissions1 = { canView: true };
let permissions2 = { canEdit: true };

// 将 permissions1 和 permissions2 中的所有属性都拷贝到 user 中
Object.assign(user, permissions1, permissions2);
console.log(user)