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
	
	
	
	- .GET请求会产生一次TCP数据包,浏览器会把http,header,data一并发送出去
	
	  　　　POST请求会产生两次TCP数据包  浏览器先发送请求头,服务器响应100 continue,  浏览器再发送请求体

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

  由 HTTP 基本的 请求 - 应答 模型所导致

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

## 010：HTTP队头阻塞问题

### 并发连接

同时对一个域名发起多个长连接，用数量来解决质量的问题 。

### 域名分片

使用多个域名指向同一台服务器

### 注意

利用 HTTP 的长连接特性对服务器发起大量请求，导致服务器最终耗尽资源，拒绝服务，这就是常说的 DDos 攻击
HTTP 的连接管理还有第三种方式 pipeline（管道或流水线），它在长连接的基础上又进了一步，可以批量发送请求批量接收响应，但因为存在一些问题，Chrome、Firefox 等浏览器都没有实现它，已经被事实上废弃了
Connection 字段还有一个取值： Connection: Upgrade 配合状态码 101 表示协议升级，例如从 HTTP 切换到 WebSocket

## 011: cookie

Cookie 并不属于 HTTP 标准（RFC6265，而不是 RFC2616/7230），所以语法上与其他字段不太一致，使用的分隔符是 ; ，与 Accept 等字段的 , 不同
```js
Set-Cookie: <cookie-name>=<cookie-value>
Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>
Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<non-zero-digit>
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
Set-Cookie: <cookie-name>=<cookie-value>; Secure
Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly

Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax

// Multiple directives are also possible, for example:
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
```

### Name/Value 

- 都必须是字符串类型

	- 值为 Unicode 字符，需要为字符编码。
	- 值为二进制数据，则需要使用 BASE64 编码

### 生存周期

若 Cookie 过期，则这个 Cookie 会被删除，并不会发送给服务端。

- Max-Age
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

  表示这个 Cookie 仅能用 HTTPS 协议加密传输 ，明文的 HTTP 协议会禁止发送。但 Cookie 本身不是加密的，浏览器里还是以明文的形式存在。

- HttpOnly  (预防XSS攻击)

  只能通过http协议传输，不能通过js访问，预防xss攻击（不能使用document.cookie访问）

- SameSite（预防CSRF攻击）

	- strict

	  浏览器完全禁止第三方请求携带Cookie。比如请求sanyuan.com网站只能在sanyuan.com域名当中请求才能携带 Cookie，在其他网站请求都不能

	-  Lax

	  默认， 允许部分第三方请求携带 Cookie
	  
	  就宽松一点了，但是只能允许 GET/HEAD 等安全方法，a 标签发送 get 请求的情况下可以携带 Cookie，但禁止 POST 跨站发送。

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

  轮询负载均衡算法
  在upstream模块设置权重，权重越大，分发的请求到该服务器的上的数量越大。
  最少连接数负载均衡算法
  根据打开连接数实现负载均衡，nginx根据连接数判读服务器当前性能好坏，将请求分配给性能最好(连接最少)的服务器
  最短响应时间负载均衡算法
  nginx会将请求分发给平均响应时间更短的应用服务器。
  基于Hash负载均衡算法
  根据请求方法不同，分配不同的服务器。当有服务器被添加或者删除的时候会重新添加hash值进行分发，这个算法就是使用的是一致性hash算法。
  IP_Hash负载均衡算法
  这个算法基于Hash负载均衡算法对访问者的ip求hash,从而实现负载均衡。这个可以保证没有办法存储session 或者session丢失的请求，只要ip不发生改变，
  并且服务器可用的情况下，请求永远都负载同一台服务器上。

- 缓存代理
- 安全防护
- 数据处理

### 相关头部字段

Via
X-Forwarded-For
	产生的问题
		意味着代理必须解析 HTTP 请求头，然后修改，比直接转发数据性能下降。
		在 HTTPS 通信加密的过程中，原始报文是不允许修改的。
	:question: 如何解决？
代理协议有 v1 和 v2 两个版本，v1 和 HTTP 差不多，也是明文，而 v2 是二进制格式。
开头必须是 PROXY 五个大写字母，然后是 TCP4 或者 TCP6 ，表示客户端的 IP 地址类型，再后面是请求方地址、应答方地址、请求方端口号、应答方端口号，最后用一个回车换行（\r\n）结束。
```bash
PROXY TCP4 1.1.1.1 2.2.2.2 55555 80\r\n
GET / HTTP/1.1\r\n
Host: www.xxx.com\r\n
\r\n
```
X-Real-IP
X-Forwarded-Host
X-Forwarded-Proto

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

