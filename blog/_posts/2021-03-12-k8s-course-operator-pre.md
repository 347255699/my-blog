---
title: k8s 课程笔记——Operator基础
date: 2021-03-12
tags: 
  - k8s
  - docker
author: Menfre
location: Shenzhen
---

## 声明式 API

学习 Operator 之前需要先深刻理解下声明式 API，声明式 API 是 kubernetes 编排赖以生存的关键特性。

> 编排指的是维护容器以及容器之间的依赖关系。

我们在编排容器的时候，除了声明式 API 外。还有其他两种常见的操作方式。了解这两种方式可以让我们通过对比的方法来了解声明式 API。

* 命令式命令行
* 命令式配置文件

### 命令式命令行

命令式命令行的方式是比较常见的方式，比如 docker 中的 run 命令，直接通过命令设置容器的运行参数来运行容器。

```shell
 docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
```
### 命令式配置文件

docker-compose 使用的就是命令式配置文件的方式，往往我们需要将容器的信息以及容器的依赖关系编写进一个 yaml 格式的配置文件，然后通过 docker-compose 的 up 命令将配置文件交给 docker-compose。

```shell
docker-compose -f standalone-mysql-5.7.yaml up
```

同样的方式还有 kubectl 的 replace 命令。这种操作方式的特点是每一次运行都会创建出一个全新的 API 对象出来。

### 声明式 API

在 kubernetes 中通常我们使用 kubectl apply 命令就是使用了声明式 API 的方式在管理容器。

```shell
kubectl apply -f mysql-statefulset.yaml
```

声明式 API 可以有多个 API 写入端通过 patch 的方式修改同一个 API 对象，多个 API 写入端修改同一个 API 对象往往会伴随着 merge 操作(声明中有相同的字段内容)。

在 kubernetes 中用户往往只需要声明对象的基本信息以及预期状态，通过 apply 提交给 kubernetes 后，kubernetes 会有与之相关的一个或多个Initailizer、控制器等。通过 patch 的方式来修改同一份 API 对象。以此来联合达到用户所声明的预期状态。而用户在之后的时间里有修改 API 对象的需求也是通过 apply 即 patch 的方式来修改 API 对象这使得控制器原先对 API 对象的修改得以保留，用户新的修改不会产生新的 API 对象。

这种持续修改并且作用在同一个 API 对象上的特性正是声明式 API 对象的好处。

> kubernetes 能达到声明式 API 效果的命令还有 kubectl set image 以及 kubectl edit 等。

## API 对象

kubernetes 中提供了许许多多的 API 资源对象，这些 API 资源对象有的用来描述应用，有的用来描述资源，而有的则用来描述编排方式。

常见的 API 对象有：

* Pod
* ConfigMap
* Deployment
* StatefulSet
* Service
* CronJob

kubernetes 中 API 对象可以通过一定的规则来定位。主要通过 Group、Version、Resouce 三部分来定位。

比如声明一个 CronJob 对象：

```yaml
apiVersion: batch/v2alpha1
kind: CronJob
...
```

其中 batch 就是 Group，v2alpha1 就是 Version，而 CronJob 就是 Resouce，kubernetes 中就是通过 version 来进行 API 对象的多版本管理的。

但需要注意的是像 Pod、Deployment 等 kubernetes 中标准的 API 对象它们的 Group 为 “ ”，所以这些对象的定义往往是这样的：

```yaml
apiVersion: v1
kind: Pod
```

它们会从 Version 开始匹配。

从 v1.7 之后 kubernetes 允许我们通过 CRD(Custom Resource Definition)来定义我们自己的 API 资源对象。 

比如我们定义一种 Network API 资源；

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: networks.samplecrd.k8s.io
spec:
  group: samplecrd.k8s.io
  version: v1
  names:
    kind: Network
    plural: networks
  scope: Namespaced
```

将这个 CRD 通过 kubectl apply 交给 kubernetes 之后，我门就能创建自己的 CR 了。

比如：

```yaml
apiVersion: samplecrd.k8s.io/v1
kind: Network
metadata:
  name: example-network
spec:
  cidr: "192.168.0.0/16"
  gateway: "192.168.0.1"
```

其中 samplecrd.k8s.io 就是我们自定义资源的组，v1 是我们的版本，而 Network 就是我们的资源名称。

> 需要注意的是资源组的名称必须有两个 `.`，比如 samplecrd.k8s.io 。

## 控制器

占位..
 
 <comment/> 
 
 
 <comment/> 
 
 
 <comment/> 
 