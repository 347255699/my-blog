---
title: 认真学习 kubernetes——Pod 的基本使用
date: 2020-05-10
tags: 
  - k8s
author: Menfre
location: Shenzhen
---

通过前面的学习，我们知道 Pod 是 kubernetes 最小的调度单位。如果将 Pod 落实到 API 对象上，那么 container 则是 Pod 上的一个字段。这里我们需要搞清楚哪些属性是属于容器哪些是属于 Pod。

凡是调度、网络、存储以及安全相关的属性基本都是 Pod 级别的。

接下来我们来学习 Pod 中几个重要的字段。

**NodeSelector**：是一个将 Pod 和 Node 绑定的字段。

```yaml
apiVersion: v1
kind: Pod
...
spec:
 nodeSelector:
   disktype: ssd
```

这样一个配置，意味着 Pod 只能被带有 disktype:ssd 标签的节点调度，否则就会失败。

**NodeName**：一旦 Pod 上这个字段被赋值意味着 Pod 已经被某个节点成功调度了。该字段只会被调度器设置。但是我们也可以手动设置来骗过调度器。

**HostAliases**：定义 Pod 中的 hosts 文件，即设置 /etc/hosts。

```yaml
apiVersion: v1
kind: Pod
...
spec:
  hostAliases:
  - ip: "10.1.2.3"
    hostnames:
    - "foo.remote"
    - "bar.remote"
...
```

如下是设置完成后的 /etc/hosts。

```yaml
cat /etc/hosts
# Kubernetes-managed hosts file.
127.0.0.1 localhost
...
10.244.135.10 hostaliases-pod
10.1.2.3 foo.remote
10.1.2.3 bar.remote
```

这里需要注意的是，为 Pod 中的容器设置 hosts 只能通过这种方式，如果是在容器运行时直接修改 /etc/hosts 会在 Pod 被删除和创建时被重新设置。

除了上述 hosts 配置外，凡是跟容器的 Linux Namespace 相关的属性就一定是 Pod 级别的。

这里可以跟虚拟机与虚拟机上的应用做个比较，这里 Pod 就是虚拟机，容器就是虚拟机上的应用。因此不难想象，在虚拟机上的配置都应该是 Pod 级别的。

比如 **shareProcessNamespace=true**：在容器间共享 pid。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  shareProcessNamespace: true
  containers:
  - name: nginx
    image: nginx
  - name: shell
    image: busybox
    stdin: true
    tty: true
```

这个 Pod 中我们声明了两个容器，nginx 和 一个开启了 tty 和 stdin 的 shell 容器。

这里 shell 容器的效果等同于 docker run -it （it 分别是 stdin 和 tty 的意思）。

这里我们实践一下：

```shell
kubectl create -f nginx.yaml
```

当 Pod 被创建完成之后我们就可以通过 kubectl attach 命令，链接 shell 容器的 tty 了。

```shell
kubectl attach -it nginx -c shell
```

我们可以在 shell 执行 ps 来尝试共享 pid namespace 的效果。

```shell
$ kubectl attach -it nginx -c shell
/ # ps ax
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    8 root      0:00 nginx: master process nginx -g daemon off;
   14 101       0:00 nginx: worker process
   15 root      0:00 sh
   21 root      0:00 ps ax
```

这里我们可以看到 infra 容器的 /pause 进程，以及 ngnix 进程和 sh 进程。

同样的我们可以在 Pod 中共享宿主机的 Namespace。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  hostNetwork: true
  hostIPC: true
  hostPID: true
  containers:
  - name: nginx
    image: nginx
  - name: shell
    image: busybox
    stdin: true
    tty: true
```

这样我们就可以使用宿主机的进程，与宿主机进行 IPC 通信以及看到宿主机中的所有进程了。

除这些字段外，Pod 中最重要的字段就是 **container** 了。除普通的 container 外，我们还接触 initContainer，它们的区别在于 initContainer 会先于普通的 container 并按照声明顺序执行。container 只要等到 initContainer 执行完成才会执行。

kubernetes 中对 container 的定义与 docker 大致一样。如 image、command、workDir、ports 和 volumeMounts 等。如这些主要字段外还有一些需要注意的字段。

**imagePullPolicy**: 定义镜像的拉取策略。

* Always：每次创建 Pod 都重新拉取一次镜像，当拉取镜像的 tag 为 nginx 或 nginx:latest 也会起到相同的效果。
* Never/IfNotPresent：不主动拉取镜像，只有在宿主机中不存在才会主动拉取。

**lifecycle**：它定义的是容器的生命周期 Hooks。

lifecycle的作用是在容器的状态发生变化时触发一系列 “钩子”。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: lifecycle-demo
spec:
  containers:
  - name: lifecycle-demo-container
    image: nginx
    lifecycle:
      postStart:
        exec:
          command: ["/bin/sh", "-c", "echo Hello from the postStart handler > /usr/share/message"]
      preStop:
        exec:
          command: ["/usr/sbin/nginx","-s","quit"]
```

这里我们为 lifecycle-demo-container 容器定义了生命周期钩子 postStart 和 preStop。

* postStart：容器指定后立即执行一个操作，需要注意的是，这里并不能保证在 ENTRYPOINT 之后执行。
* preStop：容器在被杀死前(收到 SIGKILL 信号)执行。这里是同步的，只有钩子执行完成才会杀死容器。
这里的例子是在容器启动后在 /usr/share/message 中写入一条 hello message。在容器关闭之前调用 nginx 的退出命令。

这里我们可以大致的了解下 Pod 在 kubernetes 中的生命周期。

Pod 的生命周期主要体现在 API 的 **Status** 字段。它是除了 Metadata 和 Spec 之外第三个比较重要的字段。其中 pod.status.phase 就是 Pod 当前的状态。状态列表如下：

* Pending：表示 Pod 的 yaml 文件已经提交给 kubernetes 并保存在 Etcd 中，但出于其他原因未能被成功创建。
* Running：表示 Pod 已经成功被某一节点调度，且至少有一个容器在运行中了。
* Succeeded：表示 Pod 的所有容器都正常运行并成功退出了，这种情况在一次性任务中很常见。
* Failed：表示 Pod 中至少有一个容器不正常退出(非 0 返回码)退出。这个时候就要想办法 Debug 容器了，通过 Events 等。
* Unknown：表示异常状态，意味着 Pod 状态未能被 kubelet 持续汇报给 kube-apiserver。可能是主从节点的通信出现问题了。

更进一步的，每一个 Status 还可以细分出一组 **Conditions** 。这些细分状态包含 PodScheduled、

Ready、Initialized 和 Unschedulable。他们主要用于描述造成当前 Status 的原因。

比如 Status 为 Pending，对应的 Condition 为 Unschedulable，则表示调度出了问题。

又如 Ready Condition，表示 Pod 不仅正常启动(Running)且已经对外服务了。

如果想知道 Pod Yaml 文件的全部字段，可以参考 $GOPATH/src/k8s.io/kubernetes/vendor/k8s.io/api/core/v1/types.go 下的 struct。


 
 <comment/> 
