---
title: Spring 项目容器化
date: 2020-08-22
tags: 
  - spring
  - docker
author: Menfre
location: Shenzhen
---

相信大家对 docker 都有所了解，:smirk: ​或早已轻车熟路了。那我们就直奔主题。这里之所以要容器化，目标是想借助 k8s 的容器编排在多个节点间来管理和运维错综复杂的应用关系。当然我们离使用 k8s 还有一定的距离，这里我们先迈出容器化这一小步。

这里以 spring 项目为例。

## 编写 Dockerfile

Dockerfile 是 docker 用来定义如何打包容器镜像的命令集合。内容如下：

```dockerfile
FROM openjdk:8-jdk-alpine
WORKDIR /app
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 9091
ENTRYPOINT ["sh", "-c", "java -jar ./app.jar ${0} ${@}"]
```
1. FROM 命令的作用是指定在哪个已有的镜像上进行打包，这里我们是打包 Java 项目，自然需要在 jdk 环境上进行打包。alpine 版本通常是指精简过的镜像版本，适用于二次打包的需求
2. WORKDIR 命令的作用是定义工作目录，往后的命令都会在所定义的工作目录下运行
3. ARG 声明参数，可以在使用 docker build 的时候传递命令行参数，可以通过 =target/*.jar 来声明默认值
4. COPY 命令用于将打包上下文中的内容拷贝到镜像中
5. EXPOSE 无实际作用，类似注释的存在，仅仅告诉你当前应用工作在 9091 端口
6. ENTRYPOINT 定义容器运行时所执行的命令以及命令参数；\${0}\${@} 均是占位符，\${0} 指在 docker run 时最后面跟的 cmd 补充到当前位置，\${@} 指将 docker run cmd 之后的所有参数都补充到当前位置。

> 这里使用 \${0} \${@} 来传递命令和命令参数是贴近 supervisor 的做法。如 supervisor 中我们会通过 java -jar xxx.jar --spring.profiles.active=prod 来传递参数，容器化后我们仍然可以通过类似的 docker run -p 9091:9091 -d --name xxxx-server xxxx-server:latest --spring.profiles.active=prod 的方式来启动容器。
> 
>我们可以使用 openjdk:8u252-jre-slim 来替换 openjdk:8-jdk-alpine，可以进一步缩小镜像体积。
## docker build

有了 Dockerfile 后，我们就可以使用 docker build 来打包镜像了，通常我们会将 Dockerfile 文件放在项目根目录下。如下：

![project-directory](/image/project-directory.jpg)

此时我们可以 cd 到 spring-demo 目录下，执行 `docker build -t spring-demo:1.0-SHAPSHOT .
`，:weary: 如无意外你会翻车。如下所示：

![docker-build-failed](/image/docker-build-failed.jpg)

这里我们 COPY 命令是将 target/ 目录下的可执行 jar 拷贝到镜像中，所以在执行 docker build 之前需要先 package 一下，确保 target 文件夹下已经存在可执行 jar 了。如下是已经打好的镜像。

![docker-images](/image/docker-images.jpg)

当然直接通过 `docker build` 方式还不够方便，有时会遗忘 package 这个操作，而且还要手动打 tag。:star2: ​此时聪明的 Java 程序员就会寻找 maven 插件了，只要我们将 build 这个操作跟 package 生命周期绑定在一起不就可以了吗。

接下来我们会使用 `dockerfile-maven-plugin` 插件来代替 docker build。

```xml
<properties>
	<docker.repository>harbor.[your-domain].com</docker.repository>
    <docker.image.prefix>my-project</docker.image.prefix>
</properties>

<plugin>
    <groupId>com.spotify</groupId>
    <artifactId>dockerfile-maven-plugin</artifactId>
    <version>${dockerfile-maven-version}</version>
    <executions>
        <execution>
            <id>default</id>
            <goals>
                <goal>build</goal>
                <!-- <goal>push</goal> -->
            </goals>
        </execution>
    </executions>
    <configuration>
        <repository>${docker.repository}/${docker.image.prefix}/${project.artifactId}</repository>
        <tag>${project.version}</tag>
        <buildArgs>
            <JAR_FILE>target/${project.build.finalName}.jar</JAR_FILE>
        </buildArgs>
        <useMavenSettingsForAuth>true</useMavenSettingsForAuth>
    </configuration>
</plugin>
```

关于 `dockerfile-maven-plugin` 的使用我们不做过多的赘述，如有疑问 [出门左转!!!](https://github.com/spotify/dockerfile-maven)

这里我们需要注意的是 harbor.[your-domain].com，这是我们为容器准备的私库。我们的镜像在本地调试完成后，可以直接 push 到私库。当然 push 之前你需要取得 harbor 账户。关于 harbor 如何安装部署，可自行 google，将 [your-domain] 替换成你的 harbor 访问域名即可。

`<useMavenSettingsForAuth>true</useMavenSettingsForAuth>` 这里声明使用 Maven settings 方式登录。因此我们需要将账户配置在 Maven settings.xml 中。

```xml
<server>
    <id>harbor.[your-domain].com</id>
    <username>menfre</username>
		<password>********</password>
</server>
```

OK，如无意外你会成功将镜像推送到 harbor, 日后你只需要在任意服务器 docker login and docker pull 就可以将镜像拉取下来执行了。

### .dockerignore

我们打包镜像时可以在根目录编辑一个 .dockerignore。它的作用是在打包时将不必要的文件和文件夹过滤掉，避免发送给 docker deamon 的打包上下文过大。(docker 实际是一个 cs 结构，其中包含  dockerctl 和 deamon，docker build 执行的过程中会将指定的上下文整个发送给 deamon 完成打包)

> NOTE: 在使用私库前，需要先将私库配置在 docker 的 daemon.json 中。然后通过 `docker login harbor.[your-domain].com` 完成登录。

## docker run 

有了镜像之后，我们就可以方便的分发和运行容器啦。

假设我们已经将镜像推送到我们的私库中，这里我们以 harbor.[your-domain].com/my-project/spring-demo:1.0-SNAPSHOT 为例。

```shell
docker run -d --network=host --name spring-demo harbor.[your-domain].com/my-project/spring-demo:1.0-SNAPSHOT --spring.profiles.active=container
```

1. -d 后台运行
2. --network=host 设置与宿主机同个 network namespace
3. --name 容器取名为 spring-demo
4. --spring.profiles.active=container，指定 spring profile 为 container，这里可以为 spring 项目指定任意配置参数

查看日志可以通过 `docker logs -f [容器ID]` 命令。

看到这恭喜你，迈出了容器化的一小步。:clap: :clap: :clap:
