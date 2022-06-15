## 选择排序 

升序排列：在未排序的那一部分中选出最小的那个数的索引，与开头的数进行交换，不断地重复这一过程。

```js
//前半部分排好序
function selectSort(arr) {
  for(let i=0; i<arr.length; i++){
    let minIndex = i
    for(let j=i; j<arr.length; j++) {
      if(arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
  }
  return arr
}
//后半部分排好序
function selectSort(arr) {
  for(let i=arr.length-1; i>=0; i--){
    let maxIndex = i
    for(let j=i; j>=0; j--) {
      if(arr[j] > arr[maxIndex]) {
        maxIndex = j
      }
    }
    [arr[i], arr[maxIndex]] = [arr[maxIndex], arr[i]]
  }
  return arr
}

const arr = [6, 4, 2, 3, 1, 5]
console.log(selectSort(arr))
```

## 插入排序:heavy_check_mark:

插入排序的插入是指从未排序的序列中选择一个（一般是第一个）插入到前方已经排好的序列中

时间复杂度：O(n^2)

空间复杂度：O(1)

```js
function insertionSort(arr) {
  for(let i=0; i<arr.length; i++) {
    // j-1>=0, 保证前面至少有一个元素，如果前面没有元素，没有必要进行比较了
    for(let j=i; j-1>=0; j--) {
      if(arr[j] < arr[j-1]) {
        [arr[j], arr[j-1]] = [arr[j-1], arr[j]]
      } else break
    }
  }
  return arr
}

// 优化
function insertionSort(arr) {
  for(let i=0; i<arr.length; i++) {
    // j-1>=0, 保证前面至少有一个元素，如果前面没有元素，没有必要进行比较了
    let j
    // 暂存准备插入的元素，能够减少赋值的操作，但总体复杂度不变
    let temp = arr[i]
    for(j=i; j-1>=0 && temp<arr[j-1]; j--) {
      arr[j] = arr[j-1]
    }
    arr[j] = temp
  }
  return arr
}


//后半部分有序
function insertionSort(arr) {
  for(let i=arr.length-1; i>=0; i--) {
    let j
    let temp = arr[i]
    for(j=i;j<=arr.length-1 && temp>arr[j+1]; j++) {
      arr[j] = arr[j+1]
    }
    arr[j] = temp
  }
  return arr
}

const arr = [6, 4, 2, 3, 1, 5]
console.log(insertionSort(arr))
```

### 插入排序的重要特性

对于选择排序来说， 它的时间时间复杂度稳定在O(n^2)，其内部 循环每次都是从头循环到尾，即使内部循环的的第一个数就是最小的那个数，而对于插入排序来说，其内部排序是可以中途退出的，即内部循环找到了待插入值的位置后就结束了，那么对于一个有序数组来说，插入排序的时间复杂度可以到O(n)，但其总体复杂度还是不变的，如果一个数组总体有序的话可以考虑插入排序。

## 归并排序 :heavy_check_mark:

时间复杂度：O(nlogn)

空间复杂度：O(n)

### 自顶向下的归并排序 :heavy_check_mark:

运用递归的思想，先分成左、右部分，对左右部分递归地进行merge排序，这样左右部分是有序的，然后再将有序的两部分进行合并

```js
const mergeSort = (arr) => {
  const merge = (arr, l, mid, r) => {
    const temp = arr.slice(l, r + 1)
    let i = l,
      j = mid + 1
    // 思考为什么要减去l?temp与原数组是存在偏差的
    // 截取的数组第一个位置为0，但在原数组中位置是l
    // 因此偏差为l，每次要减去l 
    for (let k = l; k <= r; k++) {
      // 左半部分越界
      if (i > mid) {
        arr[k] = temp[j - l]
        j++
        // 右半部分越界
      } else if (j > r) {
        arr[k] = temp[i - l]
        i++
      } else if (temp[i - l] < temp[j - l]) {
        arr[k] = temp[i - l]
        i++
      } else {
        arr[k] = temp[j - l]
        j++
      }
    }
  }
  const sort = (arr, l, r) => {
    if(l >= r) return
    let mid = Math.floor((l+r)/2)
    sort(arr,l,mid)
    sort(arr,mid+1, r)
    merge(arr, l, mid, r)
  }
  sort(arr, 0, arr.length-1)
}

const arr = [1,3,53,9,8,5,4]
mergeSort(arr)
console.log(arr)

```

优化一：

```js
  const sort = (arr, l, r) => {
    if(l >= r) return
    let mid = Math.floor((l+r)/2)
    sort(arr,l,mid)
    sort(arr,mid+1, r)
    // 两端已经有序，如果arr[mid]<=arr[mid+1]，那么这两段就没有必要进行归并
    if(arr[mid]>arr[mid+1]) {
      merge(arr, l, mid, r)
    }
  }
```

