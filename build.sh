#!/bin/bash
echo "开始推送...."
env GOOS=linux GOARCH=386 go build main.go
mv main docker/app
cp -rf configs docker
scp -r docker root@ucloud:/docker/go/xsheetServer
echo "推送成功"