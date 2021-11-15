var arr = [1, '1', 1, '1',2, '2', 2, null,undefined, null, undefined, new String('1'), {value:1}, new String('1'), /a/, {value:1},/a/, NaN, 2,NaN];

// let arr =  [2, '2', 2]


// function unique(array) {
//   let res = []
//   for(let i = 0; i < array.length; i++) {
//     if(res.indexOf(array[i]) === -1) res.push(array[i])
//   }
//   return res
// }


// function unique(arr) {
//   return arr.filter((item, index, arr) => arr.indexOf(item) ===index)
// }

// function unique(array) {
//   let res = []
//   let pre
//   let sortedArray = array.concat().sort((a, b) => a - b)
//   for(let i = 0; i < sortedArray.length; i++) {
//     if(!i || pre !== sortedArray[i]) res.push(sortedArray[i])
//     pre = sortedArray[i]
//   }
//   return res
// }
function unique(arr) {
  return arr.concat().sort().filter((item, index, arr) => !index || item !== arr[index-1])
}

console.log(arr.sort((a,b) => a-b))

// function unique(arr) {
//   let obj = {}
//   return arr.filter((item, index, arr) => {
//     return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)] = true)
//   })
// }

// function unique(arr) {
//   // return Array.from(new Set(arr))
//   return [...new Set(arr)]
// }

// function unique(arr) {
//   let map = new Map()
//   return arr.filter(item => !map.has(item) && map.set(item, 1))
// }
console.log(unique(arr))