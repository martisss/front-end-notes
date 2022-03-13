const quickSort = (arr, l, r) => {
  const partition = (arr, l, r) => {
    let p = l + Math.floor(Math.random()*(r-l));
    [arr[p], arr[l]] = [arr[l], arr[p]]
    let j = l
    for(i=l+1; i<=r; i++) {
      if(arr[i]<arr[l]) {
        j++
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
    [arr[l], arr[j]] = [arr[j], arr[l]]
    return j
  }
  if(l>=r) return
  let mid = partition(arr, l, r)
  quickSort(arr,l,mid-1)
  quickSort(arr,mid+1,r)
}
const arr = [1, 3, 53, 9, 8, 5, 4]
quickSort(arr, 0, arr.length-1)
console.log(arr)