gzip: 压缩率通常能够超过 60%
br： 专门为 HTML 设计的，压缩效率和性能比 gzip 还要好，能够再提高 20% 的压缩密度

### 分块传输

- 使用方式

  在响应报文里用头字段 Transfer-Encoding: chunked 来表示，意思是报文里的 body 部分不是一次性发过来的，而是分成了许多的块（chunk）逐个发送。

- 注意点

  分块传输也可以用于流式数据 ，例如由数据库动态生成的表单页面，这种情况下 body 数据的长度是未知的 ，无法在头字段 Content-Length 里给出确切的长度，所以也只能用 chunked 方式分块发送。
  Transfer-Encoding: chunked 和 Content-Length 这两个字段是 互斥的 ，也就是说响应报文里这两个字段不能同时出现，一个响应报文的传输要么是长度已知，要么是长度未知（chunked）
  Transfer-Encoding 字段最常见的值是 chunked，但也可以用 gzip、deflate 等，表示传输时使用了压缩编码。注意这与 Content-Encoding 不同，Transfer-Encoding 在传输后会被自动解码还原出原始数据，而 Content-Encoding 则必须由应用自行解码
  Trailer 是一个响应首部，允许发送方在分块发送的消息后面添加额外的元信息，这些元信息可能是随着消息主体的发送动态生成的，比如消息的完整性校验，消息的数字签名，或者消息经过处理之后的最终状态等。

- 数据传输格式

  每个分块包含两个部分，长度头和数据块；
  长度头是以 CRLF（回车换行，即 \r\n ）结尾的一行明文，用 16 进制数字表示长度；因此数据中包含回车换行并不影响数据传输
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
注意：  Range 是针对原文件，不是压缩后的文件

使用一种特殊的 MIME 类型：multipart/byteranges，表示报文的 body 是由多段字节序列组成的
要用一个参数 boundary=xxx 给出段之间的分隔标记。
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

## 018： HTTP的重定向和跳转

### 大致流程

浏览器收到 301/302 报文，会检查响应头里有没有 Location 。如果有，就从字段值里提取出 URI，发出新的 HTTP 请求，相当于自动替我们点击了这个链接。

在 Location 里的 URI 既可以使用 绝对 URI，也可以使用 相对 URI ：

### 重定向状态码

301 俗称 永久重定向（Moved Permanently）
意思是原 URI 已经「永久」性地不存在了，今后的所有请求都必须改用新的 URI。
浏览器看到 301，就知道原来的 URI「过时」了，就会做适当的优化。比如历史记录、更新书签，下次可能就会直接用新的 URI 访问，省去了再次跳转的成本。搜索引擎的爬虫看到 301，也会更新索引库，不再使用老的 URI。
302 俗称 临时重定向（Moved Temporarily），意思是原 URI 处于 临时维护 状态，新的 URI 是起顶包作用的临时工。
浏览器或者爬虫看到 302，会认为原来的 URI 仍然有效，但暂时不可用，所以只会执行简单的跳转页面，不记录新的 URI，也不会有其他的多余动作，下次访问还是用原 URI。
301/302 是最常用的重定向状态码，在 3×× 里剩下的几个还有：

303 See Other：类似 302，但要求重定向后的请求改为 GET 方法，访问一个结果页面，避免 POST/PUT 重复操作；
307 Temporary Redirect：类似 302，但重定向后请求里的方法和实体不允许变动，含义比 302 更明确；
308 Permanent Redirect：类似 307，不允许重定向后的请求变动，但它是 301 永久重定向的含义。

### 重定向的相关问题

性能损耗
大量的跳转对服务器的影响也是不可忽视的。站内重定向还好说，可以长连接复用，站外重定向就要开两个连接，如果网络连接质量差，那成本可就高多了，会严重影响用户的体验。
循环跳转
如果重定向的策略设置欠考虑，可能会出现 A=>B=>C=>A 的无限循环，不停地在这个链路里转圈圈，后果可想而知。
所以 HTTP 协议特别规定，浏览器必须具有检测 循环跳转 的能力，在发现这种情况时应当停止发送请求并给出错误提示。

## 019： HTTP  缓存控制

