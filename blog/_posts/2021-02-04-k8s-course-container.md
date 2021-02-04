---
title: K8S 课程笔记——容器的本质
date: 2021-02-04
tags: 
  - k8s
  - docker
author: Menfre
location: Shenzhen
---

## 容器的本质是什么 ？

容器是一种沙盒技术，可以将事物隔离起来，让事物之间互不干扰且方便搬运。现实生活中最为典型的例子就是集装箱，集装箱可以将货物打包隔离开来方便搬运。沙盒技术运用到应用程序上最为关键的是实现应用程序的边界。

应用程序的运行时环境总和通常称为进程，我们所说的边界实现实际上是实现进程的边界。容器技术的核心是通过约束和限制进程从而创造出一个边界。

### 容器技术的典型代表：docker

docker 是容器技术的典型代表。docker 依赖 Linux 的 Namespace、Cgroups、rootfs 和 unionFS 来实现容器技术。

#### Namespace

Linux Namespace 技术实际上是在创建进程时为进程指定一组 Namespace 参数，从而来限制进程创建后所看到的操作系统视图。比如设置 CLONE_NEWPID 参数来限制进程看到的进程列表视图。

```c
int pid = clone(main_function, stack_size, CLONE_NEWPID | SIGCHLD, NULL); 
```

当通过这种方式创建的进程，通过 ps 命令所看到的进程列表中只有它自己，即它是第 1 号进程。但是实际上在宿主机操作系统上它是第 99 号进程，只是通过 CLONE_NEWPID 参数被限制了查看的进程列表只有它自己以及在容器里创建的其他进程。

PID 只是 Linux 提供的其中一种 Namespace，其他的还有 Mount、UTS、IPC、Network 和 User Namespace，他们共同限制了进程所能看到的操作系统视图。

所以容器的本质实际上只是一个特殊的进程而已，一个被施了障眼法的进程而已。

#### Cgroups

Namespace 只是限制进程看待操作系统的视图，但并没有限制进程对计算机资源的使用。Cgroups(Control Group) 就是 Linux 提供的用来限制进程资源使用的技术。

linux Cgroups 是以文件系统的方式来操作进程的资源限制的，毕竟 linux 的理念就是万物皆文件。 Cgroups 的资源限制操作被组织在 /sys/fs/cgroup 路径下。cgroup 每一个子目录都对应着一种能够被限制的资源。比如 cgroup/cpu 子目录。

 如果我们要限制一个进程的 cpu 使用率，可以通过操作 cpu.cfs_period_us 和 cpu.cfs_quota_us 两个文件来实现目的，period 是指 cpu 的运行时间片，quota 是指进程在时间片中所能占用的使用时间。比如 period 设置为 100000 (100 ms)，quota 设置为 20000(20 ms)，那么被设置的进程实际能使用到的最大 cpu 资源只能占用 cpu 总资源的 20%。

大致用法：

```shell
cd /sys/fs/cgroup/cpu
# 在 cpu 目录下创建一个子目录，系统会在目录创建成功后自动生成 cpu.cfs_period_us、cpu.cfs_quota_us 等文件
mkdir container
cd container
echo 20000 > cpu.cfs_quota_us
echo 100000 > cpu.cfs_period_us
echo [PID] > tasks
```

通常我们会为每一个需要限制的进程创建一个子目录。然后通过子目录中的限制文件内容来限制进程的资源使用。

除了 cpu 外，我们还能限制如下几种资源：

* blkio，为块设备设定 I/O 限制，用于磁盘设备
* cpuset，分配单独的 CPU 核心
* Mermory，限制内存使用

#### rootfs

限制进程所能见到的操作系统视图和资源使用后，我们希望容器中所能看到的文件系统也是完全隔离开的。我们可以通过 mount Namespace 来隔离挂载的文件系统，但事实上 mount Namespace 比较特殊，它一定要先调用 mount 来重新挂载某个挂载点之后，挂载点才能跟宿主机隔离开。否则将继承宿主机的文件系统。如果你在指定 Mount Namespace 参数后调用了  mount /tmp，那么 /tmp 才能跟宿主机隔离开。根据这种做法我们理所当然的可以想到重新挂载整个根目录(/)，来让整个根文件系统跟宿主机隔离开。实际上 linux 提供了这种功能，他就是 chroot 命令，chroot 可以让我们指定其他目录作为当前进程的根目录。

```shell
# 指定 test 目录作为 /bin/bash 的根目录
chroot ~/test /bin/bash
```

最后我们希望进程看到的根目录更加真实，我们会在根目录下挂载完整的操作系统文件目录。

通常我们称这种挂载在进程根目录下用来提供进程完整运行时所需要的环境的文件系统为 rootfs，也称为容器镜像。

一个完整的容器镜像通常会包含如下文件目录：

```shell
bin dev etc home lib lib64 mnt opt proc root run sbin sys tmp usr var
```

docker 在实际使用中会优先调用 pivot_root，只有在操作系统不支持 pivot_root 时才会调用 chroot。

最后需要明确的是容器只是根文件系统不一样而已，而他们调用的实际还是同一个 linux 内核。

rootfs 是 docker 最为重要的概念和技术，也是容器镜像一致性的由来。通常我们在打包镜像的时候会连同程序依赖的整个操作系统文件目录也一起打包了。

#### unionFS 

前面提到 rootfs，实际上对 rootfs 的每一次修改都会产生一个全新的镜像。过多的镜像分支不利于分发和维护。因此 docker 创造性的提出了增量 rootfs，即对 rootfs 进行分层管理，然后可以通过 unionFS 技术将多个层联合挂载为一个 rootfs。

unionFS 的作用是将不同的两个目录的内容联合挂载到同一个目录下，并且对联合挂载目录的修改会直接反馈到原来的两个目录下。

```shell
$ tree
.
├── A
│  ├── a
│  └── x
└── B
  ├── b
  └── x
```

```shell
$ mkdir C
$ mount -t aufs -o dirs=./A:./B none ./C
```

```shell
$ tree ./C
./C
├── a
├── b
└── x
```

相同的文件 x 会被合并为一份，且对 a、b 的修改会被反馈到文件夹 A 和 B 中。

docker 具体使用的 unionFS 技术是 AuFS。

当你通过 docker pull 拉取镜像并运行时，docker 会创建如下三种不同的层。

* 只读层：顾名思义你在容器所有的修改都不会反馈到这个层上，是多个容器可以共享的层。
* 读写层：你在容器上所有的修改都会反馈到这个层上，在往后的时间里你可以通过 docker commit 来将读写层保存为一个只读层作为其他容器的共享层。
* init 层：docker 额外提供的层，用于保存 host 文件等不希望被提交到只读层的文件。

你在容器中对只读层的增删改都只会反馈到读写层，不会真的修改到只读层。对于只读层的文件删除，docker 的做法是通过 whiteout 的技术隐藏文件，比如你想删除 foo 文件，那么 docker 会在读写层新增 .wh.foo 来在联合挂载的时候隐藏文件。

## 总结

容器的本质实际是一个特殊的进程，只是对一个进程作了障眼法。因此容器对比其他虚拟化技术它更具有敏捷、轻量等特性。docker 的容器化技术是完全依托于 linux 的 namespace、cgroups、rootfs 和 auFS 技术。docker 对容器化真正的贡献是创新性的提供了一种强一制性，增量的多层次的 rootfs 打包方式，这种方式越来越成为当今应用发布的首选方式。 