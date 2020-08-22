---
title: 使用 docker-compose 部署 Spring 应用
date: 2020-08-22
tags: 
  - spring
  - docker
author: Menfre
location: Shenzhen
---

在上一篇中我们知道了如何去容器化一个 spring 项目并运行单一容器。但在实际情况中，往往我们的容器并不是孤军奋战的，它们总是会依赖其他的容器并成组调度和运行。因此我们可以使用 docker-compose 在单个机器中快速部署多个容器或多个容器组成的应用。如果有在多个机器中部署多个容器的需求我们可以使用 docker swarm 或 kubenetes 等容器平台。由于历史原因，kukernetes 已然成为了 container Kingdom 中的 king :crown: 了，本于擒贼先擒王的原则，当然建议直接上 kubernetes。

使用 docker-compose 的关键是写好 docker-compose.yml。docker-compose 通过声明的方式来描述多个容器是如何关联和运行的。

docker-compose 中的关键概念是 project 和 service。project 指多个 service(container) 组成的 project，service 指一个容器服务或多实例的容器服务。

docker-compose 大部分命令都是针对 project 的，如 docker-compose up/down 等。如有疑问 [出门左转!!!](https://yeasy.gitbook.io/docker_practice/compose)

这里我们假象一个云项目作为例子。

## my-project 容器列表

cloud 容器列表：

* db: mysql，用于持久化 cloud 数据

* cloud-server: 提供 cloud web 服务，依赖于 db

* cloud-scheduler: 在后台执行 cloud 的调度服务，依赖于 db 和 cloud-server

* cloud-other: 其他服务，可独立运行

## docker-compose.yml

```yaml
version: '3'
services:

  cloud-server:
    image: harbor.[your-domain].com/my-project/cloud-server:1.0-SNAPSHOT
    ports:
      - "9090:9090"
    depends_on:
      - db
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: container
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/cloud?cachePrepStmts=true&useUnicode=true&characterEncoding=utf8
    networks:
      - backend

  cloud-scheduler:
    image: harbor.[your-domain].com/my-project/cloud-scheduler:1.0-SNAPSHOT
    depends_on:
      - db
      - cloud-server
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: container
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/cloud?cachePrepStmts=true&useUnicode=true&characterEncoding=utf8
    networks:
      - backend

  cloud-other:
    image: harbor.[your-domain].com/my-project/cloud-other:1.0-SNAPSHOT
    ports:
      - "9091:9091"
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: container

  db:
    image: mysql:5.7
    ports:
      - "3306:3306"
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 12345678
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - backend

networks:
  backend:

volumes:
  db-data:
```

首先国际惯例，声明 docker-compose 的 version，通常是 3 或 3.x。

然后我们需要在 services 中声明我们需要用到的容器。与 docker run 的行为基本一致。如下：

```yaml
  cloud-server:
    image: harbor.[your-domain].com/my-project/cloud-server:1.0-SNAPSHOT
    ports:
      - "9090:9090"
    depends_on:
      - db
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: container
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/cloud?cachePrepStmts=true&useUnicode=true&characterEncoding=utf8
    networks:
      - backend
```

1. image: 声明所使用的镜像信息
2. ports: 与 docker run -p 参数行为一致
3. depends_on: 用于声明当前容器依赖哪些容器或需要在哪些容器启动后才能运行
4. environment: 用于声明环境变量。与 docker run -e 参数行为一致
5. networks: 声明容器工作在哪个网络下，需要先定义 network

> my-project 中的其中容器声明大同小异，照葫芦画瓢即可。

除了 network 外我们还需要为 db 服务声明一个 volume，这里这么做的好处是即使 db 容器被删除了，下次只需要重新将 volume 挂载到容器中即可将数据恢复。volume 是独立于容器的。

最后我们来看下部署完的效果图：

![docker-compose-example](/image/docker-compose-example.jpg)

如果你坚持看完了，:call_me_hand: :call_me_hand: :call_me_hand: 那么恭喜你点亮了 docker-compose 初级技能～～～

