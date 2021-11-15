# HTTP

## 001: HTTP报文结构

### 报文

- 起始行

	- 请求行：方法 + 路径 + http版本   例： GET /home HTTP/1.1
	- 响应行：http版本 + 状态码 + 原因  例： HTTP/1.1 200 OK

- 头部

	- 注意点：字段名不区分大小写、字段名不能出现空格和下划线_，字段名后紧接  ：

- 空行

	- 区分头部和实体

- 实体

	- 请求体、响应体

## 002: 请求方法

### 种类

- GET
- HEAD

  和 GET 方法类似，但是不返回报文实体主体部分。
  主要用于确认 URL 的有效性以及资源更新的日期时间等。

- POST
- PUT

  自身不带验证机制，任何人都可以上传文件，因此存在安全性问题

- PATCH

  PUT 也可以用于修改资源，但是只能完全替代原始资源，PATCH 允许部分修改。

- DELETE

  与 PUT 功能相反，并且同样不带验证机制。

- CONNECT

  CONNECT 方法要求在与代理服务器通信时建立隧道使用 SSL（Secure Sockets Layer，安全套接层）和 TLS（Transport Layer Security，传输层安全）协议把通信内容加密后经网络隧道传输。
  
  请求     CONNECT proxy.hackr.jp:8080 HTTP/1.1 Host: proxy.hackr.jp 
  响应      HTTP/1.1 200 OK（之后进入网络隧道）

- OPTIONS
- TRACE

  服务器会将通信路径返回给客户端。
  发送请求时，在 Max-Forwards 首部字段中填入数值，每经过一个服务器就会减 1，当数值为 0 时就停止传输。
  通常不会使用 TRACE，并且它容易受到 XST 攻击（Cross-Site Tracing，跨站追踪）。

### GET 和 POST的区别

- 语义
- 缓存

	- 从缓存的角度，GET 请求会被浏览器主动缓存下来，留下历史记录，而 POST 默认不会

- 编码

	- 从编码的角度，GET 只能进行 URL 编码，只能接收 ASCII 字符，而 POST 没有限制

- 参数

	- 从参数的角度，GET 一般(注意  为什么 是一般)放在 URL 中，因此不安全，POST 放在请求体中，更适合传输敏感信息。 （这里的安全是相对的，HTTP在网络上是明文传输，通过在网络节点抓包就可获取数据报文，需要使用https加密）

- 幂等性

	- 从幂等性的角度，GET是幂等的，而POST不是。(幂等表示执行相同的操作，结果也是相同的)

## 003: URI编码

### URI  Uniform Resource Identifier

URI 只能使用ASCII, ASCII 之外的字符是不支持显示的，而且还有一部分符号是界定符，如果不加以处理就会导致解析出错。

因此，URI 引入了编码机制，将所有非 ASCII 码字符和界定符转为十六进制字节值，然后在前面加个%。

完整结构
scheme 表示协议名，比如http, https, file等等。后面必须和://连在一起。
user:passwd@ 表示登录主机时的用户信息，不过很不安全，不推荐使用，也不常用。
host:port表示主机名和端口。
path表示请求路径，标记资源所在位置。
query表示查询参数，为key=val这种形式，多个键值对之间用&隔开。
fragment表示 URI 所定位的资源内的一个锚点，浏览器可以根据这个锚点跳转到对应的位置。

- URL
- URN

## 004: HTTP状态码

### 1XX

表示目前是协议处理的中间状态，还需要后续操作

101 Switching Protocols。在HTTP升级为WebSocket的时候，如果服务器同意变更，就会发送状态码 101。

### 2XX

- 200 OK
- 204 No Content
- 206  Partial Content

### 3XX

- 301 Moved Permanently
- 302 Found
- 304 Not Modified

	- 协商缓存命中时返回该状态码

### 4XX

- 400 Bad Request
- 403 Forbidden
- 404 Not Found
- 405 Method Not Allowed
- 406 Not Acceptable
- 408 Request Timeout
- 409 Conflict
- 413 Request Entity Too Large
- 414 Request-URI Too Long
- 429 Request Too Many Request
- 431 Request Header Fields Too Large

