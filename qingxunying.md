# html

语义化 新特性



高阶函数 与 柯里化

# 调试工具

charles

whisltls

# 常用开发调试技巧

## 更改html 和 css ？

## 利用代理解决开发时的跨域问题

## 

sourcemap代理到本地？

![image-20220117153239986](D:\NOTES\qingxunying.assets\image-20220117153239986.png)

![image-20220117153448997](D:\NOTES\qingxunying.assets\image-20220117153448997.png)

127.0.0.1 与 0.0.0.1 之间的区别？





# Node 

## Node.js的应用场景

1. 前端工程化

![image-20220120140814753](D:\NOTES\qingxunying.assets\image-20220120140814753.png)

2. web服务端应用

![image-20220120141009328](D:\NOTES\qingxunying.assets\image-20220120141009328.png)

3. Electron 跨端桌面应用

![image-20220120141508089](D:\NOTES\qingxunying.assets\image-20220120141508089.png)

4. node.js 在字节

![image-20220120141733280](D:\NOTES\qingxunying.assets\image-20220120141733280.png)

## node.js 运行时结构

![image-20220120142133550](D:\NOTES\qingxunying.assets\image-20220120142133550.png)

![image-20220120142456453](D:\NOTES\qingxunying.assets\image-20220120142456453.png)

### 特点

1. 异步 I/O

会在响应返回后恢复操作，而不是阻塞线程

2. 单线程

实际：js线程 + uv线程池  + V8任务线程池 + V8  Inspector 线程

优点：不用考虑多线程状态同步问题，不需要锁； 高效利用系统资源

缺点：阻塞会产生更多负面影响

解决办法： 多进程或多线程

3. 跨平台

- 跨平台 （大部分api）
- node.js 跨平台 + js 无需编译环境 + （+ web跨平台 + 诊断 工具跨平台） = 开发、学习成本低，大部分场景无需考虑跨平台

## 编写http server

### 安装node.js

### http server



promisify 改写

![image-20220120150234787](D:\NOTES\qingxunying.assets\image-20220120150234787.png)

静态文件服务

![image-20220120153517289](D:\NOTES\qingxunying.assets\image-20220120153517289.png)



http server debug

![image-20220120153646666](D:\NOTES\qingxunying.assets\image-20220120153646666.png)



#  开发调试

## 1. 前端debug特点

![image-20220121094225186](D:\NOTES\qingxunying.assets\image-20220121094225186.png)





请服务

![image-20220125200713266](D:\NOTES\qingxunying.assets\image-20220125200713266.png)

![image-20220125201927497](D:\NOTES\qingxunying.assets\image-20220125201927497.png)
