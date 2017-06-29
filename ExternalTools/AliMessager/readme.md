阿里消息订阅工具说明
==========
*因阿里只提供了JAVA版和PHP版的消息订阅SDK,且改写成NodeJS方式也比较耗时间,所以目前只借用Java SDK来进行阿里商品对接的消息订阅*

实现方式
----
+ 工具收到阿里推送的消息后直接通过http方式发给node服务
+ 发送方式为POST
+ 发送格式为:`"topic=" + this.topic + "&message=" + URLEncoder.encode(this.message,"UTF-8");`

调用方式
----
目录中的`release`目录中的`ali_messsager.jar`为最终使用的jar包

调用语法为:
`java -jar ali_message.js [api地址]`
例如:
`java -jar ali_messager.jar http://127.0.0.1:3000/goods/notification`

则收到消息后会POST到[http://127.0.0.1:3000/goods/notification](http://127.0.0.1:3000/goods/notification)中

数据格式
----
`topic` 阿里接口名
`message` 返回的JSON串

日志记录
----
所有日志会按照每小时分割成单独文件
所有收到购买成功的消息都记为ERROR
其他消息记为WARN
