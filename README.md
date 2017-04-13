  ## 安装方式：
  下载安装node：
  https://npm.taobao.org/mirrors/node/latest-v6.x/node-v6.9.1-x64.msi

  安装目录随意

  ## 开发时，不用自动刷新：
  进入项目目录，打开cmd执行命令：
  ```
  npm run dev
  ```
  运行结果如下；
  ```
  > cross-env NODE_ENV=development node index

  ▀ ╢░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  serve static files in src
  proxy to :::http://10.82.82.119:81
  [HPM] Proxy created: /  ->  http://10.82.82.119:81
  server start at: 8090
  ```

  ## 开发时，自动刷新：
  进入项目目录，打开cmd执行命令：
  ```
  npm run dev:hot
  ```
  运行结果如下；
  ```
  > gulp hot

  ▀ ╢░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  [15:23:31] Using gulpfile I:\apm\front\gulpfile.js
  [15:23:31] Starting 'hot'...
  [HPM] Proxy created: /api  ->  http://10.82.82.119:81
  [15:23:31] Finished 'hot' after 64 ms
  [BS] Access URLs:
   --------------------------------------
         Local: http://localhost:8090
      External: http://192.168.1.184:8090
   --------------------------------------
            UI: http://localhost:3001
   UI External: http://192.168.1.184:3001
  ```

  ## 最终项目部署，执行命令：
  ```
  npm run server
  ```
