```
git remote add 别名 地址

git push 别名 master

git checkout - b newBranch
git add .
git commit - m 'newBranch  提交'
git push 别名 newBranch

<!-- newBranch 开发完成之后, 对分支进行合并 -->

git checkout master
git merge newBranch
git push 别名 master

<!-- 组员 -->
git clone 地址

git remote add newName 地址
git checkout -b newBranch
git add .
git commit -m 'newBranch第一次提交'
git push 别名 newBranch


git pull 别名 master


//git clone 地址
//git checkout -b 本地分支名 origin/远程分支名

git --set-upstream origin 本地分支

git branch -d origin 分支名    删除远程分支
```



## merge
- merge 的含义：从两个 commit「分叉」的位置起，把目标 commit 的内容应用到当前 commit（HEAD 所指向的 commit），并生成一个新的 commit；
- merge 的适用场景：
单独开发的 branch 用完了以后，合并回原先的 branch；
git pull 的内部自动操作。
- merge 的三种特殊情况：
1. 冲突：
   1. 原因：当前分支和目标分支修改了同一部分内容，Git 无法确定应该怎样合并；
   2. 应对方法：解决冲突后手动 commit。
2. HEAD 领先于目标 commit：Git 什么也不做，空操作；
3. HEAD 落后于目标 commit：fast-forward

## commit log
- 查看历史中的多个 commit： git log
- 查看详细改动： git log -p
- 查看大致改动：git log –stat
- 查看具体某个 commit：show
- 要看最新 commit ，直接输入 git show ；要看指定 commit ，输入 git show commit的引用或SHA-1
如果还要指定文件，在 git show 的最后加上文件名
- 查看未提交的内容：diff
- 查看暂存区和上一条 commit 的区别：git diff – staged（或 –cached）
- 查看工作目录和暂存区的区别：git diff 不加选项参数
- 查看工作目录和上一条 commit 的区别：git diff HEAD

## rebase


## 修改最新一条commit
用 commit –amend 可以修复当前提交的错误。使用方式：

``git commit --amend``

## 交互式rebase
https://blog.csdn.net/wuhuagu_wuhuaguo/article/details/105006408?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-5.essearch_pc_relevant&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-5.essearch_pc_relevant

## 丢弃最新提交
``git reset --hard HEAD^``

## 丢弃的不是最新提交

## 代码已经 push 上去了才发现写错
- 如果出错内容在私有 branch：在本地把内容修正后，强制 push (push -f）一次就可以解决；
``git push origin branch1 -f``
- 如果出错内容在 master：不要强制 push，而要用 revert 把写错的 commit 撤销
``git revert HEAD^
``
这行代码就会增加一条新的 commit，它的内容和倒数第二个 commit 是相反的，从而和倒数第二个 commit 相互抵消，达到撤销的效果





新建一个分支feature, 推送到远程服务器. 然后reset你的main分支和远程服务器保持一致, 否则下次你pull并且他人的提交和你冲突的时候就会有问题.

```shell
git reset --hard o/main
git checkout -b feature c2
git push origin feature
```





直接了当地讲，`main` 和 `o/main` 的关联关系就是由分支的“remote tracking”属性决定的。`main` 被设定为跟踪 `o/main` —— 这意味着为 `main` 分支指定了推送的目的地以及拉取后合并的目标。

你可能想知道 `main` 分支上这个属性是怎么被设定的，你并没有用任何命令指定过这个属性呀！好吧, 当你克隆仓库的时候, Git 就自动帮你把这个属性设置好了。

当你克隆时, Git 会为远程仓库中的每个分支在本地仓库中创建一个远程分支（比如 `o/main`）。然后再创建一个跟踪远程仓库中活动分支的本地分支，默认情况下这个本地分支会被命名为 `main`。

克隆完成后，你会得到一个本地分支（如果没有这个本地分支的话，你的目录就是“空白”的），但是可以查看远程仓库中所有的分支（如果你好奇心很强的话）。这样做对于本地仓库和远程仓库来说，都是最佳选择。

这也解释了为什么会在克隆的时候会看到下面的输出：

```
local branch "main" set to track remote branch "o/main"
```

### 我能自己指定这个属性吗？

x'x'x'x

当然可以啦！你可以让任意分支跟踪 `o/main`, 然后该分支会像 `main` 分支一样得到隐含的 push 目的地以及 merge 的目标。 这意味着你可以在分支 `totallyNotMain` 上执行 `git push`，将工作推送到远程仓库的 `main` 分支上。

有两种方法设置这个属性，第一种就是通过远程分支检出一个新的分支，执行:

```
git checkout -b totallyNotMain o/main
```

就可以创建一个名为 `totallyNotMain` 的分支，它跟踪远程分支 `o/main`。

### 第二种方法

另一种设置远程追踪分支的方法就是使用：`git branch -u` 命令，执行：

```
git branch -u o/main foo
```

这样 `foo` 就会跟踪 `o/main` 了。如果当前就在 foo 分支上, 还可以省略 foo：

```
git branch -u o/main
```