### 5XX

- 500 Internal Server Error
- 501 Not Implemented
- 502 Bad Gateway
- 503 Service Unavailable

## 005: HTTP特点及缺点

### 特点

- 1. 灵活可扩展

	- 语义自由
	- 传输格式多样

- 2. 可靠传输
- 3. 请求-应答
- 4. 无状态

### 缺点

- 1. 无状态

  在需要长连接的场景中，需要保存大量的上下文信息，以免传输大量重复的信息，那么这时候无状态就是 http 的缺点
  只是为了获取一些数据，不需要保存连接上下文信息，无状态反而减少了网络开销，成为了 http 的优点

- 2. 明文传输
- 3. 队头阻塞问题

## 006： Accept字段

### 数据格式

text： text/html, text/plain, text/css 等
image: image/gif, image/jpeg, image/png 等
audio/video: audio/mpeg, video/mp4 等
application: application/json, application/javascript, application/pdf, application/octet-stream

- 发送方：Content-Type
- 接收方：Accept

### 压缩方式

- 发送方：Content-Encodeing
- 接收方：Accept-Encoding

### 支持语言

- Content-Language  &  Accept-Language

### 字符集

- 放在Content-Type中，以charset属性指定
- 接收方：Accept-Charset

## 007: HTTP传输定长和不定长数据

### 定长包体

- Content-Length

### 不定长包体

- Transfer-Encoding: chunked

	- Content-Length 字段会被忽略
	- 基于长连接持续推送动态内容

## 008： 如何处理大文件的传输

### 前提是服务端支持范围请求，响应头增加： Accept-Ranges: none

### 单端数据请求

请求：
Range: bytes=0-9

返回的响应为：
HTTP/1.1 206 Partial Content
Content-Length: 10
Accept-Ranges: bytes
Content-Range: bytes 0-9/100

i am xxxxx

### 多端数据请求

请求：Range:  bytes=0-8, 30-39


响应：
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000010101
Content-Length: 189
Connection: keep-alive
Accept-Ranges: bytes


--00000010101
Content-Type: text/plain
Content-Range: bytes 0-9/96

i am xxxxx
--00000010101
Content-Type: text/plain
Content-Range: bytes 20-29/96

eex jspy e
--00000010101--

Content-Type: multipart/byteranges;boundary=00000010101，它代表了信息量是这样的:
请求一定是多段数据请求
响应体中的分隔符是 00000010101

各段数据之间会由这里指定的分隔符分开，而且在最后的分隔末尾添上--表示结束。

## 009: 处理表单数据的提交

### Content-Type: application/x-www-form-urlencoded

- 其中的数据会被编码成以&分隔的键值对
- 字符以URL编码方式编码。

### Content-Type: multipart/form-data

- 请求头中的Content-Type字段会包含boundary，且boundary的值由浏览器默认指定。

  例：
  Content-Type: multipart/form-data;boundary=----WebkitFormBoundaryRRJKeWfHPGrS4LKe

- 数据会分为多个部分，每两个部分之间通过分隔符来分隔
- 每部分表述均有 HTTP 头部描述子包体，如Content-Type
- 最后的分隔符会加上--表示结束。

  响应体
  
  Content-Disposition: form-data;name="data1";
  Content-Type: text/plain
  data1
  ----WebkitFormBoundaryRRJKeWfHPGrS4LKe
  Content-Disposition: form-data;name="data2";
  Content-Type: text/plain
  data2
  ----WebkitFormBoundaryRRJKeWfHPGrS4LKe--

- 图片等文件上传，采用什么方式，为什么？

## 010：HTTP队头阻塞问题  TODO

### 并发连接

### 域名分片

## 011: cookie

### Name/Value 

- 都必须是字符串类型

	- 值为 Unicode 字符，需要为字符编码。
	- 值为二进制数据，则需要使用 BASE64 编码

### 生存周期

