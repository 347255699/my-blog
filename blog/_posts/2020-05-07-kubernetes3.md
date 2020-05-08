---
title: 认真学习 kubernetes——打包应用
date: 2020-05-07
tags: 
  - k8s
author: Menfre
location: Shenzhen
---

通过前面两篇博客的环境搭建，我们拥有了一个 k8s 环境和一个 harbor 容器注册中心。现在我们需要尝试将应用容器化然后发布到 harbor 中。

## 1. 准备应用

首先我们需要准备一个 Springboot 应用(Java 应用)。这里我们只启用了 rest service 功能，并集成一个 swagger-ui 方便我们对应用进行访问。

这里我们通过 Maven 来管理依赖和打包应用。

因此我们首先需要配置好 pom.xml 文件。

pom.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.2.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>org.mendora</groupId>
    <artifactId>spring-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <java.version>1.8</java.version>
        <dockerfile-maven-version>1.4.13</dockerfile-maven-version>
        <docker.repository>harbor.com</docker.repository>
        <docker.image.prefix>library</docker.image.prefix>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>2.9.2</version>
        </dependency>

        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
            <version>2.9.2</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>


            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-deploy-plugin</artifactId>
                <configuration>
                    <skip>true</skip>
                </configuration>
            </plugin>

            <plugin>
                <groupId>com.spotify</groupId>
                <artifactId>dockerfile-maven-plugin</artifactId>
                <version>${dockerfile-maven-version}</version>
                <executions>
                    <!--<execution>-->
                        <!--<id>default</id>-->
                        <!--<goals>-->
                            <!--<goal>build</goal>-->
                            <!--<goal>push</goal>-->
                        <!--</goals>-->
                    <!--</execution>-->
                </executions>
                <configuration>
                    <repository>${docker.repository}/${docker.image.prefix}/${project.artifactId}</repository>
                    <tag>${project.version}</tag>
                    <buildArgs>
                        <JAR_FILE>${project.build.finalName}.jar</JAR_FILE>
                    </buildArgs>
                    <useMavenSettingsForAuth>true</useMavenSettingsForAuth>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

HelloApplication.java:

```java
@SpringBootApplication
@RestController
public class HelloApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelloApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return String.format("Hello %s!", name);
    }
}
```

SwaggerConfig.java:

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
          .select()                                  
          .apis(RequestHandlerSelectors.any())
          .paths(PathSelectors.any())
          .build();                                           
    }
}
```

有了 Maven 配置和 Springboot 的启动源代码之外，我们还需要在项目根目录下放一个 Dockerfile 文件。

Dockerfile:

```dockerfile
FROM openjdk:8-jdk-alpine
ARG JAR_FILE=*.jar
COPY target/${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```
[源码链接]()

## 2. 打包应用

这里我们使用 dockerfile-maven-plugin 插件来打包和发布我们的应用。

```xml
<plugin>
    <groupId>com.spotify</groupId>
    <artifactId>dockerfile-maven-plugin</artifactId>
    <version>${dockerfile-maven-version}</version>
    <executions>
        <!--<execution>-->
        <!--<id>default</id>-->
        <!--<goals>-->
        <!--<goal>build</goal>-->
        <!--<goal>push</goal>-->
        <!--</goals>-->
        <!--</execution>-->
    </executions>
    <configuration>
        <repository>${docker.repository}/${docker.image.prefix}/${project.artifactId}</repository>
        <tag>${project.version}</tag>
        <buildArgs>
            <JAR_FILE>${project.build.finalName}.jar</JAR_FILE>
        </buildArgs>
        <useMavenSettingsForAuth>true</useMavenSettingsForAuth>
    </configuration>
</plugin>
```

示例中注释的部分是跟 maven 的 package、deploy 等生命周期绑定的配置，如果你需要在发布 jar 的同时发布镜像，可以通过该配置来绑定。

这里我们通过 `useMavenSettingsForAuth` 的方式来配置私库的账户和密码。因此需要在 Maven setting.xml 粘贴如下服务器信息。

```xml
<server>
    <id>harbor.com</id>
    <username>admin</username>
    <password>xxxxx</password>
</server>
```

这里注意 id 需要跟 ${docker.repository} 的值一致，这里可以填写你的 harbor 访问地址。

当前面的项目源码还有 Maven 配置准备好后，我们就可以通过 dockerfile:build 来构建镜像了。

构建完成可以通过 docker image ls 来查询我们构建的镜像。

```shell
MenfredeMacBook-Pro:spring-demo menfre$ docker image ls
REPOSITORY                       TAG                 IMAGE ID            CREATED             SIZE
harbor.com/library/spring-demo   1.0-SNAPSHOT        3ac8f4d1d029        5 hours ago         132MB
```

这里我们可以先测试下镜像是否可用，运行如下命令 run 一下。

```shell
 docker run -p 8080:8080 3ac8f4d1d029
```

如果一切顺利你会看到如下日志：

```shell
2020-05-08 14:12:57.734  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2020-05-08 14:12:57.737  INFO 1 --- [           main] org.mendora.HelloApplication             : Started HelloApplication in 3.339 seconds (JVM running for 3.96)
```

我们可以访问一下 Swagger-ui。

```http
 http://localhost:8080/swagger-ui.html 
```

![swagger-ui](/image/swagger-ui.jpg)

看起来我们的容器是正确可用的，接下来我们就可以通过 dockerfile:push 推送到 harbor 了。

推送前我们要确认一下，是否在本地配置了 harbor.com hosts。是否将 https://harbor.com 配置为 docker 的私库了。

这里我通过图形化界面配置。

![image-20200508222026195](/image/docker.png)

当然你也可以通过 daemon.json 来配置。

```json
{
  "insecure-registries" : [
    "https://harbor.com"
  ]
}
```

配置完成记得重启下 docker 来生效。

一切就绪后我们就可以通过 dockerfile:push 来推送镜像了。

最后你就可以在我们的镜像仓库中看到我们推送的镜像了。

![image-20200508222436939](/image/harbor-images.png)

通过前面三篇博客我们算是搭建了一个完整的 k8s 环境了，接下来就可以好好练习了。

## 资料

1. [spotify/dockerfile-maven](https://github.com/spotify/dockerfile-maven)

2. [spring-boot-docker](https://spring.io/guides/gs/spring-boot-docker/)

3. [docker x509 error](https://blog.csdn.net/liusf1993/article/details/102508663)


