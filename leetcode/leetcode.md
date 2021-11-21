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
            curLevel.push(node.val);
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

回溯的本质是穷举

**组合是不强调元素顺序的，排列是强调元素顺序**。

所有回溯法的问题都可以抽象为树形结构！

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
            pre = source[i]
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

## 求子集问题

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

ps: 本题没有使用used数组来去重，因为递归的时候下一个startIndex是i+1而不是0。

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
> 通过次数50,425提交次数92,827
>
> 来源：力扣（LeetCode）
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







在[回溯算法：求子集问题！](https://programmercarl.com/0078.子集.html)的基础上原数组增加了重复元素，也就是相比上一问题增加了去重的操作，如何去重在[组合总和II](#40)，去重可以使用set或者数组进行记录，如果可以对原数组进行排序，也可以排序后直接比较前后值大小以去重。

而在[77.组合](https://programmercarl.com/0077.组合.html)和[216.组合总和III](https://programmercarl.com/0216.组合总和III.html) 中都可以知道要递归K层，因为要取k个元素的组合。

我举过例子，如果是一个集合来求组合的话，就需要startIndex，例如：[77.组合](https://programmercarl.com/0077.组合.html)，[216.组合总和III](https://programmercarl.com/0216.组合总和III.html)。

如果是多个集合取组合，各个集合之间相互不影响，那么就不用startIndex，例如：[17.电话号码的字母组合](https://programmercarl.com/0017.电话号码的字母组合.html)



子集问题和组合问题、分割问题的的区别，**子集是收集树形结构中树的所有节点的结果**。**而组合问题、分割问题是收集树形结构中叶子节点的结果**。