若 Cookie 过期，则这个 Cookie 会被删除，并不会发送给服务端。

- Max-Age

	- Cache-Control   (HTTP 1.1) 

		- no-cache

			- 必须先与服务器确认资源是否被更改过（依靠If-None-Match和Etag），然后再决定是否使用本地缓存。如果没有修改，返回304+空响应，浏览器更新本地资源过期时间

		- no-store

			- 绝对禁止缓存任何资源

		- must-revalidate 

			-   一旦资源过期（比如已经超过max-age），在成功向原始服务器验证之前，缓存不能用该资源响应后续请求

		- proxy-revalidate 

			-   与must-revalidate作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。

		- s-maxage

			- 覆盖max-age或者Expires头，但是仅适用于共享缓存(比如各个代理)，私有缓存会忽略它。

		- 缓存过期机制

			- max-age

			  max-age 指令出现在请求报文，并且缓存资源的缓存时间小于该指令指定的时间，那么就能接受该缓存。
			  max-age 指令出现在响应报文，表示缓存资源在缓存服务器中保存的时间。

			- Expires（首部字段，不是catch-control的）

			  在 HTTP/1.1 中，会优先处理 max-age 指令；
			  在 HTTP/1.0 中，max-age 指令会被忽略掉。

		- 源服务器的缓存控制

			- 私有缓存和公共缓存

				- public

					- 可以在代理中缓存，默认public

				- private

					- 只能在私有缓存中被缓存，适用于用户信息敏感的资源,一般存储在用户浏览器中。

			- 缓存过期

			  must-revalidate的意思是客户端缓存过期就去源服务器获取，而proxy-revalidate则表示代理服务器的缓存过期后到源服务器获取。

				- proxy-revalidate
				- must-revalidate

			- s-maxage

			  s是share的意思，限定了缓存在代理服务器中可以存放多久，和限制客户端缓存时间的max-age并不冲突。

		- 客户端的缓存控制

			- max-stale 和 min-fresh

			  在客户端的请求头中，可以加入这两个字段，来对代理服务器上的缓存进行宽容和限制操作

			- only-if-cached

			  表示客户端只会接受代理缓存，而不会接受源服务器的响应。如果代理缓存无效，则直接返回504（Gateway Timeout）

- Expires

	- Expires  (HTTP 1.0)

		- 一般用Cache-Control，思考为什么

- 服务器再验证

  浏览器或代理缓存中缓存的资源过期了，并不意味着它和原始服务器上的资源有实际的差异，仅仅意味着到了要进行核对的时间了。这种情况被称为服务器再验证。
  
  如果资源发生变化，则需要取得新的资源，并在缓存中替换旧资源。
  如果资源没有发生变化，缓存只需要获取新的响应头，和一个新的过期时间，对缓存中的资源过期时间进行更新即可。

	- HTTP1.0中使用If-Modified-Since/Last-Modified

		- 有些文档资源周期性的被重写，但实际内容没有改变。

		  此时文件元数据中会显示文件最近的修改日期与If-Modified-Since不相同，导致不必要的响应。

		- 有些文档资源被修改了，但修改内容并不重要，不需要所有的缓存都更新（比如代码注释）

	- HTTP1.1推荐使用的验证方式是If-None-Match/Etag

### 作用域

在发送请求之前，发现域名或者路径和这两个属性不匹配，那么就不会带上 Cookie。值得注意的是，对于路径来说，/表示域名下的任意路径都允许使用 Cookie。

- Domain
- Path

### 安全相关

- Secure

  只能通过 HTTPS 传输 cookie

- HttpOnly  (预防XSS攻击)

  只能通过http协议传输，不能通过js访问，预防xss攻击（不能使用document.cookie访问）

- SameSite（预防CSRF攻击）

	- strict

	  浏览器完全禁止第三方请求携带Cookie。比如请求sanyuan.com网站只能在sanyuan.com域名当中请求才能携带 Cookie，在其他网站请求都不能

	-  Lax

	  默认， 允许部分第三方请求携带 Cookie
	  
	  就宽松一点了，但是只能在 get 方法提交表单况或者a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。

	- None （默认）

	  默认模式，请求会自动携带上 Cookie

