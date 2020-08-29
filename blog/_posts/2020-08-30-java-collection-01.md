---
title: Java 集合类 —— 概念
date: 2020-08-30
tags: 
  - java
author: Menfre
location: Shenzhen
---

最近由于换工作的需要，开始回顾 Java 的基础。重新回看集合类还是别有一番滋味的。

为了更好的了解集合类和使用它们我们需要对集合类之间的继承关系有一个较好的了解。不同的继承关系会使得它们的实现类呈现出不同的特性。这些关系你可以直接通过阅读源码得出。按照不同的继承链我们可以得到两组接口，分别是 Collections 和 Map。

继承关系图：

![collections-01](/image/java/collections-01.png)

这里我们以常用的 ArrayList 为例，来分析它的继承关系所带来的特性。ArrayList 是 List 接口的实现，同时 List 继承了 Collection，Collection 又继承了顶层接口 Iterable。

* Iterable 定义了一个 iterator 接口，实现了该接口的集合类具有获取 iterator 通过 iterator.next() 和使用 foreach 语法糖进行迭代的特性。
* Collection 定义了一组元素操作、元素比较、集合操作以及集合转换等接口，实现了该接口的集合类能使用 add()/remove()、contains()、addAll\removeAll() 以及 toArray() 等功能。
* List 定义了一组通过下标操作元素的接口以及内置有排序方法，实现了该接口的集合类具备有序、能使用 add(index)/get(index) 等特性。

> 同样的，我们想要知道其他集合类拥有什么特性只要分析它们的继承关系即可。
>
> 小知识：其实 Collection 所定义的集合操作接口都能对应到数学的交并补概念。如 retainAll() 体现的就是一个交集的概念。另外这种概念还能体现在 sql 的 left/right/inner join 等表连接操作上。

