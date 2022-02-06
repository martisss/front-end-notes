# 栈与队列

## 用栈实现队列

[232. 用栈实现队列](https://leetcode-cn.com/problems/implement-queue-using-stacks/)

```js
var MyQueue = function() {
    this.stackIn = []
    this.stackOut = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function(x) {
    this.stackIn.push(x)
};

/**
 * @return {number}
 */
MyQueue.prototype.pop = function() {
    if(this.stackOut.length) {
        return this.stackOut.pop()
    }
    while(this.stackIn.length) {
        this.stackOut.push(this.stackIn.pop())
    }
    return this.stackOut.pop()
};

/**
 * @return {number}
 */
MyQueue.prototype.peek = function() {
    let x = this.pop()
    this.stackOut.push(x)
    return x
};

/**
 * @return {boolean}
 */
MyQueue.prototype.empty = function() {
    return this.stackIn.length === 0 && this.stackOut.length === 0
};

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */
```



## 用队列实现栈

```js
//用两个队列
var MyStack = function() {
    this.queue1 = []
    this.queue2 = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
    this.queue1.push(x)
};

/**
 * @return {number}
 */
MyStack.prototype.pop = function() {
    if(!this.queue1.length) {
        [this.queue1, this.queue2] = [this.queue2, this.queue1]
    }
    // queue2用作复制，每次queue1弹出item直到只剩一个，返回该item, 相当于是栈顶的元素
    while(this.queue1.length > 1) {
        this.queue2.push(this.queue1.shift())
    }
    return this.queue1.shift()
};

/**
 * @return {number}
 */
MyStack.prototype.top = function() {
    let x = this.pop()
    this.queue1.push(x)
    return x
};

/**
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
    return this.queue1.length === 0 && this.queue2.length === 0
};
```



# 链表

## 单链表

> with dummyHead

```js
class Node {
  constructor(value, next=null) {
    this.value = value
    this.next = next
  }
}

class LinkedList {
  constructor() {
    this.head = new Node(0)
    this.length = 0
  }
  get(pos) {
    if(pos<0 || pos>=this.length) return null
    let cur = this.head
    while(pos+1 > 0) {
      cur = cur.next
      pos--
    }
    return cur.value
  }
  insert(pos, val) {
    if(pos<0 || pos> this.length) return null
    this.length++
    let cur = this.head
    while(pos > 0) {
      cur = cur.next
      pos--
    }
    let newNode = new Node(val)
    newNode.next = cur.next
    cur.next = newNode
  }
  addHead(val) {
    this.insert(0, val)
  }
  addTail(val) {
    this.insert(this.length, val)
  }
  deleteAtIndex(pos) {
    if(pos<0 || pos>=this.length) return null
    let cur = this.head
    this.length--
    while(pos > 0) {
      cur = cur.next
      pos--
    }
    deletedNode = cur.next
    cur.next = cur.next.next
    return deletedNode
  }
  deleteHead(){
    this.deleteAtIndex(0)
  }
  deleteTail() {
    this.deleteAtIndex(this.length-1)
  }
}
```

```js
//用一个队列
var MyStack = function() {
    this.queue = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
    this.queue.push(x)
};

/**
 * @return {number}
 */
MyStack.prototype.pop = function() {
    let len = this.queue.length
    while(len-->1) {
        this.queue.push(this.queue.shift())
    }
    return this.queue.shift()
};

/**
 * @return {number}
 */
MyStack.prototype.top = function() {
    let x = this.pop()
    this.queue.push(x)
    return x
};

/**
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
    return this.queue.length === 0
};
```



## 技巧

后面三个都使用了双指针的技巧,注意体会.

### 反转链表

1. 递归

```js
// 递归
var reverseList = function(head) {
    if(!head || !head.next) return head
    const newNode = reverseList(head.next)
    head.next.next = head
    head.next = null
    return newNode
}
```

2. 迭代

```js
/* var reverseList = function(head) {
    let pre = null
    let cur = head
    while(cur) {
        let next = cur.next
        cur.next = pre
        pre = cur 
        cur = next
    }
    return pre
}; 
```

**反转部分链表**

反转（start, end）之间的链表

```js
function reverse(start, end) {
    let [pre, cur] = [start, start.next]
    while(cur !== end) { //这里的end节点并没有被反转
        let next = cur.next
        cur.next = pre
        pre = cur
        cur = next
    }
}
```

注意: 这里的反转后pre指向反转后链表的第一个节点，原链表的第一个节点变为反转后链表的最后一个节点

### 链表的拼接

#### 两个升序链表的合并

1. 迭代实现

```js
var mergeTwoLists = function(list1, list2) {
    let res = new ListNode(0)
    let cur = res
   let m = list1
   let n = list2
   while(m !== null && n !== null) {
       if(m.val <= n.val) {
           cur.next = m
           m = m.next
       } else {
           cur.next = n
           n = n.next
       }
       cur = cur.next
   }
   cur.next = m === null ? n : m
   return res.next
};
```

2. 递归实现

```js
var mergeTwoLists = function(list1, list2) {
    if(list1 === null) {
        return list2
    } else if(list2 === null) {
        return list1
    } else if(list1.val <= list2.val) {
        list1.next = mergeTwoLists(list1.next, list2)
        return list1
    } else {
        list2.next = mergeTwoLists(list1, list2.next)
        return list2
    }
}
```

#### abcd | 找到待反转链表的前驱和后继

[92. 反转链表 II](https://leetcode-cn.com/problems/reverse-linked-list-ii/)  链表反转的方法同前，注意反转后的拼接过程，看作a, b, c ,d四点， [25. K 个一组翻转链表](https://leetcode-cn.com/problems/reverse-nodes-in-k-group/)中处理方法相同，不同的是要在同一个链表中处理K组

[61. 旋转链表](https://leetcode-cn.com/problems/rotate-list/)其实并没有涉及链表的反转，其实就是链表的拼接，找到倒数第n个节点，修改指针的指向，修改后要注意断开，否则会形成环，另外要注意空链表的处理

### 快慢指针

#### 检测链表中的环

1. 使用哈希表

```js
var hasCycle = function(head) {
    let set = new Set()
    let cur = head
    while(cur) {
        if(set.has(cur)) return true
        set.add(cur)
        cur = cur.next
    }
    return false
};
```

2. 使用快慢指针

   快指针走两步，慢指针走一步，如果有环，快指针先进入环中，慢指针一定会被快指针追上；如果没有环，那么快指针就会先一步到达链表末尾。

   ```js
   var hasCycle = function(head) {
       if(head == null || head.next == null) return false
       // 想象有一个虚拟头节点,慢指针从该节点移动一步到head,快指针移动两步到head.next
       //如果都从head开始,那while就行不下去了,当然也可以使用do-while解决
       let slow = head
       let fast = head.next
       while(slow !== fast) {
           if(fast == null || fast.next == null) return false
           slow = slow.next
           fast = fast.next.next
       }
       return true
   }
   ```

#### 删除链表的倒数第 N 个结点

1. 使用栈

```js
var removeNthFromEnd = function(head, n) {
    // 哨兵节点，不用单独处理头节点
    let dummy = new ListNode(-1, head)
    let arr = []
    let cur = dummy
    while(cur) {
        arr.push(cur)
        cur = cur.next
    }
    for(let i=0; i<n; i++) {
        arr.pop()
    }
    // 得到待删除节点的前驱节点
    let pre = arr.pop()
    pre.next = pre.next.next
    return dummy.next
};
```

2. 双指针

```js
var removeNthFromEnd = function(head, n) {
    // first比second提前n个节点，当first到达最后一个节点时，
    // second 刚好到达倒数第n个节点，
    // 那么让second初始值为dummy，first到达最后一个节点时，
    // second刚好到达待删除节点的前驱节点
    let dummy = new ListNode(-1, head)
    let first = head
    let second = dummy
    for(let i=0; i<n; i++) {
        first = first.next
    }
    while(first) {
        first = first.next
        second = second.next
    }
    second.next = second.next.next
    return dummy.next
}
```

#### [链表的中间结点](https://leetcode-cn.com/problems/middle-of-the-linked-list/)

1. 单指针  (n, 1)

```js
var middleNode = function(head) {
    let cur = head
    let len = 0
    while(cur) {
        len++
        cur = cur.next
    }
    let dummy = new ListNode(-1, head)
    let num = Math.floor(len/2)
    let pre=dummy
    while(num > 0) {
        num--
        pre = pre.next
    }
    return pre.next
};
```

2. 快慢指针

```js
var middleNode = function(head) {
    let slow = head
    let fast = head
    while(fast !== null && fast.next !== null) {
        slow = slow.next
        fast = fast.next.next
    }
    return slow
}
```

#### [25. K 个一组翻转链表](https://leetcode-cn.com/problems/reverse-nodes-in-k-group/)

```js
//  虚拟头节点的使用；反转链表；尤其是在链表内部反转部分链表，以及反转后链表的拼接
var reverseKGroup = function(head, k) {
    let dummy = new ListNode(-1, head)
    let [start, end] = [dummy, dummy.next]
    let count = 0
    //达到数量k的要求后就反转, 剩下的不足k就结束，返回结果
    while(end) {
        count++
        if(count % k === 0) {
            // 真正需要的是start.next 到 end， start被当作哨兵节点
            // 还原成初始状态，start指向前一段的最后一个节点，end指向下一组待翻转链表的第一个节点
            start = reverseList(start, end.next)
            end = start.next  
        } else {
            end = end.next
        }
    }
    return dummy.next

    function reverseList(start, end){
        let [pre, cur] = [start, start.next]
        let first = cur
        while(cur !== end) {
            let next = cur.next
            cur.next = pre
            pre = cur
            cur = next
        }
        // 拼接链表 a b c d
        start.next = pre
        first.next = cur //  同 first.next = cur
        return first
    }
};
```

## todo

> meddium

#### [146. LRU 缓存](https://leetcode-cn.com/problems/lru-cache/)

#### [430. 扁平化多级双向链表](https://leetcode-cn.com/problems/flatten-a-multilevel-doubly-linked-list/)

#### [1600. 皇位继承顺序](https://leetcode-cn.com/problems/throne-inheritance/)

> hard

#### [460. LFU 缓存](https://leetcode-cn.com/problems/lfu-cache/)

# 堆

### todo [剑指 Offer 40. 最小的k个数](https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/)

## 二叉堆实现

```js
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
```

# 位运算

### [136. 只出现一次的数字](https://leetcode-cn.com/problems/single-number/)

> 使用哈希可以达到n的空间与时间复杂度
>
> 使用位运算可以达到线性时间空间复杂度

```js
// 异或运算
// 任何数和0做异或，不变
// 任何数和自身做异或，为0
var singleNumber = function(nums) {
    let ans = 0
    for(let item of nums) {
        ans ^= item
    }
    return ans
};
```

<hr>
### [342. 4的幂](https://leetcode-cn.com/problems/power-of-four/)

```js
var isPowerOfFour = function(n) {
    return n>0 && (n & (n-1)) === 0 && (n % 3 === 1)
};
// var isPowerOfFour = function(n) {
//     return n>0 && (n & (n-1)) === 0 && (n & 0xaaaaaaaa) === 0
// };
```

#### [231. 2 的幂](https://leetcode-cn.com/problems/power-of-two/)

```js
var isPowerOfTwo = function(n) {
    return n > 0 && (n & (n-1)) === 0
};
var isPowerOfTwo = function(n) {
    return n > 0 && (n & (-n)) === n
};
```

#### [面试题 01.01. 判定字符是否唯一](https://leetcode-cn.com/problems/is-unique-lcci/)

```js
//注意位运算符优先级
var isUnique = function(astr) {
    let mark = 0
    for(let c of astr) {
        let k = c.charCodeAt() - 'a'.charCodeAt()
        if((mark & (1 << k)) !== 0) {
            return false
        } else {
            mark |= (1 << k)
        }
    }
    return true
}
```

> 利用异或

### [389. 找不同](https://leetcode-cn.com/problems/find-the-difference/)

```js
 /* 位运算 */
var findTheDifference = function(s, t) {
    let mark = 0
    for(let c of s) {
        mark ^= c.charCodeAt()
    }
    for(let c of t) {
        mark ^= c.charCodeAt()
    }
    return String.fromCharCode(mark)
};
```



***n* & (*n*−1)**  运算结果恰为把 n 的二进制位中的最低位的 1变为 0，使用 

:question:判断是否是2的幂

1. `n & (n−1) === 0  `

2. `n & (-n) = n`

3. 判断 n 是否是 2^30 的约数

   > ```js
   > var isPowerOfTwo = function(n) {
   >     const BIG = 1 << 30;
   >     return n > 0 && BIG % n === 0;
   > };
   > ```

:question:二进制加减法![image-20220203134919525](D:\NOTES\leetcode\leetcode.assets\image-20220203134919525.png)

:question:判断a的第k位数字是0是1； 将a的第k位数字赋值为1

a & (1<<k) 

a | (1<<k) 

# 滑动窗口

## 窗口大小不变

### [643. 子数组最大平均数 I](https://leetcode-cn.com/problems/maximum-average-subarray-i/)

> 给你一个由 `n` 个元素组成的整数数组 `nums` 和一个整数 `k` 。
>
> 请你找出平均数最大且 **长度为 `k`** 的连续子数组，并输出该最大平均数。
>
> 任何误差小于 `10-5` 的答案都将被视为正确答案。
>
> ```js
> var findMaxAverage = function(nums, k) {
>     let sum = 0
>     for(let i=0; i<k; i++) {
>         sum += nums[i]
>     }
>     // 维护一个长度为k的滑动窗口
>     // 通过一次遍历求得连续子数组的和，更新最大值
>     let max = sum
>     for(let i=k; i<nums.length; i++) {
>         sum = sum - nums[i-k] + nums[i]
>         max = Math.max(sum, max)
>     }
>     return max/k
> };
> ```

### [1423. 可获得的最大点数](https://leetcode-cn.com/problems/maximum-points-you-can-obtain-from-cards/)

>  几张卡牌 **排成一行**，每张卡牌都有一个对应的点数。点数由整数数组 `cardPoints` 给出。
>
> 每次行动，你可以从行的开头或者末尾拿一张卡牌，最终你必须正好拿 `k` 张卡牌。
>
> 你的点数就是你拿到手中的所有卡牌的点数之和。
>
> 给你一个整数数组 `cardPoints` 和整数 `k`，请你返回可以获得的最大点数。
>
> ```js
> var maxScore = function(cardPoints, k) {
>     let sum = 0
>     let n = cardPoints.length - k
>     for(let i=0; i < n; i++) {
>         sum += cardPoints[i]
>     }
>     let minSum = sum
>     for(let i=n; i<cardPoints.length; i++) {
>         sum += cardPoints[i] - cardPoints[i-n]
>         minSum = Math.min(minSum, sum)
>     }
>     const total = cardPoints.reduce((a,b) => a+b, 0)
>     return total - minSum
> };
> ```

### [219. 存在重复元素 II](https://leetcode-cn.com/problems/contains-duplicate-ii/)

> 给你一个整数数组 `nums` 和一个整数 `k` ，判断数组中是否存在两个 **不同的索引** `i` 和 `j` ，满足 `nums[i] == nums[j]` 且 `abs(i - j) <= k` 。如果存在，返回 `true` ；否则，返回 `false` 。
>
>  ```js
>  // 滑动窗口
>  var containsNearbyDuplicate = function(nums, k) {
>      let set = new Set()
>      // abs(i-j) <= k 维护一个长度为k+1的滑动窗口
>      for(let i=0; i<nums.length; i++) {
>          if(i>k) {
>              set.delete(nums[i-k-1])
>          }
>          if(set.has(nums[i])) return true
>          set.add(nums[i])
>      }
>      return false
>  };
>  
>  // 哈希
>  var containsNearbyDuplicate = function(nums, k) {
>      let map = new Map()
>      for(let i=0; i<nums.length; i++) {
>          if(map.has(nums[i]) && Math.abs(i-map.get(nums[i]) <= k)) return true
>          map.set(nums[i], i)
>      }
>      return false
>  }
>  ```

### [220. 存在重复元素 III](https://leetcode-cn.com/problems/contains-duplicate-iii/)

**todo**

> 给你一个整数数组 `nums` 和两个整数 `k` 和 `t` 。请你判断是否存在 **两个不同下标** `i` 和 `j`，使得 `abs(nums[i] - nums[j]) <= t` ，同时又满足 `abs(i - j) <= k` 。
>
> 如果存在则返回 `true`，不存在返回 `false`。
>
> ```js
> ```
>
> 

## 窗口大小变化

### 模板

```java
def findSubArray(nums):
    N = len(nums) # 数组/字符串长度
    left, right = 0, 0 # 双指针，表示当前遍历的区间[left, right]，闭区间
    sums = 0 # 用于统计 子数组/子区间 是否有效，根据题目可能会改成求和/计数
    res = 0 # 保存最大的满足题目要求的 子数组/子串 长度
    while right < N: # 当右边的指针没有搜索到 数组/字符串 的结尾
        sums += nums[right] # 增加当前右边指针的数字/字符的求和/计数
        while 区间[left, right]不符合题意：# 此时需要一直移动左指针，直至找到一个符合题意的区间
            sums -= nums[left] # 移动左指针前需要从counter中减少left位置字符的求和/计数
            left += 1 # 真正的移动左指针，注意不能跟上面一行代码写反
        # 到 while 结束时，我们找到了一个符合题意要求的 子数组/子串
        res = max(res, right - left + 1) # 需要更新结果
        right += 1 # 移动右指针，去探索新的区间
    return res
```

滑动窗口中用到了左右两个指针，它们移动的思路是：**以右指针作为驱动，拖着左指针向前走。右指针每次只移动一步，而左指针在内部 while 循环中每次可能移动多步。右指针是主动前移，探索未知的新区域；左指针是被迫移动，负责寻找满足题意的区间。**

```js
模板的整体思想是：

定义两个指针 left 和 right 分别指向区间的开头和结尾，注意是闭区间；定义 sums 用来统计该区间内的各个字符出现次数；
第一重 while 循环是为了判断 right 指针的位置是否超出了数组边界；当 right 每次到了新位置，需要增加 right 指针的求和/计数；
第二重 while 循环是让 left 指针向右移动到 [left, right] 区间符合题意的位置；当 left 每次移动到了新位置，需要减少 left 指针的求和/计数；
在第二重 while 循环之后，成功找到了一个符合题意的 [left, right] 区间，题目要求最大的区间长度，因此更新 res 为 max(res, 当前区间的长度) 。
right 指针每次向右移动一步，开始探索新的区间。
```



#### [594. 最长和谐子序列](https://leetcode-cn.com/problems/longest-harmonious-subsequence/)



# 二叉树

## **:sparkles: 二叉树：递归函数究竟什么时候需要返回值，什么时候不要返回值？:sparkles:**

> :man_playing_handball: 递归函数返回值为bool类型是为了搜索一条边，没有返回值是搜索整棵树。

> 递归函数有返回值就是要遍历某一条边，但有返回值也要看如何处理返回值
>
> > :man_playing_handball:**如果递归函数有返回值，如何区分要搜索一条边，还是搜索整个树呢？**
> >
> > 搜索一条边的写法：
> >
> > ```text
> > if (递归函数(root->left)) return ;
> > 
> > if (递归函数(root->right)) return ;
> > ```
> >
> > 搜索整个树写法：
> >
> > ```text
> > left = 递归函数(root->left);
> > right = 递归函数(root->right);
> > left与right的逻辑处理;
> > ```


 **在递归函数有返回值的情况下：如果要搜索一条边，递归函数返回值不为空的时候，立刻返回，如果搜索整个树，直接用一个变量left、right接住返回值，这个left、right后序还有逻辑处理的需要，也就是后序遍历中处理中间节点的逻辑（也是回溯）**。

## **遍历方式**

### 递归

>  前序遍历：

```javascript
var preorderTraversal = function(root) {
 let res=[];
 const dfs=function(root){
     if(root===null)return ;
     //先序遍历所以从父节点开始
     res.push(root.val);
     //递归左子树
     dfs(root.left);
     //递归右子树
     dfs(root.right);
 }
 //只使用一个参数 使用闭包进行存储结果
 dfs(root);
 return res;
};
```

>  中序遍历

```javascript
var inorderTraversal = function(root) {
    let res=[];
    const dfs=function(root){
        if(root===null){
            return ;
        }
        dfs(root.left);
        res.push(root.val);
        dfs(root.right);
    }
    dfs(root);
    return res;
};
```

>  后序遍历

```javascript
var postorderTraversal = function(root) {
    let res=[];
    const dfs=function(root){
        if(root===null){
            return ;
        }
        dfs(root.left);
        dfs(root.right);
        res.push(root.val);
    }
    dfs(root);
    return res;
};
```

### 迭代

```js
前序遍历:

// 入栈 右 -> 左
// 出栈 中 -> 左 -> 右
var preorderTraversal = function(root, res = []) {
    if(!root) return res;
    const stack = [root];
    let cur = null;
    while(stack.length) {
        cur = stack.pop();
        res.push(cur.val);
        cur.right && stack.push(cur.right);
        cur.left && stack.push(cur.left);
    }
    return res;
};

中序遍历:

// 入栈 左 -> 右
// 出栈 左 -> 中 -> 右

var inorderTraversal = function(root, res = []) {
    const stack = [];
    let cur = root;
    while(stack.length || cur) {
        if(cur) {
            stack.push(cur);
            // 左
            cur = cur.left;
        } else {
            // --> 弹出 中
            cur = stack.pop();
            res.push(cur.val); 
            // 右
            cur = cur.right;
        }
    };
    return res;
};

后序遍历:

// 入栈 左 -> 右
// 出栈 中 -> 右 -> 左 结果翻转

var postorderTraversal = function(root, res = []) {
    if (!root) return res;
    const stack = [root];
    let cur = null;
    do {
        cur = stack.pop();
        res.push(cur.val);
        cur.left && stack.push(cur.left);
        cur.right && stack.push(cur.right);
    } while(stack.length);
    return res.reverse();
};
```

### 迭代统一形式

> 前序遍历统一迭代法

```js
// 前序遍历：中左右
// 压栈顺序：右左中

var preorderTraversal = function(root, res = []) {
    const stack = [];
    if (root) stack.push(root);
    while(stack.length) {
        const node = stack.pop();
        if(!node) {
            res.push(stack.pop().val);
            continue;
        }
        if (node.right) stack.push(node.right); // 右
        if (node.left) stack.push(node.left); // 左
        stack.push(node); // 中
        stack.push(null);
    };
    return res;
};
```

> 中序遍历统一迭代法

```js
//  中序遍历：左中右
//  压栈顺序：右中左
 
var inorderTraversal = function(root, res = []) {
    const stack = [];
    if (root) stack.push(root);
    while(stack.length) {
        const node = stack.pop();
        if(!node) {
            res.push(stack.pop().val);
            continue;
        }
        if (node.right) stack.push(node.right); // 右
        stack.push(node); // 中
        stack.push(null);
        if (node.left) stack.push(node.left); // 左
    };
    return res;
};
```

> 后序遍历统一迭代法

```js
// 后续遍历：左右中
// 压栈顺序：中右左
 
var postorderTraversal = function(root, res = []) {
    const stack = [];
    if (root) stack.push(root);
    while(stack.length) {
        const node = stack.pop();
        if(!node) {
            res.push(stack.pop().val);
            continue;
        }
        stack.push(node); // 中
        stack.push(null);
        if (node.right) stack.push(node.right); // 右
        if (node.left) stack.push(node.left); // 左
    };
    return res;
};
```

### 层序遍历

BFS模板

```js
const visited = {}
function bfs() {
	let q = new Queue()
	q.push(初始状态)
	while(q.length) {
		let i = q.pop()
        if (visited[i]) continue
        if (i 是我们要找的目标) return 结果
		for (i的可抵达状态j) {
			if (j 合法) {
				q.push(j)
			}
		}
    }
    return 没找到
}

```



带有层标记信息 (相当于对距离指定节点距离为0的节点进行操作) => **层序遍历**

```javascript
var levelOrder = function(root) {
    //二叉树的层序遍历
    let res=[],queue=[];
    queue.push(root);
    if(root===null){
        return res;
    }
    while(queue.length!==0){
        // 记录当前层级节点数
        let length=queue.length;
        //存放每一层的节点 
        let curLevel=[];
        for(let i=0;i<length;i++){
            let node=queue.shift();
            curLevel.push(node.val);  // 这一步就对距离指定节点为0的节点进行了操作
            // 存放当前层下一层的节点
            node.left&&queue.push(node.left);
            node.right&&queue.push(node.right);
        }
        //把每一层的结果放到结果数组
        res.push(curLevel);
    }
    return res;
};
```

ps：特别地，需要求距离某个节点距离等于k的所有节点

```js
class Solution:
    def bfs(k):
        # 使用双端队列，而不是数组。因为数组从头部删除元素的时间复杂度为 N，双端队列的底层实现其实是链表。
        queue = collections.deque([root])
        # 记录层数
        steps = 0
        # 需要返回的节点
        ans = []
        # 队列不空，生命不止！
        while queue:
            size = len(queue)
            # 遍历当前层的所有节点
            for _ in range(size):
                node = queue.popleft()
                if (step == k) ans.append(node)
                if node.right:
                    queue.append(node.right)
                if node.left:
                    queue.append(node.left)
            # 遍历完当前层所有的节点后 steps + 1
            steps += 1
        return ans

```



## 题型

### 搜索类

两种解法： DFS 和 BFS

所有搜索类的题目只要把握三个核心点，即**开始点**，**结束点** 和 **目标**即可。

#### DFS搜索

DFS 搜索类的基本套路就是从入口开始做 dfs，然后在 dfs 内部判断是否是结束点，这个结束点通常是**叶子节点**或**空节点**

```js
# 其中 path 是树的路径， 如果需要就带上，不需要就不带
def dfs(root, path):
    # 空节点
    if not root: return
    # 叶子节点
    if not root.left and not root.right: return
    path.append(root)
    # 逻辑可以写这里，此时是前序遍历
    dfs(root.left)
    dfs(root.right)
    # 需要弹出，不然会错误计算。
    # 比如对于如下树：
    """
              5
             / \
            4   8
           /   / \
          11  13  4
         /  \    / \
        7    2  5   1
    """
    # 如果不 pop，那么 5 -> 4 -> 11 -> 2 这条路径会变成 5 -> 4 -> 11 -> 7 -> 2，其 7 被错误地添加到了 path

    path.pop()
    # 逻辑也可以写这里，此时是后序遍历

    return 你想返回的数据
```

#### BFS 搜索	

BFS模板

```js
const visited = {}
function bfs() {
	let q = new Queue()
	q.push(初始状态)
	while(q.length) {
		let i = q.pop()
        if (visited[i]) continue
        if (i 是我们要找的目标) return 结果
		for (i的可抵达状态j) {
			if (j 合法) {
				q.push(j)
			}
		}
    }
    return 没找到
}

```



1. 带有层标记信息 (相当于对距离指定节点距离为0的节点进行操作)

```javascript
var levelOrder = function(root) {
    //二叉树的层序遍历
    let res=[],queue=[];
    queue.push(root);
    if(root===null){
        return res;
    }
    while(queue.length!==0){
        // 记录当前层级节点数
        let length=queue.length;
        //存放每一层的节点 
        let curLevel=[];
        for(let i=0;i<length;i++){
            let node=queue.shift();
            curLevel.push(node.val);  // 这一步就对距离指定节点为0的节点进行了操作
            // 存放当前层下一层的节点
            node.left&&queue.push(node.left);
            node.right&&queue.push(node.right);
        }
        //把每一层的结果放到结果数组
        res.push(curLevel);
    }
    return res;
};
```

ps：特别地，需要求距离某个节点距离等于k的所有节点

```js
class Solution:
    def bfs(k):
        # 使用双端队列，而不是数组。因为数组从头部删除元素的时间复杂度为 N，双端队列的底层实现其实是链表。
        queue = collections.deque([root])
        # 记录层数
        steps = 0
        # 需要返回的节点
        ans = []
        # 队列不空，生命不止！
        while queue:
            size = len(queue)
            # 遍历当前层的所有节点
            for _ in range(size):
                node = queue.popleft()
                if (step == k) ans.append(node)
                if node.right:
                    queue.append(node.right)
                if node.left:
                    queue.append(node.left)
            # 遍历完当前层所有的节点后 steps + 1
            steps += 1
        return ans

```



1. 不带层标记信息

```js
class Solution:
    def bfs(k):
        # 使用双端队列，而不是数组。因为数组从头部删除元素的时间复杂度为 N，双端队列的底层实现其实是链表。
        queue = collections.deque([root])
        # 队列不空，生命不止！
        while queue:
            node = queue.popleft()
            # 由于没有记录 steps，因此我们肯定是不需要根据层的信息去判断的。否则就用带层的模板了。
            if (node 是我们要找到的) return node
            if node.right:
                queue.append(node.right)
            if node.left:
                queue.append(node.left)
        return -1
```

### 二叉树构建

#### 普通二叉树的构建

1. 根据DFS的结果构建

注意分界点的选择，主要思路是首先找到根节点，然后用根节点去分割另外一个数组，然后进行递归，时间空间复杂度均为n

- [105. 从前序与中序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
- [106. 从中序与后序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
- [889. 根据前序和后序遍历构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)

2. 根据BFS的结果构建

[剑指 Offer 37. 序列化二叉树](https://leetcode-cn.com/problems/xu-lie-hua-er-cha-shu-lcof/)

```js
var serialize = function(root) {
    if(!root) return ''
    let queue = [root]
    let res = []
    while(queue.length) {
        let node = queue.shift()
        // 要注意记录树的完整信息，不要漏掉空节点
        if(node) {
            res.push(node.val)
            queue.push(node.left)
            queue.push(node.right)
        } else {
            res.push('null')
        }
    }
    return res.join(',')
}

var deserialize = function(data) {
    if(data === '') return null
    let arr = data.split(',')
    let i = 1
    let root = new TreeNode(parseInt(arr[0]))
    let queue = [root]
    while(queue.length) {
        let node = queue.shift()
        if(arr[i] !== 'null') {
            node.left = new TreeNode(arr[i])
            queue.push(node.left)
        } else node.left = null
        i++
        if(arr[i] !== 'null') {
            node.right = new TreeNode(arr[i])
            queue.push(node.right)
        } else node.right = null
        i++
    }
    return root
}
```

> 前序

```js
var serialize = function(root) {
    return rserialize(root, '')
};

var deserialize = function(data) {
    let arr = data.split(',')
    return rdeserialize(arr)
};


const rserialize = (root, str) => {
    if (root === null) {
        str += 'None,';
    } else {
        str += root.val + '' + ',';
        str = rserialize(root.left, str);
        str = rserialize(root.right, str);
    }
    return str
}

const rdeserialize = (dataList) => {
    if (dataList[0] === "None") {
        dataList.shift();
        return null;
    }
    const root = new TreeNode(parseInt(dataList[0]));
    dataList.shift();
    root.left = rdeserialize(dataList);
    root.right = rdeserialize(dataList);
    return root;
}
```

#### 二叉搜索树构建

[1008. 前序遍历构造二叉搜索树](https://leetcode-cn.com/problems/construct-binary-search-tree-from-preorder-traversal/)

### 二叉树的修改 

> 本质上是删除叶子节点

[1325. 删除给定值的叶子节点](https://leetcode-cn.com/problems/delete-leaves-with-a-given-value/)

```js
var removeLeafNodes = function(root, target) {
    if(!root) return null
    root.left = removeLeafNodes(root.left, target)
    root.right = removeLeafNodes(root.right, target)
    if(!root.left && !root.right && root.val === target) return null
    return root
}
```

[814. 二叉树剪枝](https://leetcode-cn.com/problems/binary-tree-pruning/)

```js
var pruneTree = function(root) {
    if(root === null) return null
    root.left = pruneTree(root.left)
    root.right = pruneTree(root.right)
    if(!root.left && !root.right && root.val === 0) return null
    return root
};
```

> 改变节点直接的关系

 [116. 填充每个节点的下一个右侧节点指针](https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node/)

```js
// 层次遍历
// 将每一层加入队列之后不断弹出节点，并不断更新pre 与 cur，
// 同时将pre.next指向cur
var connect = function(root) {
    if(!root) return root
    let queue = [root]
    while(queue.length) {
        let size = queue.length
        let pre = null
        let cur = null
        for(let i=0; i<size; i++) {
            if(i===0) {
                pre = queue.shift()
                cur = pre
            } else {
                cur = queue.shift()
                pre.next = cur
                pre = pre.next
            }
            cur.left && queue.push(cur.left)
            cur.right && queue.push(cur.right)
        }
    }
    return root
};


// 时间复杂度O(n), 空间复杂度O(1)
var connect = function(root) {
    if(!root) return root
    let leftmost = root
    while(leftmost.left) {
        let head = leftmost
        // 可以通过该层的next指针遍历该层，
        // 遍历的过程中建立下一层节点之间的关系
        while(head) {
            head.left.next = head.right
            if(head.next) {
                head.right.next = head.next.left
            }
            head = head.next
        }
        leftmost = leftmost.left
    }
    return root
}
```



### todo



 [450. 删除二叉搜索树中的节点](https://leetcode-cn.com/problems/delete-node-in-a-bst/) 

 [669. 修剪二叉搜索树](https://leetcode-cn.com/problems/trim-a-binary-search-tree/)



> 算法需要，自己修改

 [863. 二叉树中所有距离为 K 的结点](https://leetcode-cn.com/problems/all-nodes-distance-k-in-binary-tree/)

## 重要概念

### 二叉搜索树

- 若左子树不空，则左子树上所有节点的值均小于它的根节点的值；
- 若右子树不空，则右子树上所有节点的值均大于它的根节点的值；
- 左、右子树也分别为二叉排序树；
- 没有键值相等的节点。

注意：平衡二叉树**中序遍历**是有序，遍历的值单调递增

### 平衡二叉树

**平衡二叉树**（Balanced Binary Tree）又被称为AVL树（有别于AVL算法），且具有以下性质：它是**一 棵空树**或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树。这个方案很好的解决了**二叉查找树退化成链表**的问题，把插入，查找，删除的时间复杂度最好情况和最坏情况都维持在O(logN)



### 完全二叉树

完全二叉树不一定是满二叉树，而满二叉树一定是完全二叉树，完全二叉树从根节点到倒数第二层都满足满二叉树的定义，只是最底下一层没有填满，且这一层的所有结点都靠左。

给完全二叉树编号，这样父子之间就可以通过编号轻松求出。给所有节点从左到右从上到下依次从 1 开始编号。那么已知一个节点的编号是 i，那么其左子节点就是 2 _*i，右子节点就是 2 *i + 1，父节点就是 i / 2。

[222. 完全二叉树的节点个数](https://leetcode-cn.com/problems/count-complete-tree-nodes/)

```js
var countNodes = function(root) {
    /* 初始值设置为0是为了后面求值方便 */
    //设根节点的深度为1，总深度为n, 节点个数为2^n-1
    //如果是满二叉树直接返回节点个数,如果不是满二叉树，继续递归其左右节点
    if(!root) return 0
    let [leftlength, rightlength] = [0, 0]
    let left = root.left
    let right = root.right
    while(left) {
        left = left.left
        leftlength++
    }
    while(right) {
        right = right.right
        rightlength++
    }
    // 是满二叉树
    if(leftlength === rightlength) {
        return (2 << leftlength) - 1
    }
    // 不是满二叉树
    return 1 + countNodes(root.left) + countNodes(root.right)
}
```

### 路径

[124. 二叉树中的最大路径和](https://leetcode-cn.com/problems/binary-tree-maximum-path-sum/)

:sparkles:**树的题目，基本都是考察递归思想的。因此我们需要思考如何去定义我们的递归函数**，在这里我定义了一个递归函数，它的功能是，`返回以当前节点为根节点的MaxPath`但是有两个条件:

1. 根节点必须选择
2. 左右子树只能选择一个

````
### 解题思路
树的题目大多涉及到递归，需要思考如何设计递归函数
dfs函数的作用：返回以给定节点为根节点的二叉树最大路径和
需要注意：
- 最大路径可以从树中任意节点出发
- 路径至少包含一个节点
- 以某个节点为根节点的最大路径和有可能为负数。因为`-1000 <= Node.val <= 1000`
### 代码

//  从任意节点出发 => 选择记录max全局最大值
// dfs记录以当前节点为根节点的最大路径和，递归左右子节点，更新全局最大值的同时返回以当前节点为根节点的最大路径和
var maxPathSum = function(root) {
    let max = -Infinity
    const dfs = (root) => {
        if(!root) return 0
        let left = dfs(root.left) //以左节点为根节点的二叉树最大路径和
        let right = dfs(root.right) // 以右节点为根节点的二叉树最大路径和
        max = Math.max(max, Math.max(left, 0) + Math.max(right, 0)+root.val) // 在对子节点进行递归的过程中可能已经出现了原二叉树的最大路径和，因此需要进行比较，更新最大路径和max
        // 此外，dfs的功能就是计算以当前节点为根节点的最大路径和，因此将 当前节点的值（即root.val） 与 以当前节点的子节点为根节点的子树的最大路径和（即 Math.max(left, right)）返回
        return Math.max(left, right, 0) + root.val
    }
    dfs(root)
    return max
};
```
````

#### [437. 路径总和 III](https://leetcode-cn.com/problems/path-sum-iii/)

> 给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。
>
> 路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
>
>  
>
> 示例 1：![img](https://assets.leetcode.com/uploads/2021/04/09/pathsum3-1-tree.jpg)
>
> 
>
> 输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
> 输出：3
> 解释：和等于 8 的路径有 3 条，如图所示。
> 示例 2：
>
> 输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
> 输出：3
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/path-sum-iii

```js
var pathSum = function(root, targetSum) {
    // dfs计算以当前节点为根节点的二叉树里节点值之和等于targetSum的路径的数目
    const dfs = (root, target) => {
        let num = 0
        if(!root ) return 0
        // 路径不需要在叶子节点结束，只需要路径方向向下，满足targetSum的要求
        if(root.val === target) {
            num++
        }
        num += dfs(root.left, target - root.val)
        num += dfs(root.right, target - root.val)
        return num
    }
    if(!root) return 0
    // 因为路径不需要从根节点开始，因此递归地对子节点调用pathSum方法
    let count = dfs(root, targetSum)
    count += pathSum(root.left, targetSum)
    count +=  pathSum(root.right, targetSum)
    return  count
};
```



### 距离 todo

[834.树中距离之和](https://leetcode-cn.com/problems/sum-of-distances-in-tree/description/)

[863.二叉树中所有距离为 K 的结点](https://leetcode-cn.com/problems/all-nodes-distance-k-in-binary-tree/description/)

## 技巧

### 双递归

**如果题目有类似，任意节点开始 xxxx 或者所有 xxx**这样的说法，就可以考虑使用双递归。但是如果递归中有重复计算，则可以使用双递归 + 记忆化 或者直接单递归。

一个典型的加法双递归

```js
def dfs_inner(root):
    # 这里写你的逻辑，就是前序遍历
    dfs_inner(root.left)
    dfs_inner(root.right)
    # 或者在这里写你的逻辑，那就是后序遍历
def dfs_main(root):
    return dfs_inner(root) + dfs_main(root.left) + dfs_main(root.right)

```



[面试题 04.12. 求和路径](https://leetcode-cn.com/problems/paths-with-sum-lcci/)

```js
// 将每个节点都当作根节点进行递归
function dfs(root, sum) {
    if(!root) return 0
    sum -= root.val
    return (sum === 0) + dfs(root.left, sum) + dfs(root.right, sum)
}

var pathSum = function(root, sum) {
    if(!root) return 0
    // 选择当前节点，不选择当前节点
    return dfs(root, sum) + pathSum(root.left, sum) + pathSum(root.right, sum)
}
```

### 前后序

- 大多数树的题使用后序遍历比较简单，并且大多需要依赖左右子树的返回值。比如 [1448. 统计二叉树中好节点的数目](https://leetcode-cn.com/problems/count-good-nodes-in-binary-tree/)
- 不多的问题需要前序遍历，而前序遍历通常要结合参数扩展技巧。比如 [1022. 从根到叶的二进制数之和](https://leetcode-cn.com/problems/sum-of-root-to-leaf-binary-numbers/)
- 如果能使用参数和节点本身的值来决定什么应该是**传递给它子节点的参数，那就用前序遍历**。
- 如果对于树中的任意一个节点，知**道它子节点的答案，能计算出当前节点的答案，那就用后序遍历**。
- 如果遇到二叉搜索树则考虑**中序遍历**

#### [1022. 从根到叶的二进制数之和](https://leetcode-cn.com/problems/sum-of-root-to-leaf-binary-numbers/)

> 给出一棵二叉树，其上每个结点的值都是 0 或 1 。每一条从根到叶的路径都代表一个从最高有效位开始的二进制数。例如，如果路径为 0 -> 1 -> 1 -> 0 -> 1，那么它表示二进制数 01101，也就是 13 。
>
> 对树上的每一片叶子，我们都要找出从根到该叶子的路径所表示的数字。
>
> 返回这些数字之和。题目数据保证答案是一个 32 位 整数。
>
>  
>
> 示例 1：![img](https://assets.leetcode.com/uploads/2019/04/04/sum-of-root-to-leaf-binary-numbers.png)
>

> 前序

```js
var sumRootToLeaf = function(root) {
    let sum = 0
    const dfs = (root, pre) => {
        pre = (pre << 1) + root.val
        if(!root.left && !root.right) {
            sum += pre
        }
        root.left && dfs(root.left, pre)
        root.right && dfs(root.right, pre)
    }
    dfs(root, 0)
    return sum
};
```



[563. 二叉树的坡度](https://leetcode-cn.com/problems/binary-tree-tilt/)

### 边界

### 参数扩展

一个最简单的 dfs 通常是下面这样：

```
def dfs(root):
    # do something
```

而有时候，我们需要 dfs 携带更多的有用信息。典型的有以下三种情况：

1. 携带父亲或者爷爷的信息。

```js
def dfs(root, parent):
    if not root: return
    dfs(root.left, root)
    dfs(root.right, root)
```

2. 携带路径信息，可以是路径和或者具体的路径数组等。

路径和：

```js
def dfs(root, path_sum):
    if not root:
        # 这里可以拿到根到叶子的路径和
        return path_sum
    dfs(root.left, path_sum + root.val)
    dfs(root.right, path_sum + root.val)
```

路径：

```js
def dfs(root, path):
    if not root:
        # 这里可以拿到根到叶子的路径
        return path
    path.append(root.val)
    dfs(root.left, path)
    dfs(root.right, path)
    # 撤销
    path.pop()
```

3. 二叉搜索树的搜索题大多数都需要扩展参考，甚至怎么扩展都是固定的。

#### todo [783. 二叉搜索树节点最小距离](https://leetcode-cn.com/problems/minimum-distance-between-bst-nodes/)

二叉搜索树的搜索总是将最大值和最小值通过参数传递到左右子树，类似 `dfs(root, lower, upper)`，然后在递归过程更新最大和最小值即可。

对于入口是任意节点的题目，我们都可以方便地使用**双递归**来完成，关于这个，我会在**七个技巧中的单/双递归部分**展开。

对于这种交错类的题目，一个好用的技巧是使用 -1 和 1 来记录方向，这样我们就可以通过乘以 -1 得到另外一个方向。

> [886. 可能的二分法](https://github.com/azl397985856/leetcode/blob/master/problems/886.possible-bipartition.md) 和 [785. 判断二分图](https://github.com/azl397985856/leetcode/blob/master/problems/785.is-graph-bipartite.md) 都用了这个技巧。

### 返回元组/列表

通常，dfs 函数的返回值是一个单值。而有时候为了方便计算，会返回一个数组或者元组

#### todo [865. 具有所有最深节点的最小子树](https://leetcode-cn.com/problems/smallest-subtree-with-all-the-deepest-nodes/)

#### todo [1530.好叶子节点对的数量](https://leetcode-cn.com/problems/number-of-good-leaf-nodes-pairs/description/)

## 求二叉树的属性

[二叉树：是否对称](https://programmercarl.com/0101.对称二叉树.html)

- 递归：后序，递归比较左右节点
- 迭代：将对应节点放入队列或者栈中再进行比较

[二叉树：求最大深度](https://programmercarl.com/0104.二叉树的最大深度.html)

- 递归：后序，注意最小深度的定义，一定要是叶子节点，方法和求深度类似
- 层序遍历

[二叉树：求有多少个节点](https://programmercarl.com/0222.完全二叉树的节点个数.html)

- 递归：后序，通过递归函数的返回值计算节点数量
- 层序遍历
- 如果是完全二叉树的话，可以利用其性质，完全二叉树只有两种情况，**情况一：就是满二叉树，情况二：最后一层叶子节点没有满。**

[二叉树：是否平衡](https://programmercarl.com/0110.平衡二叉树.html)

求深度一般用前序遍历，从上到下，求高度一般用后序遍历，从下到上，但是二叉树的最大深度和也就是根节点的最大高度。

> 二叉树前序遍历求二叉树最大深度

```js
class Solution {
public:
    int result;
    void getDepth(TreeNode* node, int depth) {
        result = depth > result ? depth : result; // 中
        if (node->left == NULL && node->right == NULL) return ;
        if (node->left) { // 左
            getDepth(node->left, depth + 1);
        }
        if (node->right) { // 右
            getDepth(node->right, depth + 1);
        }
        return ;
    }
    int maxDepth(TreeNode* root) {
        result = 0;
        if (root == 0) return result;
        getDepth(root, 1);
        return result;
    }
};
```

:boom:注意上述问题中后序遍历&& 递归的使用



[二叉树：找所有路径](https://programmercarl.com/0257.二叉树的所有路径.html)

- 递归：前序，方便让父节点指向子节点，涉及回溯处理根节点到叶子的所有路径，其中隐藏着回溯

- 迭代：一个栈模拟递归，一个栈来存放对应的遍历路径

[二叉树：求左叶子之和](https://programmercarl.com/0404.左叶子之和.html)

- 递归：后序，必须三层约束条件，才能判断是否是左叶子。
- 迭代：

[二叉树：求左下角的值](https://programmercarl.com/0513.找树左下角的值.html)

- 递归：顺序无所谓，优先左孩子搜索，同时找深度最大的叶子节点。
- 迭代：层序遍历找最后一行最左边

[二叉树：求路径总和](https://programmercarl.com/0112.路径总和.html)

- 递归：顺序无所谓，递归函数返回值为bool类型是为了搜索一条边，没有返回值是搜索整棵树。
- 迭代：栈里元素不仅要记录节点指针，还要记录从头结点到该节点的路径数值总和




## 二叉树的修改与构造

[翻转二叉树](https://programmercarl.com/0226.翻转二叉树.html)

- 递归：前序，交换左右孩子
- 迭代：直接模拟前序遍历

[构造二叉树](https://programmercarl.com/0106.从中序与后序遍历序列构造二叉树.html)

- 递归：前序，重点在于找分割点，分左右区间构造
- 迭代：比较复杂，意义不大

[构造最大的二叉树](https://programmercarl.com/0654.最大二叉树.html)

- 递归：前序，分割点为数组最大值，分左右区间构造
- 迭代：比较复杂，意义不大

[合并两个二叉树](https://programmercarl.com/0617.合并二叉树.html)

- 递归：前序，同时操作两个树的节点，注意合并的规则
- 迭代：使用队列，类似层序遍历

## 求二叉搜索树的属性

[二叉搜索树中的搜索](https://programmercarl.com/0700.二叉搜索树中的搜索.html)

- 递归：二叉搜索树的递归是有方向的，利用其性质进行递归 
- 迭代：因为有方向，所以迭代法很简单

[是不是二叉搜索树](https://programmercarl.com/0098.验证二叉搜索树.html)

- 递归：中序，相当于变成了判断一个序列是不是递增的，:sparkle:**pre指针**:sparkle:
- 迭代：模拟中序，逻辑相同

[求二叉搜索树的众数](https://programmercarl.com/0501.二叉搜索树中的众数.html)

- 递归：中序，利用二叉搜索树的性质，清空结果集的技巧，遍历一遍便可求众数集合
- 如果不是二叉搜索树，就使用普通遍历方式 + map

[二叉搜索树转成累加树](https://programmercarl.com/0538.把二叉搜索树转换为累加树.html)

- 递归：中序，双指针操作累加,:sparkle:**pre指针**:sparkle:
- 迭代：模拟中序，逻辑相同

## 二叉树公共祖先问题

[二叉树的公共祖先问题](https://programmercarl.com/0236.二叉树的最近公共祖先.html)

- 递归：后序，自底向上查找，回溯，找到左子树出现目标值，右子树节点目标值的节点。
- 迭代：不适合模拟回溯

> 1. 求最小公共祖先，需要从底向上遍历，那么二叉树，只能通过后序遍历（即：回溯）实现从低向上的遍历方式。
> 2. 在回溯的过程中，必然要遍历整颗二叉树，即使已经找到结果了，依然要把其他节点遍历完，因为要使用递归函数的返回值（也就是代码中的left和right）做逻辑判断。
> 3. 要理解如果返回值left为空，right不为空为什么要返回right，为什么可以用返回right传给上一层结果。

[二叉搜索树的公共祖先问题](https://programmercarl.com/0235.二叉搜索树的最近公共祖先.html)

- 递归：顺序无所谓，如果节点的数值在目标区间就是最近公共祖先
- 迭代：按序遍历

## 二叉搜索树的修改与构造

[二叉搜索树中的插入操作](https://programmercarl.com/0701.二叉搜索树中的插入操作.html)

- 递归：顺序无所谓，通过递归函数返回值添加节点
- 迭代：按序遍历，需要记录插入父节点，这样才能做插入操作

[二叉搜索树中的删除操作](https://programmercarl.com/0450.删除二叉搜索树中的节点.html)

- 递归：前序，想清楚删除非叶子节点的情况
- 迭代：有序遍历，较复杂

**:sparkler:普通二叉树的删除方式**

[修剪二叉搜索树](https://programmercarl.com/0669.修剪二叉搜索树.html)

- 递归：前序，通过递归函数返回值删除节点
- 迭代：有序遍历，较复杂

[构造二叉搜索树](https://programmercarl.com/0108.将有序数组转换为二叉搜索树.html)

- 递归：前序，数组中间节点分割
- 迭代：较复杂，通过三个队列来模拟

## todolist

[99. 恢复二叉搜索树](https://leetcode-cn.com/problems/recover-binary-search-tree/)

时间复杂度 O(N)，空间复杂度O(N)

```js
var recoverTree = function(root) {
    const dfs = (root) => {
        if(!root) return null
        dfs(root.left)
        res.push(root)
        dfs(root.right)
    } 
    let res = []
    dfs(root)
    let x = null, y = null
    for(let i=0; i<res.length-1; i++) {
        if(res[i].val > res[i+1].val) {
            y = i+1
            if(x === null) x = i
        }
    }
    [res[x].val, res[y].val ] = [res[y].val, res[x].val]
    return root
};
```

时间复杂度 O(N)，空间复杂度O(H), H为二叉树高度

```js
var recoverTree = function(root) {
    let x = null, y = null
    let stack = []
    let pre = null
    while(stack.length || root) {
        // while(root) {
        //     stack.push(root)
        //     root = root.left
        // }
        // root = stack.pop()
        // if(pre !== null && pre.val > root.val) {
        //     y = root
        //     if(x === null) {
        //         x = pre
        //     }
        // }
        // pre = root
        // root = root.right
        if(root) {
            stack.push(root)
            root = root.left
        } else {
            root = stack.pop()
            if(pre !== null && pre.val > root.val) {
                y = root
                if(x === null) {
                    x = pre
                }
            }
            pre = root
            root = root.right
        }
    }
    [x.val, y.val] = [y.val, x.val]
    return root
};
```



 [116. 填充每个节点的下一个右侧节点指针](https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node/)

 [450. 删除二叉搜索树中的节点](https://leetcode-cn.com/problems/delete-node-in-a-bst/) 

 [669. 修剪二叉搜索树](https://leetcode-cn.com/problems/trim-a-binary-search-tree/)

[662. 二叉树最大宽度](https://leetcode-cn.com/problems/maximum-width-of-binary-tree/)

- [剑指 Offer 55 - I. 二叉树的深度](https://leetcode-cn.com/problems/er-cha-shu-de-shen-du-lcof/)
- [剑指 Offer 34. 二叉树中和为某一值的路径](https://leetcode-cn.com/problems/er-cha-shu-zhong-he-wei-mou-yi-zhi-de-lu-jing-lcof/)
- [101. 对称二叉树](https://github.com/azl397985856/leetcode/blob/master/problems/101.symmetric-tree.md)
- [226. 翻转二叉树](https://github.com/azl397985856/leetcode/blob/master/problems/226.invert-binary-tree.md)
- [543. 二叉树的直径](https://leetcode-cn.com/problems/diameter-of-binary-tree/)
- [662. 二叉树最大宽度](https://leetcode-cn.com/problems/maximum-width-of-binary-tree/)
- [971. 翻转二叉树以匹配先序遍历](https://leetcode-cn.com/problems/flip-binary-tree-to-match-preorder-traversal/)
- [987. 二叉树的垂序遍历](https://leetcode-cn.com/problems/vertical-order-traversal-of-a-binary-tree/)
- [863. 二叉树中所有距离为 K 的结点](https://leetcode-cn.com/problems/all-nodes-distance-k-in-binary-tree/)
- [面试题 04.06. 后继者](https://leetcode-cn.com/problems/successor-lcci/)



# 二分

## 定义

二分查找又称`折半搜索算法`。 狭义地来讲，二分查找是一种在有序数组查找某一特定元素的搜索算法。这同时也是大多数人所知道的一种说法。实际上， 广义的二分查找是将问题的规模缩小到原有的一半。类似的，三分法就是将问题规模缩小为原来的 1/3。

## 模板

> 寻找符合条件的值

```js

var search = function(nums, target) {
    let left = 0, right = nums.length -1
    while(left <= right) {
        let mid = left + Math.floor((right - left)/2)
        if(nums[mid] < target) left = mid+1
        else if(nums[mid] > target) right = mid - 1
        else return mid
    } 
    return -1
};
```

>  寻找最左插入位置

```python
def bisect_left(nums, x):
    # 内置 api
    bisect.bisect_left(nums, x)
    # 手写
    l, r = 0, len(A) - 1
    while l <= r:
        mid = (l + r) // 2
        if A[mid] >= x: r = mid - 1
        else: l = mid + 1
    return l
```

> 寻找最右插入位置

```python

def bisect_right(nums, x):
    # 内置 api
    bisect.bisect_right(nums, x)
    # 手写
    l, r = 0, len(A) - 1
    while l <= r:
        mid = (l + r) // 2
        if A[mid] <= x: l = mid + 1
        else: r = mid - 1
    return l
```



1. 最左二分不断收缩右边界，最终返回左边界
2. 最右二分不断收缩左边界，最终返回右边界

## 应用

### 能力检测二分

[875. 爱吃香蕉的珂珂](https://leetcode-cn.com/problems/koko-eating-bananas/)

解的是有序的，不断收缩解集的空间，如果possible(k)不满足要求，那么小于k的解也不会满足要求

使用最左二分，不断收缩右边界

```js
var minEatingSpeed = function(piles, h) {
    const canEat = (piles, h, mid) => {
        let time = 0
        for(let pile of piles) {
            time += Math.ceil(pile/mid)
        }
        return time <= h
    }

    let l = 1
    let r = Math.max(...piles)
    while(l<=r) {
        let mid = l + ((r-l) >>> 1)
        if(canEat(piles, h, mid)) r = mid -1
        else l = mid+1
    }
    return l
};
```

[475. 供暖器](https://leetcode-cn.com/problems/heaters/)

```js
var findRadius = function(houses, heaters) {
    houses.sort((a, b) => a - b);
    heaters.sort((a, b) => a - b);
    const helpers = (mid) => {
        let i = 0
        for(let j = 0; j < houses.length; j++) {
            while(i < heaters.length && (houses[j] < (heaters[i] - mid) ||  houses[j]> (heaters[i] + mid))) {
                i++
            }
            if( i === heaters.length) return false
        }
        return true
    }

    let l = 0
    let r = 1e9+1
    while(l <= r) {
        let mid = l + ((r-l) >>> 1)
        if(helpers(mid)) r = mid -1
        else l = mid+1
    }
    return l
};
```



# 字符串

## KMP算法

### 关键概念

**前缀是指不包含最后一个字符的所有以第一个字符开头的连续子串**；**后缀是指不包含第一个字符的所有以最后一个字符结尾的连续子串**。

模式串与前缀表对应位置的数字表示的就是：**下标i之前（包括i）的字符串中，有多大长度的相同前缀后缀。**

next数组就可以是前缀表，但是很多实现都是把前缀表统一减一（右移一位，初始位置为-1）之后作为next数组。

**j和next[0]初始化为-1，整个next数组是以 前缀表减一之后的效果来构建的**

### 时间复杂度

生成next数组，时间复杂度是O (m), 后续匹配过程时间复杂度是O（n），时间复杂度是O(m+n)

暴力解法是O(m*n)

### 构建next数组

1. 初始化

定义两个指针i和j，j指向前缀末尾位置，i指向后缀末尾位置。

2. 处理前后缀不相同的情况: 回退
3. 处理前后缀相同的情况： j++

```js
  const getNext = function(s) {
    let next = []
    let j = -1
    next[0] = j
    for(let i = 1; i < s.length; i++) {
      while(j >= 0 && s[j+1] !== s[i]){ // s[j + 1] 与 s[i] 不相等
        j = next[j] // 回退
          // next[j]就是记录着j（包括j）之前的子串的最长相同前后缀的长度。
      }
      if(s[j+1] === s[i]) j++  //找到了相同的前后缀，同时向后移动i、j
      next[i] = j  // 将j(前缀的长度)赋给next[i],next[i]记录最长相同前后缀的长度
    }
    return next //f
  }
```



```js
let strStr = function(haystack, needle) {
  if(needle.length === 0) return 0
  const getNext = function(s) {
    let next = []
    let j = -1
    next[0] = j
    for(let i = 1; i < s.length; i++) {
      while(j >= 0 && s[j+1] !== s[i]){
        j = next[j]
      }
      if(s[j+1] === s[i]) j++
      next[i] = j 
    }
    return next
  }
  
  let next = getNext(next, needle)
  let j = -1
  for(let i = 0; i < haystack.length; i++) {
    while(j >= 0 && haystack[i] !== needle[j+1]){
      j = next[j]
    }
    if(haystack[i] === needle[j+1]) j++
    if(j === needle.length - 1) {
      return i - needle.length + 1
    }
  }
  return -1
}
```

# 回溯法

回溯的本质是穷举，所有回溯法的问题都可以抽象为树形结构！

**组合是不强调元素顺序的，排列是强调元素顺序**

剪枝:for 后续的数可能已经不满足题目要求，因此没有必要全部遍历

如果是一个集合来求组合的话，就需要startIndex，如果是多个集合取组合，各个集合之间相互不影响，那么就不用startIndex

子集问题需要记录所有节点的结果，而组合问题是记录叶子节点的结果。

如果原始数组中有重复元素，要注意进行去重，一般都需要对原数组进行排序，有数组或者set记录已经使用过的元素。

## 回溯三部曲

- 回溯函数模板返回值以及参数

  返回值一般为void

- 回溯函数终止条件

  搜索到叶子节点，存储答案，结束本层递归

  ```
  if (终止条件) {
      存放结果;
      return;  //不能忘，
  }
  ```

- 回溯搜索的遍历过程

  回溯是在结合中递归搜索，因此集合的大小构成了树的宽度，递归的深度决定了树的深度

伪代码：

```
for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
    处理节点;
    backtracking(路径，选择列表); // 递归
    回溯，撤销处理结果
}
```

**for循环横向遍历，backtracking纵向遍历（递归）**

- 回溯模板

```
void backtracking(参数) {
    if (终止条件) {
        存放结果;
        return;
    }

    for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
        处理节点;
        backtracking(路径，选择列表); // 递归
        回溯，撤销处理结果
    }
}
```

## 组合问题

#### [77. 组合](https://leetcode-cn.com/problems/combinations/)

```ts
function combine(n: number, k: number): number[][] {
    let res = []
    let path = []
    const backtracking = (startIndex: number): number[][] => {
        if(path.length === k) {
            res.push([...path])
            return
        }
        for(let i=startIndex; i<=n; i++) {
            path.push(i)
            backtracking(i+1)
            path.pop()
        }
        return res
    }
    return backtracking(1)
};


// 剪枝
function combine(n: number, k: number): number[][] {
    let res = []
    let path = []
    const backtracking = (startIndex: number): number[][] => {
        if(path.length === k) {
            res.push([...path])
            return
        }
        for(let i = startIndex; i <= n; i++) {
            path.push(i)
            backtracking(i+1)
            path.pop()
        }
    }
    backtracking(1)
    return res
}
```

#### [216. 组合总和 III](https://leetcode-cn.com/problems/combination-sum-iii/)

找出所有相加之和为 n 的 k 个数的组合。组合中只允许含有 1 - 9 的正整数，并且每种组合中不存在重复的数字。

说明：

所有数字都是正整数。
解集不能包含重复的组合。 
示例 1:

输入: k = 3, n = 7
输出: [[1,2,4]]
示例 2:

输入: k = 3, n = 9
输出: [[1,2,6], [1,3,5], [2,3,4]]

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/combination-sum-iii

```ts
function combinationSum3(k: number, n: number): number[][] {
    let path:number[] = []
    let res:number[][] = []
    const backtracking = (startIndex: number, sum: number): number[][] => {
        if(path.length === k) {
            if(sum === 0){
                res.push([...path])
            }
            return
        }
        for(let i=startIndex; i<=9; i++) {
            path.push(i)
            backtracking(i+1, sum-i)
            path.pop()
        }
        return res
    }
    return backtracking(1, n)
};

// 剪枝
function combinationSum3(k: number, n: number): number[][] {
    let path:number[] = []
    let res:number[][] = []
    const backtrack = (startIndex: number, sum: number): number[][] => {
        if(sum < 0) return
        if(path.length === k) {
            if(sum === 0){
                res.push([...path])
            }
            return
        }
        for(let i=startIndex; i<= 9-(k - path.length) + 1; i++) {
            path.push(i)
            backtrack(i+1, sum-i)
            path.pop()
        }
    }
    backtrack(1, n)
    return res
};
```



#### [17. 电话号码的字母组合](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)

给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

示例 1：

输入：digits = "23"
输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
示例 2：

输入：digits = ""
输出：[]
示例 3：

输入：digits = "2"
输出：["a","b","c"]

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number

```ts
function letterCombinations(digits: string): string[] {
    const source = {
        "2": "abc",
        "3": "def",
        "4": "ghi",
        "5": "jkl",
        "6": "mno",
        "7": "pqrs",
        "8": "tuv",
        "9": "wxyz",
    };
    if(!digits.length) return []
    if(digits.length === 1) return source[digits].split('')
    let path = []
    let res: string[] = []
    const backtrack = (index: number): void => {
        if(path.length === digits.length) {
            res.push(path.join(''))
            return
        }
        for(let item of source[digits[index]]) {
            path.push(item)
            backtrack(index+1)
            path.pop()
        }
    }
    backtrack(0)
    return res
};
```

#### [39. 组合总和](https://leetcode-cn.com/problems/combination-sum/)

给定一个无重复元素的正整数数组 candidates 和一个正整数 target ，找出 candidates 中所有可以使数字和为目标数 target 的唯一组合。

candidates 中的数字可以无限制重复被选取。如果至少一个所选数字数量不同，则两种组合是唯一的。 

对于给定的输入，保证和为 target 的唯一组合数少于 150 个。

 

示例 1：

输入: candidates = [2,3,6,7], target = 7
输出: [[7],[2,2,3]]
示例 2：

输入: candidates = [2,3,5], target = 8
输出: [[2,2,2,2],[2,3,3],[3,5]]
示例 3：

输入: candidates = [2], target = 1
输出: []
示例 4：

输入: candidates = [1], target = 1
输出: [[1]]
示例 5：

输入: candidates = [1], target = 2
输出: [[1,1]]

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/combination-sum

```js
var combinationSum = function(candidates, target) {
    let res = []
    let path = []
    const backtrack = (sum, startIndex) => {
        //终止条件
        if(sum < 0) return
        if(sum === 0) {
            res.push([...path])
            return
        }
        for(let i = startIndex; i < candidates.length; i++) {
            path.push(candidates[i])
            backtrack(sum-candidates[i], i)  // i 表示下一层可以重复选取，此外，这一步也隐藏了回溯
            path.pop() //回溯，
        }
    }
    backtrack(target, 0)
    return res
};
```

剪枝：

```js
var combinationSum = function(candidates, target) {
    let res = []
    let path = []
    // 排序 剪枝
    candidates.sort((a,b) => a -b)
    const backtrack = (sum, startIndex) => {
        //终止条件
        if(sum === 0) {
            res.push([...path])
            return
        }
        for(let i = startIndex; i < candidates.length && sum - candidates[i] >= 0; i++) {
            path.push(candidates[i])
            backtrack(sum-candidates[i], i)  // i 表示下一层可以重复选取，此外，这一步也隐藏了回溯
            path.pop() //回溯，
        }
    }
    backtrack(target, 0)
    return res
};
```



#### [40. 组合总和 II](https://leetcode-cn.com/problems/combination-sum-ii/)<a name = '40'></a>

给定一个数组 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合。

candidates 中的每个数字在每个组合中只能使用一次。

注意：解集不能包含重复的组合。 

 

示例 1:

输入: candidates = [10,1,2,7,6,1,5], target = 8,
输出:
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]
示例 2:

输入: candidates = [2,5,2,1,2], target = 5,
输出:
[
[1,2,2],
[5]
]


提示:

1 <= candidates.length <= 100
1 <= candidates[i] <= 50
1 <= target <= 30

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/combination-sum-ii

```js
var combinationSum2 = function(candidates, target) {
    let source = candidates.sort((a, b) => a - b)
    let res = []
    let path = []
    const backtrack = (startIndex, sum) => {
        if(sum === 0) {
            res.push([...path])
            return
        }
        for(let i = startIndex; i < source.length && sum - candidates[i] >= 0; i++) { //剪枝，小于0的话就没必要再进入下一层递归
            if(i > startIndex && source[i] === source[i-1]) continue //同一层不选择重复的元素

            path.push(source[i])
            backtrack(i+1, sum - source[i]) // i+1代表不选择上一层已经选择过的【同一个】元素，表现为【candidates 中的每个数字在每个组合中只能使用一次】，但还是可以选择数值上重复，但未在本层使用过的【重复元素】，表现为每个path中可以有重复元素
            path.pop()
        }
    }
    backtrack(0, target)
    return res
};
```







## 分割问题

#### [131. 分割回文串](https://leetcode-cn.com/problems/palindrome-partitioning/)

> 给你一个字符串 s，请你将 s 分割成一些子串，使每个子串都是 回文串 。返回 s 所有可能的分割方案。
>
> 回文串 是正着读和反着读都一样的字符串。
>
>  
>
> 示例 1：
>
> 输入：s = "aab"
> 输出：[["a","a","b"],["aa","b"]]
> 示例 2：
>
> 输入：s = "a"
> 输出：[["a"]]
>
>
> 提示：
>
> 1 <= s.length <= 16
> s 仅由小写英文字母组成
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/palindrome-partitioning

```ts
function partition(s: string): string[][] {
    let res: string[][] = []
    let path: string[] = []
    const backtrack = (startIndex: number): void => {
        // if(path.join('').length === s.length) {
        if(startIndex >= s.length) {
            res.push([...path])
            return
        }
        for(let i = startIndex; i < s.length; i++) {
            if(check(s, startIndex, i+1)) {
                path.push(s.slice(startIndex,i+1))
            } else continue
            backtrack(i + 1)
            path.pop()
        }
    }
    backtrack(0)
    return res
};

const check = (s: string, startIndex: number, endIndex: number): boolean => {
        // let c = s.slice(startIndex, endIndex)
        // let temp = c
        // return c === temp.split('').reverse().join('')
        for(let i = startIndex, j=endIndex -1; i < j; i++,j--) {
            if(s[i] !== s[j]) return false
        }
        return true
    }
```

#### [93. 复原 IP 地址](https://leetcode-cn.com/problems/restore-ip-addresses/)

> 有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。
>
> 例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 无效 IP 地址。
> 给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能的有效 IP 地址，这些地址可以通过在 s 中插入 '.' 来形成。你不能重新排序或删除 s 中的任何数字。你可以按 任何 顺序返回答案。
>
>  
>
> 示例 1：
>
> 输入：s = "25525511135"
> 输出：["255.255.11.135","255.255.111.35"]
> 示例 2：
>
> 输入：s = "0000"
> 输出：["0.0.0.0"]
> 示例 3：
>
> 输入：s = "1111"
> 输出：["1.1.1.1"]
> 示例 4：
>
> 输入：s = "010010"
> 输出：["0.10.0.10","0.100.1.0"]
> 示例 5：
>
> 输入：s = "101023"
> 输出：["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
>
>
> 提示：
>
> 0 <= s.length <= 20
> s 仅由数字组成
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/restore-ip-addresses

```ts
function restoreIpAddresses(s: string): string[] {
    let res: string[] = []
    let path: string[] = []
    const backtrack = (startIndex: number): void => {
        const len = path.length;
        // 注意终止条件，光有startIndex === s.length并不能确定终止
        if(len > 4) return;
        if(len === 4 && startIndex === s.length) {
            res.push(path.join("."));
            return;
        }
        for(let i = startIndex; i < s.length; i++) {
            if(check(s, startIndex, i+1)) {
                path.push(s.slice(startIndex, i+1))
            } else continue
            backtrack(i+1)
            path.pop()
        }
    }
    backtrack(0)
    return res
};

const check = (s: string, startIndex: number, endIndex: number): boolean => {
    let temp = s.slice(startIndex, endIndex)
    // let num = parseInt(temp)
    // if(num.toString() === temp && num <= 255 && num >= 0) return true
    // return false
    if(temp.length > 3 || +temp > 255) return false
    if(temp.length > 1 && temp[0] === '0') return false
    return true
}
```

#### [306. 累加数](https://leetcode-cn.com/problems/additive-number/)

累加数是一个字符串，组成它的数字可以形成累加序列。

一个有效的累加序列必须至少包含 3 个数。除了最开始的两个数以外，字符串中的其他数都等于它之前两个数相加的和。

给定一个只包含数字 '0'-'9' 的字符串，编写一个算法来判断给定输入是否是累加数。

说明: 累加序列里的数不会以 0 开头，所以不会出现 1, 2, 03 或者 1, 02, 3 的情况。

示例 1:

输入: "112358"
输出: true 
解释: 累加序列为: 1, 1, 2, 3, 5, 8 。1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8
示例 2:

输入: "199100199"
输出: true 
解释: 累加序列为: 1, 99, 100, 199。1 + 99 = 100, 99 + 100 = 199

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/additive-number


```js
var isAdditiveNumber = function(num) {
    const backtrack = (index, sum, pre, count, n) => {
        // 字符串已经遍历完，且分割出至少三个数
        if(index === n) {
            return count >= 3
        }
        for(let i=index; i<n; i++) {
            // 以0开头的非‘0’字符串,不满足要求，也没有必要继续向后拼接
            if( i> index && num[index] === '0') break
            let value = +num.slice(index, i+1)
            // 如果分割出的数字个数大于2，验证value是否满足累加序列
            if(count >= 2) {
                // 小于前两个数之和，继续向后拼接
                if(value < sum) continue
                // 停止拼接，因为向后拼接之后越来越大
                else if(value > sum) break
            }
            // 继续向后递归，隐藏着回溯， value+pre, count+1
            if(backtrack(i+1, value+pre, value, count+1, n)) {
                return true
            }
        }
        return false
    }
    return backtrack(0, 0, 0, 0, num.length)
}
```





## 求子集问题

子集问题和组合问题、分割问题的的区别，**子集是收集树形结构中树的所有节点的结果**。**而组合问题、分割问题是收集树形结构中叶子节点的结果**。

#### [78. 子集](https://leetcode-cn.com/problems/subsets/)

> 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
>
> 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
>
>  
>
> 示例 1：
>
> 输入：nums = [1,2,3]
> 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
> 示例 2：
>
> 输入：nums = [0]
> 输出：[[],[0]]
>
>
> 提示：
>
> 1 <= nums.length <= 10
> -10 <= nums[i] <= 10
> nums 中的所有元素 互不相同
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/subsets
>
> 
>
> **注意：子集问题需要收集路径上的所有节点**
>
> ```ts
> function subsets(nums: number[]): number[][] {
>     let res: number[][] = []
>     let path: number[] = []
>     const backtrack = (startIndex: number): void => {
>         res.push([...path])
>         // 收集子集，要放在终止添加的上面，否则会漏掉自己
>         // 终止条件可不加
>         // if(startIndex >= nums.length) {
>         //     return
>         // }
>         for(let i = startIndex; i < nums.length; i++) {
>             path.push(nums[i])
>             backtrack(i+1)
>             path.pop()
>         }
>     }
>     backtrack(0)
>     return res
> };
> ```
>
> 示例 1：
>
> 输入：nums = [1,2,2]
> 输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]
> 示例 2：
>
> 输入：nums = [0]
> 输出：[[],[0]]
>
>
> 提示：
>
> 1 <= nums.length <= 10
> -10 <= nums[i] <= 10
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/subsets-ii

```js
function subsetsWithDup(nums: number[]): number[][] {
    // 给定数组中有重复元素，而解集中不能有重复子集，但子集中允许有重复元素，这说明同一层中元素不能重复，纵向递归的过程中不能重复选取【同一】元素，也就是backtrack(i+1), 但选取的元素的【值】允许一样。
    // 将原数组做原位排序
    nums.sort((a, b) => a-b)
    let res: number[][] = []
    let path: number[] = []
    const backtrack = (startIndex: number): void => {
        res.push([...path])
        for(let i = startIndex; i < nums.length; i++) {
            if(i !== startIndex && nums[i] === nums[i-1]) continue
            path.push(nums[i])
            backtrack(i+1)
            path.pop()
        }
    }
    backtrack(0)
    return res
};
```



#### [90. 子集 II](https://leetcode-cn.com/problems/subsets-ii/)

给你一个整数数组 nums ，其中可能包含重复元素，请你返回该数组所有可能的子集（幂集）。

解集 不能 包含重复的子集。返回的解集中，子集可以按 任意顺序 排列。

> 示例 1：
>
> 输入：nums = [1,2,2]
> 输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]
> 示例 2：
>
> 输入：nums = [0]
> 输出：[[],[0]]
>
>
> 提示：
>
> 1 <= nums.length <= 10
> -10 <= nums[i] <= 10
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/subsets-ii

```ts
function subsetsWithDup(nums: number[]): number[][] {
    // 给定数组中有重复元素，而解集中不能有重复子集，但子集中允许有重复元素，这说明同一层中元素不能重复，纵向递归的过程中不能重复选取【同一】元素，也就是backtrack(i+1), 但选取的元素的【值】允许一样。
    // 将原数组做原位排序
    nums.sort((a, b) => a-b)
    let res: number[][] = []
    let path: number[] = []
    const backtrack = (startIndex: number): void => {
        res.push([...path])
        for(let i = startIndex; i < nums.length; i++) {
            // 因为递归的时候下一个startIndex是i+1而不是0。
            // 如果要是全排列的话，每次要从0开始遍历，为了跳过已入栈的元素，需要使用used。
            if(i !== startIndex && nums[i] === nums[i-1]) continue
            path.push(nums[i])
            backtrack(i+1)
            path.pop()
        }
    }
    backtrack(0)
    return res
};

// set去重
function subsetsWithDup(nums: number[]): number[][] {
    nums.sort((a, b) => a -b)
    let res: number[][] = []
    let path: number[] = []
    const backtrack = (startIndex: number): void => {
        res.push([...path])
        let set = new Set()
        for(let i = startIndex; i < nums.length; i++) {
            if(set.has(nums[i])) continue
            set.add(nums[i])
            path.push(nums[i])
            backtrack(i+1)
            path.pop()
        }
    }
    backtrack(0)
    return res
}

// used 数组记录
function subsetsWithDup(nums: number[]): number[][] {
    nums.sort((a, b) => a -b)
    let res: number[][] = []
    let path: number[] = []
    const backtrack = (startIndex: number, used: boolean[]): void => {
        res.push([...path])
        for(let i = startIndex; i < nums.length; i++) {
            if(i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue
            used[i] = true
            path.push(nums[i])
            backtrack(i+1, used)
            path.pop()
            used[i] = false
        }
    }
    backtrack(0, [])
    return res
}
```



#### [491. 递增子序列](https://leetcode-cn.com/problems/increasing-subsequences/)

给你一个整数数组 nums ，找出并返回所有该数组中不同的递增子序列，递增子序列中 至少有两个元素 。你可以按 任意顺序 返回答案。

数组中可能含有重复元素，如出现两个整数相等，也可以视作递增序列的一种特殊情况。

> 示例 1：
>
> 输入：nums = [4,6,7,7]
> 输出：[[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]
> 示例 2：
>
> 输入：nums = [4,4,3,2,1]
> 输出：[[4,4]]
>
>
> 提示：
>
> 1 <= nums.length <= 15
> -100 <= nums[i] <= 100
> 
>来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/increasing-subsequences

```ts
function findSubsequences(nums: number[]): number[][] {
    let res: number[][] = []
    let path: number[] = []
    const backtrack = (startIndex: number): void => {
        if(path.length >= 2) res.push([...path])
        //不能对原数组本身进行排序，同时又要保证res中不能有重复元素
        //因此使用set来记录本层中已经使用过的元素，进行去重
        let set = new Set()
        for(let i = startIndex; i < nums.length; i++) {
            // 保证是递增序列，同时保证同一层没有使用相同数值的元素，即去重
            if(path.length && path[path.length - 1] > nums[i] || set.has(nums[i])) continue
            set.add(nums[i])
            // 回溯
            path.push(nums[i])
            backtrack(i+1)
            path.pop()
        }
    }
    backtrack(0)
    return res
};
```

## 排列问题

- 每层都是从0开始搜索而不是startIndex
- 需要used数组记录path里都放了哪些元素了

#### [46. 全排列](https://leetcode-cn.com/problems/permutations/)

给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

 

示例 1：

输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
示例 2：

输入：nums = [0,1]
输出：[[0,1],[1,0]]
示例 3：

输入：nums = [1]
输出：[[1]]


提示：

1 <= nums.length <= 6
-10 <= nums[i] <= 10
nums 中的所有整数 互不相同

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/permutations

```ts
function permute(nums: number[]): number[][] {
    let res: number[][] = []
    let path: number[] = []
    // 记录数组中哪些元素已经使用过了，一个排列中不能重复
    let used: number[] = new Array(nums.length).fill(0)
    const backtrack = (used: number[]): void => {
        // 终止条件
        if(path.length === nums.length) {
            res.push(path.slice())
            return
        }
        // 每次都从头开始搜索， [1, 3], [3, 1]
        for(let i = 0; i < nums.length; i++) {
            // 
            if(used[i]) continue
            used[i] = 1
            path.push(nums[i])
            backtrack(used)
            path.pop()
            used[i] = 0
        }
    }
    backtrack(used)
    return res
};
```



#### [47. 全排列 II](https://leetcode-cn.com/problems/permutations-ii/)

给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。

 

示例 1：

输入：nums = [1,1,2]
输出：
[[1,1,2],
 [1,2,1],
 [2,1,1]]
示例 2：

输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]


提示：

1 <= nums.length <= 8
-10 <= nums[i] <= 10

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/permutations-ii

```ts
function permuteUnique(nums: number[]): number[][] {
    nums.sort((a, b) => a - b)
    let res: number[][] = []
    let path: number[] = []
    const backtrack = (used: boolean[]):void => {
        if(path.length === nums.length) {
            res.push(path.slice())
            return
        }
        // 去重的前提是对原数组进行排序，这样方便通过相邻元素的比较进行去重
        for(let i = 0; i < nums.length; i++) {
            // i>0 : 第一个元素肯定不会重的
            // 当 nums[i] === nums[i-1] 为true 时，说明该层相邻的两个元素重复了，但是否属于在同一层重复选取呢？
            // used[i-1] 为false时，因为元素是从左到右选取的说明该值已经在nums[i-1]处选取过了，再选就重复了
            // 如果为true, 说明虽然值相同，但 i-1 处的元素是上一层选取的，本层可以选取 nums[i]
            if(i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue
            if(!used[i]) {
                used[i] = true
                path.push(nums[i])
                backtrack(used)
                path.pop()
                used[i] = false
            }
        }
    }
    backtrack([])
    return res
};



//setj
function permuteUnique(nums: number[]): number[][] {
    nums.sort((a, b) => a - b)
    let res: number[][] = []
    let path: number[] = []
    const backtrack = (used: boolean[]):void => {
        if(path.length === nums.length) {
            res.push(path.slice())
            return
        }
        let set = new Set()
        for(let i = 0; i < nums.length; i++) {
            if(set.has(nums[i])) continue
            if(!used[i]) {
                set.add(nums[i])
                used[i] = true
                path.push(nums[i])
                backtrack(used)
                path.pop()
                used[i] = false
            }
        }
    }
    backtrack([])
    return res
};
```

## 棋盘问题

遍历每一个位置，看是否存在符合要求的解

#### [51. N 皇后](https://leetcode-cn.com/problems/n-queens/)

n 皇后问题 研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 n ，返回所有不同的 n 皇后问题 的解决方案。

每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。

 

示例 1：

![image-20211122193920343](D:\NOTES\leetcode\leetcode.assets\image-20211122193920343.png)

输入：n = 4
输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
解释：如上图所示，4 皇后问题存在两个不同的解法。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/n-queens
著作权归领扣网络所有。商业转载请联系官方授权，

```ts
function solveNQueens(n: number): string[][] {
    const isValid = (row: number, col:number, board: string[][]): boolean => {
        // 同列
        for(let i=0; i<row; i++) {
            if(board[i][col] === 'Q') return false
        }
        // 45°
        for(let i=row-1, j=col+1; i>=0 && j<n; i--, j++) {
            if(board[i][j] === 'Q') return false
        }
        // 135°
        for(let i=row-1, j=col-1; i>=0 && j>=0; i--, j--) {
            if(board[i][j] === 'Q') return false
        }
        return true
    }

    const transform = (arr: string[][]): string[] => {
        return arr.map(item => item.join(''))
    }

    const backtrack = (row: number, board: string[][], n: number): boolean => {
        if(row === n) {
            res.push([...transform(board)])
            return
        }
        for(let col = 0; col < n; col++){
            if(isValid(row, col, board)) {
                board[row][col] = 'Q'
                backtrack(row+1, board, n)
                board[row][col] = '.'
            }
        } 
    }

    let res: string[][] = []
    let board: string[][] = new Array(n).fill(0).map(()=> new Array(n).fill('.'))
    backtrack(0, board, n)
    return res 

};
```

#### [37. 解数独](https://leetcode-cn.com/problems/sudoku-solver/)

编写一个程序，通过填充空格来解决数独问题。

数独的解法需 遵循如下规则：

数字 1-9 在每一行只能出现一次。
数字 1-9 在每一列只能出现一次。
数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。（请参考示例图）
数独部分空格内已填入了数字，空白格用 '.' 表示。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/sudoku-solver

```ts
/**
 Do not return anything, modify board in-place instead.
 */
function solveSudoku(board: string[][]): void {
    const isValid = (row: number, col: number, cur: string, board: string[][]): boolean => {
        // 同一行不能重复
        for(let i=0; i < board.length; i++) {
            if(board[row][i] === cur) return false
        }
        // 同一列不能重复
        for(let i=0; i < board.length; i++) {
            if(board[i][col] === cur) return false
        }
        // 同一个小九宫格内不能重复
        let rowStart = Math.floor(row/3)*3
        let colStart = Math.floor(col/3)*3
        for(let i=rowStart; i<rowStart+3; i++) {
            for(let j=colStart; j<colStart+3; j++) {
                if(board[i][j] === cur) return false
            }
        }
        return true
    }
    
    const backtrack = (board: string[][]): boolean => {
        for(let i=0; i<board.length; i++) {
            for(let j=0; j<board[0].length; j++) {
                // 该位为数字，跳过
                if(board[i][j] !== '.') continue
                for(let s=1; s<=9; s++) {
                    if(isValid(i, j, `${s}`, board)) {
                        board[i][j] = `${s}`
                        if(backtrack(board)) return true //找到合适的一组，立刻返回
                        board[i][j] = '.'
                    }
                }
                //如果某一位上1-9都不满足要求，说明不存在这样的解
                return false
            }
        }
        return true
    }
    backtrack(board)
};
```

#### [79. 单词搜索](https://leetcode-cn.com/problems/word-search/)

给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

 

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/word-search

```js
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    // 记录已经找到的字符在单元格中的位置
    const used = new Array(board.length).fill(0).map(() => new Array(board[0].length).fill(false))
    // 判断从当前位置开始寻找，是否可以在相邻单元格内找到下一个字符
    const check = (row, col, s, k) => {
        if(board[row][col] !== s[k]) return false
        else if(k === s.length-1) return true
        let result = false
        used[row][col] = true
        for(const [dx, dy] of directions) {
            let new_row = row + dx
            let new_col = col + dy
            // 保证不超出网格位置
            if(new_row>=0 && new_row < board.length && new_col >= 0 && new_col < board[0].length) {
                // 确保这个字符没有被使用过
                if(!used[new_row][new_col]) {
                    let flag = check(new_row, new_col, s, k+1)
                    if(flag) {
                        result = true
                        break
                    }
                }
            }
        }
        used[row][col] = false  // 回溯
        return result
    }
    for(let i = 0; i<board.length; i++) {
        for(let j = 0; j<board[0].length; j++) {
            if(check(i, j, word, 0)) return true
        }
    }
    return false
};
```

#### [1219. 黄金矿工](https://leetcode-cn.com/problems/path-with-maximum-gold/)

> 你要开发一座金矿，地质勘测学家已经探明了这座金矿中的资源分布，并用大小为 m * n 的网格 grid 进行了标注。每个单元格中的整数就表示这一单元格中的黄金数量；如果该单元格是空的，那么就是 0。
>
> 为了使收益最大化，矿工需要按以下规则来开采黄金：
>
> 每当矿工进入一个单元，就会收集该单元格中的所有黄金。
> 矿工每次可以从当前位置向上下左右四个方向走。
> 每个单元格只能被开采（进入）一次。
> 不得开采（进入）黄金数目为 0 的单元格。
> 矿工可以从网格中 任意一个 有黄金的单元格出发或者是停止。
>
>
> 示例 1：
>
> 输入：grid = [[0,6,0],[5,8,7],[0,9,0]]
> 输出：24
> 解释：
> [[0,6,0],
>  [5,8,7],
>  [0,9,0]]
> 一种收集最多黄金的路线是：9 -> 8 -> 7。
> 示例 2：
>
> 输入：grid = [[1,0,7],[2,0,6],[3,4,5],[0,3,0],[9,0,20]]
> 输出：28
> 解释：
> [[1,0,7],
>  [2,0,6],
>  [3,4,5],
>  [0,3,0],
>  [9,0,20]]
> 一种收集最多黄金的路线是：1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7。
>
> 来源：力扣（LeetCode）
> 链接：https://leetcode-cn.com/problems/path-with-maximum-gold

```js
const dfs = (grid, m, n) => {
    // 返回条件，一是坐标不能超出棋盘的位置
    // 二是“不得开采（进入）黄金数目为 0 的单元格。”
    // 遇到上述情况就返回0
    if(m<0 || m>=grid.length || n<0 || n>=grid[0].length || grid[m][n] === 0) return 0
    // 暂存该值，之后要进行回溯
    let temp = grid[m][n]
    // 假定已经开采过grid[m][n]了, 因此黄金数量变为0
    grid[m][n] = 0
    // 继续探索上下左右
    let up = dfs(grid,m-1, n)
    let down = dfs(grid,m+1, n)
    let right = dfs(grid,m, n+1)
    let left = dfs(grid,m, n-1)
    // 上下左右哪个最大就走哪一步
    let max = Math.max(up, down, left, right)
    grid[m][n] = temp
    return grid[m][n] + max
}

var getMaximumGold = function(grid) {
    if(!grid || grid.length === 0) return 0
    let res = 0
    // 矿工可以从网格中 任意一个 有黄金的单元格出发或者是停止。
    // 因此要以网格中的每一个坐标为起点进行探索，并不断更新最大值
    for(let i=0; i<grid.length; i++) {
        for(let j=0; j<grid[0].length; j++) {
            res = Math.max(res, dfs(grid, i, j))
        }
    }
    return res
};

作者：eric2589
链接：https://leetcode-cn.com/problems/path-with-maximum-gold/solution/1219-huang-jin-kuang-gong-by-eric2589-uawo/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```



# 动态规划

## 动规五部曲

动规的五部曲：

1. 确定dp数组（dp table）以及下标的含义
2. 确定递推公式
3. dp数组如何初始化
4. 确定遍历顺序
5. 举例推导dp数组

### [53. 最大子数组和](https://leetcode-cn.com/problems/maximum-subarray/)

```js
// 贪心
var maxSubArray = function(nums) {
    let max = -Infinity
    let count = 0
    for(let item of nums) {
        count += item
        if(count > max) max = count
        if(count <= 0) count = 0
    }
    return max
}

// 动态规划
// 递推公式 dp[i+1] = max(nums[i+1], dp[i]+nums[i+1])
// 满足最优子结构和无后效性
var maxSubArray = function(nums) {
    let max = nums[0]
    for(let i=1; i<nums.length; i++) {
        // 无后效性，因此直接修改nums
        if(nums[i-1]>0) {
            // 关键在于上一次的递推结果是否是大于0
            nums[i] += nums[i-1]
        }
        max = Math.max(nums[i], max)
    }
    return max
}

// 变体，返回最大和的连续子数组的开始结束索引
var maxSubArray = function(nums) {
    let max = nums[0]
    let start=0, end=0, finalStart=0, finalEnd=0
    for(let i=1; i<nums.length; i++) {
        // 无后效性，因此直接修改nums
        if(nums[i-1]>0) {
            end = i
            // 关键在于上一次的递推结果是否是大于0
            nums[i] += nums[i-1]
        } else {
            start = i
            end = i
        }
        if(nums[i]>max) {
            max = nums[i]
            finalStart = start
            finalEnd = end
        }
    }
    return [finalStart, finalEnd]
}
```



# 贪心

针对一组数据，定义了限制值和期望值，在满足限制值的情况下，要求期望值最大。贪心的做法：每次选择当前情况下，在对限制值同等贡献量的情况下，对期望值贡献最大的数据。或者说对期望值相同贡献量的情况下，选择更小的限制值使用量。

#### [134. 加油站](https://leetcode-cn.com/problems/gas-station/)

难度中等802

在一条环路上有 *N* 个加油站，其中第 *i* 个加油站有汽油 `gas[i]` 升。

你有一辆油箱容量无限的的汽车，从第 *i* 个加油站开往第 *i+1* 个加油站需要消耗汽油 `cost[i]` 升。你从其中的一个加油站出发，开始时油箱为空。

如果你可以绕环路行驶一周，则返回出发时加油站的编号，否则返回 -1。

**说明:** 

- 如果题目有解，该答案即为唯一答案。
- 输入数组均为非空数组，且长度相同。
- 输入数组中的元素均为非负数。

**示例 1:**

```
输入: 
gas  = [1,2,3,4,5]
cost = [3,4,5,1,2]

输出: 3

解释:
从 3 号加油站(索引为 3 处)出发，可获得 4 升汽油。此时油箱有 = 0 + 4 = 4 升汽油
开往 4 号加油站，此时油箱有 4 - 1 + 5 = 8 升汽油
开往 0 号加油站，此时油箱有 8 - 2 + 1 = 7 升汽油
开往 1 号加油站，此时油箱有 7 - 3 + 2 = 6 升汽油
开往 2 号加油站，此时油箱有 6 - 4 + 3 = 5 升汽油
开往 3 号加油站，你需要消耗 5 升汽油，正好足够你返回到 3 号加油站。
因此，3 可为起始索引。
```

**示例 2:**

```
输入: 
gas  = [2,3,4]
cost = [3,4,3]

输出: -1

解释:
你不能从 0 号或 1 号加油站出发，因为没有足够的汽油可以让你行驶到下一个加油站。
我们从 2 号加油站出发，可以获得 4 升汽油。 此时油箱有 = 0 + 4 = 4 升汽油
开往 0 号加油站，此时油箱有 4 - 3 + 2 = 3 升汽油
开往 1 号加油站，此时油箱有 3 - 3 + 3 = 3 升汽油
你无法返回 2 号加油站，因为返程需要消耗 4 升汽油，但是你的油箱只有 3 升汽油。
因此，无论怎样，你都不可能绕环路行驶一周。
```

> 贪心

```js
var canCompleteCircuit = function(gas, cost) {
    let curSum = 0
    let totalSum = 0
    let start = 0
    for(let i=0; i<gas.length; i++) {
        curSum += gas[i] - cost[i]
        totalSum += gas[i] - cost[i] //总油量如果小于总消耗量，一定是不能跑完全程的
        // 局部最优，更新起始位置
        if(curSum < 0) {
            start = i+1 //更新起始位置
            curSum = 0
        }
    }
    if(totalSum < 0) return -1
    return start
}
```

> 暴力

```js
var canCompleteCircuit = function(gas, cost) {
    // for循环适合从头到尾
    // while适合环状循环
    // 模拟以每一个加油站为起始点的行进
    for(let i=0; i<gas.length; i++) {
        let rest = gas[i] - cost[i]
        // index为下个加油站位置
        let index = (i+1) % gas.length
        // 如果剩余油量大于0且下个加油站位置不是起始点
        while(rest > 0 && index !== i) {
            rest += gas[index] - cost[index]
            index = (index+1) % gas.length
        }
        if(rest>=0 && index === i) return i //res >= 0 同时返回起点，注意此时剩余油量等于0也是可以的，因为已经回到起始点了
    }
    return -1
}
```























































































