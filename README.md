# X-spreadsheet-online 一款轻量级别的在线excel ✈

![img]( https://img.shields.io/badge/X--spreadsheet--online-James-brightgreen)

前端库借鉴了:
[https://github.com/myliang/x-spreadsheet](https://github.com/myliang/x-spreadsheet)

后端表格库与生成算法基于: [https://github.com/qax-os/excelize](https://github.com/qax-os/excelize)

我对他们做了整合，添加了表格生成算法

## 访问地址

[http://106.75.227.222:5001/](http://106.75.227.222:5001/)
## 实现的功能
### 在线设计文档及导出

![](https://github.com/zxhjames/learn_resource/blob/gif/mygif/test3-min.gif?raw=true)
### 自动填充字段导出

![](https://github.com/zxhjames/learn_resource/blob/gif/mygif/test4-min.gif?raw=true)


如果喜欢的话，就请作者喝杯☕️继续创作吧!

<img src="https://raw.githubusercontent.com/zxhjames/ImageReposity/master/WechatIMG514.jpeg" width="200" height="300" alt="微信小程序"/><br/>


## 如何安装

* 后端
```shell
git checkout -b main
git clone https://github.com/zxhjames/X-spreadsheet-online
cd X-spreadsheet-online
修改config目录下config.yaml文件的配置，改成你自己的
修改main中100行代码中的config.yml路径，改为你自己电脑上的绝对路径
go run main.go
```

* 前端
```shell
git checkout -b dev
git clone https://github.com/zxhjames/X-spreadsheet-online
cd X-spreadsheet-online
替换目录下所有请求的ip为localhost,index.html里的数据库连接信息改成自己的
npm install
npm run dev
```

* docker部署方式
可以让web服务，pg数据库单独跑在一个docker里，前端直接用npm的http-server插件即可

* 其他
建议在本地进行测试开发，最后所有项目打包发布，避免安全问题发生

## 微信公众号
更多分享请关注我的公众号《James的黑板报》

![](https://github.com/zxhjames/learn_resource/blob/gongzhonghao/gongzhonghao.jpg?raw=true)