优化二：还是对sort进行优化，在数据量小的时候插入排序的性能优于归并排序，但对于js, python来说，可能用处不大设置有反效果，了解即可。

```js
function insertionSort(arr, l, r) {
  for(let i=l; i<=r; i++) {
    let j
    let temp = arr[i]
    for(j=i; j-1>=l && temp<arr[j-1]; j--) {
      arr[j] = arr[j-1]
    }
    arr[j] = temp
  }
  return arr
}

const mergeSort = (arr) => {
  const merge = (arr, l, mid, r) => {
    const temp = arr.slice(l, r + 1)
    let i = l,
      j = mid + 1
    //思考为什么要减去l?temp与原数组是存在偏差的
    // 截取的数组第一个位置为0，但在原数组中位置是l
    // 因此偏差为l，每次要减去l
    for (let k = l; k <= r; k++) {
      // 左半部分越界
      if (i > mid) {
        arr[k] = temp[j - l]
        j++
        // 右半部分越界
      } else if (j > r) {
        arr[k] = temp[i - l]
        i++
      } else if (temp[i - l] < temp[j - l]) {
        arr[k] = temp[i - l]
        i++
      } else {
        arr[k] = temp[j - l]
        j++
      }
    }
  }
  
  const sort = (arr, l, r) => {
    // 优化前返回条件
    // if(l >= r) return
    // 优化后返回条件, 当数据量较小时，插入排序的性能优于归并排序
    if(r-l<=15) {
      insertionSort(arr, l, r)
      // 注意此处，已经排序完毕，立即返回
      return
    }
    let mid = Math.floor((l+r)/2)
    sort(arr,l,mid)
    sort(arr,mid+1, r)
    // 两端已经有序，如果arr[mid]<=arr[mid+1]，那么这两段就没有必要进行归并
    if(arr[mid]>arr[mid+1]) {
      merge(arr, l, mid, r)
    }
  }
  sort(arr, 0, arr.length-1)
}

const arr = [1,3,53,9,8,5,4]
mergeSort(arr)
console.log(arr)

```

### 自底向上的归并排序 :question:

```js
// 自底向上的归并排序
const mergeSort = (arr) => {
  const merge = (arr, l, mid, r) => {
    const temp = arr.slice(l, r + 1)
    let i = l,
      j = mid + 1
    //思考为什么要减去l?temp与原数组是存在偏差的
    // 截取的数组第一个位置为0，但在原数组中位置是l
    // 因此偏差为l，每次要减去l
    for (let k = l; k <= r; k++) {
      // 左半部分越界
      if (i > mid) {
        arr[k] = temp[j - l]
        j++
        // 右半部分越界
      } else if (j > r) {
        arr[k] = temp[i - l]
        i++
      } else if (temp[i - l] < temp[j - l]) {
        arr[k] = temp[i - l]
        i++
      } else {
        arr[k] = temp[j - l]
        j++
      }
    }
  }
  const sort = (arr) => {
    for (let sz = 1; sz < arr.length; sz += sz) {
      for (let i = 0; i + sz < arr.length; i += sz + sz) {
        // 合并两个区间，这个时候mid=i+sz-1, i+sz<n，说明第二个区间存在
        // 但是极端情况下第二个区间可能只有arr[i+sz]这一个数字
        // 为防止越界，r=Math.min(i+sz+sz-1, arr.lenth-1)
        merge(arr, i, i + sz - 1, Math.min(i + sz + sz - 1, arr.length - 1))
      }
    }
  }
  sort(arr)
}
const arr = [1, 3, 53, 9, 8, 5, 4]
mergeSort(arr)
console.log(arr)

```