### 缺点

容量缺陷。Cookie 的体积上限只有4KB，只能用来存储少量的信息。
性能缺陷。Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容。但可以通过Domain和Path指定作用域来解决。
安全缺陷。由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 Cookie 的有效期内重新发送给服务器，这是相当危险的。另外，在HttpOnly为 false 的情况下，Cookie 信息能直接通过 JS 脚本来读取。

- 容量缺陷
- 性能缺陷
- 安全缺陷

### 作用

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

### 与session对比

- 什么是session？

  session 是另一种记录服务器和客户端会话状态的机制
  session 是基于 cookie 实现的，session 存储在服务器端，sessionId 会被存储到客户端的cookie 中

- 与cookie有什么区别

	- 安全性

	  Session 比 Cookie 安全，Session 是存储在服务器端的，Cookie 是存储在客户端的。

	- 存取值类型不同

	  Cookie 只支持存字符串数据，想要设置其他类型的数据，需要将其转换成字符串，Session 可以存任意数据类型。

	- 有效期不同

	  Cookie 可设置为长时间保持，比如我们经常使用的默认登录功能，Session 一般失效时间较短，客户端关闭（默认情况下）或者 Session 超时都会失效。

	- 存储大小不同

	  单个 Cookie 保存的数据不能超过 4K，Session 可存储数据远高于 Cookie，但是当访问量过多，会占用过多的服务器资源。

### Cookie 与 Session 选择

Cookie 只能存储 ASCII 码字符串，而 Session 则可以存储任何类型的数据，因此在考虑数据复杂性时首选 Session；
Cookie 存储在浏览器中，容易被恶意查看。如果非要将一些隐私数据存在 Cookie 中，可以将 Cookie 值进行加密，然后在服务器进行解密；
对于大型网站，如果用户所有的信息都存储在 Session 中，那么开销是非常大的，因此不建议将所有的用户信息都存储到 Session 中。

## 012： HTTP代理

### 功能

负载均衡。客户端的请求只会先到达代理服务器，后面到底有多少源服务器，IP 都是多少，客户端是不知道的。因此，这个代理服务器可以拿到这个请求之后，可以通过特定的算法分发给不同的源服务器，让各台源服务器的负载尽量平均。当然，这样的算法有很多，包括随机算法、轮询、一致性hash、LRU(最近最少使用)等等，不过这些算法并不是本文的重点，大家有兴趣自己可以研究一下。
保障安全。利用心跳机制监控后台的服务器，一旦发现故障机就将其踢出集群。并且对于上下行的数据进行过滤，对非法 IP 限流，这些都是代理服务器的工作。
缓存代理。将内容缓存到代理服务器，使得客户端可以直接从代理服务器获得而不用到源服务器那里。下一节详细拆解。

- 负载均衡
- 保障安全
- 缓存代理

### 相关头部字段

- Via

  现在中间有两台代理服务器，在客户端发送请求后会经历这样一个过程:
  
  客户端 -> 代理1 -> 代理2 -> 源服务器
  复制代码
  在源服务器收到请求后，会在请求头拿到这个字段:
  
  Via: proxy_server1, proxy_server2
  复制代码
  而源服务器响应时，最终在客户端会拿到这样的响应头:
  
  Via: proxy_server2, proxy_server1
  
  Via中代理的顺序即为在 HTTP 传输中报文传达的顺序

- X-Forwarded-For

  字面意思就是为谁转发, 它记录的是请求方的IP地址(注意，和Via区分开，X-Forwarded-For记录的是请求方这一个IP)。

	- 产生的问题

	  由此产生了代理协议，一般使用明文版本，只需要在 HTTP 请求行上面加上这样格式的文本即可:
	  
	  // PROXY + TCP4/TCP6 + 请求方地址 + 接收方地址 + 请求端口 + 接收端口
	  PROXY TCP4 0.0.0.1 0.0.0.2 1111 2222
	  GET / HTTP/1.1
	  ...

		- 意味着代理必须解析 HTTP 请求头，然后修改，比直接转发数据性能下降。
		- 在 HTTPS 通信加密的过程中，原始报文是不允许修改的。

