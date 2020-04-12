---
title: Dockerfile 最佳实践
date: 2020-04-13
tags: 
  - Docker
  - Dockerfile
author: Menfre
location: Shenzhen  
---

该文章主要覆盖用于构建高效镜像的最佳实践建议和方法。

Docker 在构建镜像时会从 `Dockfile` 加载指令并自动执行，`Dockerfile` 是一个按顺序包含有构建一个给定镜像所需要的所有指令的文本文件。当然一个 `Dockerfile` 需要按照指定的格式和指令集来编写。

一个 Docker 镜像包含有多个只读层，这里每一个只读层都代表 `Dockerfile` 中的一条指令。这些层被组织成栈结构，每一层都基于上一层的修改叠加而来。参考 `Dockerfile` 示例：

```dockerfile
FROM ubuntu:18.04
COPY . /app
RUN make /app
CMD python /app/app.py
```

每一条指令都会创建一个层：

* `FROM` 基于 `ubuntu:18.4` 镜像创建一个层。
* `COPY` 添加来这宿主机当前目录下的文件。
* `RUN` 通过 `make` 来编译应用。
* `CMD` 指定需要在容器内执行的指令。

每当你运行一个镜像产生一个容器时，你都会在之前的只读层上面创建一个可写层。对于容器运行时的所有变更，包含文件写入、修改、删除都会被写入到这个可写层。

到这里你对 docker 分层技术以及镜像是如何分层维护的就有一个比较好的概念了。这里我们可以浅谈下 Docker 是如何分层以及将多个层挂载到容器内的。

Docker 主要通过 Linux 的 ufs 来实现，ufs(UnionFS) 是一个可以将不同文件夹的文件挂载到一个文件夹下的技术，同时会自动对文件去重。如下所示：

```shell
/home/me/A -- a.txt b.txt
/home/me/B -- a.txt c.txt

# 仅仅是伪命令，非真实可以用
ufs ./A ./B -d ./C

/home/me/C -- a.txt b.txt c.txt
```

在我们的用户目录下有三个文件夹，分别为 A、B、C，其中 A 文件夹有 a、b 文件，B 文件夹有 a、c 文件。通过 `ufs` 技术我们可以将 A、B 文件夹的文件挂载到 C 文件夹下且自动去重。即 C 文件夹会有 a、b、c 文件，且对 C 文件夹的文件修改会在 A 和 B 对应的文件上生效。

这就是 Docker 分层的核心技术了。

## 通用参考和建议

### 创建敏捷容器

这里的敏捷是指启动和配置容器所需要的时间。我们通过  `Dockerfiles` 创建出来的镜像要尽可能考虑容器在停止、销毁、重启和替换时启动和配置容器所需要的时长，并尽量缩短这些时长。

### 理解打包上下文

Docker 在构建镜像时需要一个上下文打包上下文。我们在执行 `docker build` 时，宿主机的当前目录就是我们的打包上下文。默认的，Docker 会自动在当前目录下加载 `Dockerfile` 文件，同时也可以通过 ` -f` 参数来指定 `Dockerfile` 的位置。最终不管 `Dockerfile` 在哪个地方，当前目录下的所有文件和文件夹都会作为打包上下文发送给 docker 守护进程。

>  :white_check_mark: 打包上下文实例
>
>  创建一个文件夹，并 `cd` 进入。创建一个 hello 文件并填充 `hello world` ，创建一个 `Dockerfile` 并在容器中运行 `cat` 命令。通过 `.` 打包上下文来创建镜像。 
>
>  ```shell
>  mkdir myproject && cd myproject
>  echo "hello world" > hello
>  echo -e "FROM busybox\nCOPY /hello /\nRUN cat /hello" > Dockerfile
>  docker build -t helloapp:v1 .
>  ```
>
>  移动 `Dockerfile` 和 `hello` 到另一个独立的文件夹，然后创建镜像的第二个版本(不去依赖上一个版本创建的缓存)。通过 `-f` 指定 `Dockerfile` 的路径，并指定一个文件夹作为打包上下文。
>
>  ```shell
>  mkdir -p dockerfiles context
>  mv Dockerfile dockerfiles && mv hello context
>  docker build --no-cache -t helloapp:v2 -f dockerfiles/Dockerfile context
>  ```

千万要注意不要在打包镜像时，把容器不需要的文件包含在上下文中，这样不仅会增加我们的打包时长，打包出来的镜像包也会体积过大，影响之后的 pull、push 和 容器运行时等所需要的时长。想要知道你的打包上下文有多大，可以在打包时关注如下消息：

```text
Sending build context to Docker daemon  187.8MB
```

## 通过 stdin 来提供 Dockerfile

