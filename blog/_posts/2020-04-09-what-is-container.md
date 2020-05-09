---
title: 什么是容器
date: 2020-04-09
tags: 
  - Docker
author: Menfre
location: Shenzhen  
---

![什么是容器](/image/container.png) 

容器即沙盒技术，容器技术的典型代表 Docker，实现沙盒技术的关键是实现边界。

Docker 实际借助了 Linux namespace、cgroup 和 rootfs 技术来隔离和限制系统中的进程(运行着的应用)，从而实现容器。Docker 实际并非拥有一个 Container Engine，而仅仅作为一个辅助程序帮助我们在 Linux 上运行容器。Docker 更大的价值是为我们提供了一种强一致性的应用打包和分发方式，即通过 dockerfile 来声明应用和应用所需要的运行环境总和。

实际上 Docker 在启动容器时，为进程预设了一组 namespace，从而改变了进程能够看到的操作系统视图，以及通过 cgroup 限制了应用能够调用的系统资源，最后通过 rootfs 改变容器内应用能够看到的根文件目录。除这三个核心技术外，Docker 还通过 ufs(aufs) 来对镜像进行分层以及联合挂载，使镜像能够被增量维护。因此 Docker  中的容器仅仅是一种被隔离和限制的特殊进程，与其他进程没什么两样。它们与宿主机上的其他非容器进程仍然共享同一个系统内核。

 
 <comment/> 
 