[剑指 Offer 51. 数组中的逆序对](https://leetcode-cn.com/problems/shu-zu-zhong-de-ni-xu-dui-lcof/)

```js
/**
 * @param {number[]} nums
 * @return {number}
 */

//套用归并排序的方法
var reversePairs = function(nums) {
    let count = 0
    const merge = (arr, l, mid, r) => {
        const temp = arr.slice(l, r+1)
        let i=l, j =mid+1
        for(let k=l; k<=r; k++) {
            if(i>mid) {
                arr[k] = temp[j-l]
                j++
            } else if(j>r) {
                arr[k] = temp[i-l]
                i++
            } else if(temp[i-l]<=temp[j-l]){
                arr[k] = temp[i-l]
                i++
            } else {
                arr[k] = temp[j-l]
                j++
                count+=mid-i+1
            }
        }
    }
    const sort = (arr, l, r) => {
        if(l>=r) return
        let mid = Math.floor((l+r)/2)
        sort(arr, l, mid)
        sort(arr, mid+1, r)
        if(arr[mid]>arr[mid+1]) {
            merge(arr, l, mid, r)
        }
    }
    sort(nums, 0, nums.length-1)
    return count
};
```

## 快速排序 :heavy_check_mark:

partition: 将目标数移动到指定位置，将原数组分为三个部分，小于等于目标数的部分，目标数，大于目标数的部分

关键是partition的实现

> 第一版

```js
const quickSort = (arr, l, r) => {
  // partition将数组分成两部分
  // l, r分别代表数组的左右边界
  // 默认将arr[l]作为标志位
  // [l+1, j] 部分小于arr[l]
  // [j+1,i-1]部分大于arr[l] （闭区间）
  const partition = (arr, l, r) => {
    let j=l
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
```

第一版快速排序的主要问题在于partition的实现，针对有序数组的话可能会栈溢出

> 第二版  增加随机性

```js
const quickSort = (arr, l, r) => {
  const partition = (arr, l, r) => {
    let p = l + Math.floor(Math.random()*(r-l));  //灵魂分号！！！ FBI warning!!!
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
  if(l>=r) return // 递归推出条件
  let mid = partition(arr, l, r)
  quickSort(arr,l,mid-1)
  quickSort(arr,mid+1,r)
}
```

## 冒泡排序:heavy_check_mark:

第i轮开始，arr[n-i, n)已排好序
第i轮:通过冒泡在arr[n-i- 1]位置放上合适的元素
第i轮结束: arr[n-i- 1, n)已排好序



冒泡排序并不是仅仅简单的将最大（小）的数字移到最后，而是在这过程中不断将逆序对减少，每冒泡一次，逆序对的数量就会减少，直到减为0，排序完成

```js
// 冒泡排序
var sortArray = function(nums) {
    for(let i=0; i<nums.length; i++) {
        for(let j=0; j<nums.length-i; j++) {
            if(nums[j]>nums[j+1]) {
                [nums[j], nums[j+1]] = [nums[j+1], nums[j]]
            }
        }
    }
    return nums
}
```

## 希尔排序:heavy_check_mark:

基本思想：让数组越来越有序，同时不止处理相邻的逆序对，

对元素间距为n/2的所有数组做插入排序
对元素间距为n/4的所有数组做插入排序
对元素间距为n/8的所有数组做插入排序
. ..
对元素间距为1的所有数组做插入排序

```js
// 希尔排序
var sortArray = function(nums) {
  let space = Math.floor(nums.length/2)
  while(space >= 1) {
    // 对间隔为space的数组进行插入排序
      for(let start = 0; start < space; start++) {
        // 进行插入排序的逻辑
        for(let i=start+space; i<nums.length; i+=space) {
            let temp = nums[i]
            let j
            for(j=i; j-space>=0 && temp < nums[j-space]; j-=space) {
                nums[j] = nums[j-space]
            }
            nums[j] = temp
        }
      }
      space = Math.floor(space/2)
  }
  return nums
}

// 改进  四重循环变为三重循环
var sortArray = function(nums) {
    let space = Math.floor(nums.length/2)
    while(space >= 1) {
        //   现在第space个元素就是第一个子序列对应的第二个元素
        for(let i=space; i<nums.length; i++) {
            let temp = nums[i]
            let j
            for(j=i; j-space>=0 && temp < nums[j-space]; j-=space) {
                nums[j] = nums[j-space]
            }
            nums[j] = temp
        }
        space = Math.floor(space/2)
    }
    return nums
}
```



## 数组排序时间空间复杂度速查

|                        算法                        | 时间复杂度 |               |               | 空间复杂度 |
| :------------------------------------------------: | :--------: | :-----------: | :-----------: | :--------: |
|                                                    |    最佳    |     平均      |     最差      |    最差    |
| [快速排序](https://zh.wikipedia.org/wiki/快速排序) | O(nlog⁡(n)) |  O(nlog⁡(n))   |     O(n2)     | O(log⁡(n))  |
| [归并排序](https://zh.wikipedia.org/wiki/归并排序) | O(nlog⁡(n)) |  O(nlog⁡(n))   |  O(nlog⁡(n))   |    O(n)    |
|  [Timsort](http://en.wikipedia.org/wiki/Timsort)   |    O(n)    |  O(nlog⁡(n))   |  O(nlog⁡(n))   |    O(n)    |
|   [堆排序](https://zh.wikipedia.org/wiki/堆排序)   | O(nlog⁡(n)) |  O(nlog⁡(n))   |  O(nlog⁡(n))   |    O(1)    |
| [冒泡排序](https://zh.wikipedia.org/wiki/冒泡排序) |    O(n)    |     O(n2)     |     O(n2)     |    O(1)    |
| [插入排序](https://zh.wikipedia.org/wiki/插入排序) |    O(n)    |     O(n2)     |     O(n2)     |    O(1)    |
| [选择排序](https://zh.wikipedia.org/wiki/选择排序) |   O(n2)    |     O(n2)     |     O(n2)     |    O(1)    |
| [希尔排序](https://zh.wikipedia.org/wiki/希尔排序) |    O(n)    | O((nlog⁡(n))2) | O((nlog⁡(n))2) |    O(1)    |