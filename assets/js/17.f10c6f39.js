(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{356:function(e,t,s){"use strict";s.r(t);var a=s(9),n=Object(a.a)({},(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("p",[e._v("该文章主要覆盖用于构建高效镜像的最佳实践建议和方法。")]),e._v(" "),s("p",[e._v("Docker 在构建镜像时会从 "),s("code",[e._v("Dockfile")]),e._v(" 加载指令并自动执行，"),s("code",[e._v("Dockerfile")]),e._v(" 是一个按顺序包含有构建一个给定镜像所需要的所有指令的文本文件。当然一个 "),s("code",[e._v("Dockerfile")]),e._v(" 需要按照指定的格式和指令集来编写。")]),e._v(" "),s("p",[e._v("一个 Docker 镜像包含有多个只读层，这里每一个只读层都代表 "),s("code",[e._v("Dockerfile")]),e._v(" 中的一条指令。这些层被组织成栈结构，每一层都基于上一层的修改叠加而来。参考 "),s("code",[e._v("Dockerfile")]),e._v(" 示例：")]),e._v(" "),s("div",{staticClass:"language-dockerfile extra-class"},[s("pre",{pre:!0,attrs:{class:"language-dockerfile"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("FROM")]),e._v(" ubuntu"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v("18.04\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("COPY")]),e._v(" . /app\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("RUN")]),e._v(" make /app\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("CMD")]),e._v(" python /app/app.py\n")])])]),s("p",[e._v("每一条指令都会创建一个层：")]),e._v(" "),s("ul",[s("li",[s("code",[e._v("FROM")]),e._v(" 基于 "),s("code",[e._v("ubuntu:18.4")]),e._v(" 镜像创建一个层。")]),e._v(" "),s("li",[s("code",[e._v("COPY")]),e._v(" 添加来这宿主机当前目录下的文件。")]),e._v(" "),s("li",[s("code",[e._v("RUN")]),e._v(" 通过 "),s("code",[e._v("make")]),e._v(" 来编译应用。")]),e._v(" "),s("li",[s("code",[e._v("CMD")]),e._v(" 指定需要在容器内执行的指令。")])]),e._v(" "),s("p",[e._v("每当你运行一个镜像产生一个容器时，你都会在之前的只读层上面创建一个可写层。对于容器运行时的所有变更，包含文件写入、修改、删除都会被写入到这个可写层。")]),e._v(" "),s("p",[e._v("到这里你对 docker 分层技术以及镜像是如何分层维护的就有一个比较好的概念了。这里我们可以浅谈下 Docker 是如何分层以及将多个层挂载到容器内的。")]),e._v(" "),s("p",[e._v("Docker 主要通过 Linux 的 ufs 来实现，ufs(UnionFS) 是一个可以将不同文件夹的文件挂载到一个文件夹下的技术，同时会自动对文件去重。如下所示：")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[e._v("/home/me/A -- a.txt b.txt\n/home/me/B -- a.txt c.txt\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# 仅仅是伪命令，非真实可以用")]),e._v("\nufs ./A ./B -d ./C\n\n/home/me/C -- a.txt b.txt c.txt\n")])])]),s("p",[e._v("在我们的用户目录下有三个文件夹，分别为 A、B、C，其中 A 文件夹有 a、b 文件，B 文件夹有 a、c 文件。通过 "),s("code",[e._v("ufs")]),e._v(" 技术我们可以将 A、B 文件夹的文件挂载到 C 文件夹下且自动去重。即 C 文件夹会有 a、b、c 文件，且对 C 文件夹的文件修改会在 A 和 B 对应的文件上生效。")]),e._v(" "),s("p",[e._v("这就是 Docker 分层的核心技术了。")]),e._v(" "),s("h2",{attrs:{id:"通用参考和建议"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#通用参考和建议"}},[e._v("#")]),e._v(" 通用参考和建议")]),e._v(" "),s("h3",{attrs:{id:"创建敏捷容器"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#创建敏捷容器"}},[e._v("#")]),e._v(" 创建敏捷容器")]),e._v(" "),s("p",[e._v("这里的敏捷是指启动和配置容器所需要的时间。我们通过  "),s("code",[e._v("Dockerfile")]),e._v(" 创建出来的镜像要尽可能考虑容器在停止、销毁、重启和替换时启动和配置容器所需要的时长，并尽量缩短这些时长。")]),e._v(" "),s("h3",{attrs:{id:"理解打包上下文"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#理解打包上下文"}},[e._v("#")]),e._v(" 理解打包上下文")]),e._v(" "),s("p",[e._v("Docker 在构建镜像时需要一个打包上下文。我们在执行 "),s("code",[e._v("docker build")]),e._v(" 时，宿主机的当前目录就是我们的打包上下文。默认的，Docker 会自动在当前目录下加载 "),s("code",[e._v("Dockerfile")]),e._v(" 文件，同时也可以通过 "),s("code",[e._v("-f")]),e._v(" 参数来指定 "),s("code",[e._v("Dockerfile")]),e._v(" 的位置。最终不管 "),s("code",[e._v("Dockerfile")]),e._v(" 在哪个地方，当前目录下的所有文件和文件夹都会作为打包上下文发送给 docker 守护进程。")]),e._v(" "),s("blockquote",[s("p",[e._v("✅ 打包上下文实例")]),e._v(" "),s("p",[e._v("创建一个文件夹，并 "),s("code",[e._v("cd")]),e._v(" 进入。创建一个 hello 文件并填充 "),s("code",[e._v("hello world")]),e._v(" ，创建一个 "),s("code",[e._v("Dockerfile")]),e._v(" 并在容器中运行 "),s("code",[e._v("cat")]),e._v(" 命令。通过 "),s("code",[e._v(".")]),e._v(" 打包上下文来创建镜像。")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("mkdir")]),e._v(" myproject "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("&&")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" myproject\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("echo")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"hello world"')]),e._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" hello\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("echo")]),e._v(" -e "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"FROM busybox'),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[e._v("\\n")]),e._v("COPY /hello /"),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[e._v("\\n")]),e._v('RUN cat /hello"')]),e._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" Dockerfile\ndocker build -t helloapp:v1 "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v(".")]),e._v("\n")])])]),s("p",[e._v("移动 "),s("code",[e._v("Dockerfile")]),e._v(" 和 "),s("code",[e._v("hello")]),e._v(" 到另一个独立的文件夹，然后创建镜像的第二个版本(不去依赖上一个版本创建的缓存)。通过 "),s("code",[e._v("-f")]),e._v(" 指定 "),s("code",[e._v("Dockerfile")]),e._v(" 的路径，并指定一个文件夹作为打包上下文。")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("mkdir")]),e._v(" -p dockerfiles context\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("mv")]),e._v(" Dockerfile dockerfiles "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("&&")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("mv")]),e._v(" hello context\ndocker build --no-cache -t helloapp:v2 -f dockerfiles/Dockerfile context\n")])])])]),e._v(" "),s("p",[e._v("千万要注意不要在打包镜像时，把容器不需要的文件包含在上下文中，这样不仅会增加我们的打包时长，打包出来的镜像包也会体积过大，影响之后的 pull、push 和 容器运行时等所需要的时长。想要知道你的打包上下文有多大，可以在打包时关注如下消息：")]),e._v(" "),s("div",{staticClass:"language-text extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("Sending build context to Docker daemon  187.8MB\n")])])]),s("h2",{attrs:{id:"通过-stdin-来提供-dockerfile"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#通过-stdin-来提供-dockerfile"}},[e._v("#")]),e._v(" 通过 stdin 来提供 Dockerfile")]),e._v(" "),s("p",[e._v("Docker 可以通过 "),s("code",[e._v("stdin")]),e._v(" 来提供 "),s("code",[e._v("Dockerfile")]),e._v(" ，以及提供了根据本地或远程上下文来打包镜像的能力。通过 "),s("code",[e._v("stdin")]),e._v(" 来提供 "),s("code",[e._v("Dockerfile")]),e._v(" 的方式对于希望在磁盘上不留下任何 "),s("code",[e._v("Dockerfile")]),e._v(" 痕迹的镜像打包非常有用。")]),e._v(" "),s("blockquote",[s("p",[e._v("✅ ​这里的 Demo 提供了较为方便的方法来使用 "),s("code",[e._v("stdin")]),e._v("，但任何能够通过 "),s("code",[e._v("stdin")]),e._v(" 提供 "),s("code",[e._v("Dockerfile")]),e._v(" 方法都是可取的。")]),e._v(" "),s("p",[e._v("如下所示，两种方式达到的效果是相同的。")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("echo")]),e._v(" -e "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v("'FROM busybox"),s("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[e._v("\\n")]),e._v('RUN echo "hello world"\'')]),e._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("|")]),e._v(" docker build -\n")])])]),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[e._v("docker build -"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<<")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('EOF\nFROM busybox\nRUN echo "hello world"\nEOF')]),e._v("\n")])])]),s("p",[e._v("你可以选择你喜欢的方式来替换这里的例子，寻找最适合你的方式。如可以通过可编程来编写 "),s("code",[e._v("Dockerfile")]),e._v(" 等。")])]),e._v(" "),s("h3",{attrs:{id:"使用-stdin-提供-dockerfile-的方式且不发送上下文来构建镜像"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#使用-stdin-提供-dockerfile-的方式且不发送上下文来构建镜像"}},[e._v("#")]),e._v(" 使用 stdin 提供 Dockerfile 的方式且不发送上下文来构建镜像")]),e._v(" "),s("p",[e._v("该方式通过如下语法来使用。使用 "),s("code",[e._v("-")]),e._v(" 占位符来取代打包上下文的路径，还有引导 docker 通过 "),s("code",[e._v("stdin")]),e._v(" 的方式来加载 "),s("code",[e._v("Dockerfile")]),e._v("。")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[e._v("docker build "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("OPTIONS"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v(" -\n")])])]),s("p",[e._v("以下例子通过 "),s("code",[e._v("stdin")]),e._v(" 来加载 "),s("code",[e._v("Dockerfile")]),e._v(" 。没有给守护进程发送任何上下文文件。")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[e._v("docker build -t myimage:latest -"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<<")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('EOF\nFROM busybox\nRUN echo "hello world"\nEOF')]),e._v("\n")])])]),s("p",[e._v("省略上下文的方式适合 "),s("code",[e._v("Dockerfile")]),e._v(" 不需要拷贝文件到镜像里的情况。这样可以加速镜像打包，因为不需要给守护进程发送任何东西。")]),e._v(" "),s("blockquote",[s("p",[e._v("✅ 注意：当前语法下在 "),s("code",[e._v("Dockerfile")]),e._v(" 中使用 "),s("code",[e._v("COPY")]),e._v(" 和 "),s("code",[e._v("ADD")]),e._v(" 会报错。如下所示：")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# create a directory to work in")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("mkdir")]),e._v(" example\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" example\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# create an example file")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("touch")]),e._v(" somefile.txt\n\ndocker build -t myimage:latest -"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<<")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v("EOF\nFROM busybox\nCOPY somefile.txt .\nRUN cat /somefile.txt\nEOF")]),e._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# observe that the build fails")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("..")]),e._v(".\nStep "),s("span",{pre:!0,attrs:{class:"token number"}},[e._v("2")]),e._v("/3 "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v(":")]),e._v(" COPY somefile.txt "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v(".")]),e._v("\nCOPY failed: "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("stat")]),e._v(" /var/lib/docker/tmp/docker-builder249218248/somefile.txt: no such "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("file")]),e._v(" or directory\n")])])])]),e._v(" "),s("h3",{attrs:{id:"使用本地本地打包上下文和-stdin-方式提供dockerfile"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#使用本地本地打包上下文和-stdin-方式提供dockerfile"}},[e._v("#")]),e._v(" 使用本地本地打包上下文和 stdin 方式提供dockerfile")]),e._v(" "),s("p",[e._v("使用 "),s("code",[e._v("-f")]),e._v(" 或 "),s("code",[e._v("--file")]),e._v(" 参数来指定 "),s("code",[e._v("Dockerfile")]),e._v(" ，使用 "),s("code",[e._v("-")]),e._v(" 作为参数值来引导 docker 从 "),s("code",[e._v("stdin")]),e._v(" 来加载 "),s("code",[e._v("dockerfile")]),e._v(" 。")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[e._v("docker build "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("OPTIONS"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v(" -f- "),s("span",{pre:!0,attrs:{class:"token environment constant"}},[e._v("PATH")]),e._v("\n")])])]),s("p",[e._v("以下实例使用当前目录 "),s("code",[e._v("·")]),e._v(" 作为打包上下文，使用 "),s("code",[e._v("stdin")]),e._v(" 来加载 "),s("code",[e._v("dockerfile")]),e._v(" 。")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# create a directory to work in")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("mkdir")]),e._v(" example\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" example\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# create an example file")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("touch")]),e._v(" somefile.txt\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# build an image using the current directory as context, and a Dockerfile passed through stdin")]),e._v("\ndocker build -t myimage:latest -f- "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v(".")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<<")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v("EOF\nFROM busybox\nCOPY somefile.txt .\nRUN cat /somefile.txt\nEOF")]),e._v("\n")])])]),s("h3",{attrs:{id:"使用远程打包上下文和-stdin-方式提供-dockerfile"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#使用远程打包上下文和-stdin-方式提供-dockerfile"}},[e._v("#")]),e._v(" 使用远程打包上下文和 stdin 方式提供 dockerfile")]),e._v(" "),s("p",[e._v("使用如下语法从远程 "),s("code",[e._v("git")]),e._v(" 仓库加载文件作为上下文，使用 "),s("code",[e._v("stdin")]),e._v(" 加载 "),s("code",[e._v("dockerfile")]),e._v("。使用 "),s("code",[e._v("-f")]),e._v(" 或 "),s("code",[e._v("--file")]),e._v(" 参数来指定 "),s("code",[e._v("dockerfile")]),e._v("，使用 "),s("code",[e._v("-")]),e._v(" 作为参数值来指引 docker 从 "),s("code",[e._v("stdin")]),e._v(" 加载 "),s("code",[e._v("dockerfile")]),e._v("。")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[e._v("docker build "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("OPTIONS"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v(" -f- "),s("span",{pre:!0,attrs:{class:"token environment constant"}},[e._v("PATH")]),e._v("\n")])])]),s("p",[e._v("这种方式对于希望从远程加载上下文但上下文中不包含 "),s("code",[e._v("dockerfile")]),e._v(" 的情况，或是从其他仓库 fork 上下文并希望定制自己的 "),s("code",[e._v("dockerfile")]),e._v(" 的情况。")]),e._v(" "),s("p",[e._v("以下实例从 "),s("code",[e._v("stdin")]),e._v(" 加载 "),s("code",[e._v("dockerfile")]),e._v("，并从远程 "),s("code",[e._v("git")]),e._v(" 仓库添加 "),s("code",[e._v("hello.c")]),e._v("。")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[e._v("docker build -t myimage:latest -f- https://github.com/docker-library/hello-world.git "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<<")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v("EOF\nFROM busybox\nCOPY hello.c .\nEOF")]),e._v("\n")])])]),s("blockquote",[s("p",[e._v("✅ 需要注意的地方")]),e._v(" "),s("p",[e._v("当使用远程仓库作为打包上下文时，docker 会执行 "),s("code",[e._v("git clone")]),e._v(" 克隆仓库到本地，并把这些文件作为上下文提交给 守护进程。当你使用这种方式打包时，需要在本机安装有 "),s("code",[e._v("git")]),e._v("。")])]),e._v(" "),s("h3",{attrs:{id:"通过-dockerignore-来忽略打包文件"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#通过-dockerignore-来忽略打包文件"}},[e._v("#")]),e._v(" 通过 . dockerignore 来忽略打包文件")]),e._v(" "),s("p",[s("code",[e._v(".gitignore")]),e._v(" 大家很熟悉了吧，这里 "),s("code",[e._v(".dockerignore")]),e._v(" 跟它一样，很多 "),s("code",[e._v(".gitignore")]),e._v(" 的语法都适用于 "),s("code",[e._v(".dockerignore")]),e._v("。")]),e._v(" "),s("h3",{attrs:{id:"使用多阶段的构建方案"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#使用多阶段的构建方案"}},[e._v("#")]),e._v(" 使用多阶段的构建方案")]),e._v(" "),s("p",[e._v("多阶段构建允许你大幅度降低最终打包出来的镜像大小，而不需要大幅度减少中间层和文件的数量。")]),e._v(" "),s("p",[e._v("因为镜像是在生成过程的最后阶段生成的，因此你可以通过平衡打包缓存来最小化镜像层的数量。")]),e._v(" "),s("p",[e._v("举个例子，如果你的构建有多个层，你可以按照最小改动到最大改动的的顺序来排列。")]),e._v(" "),s("ul",[s("li",[e._v("安装构建应用所需要的工具")]),e._v(" "),s("li",[e._v("安装或更新依赖库")]),e._v(" "),s("li",[e._v("生成应用")])]),e._v(" "),s("p",[e._v("一个 Go 应用的 Dockerfile 长这样：")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[e._v("FROM golang:1.11-alpine AS build\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Install tools required for project")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Run `docker build --no-cache .` to update dependencies")]),e._v("\nRUN apk "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("add")]),e._v(" --no-cache "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v("\nRUN go get github.com/golang/dep/cmd/dep\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# List project dependencies with Gopkg.toml and Gopkg.lock")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# These layers are only re-built when Gopkg files are updated")]),e._v("\nCOPY Gopkg.lock Gopkg.toml /go/src/project/\nWORKDIR /go/src/project/\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Install library dependencies")]),e._v("\nRUN dep ensure -vendor-only\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# Copy the entire project and build it")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# This layer is rebuilt when a file changes in the project directory")]),e._v("\nCOPY "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v(".")]),e._v(" /go/src/project/\nRUN go build -o /bin/project\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("# This results in a single layer image")]),e._v("\nFROM scratch\nCOPY --from"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v("build /bin/project /bin/project\nENTRYPOINT "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"/bin/project"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\nCMD "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"--help"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\n")])])]),s("h2",{attrs:{id:"不要安装不需要的包"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#不要安装不需要的包"}},[e._v("#")]),e._v(" 不要安装不需要的包")]),e._v(" "),s("p",[e._v("为了降低复杂性，减少依赖数量、文件大小和构建时间，应该尽量避免安装一些额外的不需要的包，不要因为应用很 nice 值得拥有就去安装它，要考虑实际用途。比如在数据库镜像中安装文本编辑器。")]),e._v(" "),s("h2",{attrs:{id:"应用解耦"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#应用解耦"}},[e._v("#")]),e._v(" 应用解耦")]),e._v(" "),s("p",[e._v("解耦是一个老生长谈的话题了。每个镜像必须只有一个职责(单一责任). 在多个容器中采用应用解耦的方式有利于水平扩展和容器复用。举个例子，一个 web 站点可能需要包含三个独立的容器，每一个容器都是一个独一无二的镜像，实现这样一个解耦的模式需要一个 Web 应用管理容器，一个数据库容器和一个内存级缓存容器。")]),e._v(" "),s("p",[e._v("限制一个容器只有一个进程是一个黄金法则，但它也不是强制的。比如，包含但不限于一个 "),s("code",[e._v("init")]),e._v(" 进程派生多个子进程，一个需要额外添加多个实例进程以作为一个整体对外提供服务的情况。举个例子，"),s("code",[e._v("Celery")]),e._v(" 需要派生多个 "),s("code",[e._v("worker")]),e._v(" 进程，"),s("code",[e._v("Apache")]),e._v(" 需要为每个请求创建一个进程。")]),e._v(" "),s("p",[e._v("根据你自身的判断尽可能保证容器的模块化和简洁。如果容器间互相依赖，你可以使用 Docker 容器网络让这些容器彼此间实现通讯。")]),e._v(" "),s("h2",{attrs:{id:"最小化镜像层的数量"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#最小化镜像层的数量"}},[e._v("#")]),e._v(" 最小化镜像层的数量")]),e._v(" "),s("p",[e._v("旧版的 Docker中，你需要最小化镜像层的数量来提升镜像的性能。")]),e._v(" "),s("p",[e._v("下面这些特性可以用来减少这些限制：")]),e._v(" "),s("ul",[s("li",[e._v("只有 "),s("code",[e._v("RUN")]),e._v(", "),s("code",[e._v("COPY")]),e._v(", "),s("code",[e._v("ADD")]),e._v(" 会创建镜像层。其他指令只会生成临时的中间层，并不会增加最终打包出来镜像的大小。")]),e._v(" "),s("li",[e._v("尽可能使用多阶段的构建方案，还有只靠背你需要的内容到你的镜像中。这些允许你包含工具和调试信息在你的中间层中，而不会增加最终打包出来的镜像大小。")])]),e._v(" "),s("h2",{attrs:{id:"排序的多行参数"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#排序的多行参数"}},[e._v("#")]),e._v(" 排序的多行参数")]),e._v(" "),s("p",[e._v("无论何时，使用字典序多行参数能为之后的更改提供便利。这里有利于避免重复安装包和让列表易于更新。同样也利于 PRs(Pull Request) 的阅读和审核。在 \\ 前加空格是一个不错的方法。")]),e._v(" "),s("p",[e._v("这个例子来自于 "),s("a",{attrs:{href:"https://github.com/docker-library/buildpack-deps",target:"_blank",rel:"noopener noreferrer"}},[s("code",[e._v("buildpack-deps")]),e._v(" image"),s("OutboundLink")],1),e._v("：")]),e._v(" "),s("div",{staticClass:"language-shell extra-class"},[s("pre",{pre:!0,attrs:{class:"language-shell"}},[s("code",[e._v("RUN "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("apt-get")]),e._v(" update "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("&&")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("apt-get")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v(" -y "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  bzr "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  cvs "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  mercurial "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n  subversion\n")])])]),s("h2",{attrs:{id:"平衡打包缓存"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#平衡打包缓存"}},[e._v("#")]),e._v(" 平衡打包缓存")]),e._v(" "),s("p",[e._v("当打包一个镜像时，Docker 会根据  "),s("code",[e._v("Dockerfile")]),e._v(" 中的指令按照顺序逐条执行。当一个执行通过验证时，Docker 会优先在缓存中寻找它能够复用的镜像，而不是马上去创建一个新的镜像。如果你不想使用缓存，可以通过 "),s("code",[e._v("docker build")]),e._v(" 的 "),s("code",[e._v("--no-cahe=true")]),e._v(" 来关闭。然而，如果你希望让 Docker 使用缓存，那么你就有必要关心 Docker 什么时候能够找到一个符合的镜像缓存而什么时候不能了。Docker 所遵循的规则如下陈述：")]),e._v(" "),s("ul",[s("li",[e._v("当你通过已经存在于缓存中的父镜像来构建缓存时，下一条指令会与所有由同一个父镜像派生出来的子镜像逐个比较，如果发现其中有一个镜像所使用的指令与当前的一致，则缓存命中，否则无可用缓存。")]),e._v(" "),s("li",[e._v("大多数情况下，只要简单的与一个子镜像比较 "),s("code",[e._v("Dockerfile")]),e._v(" 中的指令就足够了。而少数指令是需要多次验证和解析的。")]),e._v(" "),s("li",[e._v("对于 "),s("code",[e._v("ADD")]),e._v(" 和 "),s("code",[e._v("COPY")]),e._v(" 指令，镜像中的每一个文件都会经过验证和计算从而得到一个验证总和。这些文件的校验总和不考虑最后修改和访问时间。在检索缓存的过程中，当前的校验总和会与已经存在的镜像的文件校验总和做比较。如果文件有任何改动，包含内容和元数据，缓存都会失效。")]),e._v(" "),s("li",[e._v("除了 "),s("code",[e._v("ADD")]),e._v(" 和 "),s("code",[e._v("COPY")]),e._v(" 命令外，缓存检查不会通过查看容器中的文件来判断是否命中缓存。举个列子，当执行一个 "),s("code",[e._v("Run apt-get -y update")]),e._v(" 指令时，并不能通过比较容器中的文件是否修改来判断缓存命中。只能通过命令本身的字符串来判断是否命中。")])]),e._v(" "),s("p",[e._v("一旦缓存无效，那么 Dockerfile 中接下来的指令都会生成新的镜像而不适用缓存。")]),e._v(" "),s("comment")],1)}),[],!1,null,null,null);t.default=n.exports}}]);