Docker 可以通过 `stdin` 来提供 `Dockerfile` ，以及提供了根据本地或远程上下文来打包镜像的能力。通过 `stdin` 来提供 `Dockerfile` 的方式对于希望在磁盘上不留下任何 `Dockerfile` 痕迹的镜像打包非常有用。

> :white_check_mark: ​这里的 Demo 提供了较为方便的方法来使用 `stdin`，但任何能够通过 `stdin` 提供 `Dockerfile` 方法都是可取的。
>
> 如下所示，两种方式达到的效果是相同的。
>
> ```shell
> echo -e 'FROM busybox\nRUN echo "hello world"' | docker build -
> ```
>
> ```shell
> docker build -<<EOF
> FROM busybox
> RUN echo "hello world"
> EOF
> ```
>
> 你可以选择你喜欢的方式来替换这里的例子，寻找最适合你的方式。如可以通过可编程来编写 `Dockerfile` 等。

### 使用 stdin 提供 Dockerfile 的方式且不发送上下文来构建镜像

该方式通过如下语法来使用。使用 `-` 占位符来取代打包上下文的路径，还有引导 docker 通过 `stdin` 的方式来加载 `Dockerfile`。

```shell
docker build [OPTIONS] -
```

以下例子通过 `stdin` 来加载 `Dockerfile` 。没有给守护进程发送任何上下文文件。

```shell
docker build -t myimage:latest -<<EOF
FROM busybox
RUN echo "hello world"
EOF
```

省略上下文的方式适合 `Dockerfile` 不需要拷贝文件到镜像里的情况。这样可以加速镜像打包，因为不需要给守护进程发送任何东西。

> :white_check_mark: 注意：当前语法下在 `Dockerfile` 中使用 `COPY` 和 `ADD` 会报错。如下所示：
>
> ```shell
> # create a directory to work in
> mkdir example
> cd example
> 
> # create an example file
> touch somefile.txt
> 
> docker build -t myimage:latest -<<EOF
> FROM busybox
> COPY somefile.txt .
> RUN cat /somefile.txt
> EOF
> 
> # observe that the build fails
> ...
> Step 2/3 : COPY somefile.txt .
> COPY failed: stat /var/lib/docker/tmp/docker-builder249218248/somefile.txt: no such file or directory
> ```

### 使用本地本地打包上下文和 stdin 方式提供dockerfile

使用 `-f` 或 `--file` 参数来指定 `Dockerfile` ，使用 `-` 作为参数值来引导 docker 从 `stdin` 来加载 `dockerfile` 。

```shell
docker build [OPTIONS] -f- PATH
```

以下实例使用当前目录 `·` 作为打包上下文，使用 `stdin` 来加载 `dockerfile` 。

```shell
# create a directory to work in
mkdir example
cd example

# create an example file
touch somefile.txt

# build an image using the current directory as context, and a Dockerfile passed through stdin
docker build -t myimage:latest -f- . <<EOF
FROM busybox
COPY somefile.txt .
RUN cat /somefile.txt
EOF
```

### 使用远程打包上下文和 stdin 方式提供 dockerfile

使用如下语法从远程 `git` 仓库加载文件作为上下文，使用 `stdin` 加载 `dockerfile`。使用 `-f` 或 `--file` 参数来指定 `dockerfile`，使用 `-` 作为参数值来指引 docker 从 `stdin` 加载 `dockerfile`。

```shell
docker build [OPTIONS] -f- PATH
```

这种方式对于希望从远程加载上下文但没有不包含 ·，或是从其他仓库 fork 上下文并希望定制自己的 `dockerfile` 的情况。

以下实例从 `stdin` 加载 `dockerfile`，并从远程 `git` 仓库添加 `hello.c`。

```shell
docker build -t myimage:latest -f- https://github.com/docker-library/hello-world.git <<EOF
FROM busybox
COPY hello.c .
EOF
```

> :white_check_mark: 需要注意的地方
>
> 当使用远程仓库作为打包上下文时，docker 会执行 `git clone` 克隆仓库到本地，并把这些文件作为上下文提交给 守护进程。当你使用这种方式打包时，需要在本机安装有 `git`。

### 通过 . dockerignore 来忽略打包文件

`.gitignore` 大家很熟悉了吧，这里 `.dockerignore` 跟它一样，很多 `.gitignore` 的语法都适用于 `.dockerignore`。

### 使用多阶段的构建方案

多阶段构建允许你大幅度降低最终打包出来的镜像大小，而不需要大幅度减少中间层和文件的数量。

因为镜像是在生成过程的最后阶段生成的，因此你可以通过平衡打包缓存来最小化镜像层的数量。

举个例子，如果你的构建有多个层，你可以按照最小改动到最大改动的的顺序来排列。

* 安装构建应用所需要的工具
* 安装或更新依赖库
* 生成应用

一个 Go 应用的 Dockerfile 长这样：

