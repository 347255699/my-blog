---
title: 认真学习 kubernetes——Pod
date: 2020-05-09
tags: 
  - k8s
author: Menfre
location: Shenzhen
---

## 1. Pod 是什么，为什么我们需要它

这里的 Pod 是 kubernetes 的原子调度单位，好比 docker 的调度单位是容器，操作系统的调度单位是进程一样。

大家知道 kubernetes 是一套容器基础设施，即容器的操作系统。为啥 kubernetes 不以容器作为调度单位而是另辟蹊径以 Pod 作为调度单位呢？

要回答这个问题，我们首先需要知道容器的本质是一个特殊的进程，它特殊就特殊在它是一个通过 Linux Namespace 和 Cgroup 隔离和限制的进程。那我们知道操作系统的调度单位就是进程，而在实际情况下，进程在操作系统中并不会单打独斗，而是以进程组的方式被组织起来，相互协作共同完成某一责职。

而在 kubernetes 中就是将进程组这个概念映射成 Pod。

## 2. 成组调度

实际上 Pod 就是一个成组调度的概念。往往我们在集群环境上部署容器时，都需要借助一个 Paas 平台将我们的容器部署到合适的节点上。好比 Docker Swarm，假设我们有容器 a、b、c，a b c 之间是一个紧密协作的关系，它们需要被部署到同一个节点上才能正常工作，这里我们在后面两个容器中通过 affinity=a 来声明它们是紧密关系。同时运行容器 a b c 分别需要消耗 1G 内存。此时我们集群上有节点 node-A、node-B，node-A 内存为 3G，node-B 内存为 2.5G。Ok，现在我们用如下命令执行：

```shell
docker run a
docker run b affinity=a
dokcer run c affinity=a
```

执行完毕后容器 a b c 都会进入 Swarm 的调度队列，假如 a b 容器出队列都被调度到 node-B 上运行，此时因为 affinity 声明的关系，容器 c 必须在 node-B 上被调度，这时 Swarm 就会懵逼了，因为 Node-B 的内存不足以调度容器 c 了。

这就是一个成组调度没有被妥善处理的典型例子。

当然针对成组调度还有很多可行但不完美的方案，比如 Mesos 的资源囤积，等 Affinity 约束的容器都到达后再统一调度。又如 Google Omega 中的乐观锁，先不关心是否产生冲突逐一调度，等冲突发生时再通过精心设计的回滚机制回滚。

当然这些措施都不算完美，资源囤积有效率损失和死锁风险，回滚机制的技术要求又比较高。

铺垫了那么久，我们重新回到 Pod 来。kubernetes 以 Pod 为调度单位，只会选择满足 Pod 资源的节点来调度，就不存在成组调度问题,

## 3. 容器设计模式

当然在 kubernetes 中以 Pod 为调度单位可不仅仅是因为成组调度那么简单。更重要的是容器设计模式。

### Pod 原理

要了解容器设计模式，我们需要先了解下 Pod 的实现原理。

这里 Pod 只是一个逻辑概念，在 kubernetes 中并不存在 Pod 的隔离边界，实际还是以 Linux 上的 Namespace 和 Cgroups 作为隔离环境。

而在 Pod 里，所有的容器共享同一个 Network Namespace，并可以声明共享同一个 Volume。

当然 docker 也可以通过 --net 和 --volumes-from 来实现。

```shell
docker run --net=B --volumes-from=B --name=A image-A
```

但 docker 的问题是先要运行容器才能让另一个容器加入相同的 Network Namespace 或是共享一个 Volume。因此它们并不是对等结构。

而 Pod 显然要高明得多，Pod 实现了一个 infra 容器，每一个 Pod 在创建的时候都会先创建一个 infra 容器。infra 容器的用途就是先初始化一个 Network Namespace 或其他 Namespace，能够让用户自定义应用容器通过 join infra Namespace 方式关联在一起。这样的组织关系如图：

![pod](/image/pod.png)

Infra 在 Pod 是一个占位容器，因此需要占用极少的资源，所以它是一个用汇编语言编写的，永远处于暂停状态的镜像，叫做 k8s.gcr.io/pause。解压后的大小只有 100 ～ 200 KB。

这里需要注意的是，容器 A B 的进出流量都是通过 Infra 来代理的。因此任何对 Pod 的网络配置或 Volume 挂载其实是对 Infra 容器生效，又因为用户自定义的容器与 Infra 容器共享同一 Namespace，因此对 Infra 配置也是对用户容器可见的。

