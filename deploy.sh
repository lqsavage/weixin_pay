#!/usr/bin/env bash

echo -e "\e[1;42m【部署分支：$branch】\e[0m"


#######################
echo '>>> 更新node'
#######################
cd $HOME/code/util/pay/node
# rm -f package-lock.json
# npm i
# 初次运行手动在bash下执行
# pm2 start bin/www --name pay
pm2 reload pay --update-env
sleep 1s


#######################
echo '>>> 更新db'
#######################
# cd $HOME/code/util/pay/db
# psql -U xjp -d $sql -f 'up_db.sql'

# 初次部署或改动postgrest.conf文件后在bash下手动执行:
# postgrest postgrest.conf </dev/null >postgrest.log 2>&1 &
# sleep 2s
# kill -HUP $(lsof -i:$3030 -t)


#######################
echo '>>> 服务器更新完成！'
# sleep 2s
# curl api.diandianyy.com/pay/ 2>/dev/null