- X-Real-IP
- X-Forwarded-Host
- X-Forwarded-Proto

### 缓存控制-  catch-control

通过cache-control中相关字段控制

- 源服务器的缓存控制

	- 私有缓存和公共缓存

		- public

			- 可以在代理中缓存，默认public

		- private

			- 只能在私有缓存中被缓存，适用于用户信息敏感的资源,一般存储在用户浏览器中。

	- 缓存过期

	  must-revalidate的意思是客户端缓存过期就去源服务器获取，而proxy-revalidate则表示代理服务器的缓存过期后到源服务器获取。

		- proxy-revalidate
		- must-revalidate

	- s-maxage

	  s是share的意思，限定了缓存在代理服务器中可以存放多久，和限制客户端缓存时间的max-age并不冲突。

- 客户端的缓存控制

	- max-stale 和 min-fresh

	  在客户端的请求头中，可以加入这两个字段，来对代理服务器上的缓存进行宽容和限制操作

	- only-if-cached

	  表示客户端只会接受代理缓存，而不会接受源服务器的响应。如果代理缓存无效，则直接返回504（Gateway Timeout）

## 013: 跨域

### 什么是跨域？

当浏览器向目标 URI 发 Ajax 请求时，只要当前 URL 和目标 URL 不同源，则产生跨域，被称为跨域请求。

### 浏览器是如何拦截的？

渲染进程通过IPC将数据放松给主进程，主进程接收到后发出请求，在服务端处理完数据后，将响应返回，主进程检查到跨域，且没有cors响应头，将响应体全部丢掉，并不会发送给渲染进程。这就达到了拦截数据的目的。

### 如何解决跨域问题？

- TODO

## 014:  TLS    TODO

### 传统RSA握手

### TLS1.2握手过程

###  TLS 1.3 做了哪些改进？

## 015： HTTP/2

###  有哪些改进？

二进制协议，不再是纯文本；
多路复用，可发起多个请求，废弃了 1.1 里的管道；
使用专用算法压缩头部，减少数据传输量；
允许服务器主动向客户端推送数据；
增强了安全性，「事实上」要求加密通信。

### 二进制帧

- 帧结构
- 流的特性

	- 并发性
	- 自增性
	- 双向性
	- 可设置优先级

- 流的状态变化

## 016： HTTP的实体数据

### 数据类型与编码

- MIME type

  Multipurpose Internet Mail Extensions
  MIME 把数据分成了 八大类 ，每个大类下再细分出多个子类，形式是 type/subtype
  这里简单列举一下在 HTTP 里经常遇到的几个类别：
  
  text：即文本格式的可读数据，我们最熟悉的应该就是 text/html 了，表示超文本文档，此外还有纯文本 text/plain、样式表 text/css 等。
  image：即图像文件，有 image/gif、image/jpeg、image/png 等。
  audio/video：音频和视频数据，例如 audio/mpeg、video/mp4 等。
  application：数据格式不固定，可能是文本也可能是二进制，必须由上层应用程序来解释。常见的有 application/json，application/javascript、application/pdf 等，另外，如果实在是不知道数据是什么类型，像刚才说的黑盒，就会是 application/octet-stream，即不透明的二进制数据 。

- Encoding type

  gzip：GNU zip 压缩格式，也是互联网上最流行的压缩格式；
  deflate：zlib（deflate）压缩格式，流行程度仅次于 gzip；
  br：一种专门为 HTTP 优化的新压缩算法（Brotli）。相比gzip的压缩率更高，但是压缩时间更长，二者解压时间相当。因此可以预先对静态文件进行压缩，然后直接提供给客户端，这样我们就避免了Brotli压缩效率低的问题，同时使用这个方式，我们可以使用压缩质量最高的等级去压缩文件，最大程度的去减小文件的大小。
  https://segmentfault.com/a/1190000009374437
  
   通常只对文本文件有较好的压缩率