```shell
FROM golang:1.11-alpine AS build

# Install tools required for project
# Run `docker build --no-cache .` to update dependencies
RUN apk add --no-cache git
RUN go get github.com/golang/dep/cmd/dep

# List project dependencies with Gopkg.toml and Gopkg.lock
# These layers are only re-built when Gopkg files are updated
COPY Gopkg.lock Gopkg.toml /go/src/project/
WORKDIR /go/src/project/
# Install library dependencies
RUN dep ensure -vendor-only

# Copy the entire project and build it
# This layer is rebuilt when a file changes in the project directory
COPY . /go/src/project/
RUN go build -o /bin/project

# This results in a single layer image
FROM scratch
COPY --from=build /bin/project /bin/project
ENTRYPOINT ["/bin/project"]
CMD ["--help"]
```

## 不用安装不需要的包

为了降低复杂性，减少依赖数量、文件大小和构建时间，应该尽量避免安装一些额外的不需要的包，不要因为应用很 nice 值得拥有就去安装它，要考虑实际用途。比如在数据库镜像中安装文本编辑器。

## 应用解耦

解耦是一个老生长谈的话题了。每个镜像必须只有一个职责(单一责任). 在多个容器中采用应用解耦的方式有利于水平扩展和容器复用。举个例子，一个 web 站点可能需要包含三个独立的容器，每一个容器都是一个独一无二的景象，这样一个解耦合的模式需要一个 Web 应用管理容器，一个数据库，一个内存级缓存容器。

限制一个容器只有一个进程是一个黄金法则，但它也不是强制的。比如，包含但不限于一个 `init` 进程派生多个子进程，一个需要额外添加多个实例进程以作为一个整体对外提供一个服务的情况。举个例子，Celery 需要派生多个 worker 进程，Apache 需要为每个请求创建一个进程。

根据你自身的判断来保证容器的尽可能模块化和简洁。如何容器间互相依赖，你可以使用 Docker 容器网络让这些容器彼此间实现通讯。

## 最小化镜像层的数量

旧版的 Docker中，你需要最小化镜像层的数量来提升镜像的性能。

下面这些特性可以用来减少这些限制：

* 只有 `RUN`, `COPY`, `ADD` 会创建镜像层。其他指令只会生成临时的中间层，并不会增加最终打包出来镜像的大小。
* 尽可能使用多阶段的构建方案，还有只靠背你需要的内容到你的镜像中。这些允许你包含工具和调试信息在你的中间层中，而不会增加最终打包出来的镜像大小。

## 排序的多行参数

无论何时，使用字典序多行参数能为之后的更改提供便利。这里有利于避免重复安装包和让列表易于更新。同样也利于 PRs(Pull Request) 的阅读和审核。在 \ 前加空格是一个不错的方法。

这个例子来自于 [`buildpack-deps` image](https://github.com/docker-library/buildpack-deps)：

```shell
RUN apt-get update && apt-get install -y \
  bzr \
  cvs \
  git \
  mercurial \
  subversion
```

## 平衡打包缓存

当打包一个镜像时，Docker 会根据  `Dockerfile` 中的指令按照顺序逐条执行。当一个执行通过验证时，Docker 会优先在缓存中寻找它能够复用的镜像，而不是马上去创建一个新的镜像。如果你不想使用缓存，可以通过 `docker build` 的 `--no-cahe=true` 来关闭。然而，如果你希望让 Docker 使用缓存，那么你就有必要关心 Docker 什么时候能够找到一个符合的镜像缓存而什么时候不能了。Docker 所遵循的规则如下陈述：

* 当你通过已经存在于缓存中的父镜像来构建缓存时，下一条指令会与所有由同一个父镜像派生出来的子镜像逐个比较，如果发现其中有一个镜像所使用的指令与当前的一致，则缓存命中，否则无可用缓存。
* 大多数情况下，只要简单的与一个子镜像比较 `Dockerfile` 中的指令就足够了。而少数指令是需要多次验证和解析的。
* 对于 `ADD` 和 `COPY` 指令，镜像中的每一个文件都会经过验证和计算从而得到一个验证总和。这些文件的校验总和不考虑最后修改和访问时间。在检索缓存的过程中，当前的校验总和会与已经存在的镜像的文件校验总和做比较。如果文件有任何改动，包含内容和元数据，缓存都会失效。
* 除了 `ADD` 和 `COPY` 命令外，缓存检查不会通过查看容器中的文件来判断是否命中缓存。举个列子，当执行一个 `Run apt-get -y update` 指令时，并不能通过比较容器中的文件是否修改来判断缓存命中。只能通过命令本身的字符串来判断是否命中。

一旦缓存无效，那么 Dockerfile 中接下来的指令都会生成新的镜像而不适用缓存。