通过cache-control中相关字段控制
注意：
请求 - 应答的双方都可以用这个字段进行缓存控制，互相协商缓存的使用策略
，源服务器在设置完 Cache-Control 后必须要为报文加上 Last-modified 或 ETag 字段
```sh
private, max-age=5
public, max-age=5, s-maxage=10
max-age=30, proxy-revalidate, no-transform
```
流程：
浏览器发现缓存无数据，于是发送请求，向服务器获取资源；
服务器响应请求，返回资源，同时标记资源的有效期；
浏览器缓存资源，等待下次重用。

### 

- 源服务器的缓存控制

	- 是否缓存

	  no_store ：不允许缓存 ，用于某些变化非常频繁的数据，例如秒杀页面；
	  no_cache ：它的字面含义容易与 no_store 搞混，实际的意思并不是不允许缓存，而是 可以缓存,但在使用之前必须要去服务器验证是否过期，是否有最新的版本；

	- 私有缓存和公共缓存

	  public
	  	可以在代理中缓存，默认public
	  private
	  	只能在私有缓存中被缓存，适用于用户信息敏感的资源,一般存储在用户浏览器中。

	- 缓存过期

	  must-revalidate的意思是客户端缓存过期就去源服务器获取，而proxy-revalidate则表示代理服务器的缓存过期后到源服务器获取。
	  immutable 表示响应正文不会随时间而改变。资源（如果未过期）在服务器上不发生改变，因此客户端不应发送重新验证请求头（例如If-None-Match或If-Modified-Since）来检查更新，

	- s-maxage

	  s是share的意思，限定了缓存在代理服务器中可以存放多久，和限制客户端缓存时间的max-age并不冲突。

- 客户端的缓存控制

  点 「刷新」按钮的时候，浏览器会在请求头里加一个 Cache-Control: max-age=0

	- max-stale 和 min-fresh

	  在客户端的请求头中，可以加入这两个字段，来对代理服务器上的缓存进行宽容和限制操作

	- only-if-cached

	  表示客户端只会接受代理缓存，而不会接受源服务器的响应。如果代理缓存无效，则直接返回504（Gateway Timeout）

	- no-transform

	  不得对资源进行转换或转变。Content-Encoding、Content-Range、Content-Type等HTTP头不能由代理修改。例如，非透明代理或者如Google's Light Mode可能对图像格式进行转换，以便节省缓存空间或者减少缓慢链路上的流量。no-transform指令不允许这样做。

	- 条件请求

	  条件请求一共有 5 个头字段：
	  
	  if-Modified-Since：和 Last-modified 比较
	  和 Last-modified 对比，是否已经修改了
	  If-None-Match ：和 ETag 比较
	  和 ETag 比较是否不匹配
	  If-Unmodified-Since
	  和 Last-modified 对比，是否已未修改
	  If-Match
	  和 ETag 比较是否匹配
	  If-Range
	  我们最常用的是 if-Modified-Since 和 If-None-Match 这两个。需要第一次的响应报文预先提供 Last-modified 和 ETag ，然后第二次请求时就可以带上缓存里的原值，验证资源是否是最新的。
	  如果资源没有变，服务器就回应一个 304 Not Modified ，表示缓存依然有效，浏览器就可以更新一下有效期，然后放心大胆地使用缓存了。
	  
	  
	  PS: 
	  ETag 是 实体标签（Entity Tag） 的缩写，是资源的一个唯一标识 ，主要是用来解决修改时间无法准确区分文件变化的问题。
	  强 ETag 要求资源在字节级别必须完全相符 ，弱 ETag 在值前有个 W/ 标记 ，只要求资源在语义上没有变化，但内部可能会有部分发生了改变（例如 HTML 里的标签顺序调整，或者多了几个空格）。

- catch和cookie的异同

## ：注意

### HTTP 接口不支持 SameSite=none

想加 SameSite=none 属性，那么该 Cookie 就必须同时加上 Secure 属性，表示只有在 HTTPS 协议下该 Cookie 才会被发送。

### 需要 UA 检测，部分浏览器不能加 SameSite=none

IOS 12 的 Safari 以及老版本的一些 Chrome 会把 SameSite=none 识别成 SameSite=Strict，所以服务端必须在下发 Set-Cookie 响应头时进行 User-Agent 检测，对这些浏览器不下发 SameSite=none 属性

## todo: UA检测？

## todo:  在httponly为false 的情况下获取cookie