### 数据类型使用的头字段

Accept
Content-type

Accept-encoding
Content-encoding

### 语言类型使用的头字段

Accept-language
Content-language

Accept-charset

### 内容协商的质量值及结果

权重的最大值是 1，最小值是 0.01，默认值是 1，如果值是 0 就表示拒绝。具体的形式是在数据类型或语言代码后面加一个 ; ，然后是 q=value

ps:在大多数编程语言里 ; 的断句语气要强于 , ，而在 HTTP 的内容协商里却恰好反了过来，; 的意义是小于 , 的。
Accept: text/html,application/xml;q=0.9,*/*;q=0.8


Vary 字段，记录服务器在内容协商时参考的请求头字段，给出一点信息，例如：
Vary: Accept-Encoding,User-Agent,Accept

## 017: 传输大文件的方法

### 数据压缩

通常只对文本有着较好的压缩率

### 分块传输

- 使用方式

  在响应报文里用头字段 Transfer-Encoding: chunked 来表示，意思是报文里的 body 部分不是一次性发过来的，而是分成了许多的块（chunk）逐个发送。

- 注意点

  分块传输也可以用于流式数据 ，例如由数据库动态生成的表单页面，这种情况下 body 数据的长度是未知的 ，无法在头字段 Content-Length 里给出确切的长度，所以也只能用 chunked 方式分块发送。
  Transfer-Encoding: chunked 和 Content-Length 这两个字段是 互斥的 ，也就是说响应报文里这两个字段不能同时出现，一个响应报文的传输要么是长度已知，要么是长度未知（chunked）

- 数据传输格式

  每个分块包含两个部分，长度头和数据块；
  长度头是以 CRLF（回车换行，即 \r\n ）结尾的一行明文，用 16 进制数字表示长度；
  数据块紧跟在长度头后，最后也用 CRLF 结尾，但数据不包含 CRLF；
  最后用一个长度为 0 的块表示结束，即 0\r\n\r\n。
  ![image.png](https://i.loli.net/2021/11/15/O5czh2uy716JqLH.png)

### 范围请求（range requests）

获取大文件中的某个片段
服务器： Accept-ranges: bytes 告知客户端支持范围请求； 不支持： Accept-ranges: none

客户端使用Range进行范围请求，格式 bytes=x-y

服务器相应： Content-Range: bytes x-y/length

### 多段数据

Range 头里使用多个 x-y，一次性获取多个片段数据。
需要使用一种特殊的 MIME 类型：multipart/byteranges，表示报文的 body 是由多段字节序列组成的，并且还要用一个参数 boundary=xxx 给出段之间的分隔标记。
![image.png](https://i.loli.net/2021/11/15/Cj3rslD2vZRewuW.png)
例子：
GET /16-2 HTTP/1.1
Host: www.chrono.com
Range: bytes=0-9, 20-29
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000000001
Content-Length: 189
Connection: keep-alive
Accept-Ranges: bytes



--00000000001
Content-Type: text/plain
Content-Range: bytes 0-9/96

// this is
--00000000001
Content-Type: text/plain
Content-Range: bytes 20-29/96

ext json d
--00000000001--

## ：注意

### HTTP 接口不支持 SameSite=none

想加 SameSite=none 属性，那么该 Cookie 就必须同时加上 Secure 属性，表示只有在 HTTPS 协议下该 Cookie 才会被发送。

### 需要 UA 检测，部分浏览器不能加 SameSite=none

IOS 12 的 Safari 以及老版本的一些 Chrome 会把 SameSite=none 识别成 SameSite=Strict，所以服务端必须在下发 Set-Cookie 响应头时进行 User-Agent 检测，对这些浏览器不下发 SameSite=none 属性

## todo: UA检测？

## todo:  在httponly为false 的情况下获取cookie

## 自由主题

