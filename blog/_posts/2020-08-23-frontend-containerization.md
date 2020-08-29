---
title: 如何容器化前端 html
date: 2020-08-22
tags: 
  - html
  - nginx
  - docker
author: Menfre
location: Shenzhen
---

对于如何容器化前端 html，见过最粗暴的方式是将 html 与 nginx，甚至将 html、nginx 与后台程序打包到一个镜像中。这种方式千万不可采取，为什么呢？请听我慢慢道来。实际上容器是一种单进程模型，容器在运行时跟其他普通的进程其实并没有什么很大不同，仅仅是被加上了一些特殊的限制罢了。容器中的应用程序应该是与容器同生命周期的，如果一个容器中运行了多个应用，那么容器将不知道如何去管理它们，因为它只能知道其中一个应用的生与死，假如你的应用生病了它也只能照顾到其中的一个。还有这种方式最最直观的问题是更新十分不方便，一旦前端或后端有更新需求你就只能重新打一个镜像，十分笨重，况且你要知道 nginx 通常是不需要一直更新的。

好了，说了那么多废话就进入主题吧。这里最合适的方式还是将 html 与 nginx 打包成两个镜像，他们之间通过挂载相同的 volume 来共享数据。

![html-containerization-process](/image/html-containerization-process.png)

通常 html container 是一个资源镜像，启动后往 Volume 中写入静态文件后就退出了，而 nginx container 则在 html container 运行完成后启动，这个时候它就有一些静态资源可以 serving 了。且每次前端 html 更新时我们只需要替换对应的资源镜像即可。

以我们的假象项目 cloud 为例子：

```yaml
version: '3'
services:
  cloud-server:
    image: harbor.[your-domain]/my-project/cloud-server:1.0-SNAPSHOT
    depends_on:
      - db
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: container
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/cloud?cachePrepStmts=true&useUnicode=true&characterEncoding=utf8
    networks:
      - frontend
      
  cloud-front:
    image: harbor.[your-domain]/my-project/cloud-front
    volumes:
      - front-html:/usr/share
    command: sh -c "
            rm -rf /usr/share/cloud-front
            && cp -rf /resources/cloud-front /usr/share/cloud-front
            "
  web:
    image: nginx
    depends_on:
      - cloud-front
    volumes:
      - /etc/nginx/templates:/etc/nginx/templates
      - /etc/nginx/nginx.conf:/etc/nginx/nginx.conf
      - front-html:/webserver/nginx_html
    ports:
      - "80:80"
      - "443:443"
    networks:
      - frontend
      
networks:
  frontend:

volumes:
  front-html:
```

1. 这里我们声明一个数据卷 front-html 和一个 network frontend，front-html 用于在 nginx 与 html container 之间共享数据，而 frontend 则负责打通前后端的网络。在前端中有访问后端 API 需求的，这里包含在 html 以及在 nginx 配置文件中，可以通过 http://[service-name]:[port]/[path] 的方式，如: http://cloud-server:9090/cloud/server。
2. 在我们的 cloud-front service 中，我们通过 sh -c "rm -rf /usr/share/cloud-front && cp -rf /resources/cloud-front /usr/share/cloud-front" command 在每次容器运行时都将前端容器中的静态文件覆盖到 /usr/share/cloud-front 路径下，而 /usr/share 则是我们挂载 front-html 的路径。在 nginx 中则是将 front-html 挂载到 /webserver/nginx_html，这个路径就是我们 nginx 中放静态资源的路径。这里还需要注意一点是容器的启动顺序，前端容器一定要在 nginx 容器启动前先启动，不然 nginx 先启动就没东西可以 serving 了。

> 细心的同学注意到 cloud-front 中的 command 是先删除再复制到对应的目录下的，这样做是确保 cp 命令能正确复制文件到对应目录下，而不会出错。

3. nginx 中我们将 /etc/nginx/templates 挂载到宿主机的 /etc/nginx/templates，实际上 nginx 在启动前会先运行 envsubst 将 /etc/nginx/templates/*.template 路径下的 template 映射成 /etc/nginx/conf.d，这样的好处是我们可以直接在 template 中通过 ${[env-name]} 的方式定义环境变量，后续使用 environment 关键字来填充变量即可。

参考资料:

1. [nginx 官方镜像首页](https://hub.docker.com/_/nginx)

 
 <comment/> 
