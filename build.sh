###
 # @Author: your name
 # @Date: 2020-11-27 10:17:14
 # @LastEditTime: 2020-11-27 10:17:15
 # @LastEditors: Please set LastEditors
 # @Description: In User Settings Edit
 # @FilePath: /xspreadsheet/dist/build.sh
### 

#!/bin/bash
echo "begin upload dist.."
npm run build
scp -r dist root@ucloud:/dist
