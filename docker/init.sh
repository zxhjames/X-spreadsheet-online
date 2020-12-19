#!/bin/bash
echo "开始部署"
docker build -t excel-server .
docker rm -f excel-server
docker run -it -p 9091:9091 --name excel-server --restart=always -v /sheets:/sheets -v /logs:/go/src/log  -v /configs:/go/src/configs -v /etc/localtime:/etc/localtime:ro excel-server
echo "启动成功"