有了这个设计后我们在容器间共享 Volume 就容易多了。一个对应宿主机目录的 Volume 对于 Pod 就只有一个。只要 Pod 里的容器声明挂载这个 Volume 就可以实现共享了。

```yaml
apiVersion: v1
kind: Pod
metadata:
	name: two-containers
spec:
  restartPolicy: Never
  volumes:
  - name: shared-data
    hostPath:      
      path: /data
  containers:
  - name: nginx-container
    image: nginx
    volumeMounts:
    - name: shared-data
      mountPath: /usr/share/nginx/html
  - name: debian-container
    image: debian
    volumeMounts:
    - name: shared-data
      mountPath: /pod-data
    command: ["/bin/sh"]
    args: ["-c", "echo Hello from the debian container > /pod-data/index.html"]
```

这里我们声明了两个容器 nginx-container 和 debian-container，它们都声明挂载了 shared-data volume。而 shared-data 是 hostPath 类型。所以它在宿主机上的目录就是 /data。而这个目录就被同时挂载进了两个容器里了。

这样 nginx-container 就能从 /usr/share/nginx/html 读取到 debian-container 生成的 index.html 了。

### Sidecar 模式

Pod 这种超亲密关系的容器设计思想，实际上是希望用户在遇到一个容器跑多个功能的时候，可以考虑将它们描述成一个 Pod 里的多个容器。

这里举例 Tomcat 容器和 WAR 包。

这里我们要通过容器来实现将一个 WAR 包放到 Tomcat 的 webapps 目录下并运行起来。

* 一种方法是将 WAR 包和 Tomcat 打包进一个容器中。但是考虑 WAR 包一旦更换就需要打包一个新的镜像。
* 另一个方法是在容器中挂载一个对应宿主机目录的 volume，但这个又需要在每台服务器上初始化对应的目录和准备好 WAR 包。

而在 Pod 中我们可以考虑将 Tomcat 打包成一个镜像，将 WAR 包打包成一个镜像。然后通过共享 volume 的方式运行起来。

```yaml

apiVersion: v1
kind: Pod
metadata:
  name: javaweb-2
spec:
  initContainers:
  - image: geektime/sample:v2
    name: war
    command: ["cp", "/sample.war", "/app"]
    volumeMounts:
    - mountPath: /app
      name: app-volume
  containers:
  - image: geektime/tomcat:7.0
    name: tomcat
    command: ["sh","-c","/root/apache-tomcat-7.0.42-v2/bin/start.sh"]
    volumeMounts:
    - mountPath: /root/apache-tomcat-7.0.42-v2/webapps
      name: app-volume
    ports:
    - containerPort: 8080
      hostPort: 8001 
  volumes:
  - name: app-volume
    emptyDir: {}
```

这里我们声明了两个容器，第一个容器使用的镜像是 geektime/sample:v2 ，这个镜像只有一个存放在根目录的 WAR 包 sample.war。而另一个容器使用的镜像是 Tomcat。

这里需要注意的是 WAR 包容器声明的是一个 initContainer 类型。initContainer 和 container 的区别在于，initContainer 会先于 container 且按照声明顺序运行，等 initContainer 运行完成才会运行普通的 container。

这里我们 Pod 上挂载的 volume 是一个空目录 app-volume，即它只用于容器间共享。WAR 包容器将 app-volume 挂载到自己的 /app 目录。Tomcat 容器将 app-volume 挂载到自己的 /root/apache-tomcat-7.0.42-v2/webapps 目录下。当 WAR 包容器运行时就会将 sample.war 拷贝到对应目录上，因此 Tomcat 在运行时就能加载对应 Java 应用了。并且在之后需要更新 WAR 包时，只要打一个新的 WAR 包镜像即可。

这种通过主从容器的组织方式我们称为 Sidecar 模式。即我们可以启动一个辅助容器独立于主容器完成一些工作。

Istio 就是一个通过共享 Network Namespace 典型的 Sidecar 项目。

最后为了更好的设计 Pod，我们需要了解下容器的单进程模型，容器的单进程模型不是说容器不允许创建多个进程，而是说容器没有管理多个进程的能力，因为每个容器内 PID=1 的进程就是容器本身，如果通过 docker container -it [containerId] /bin/bash 进入容器内创建的其他进程，这些进程在出现错误或做日志收集等，容器是管理不到的。这是容器的天性。

 
 <comment/> 
