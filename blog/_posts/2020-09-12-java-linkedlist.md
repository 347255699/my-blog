---
title: LindedList 源码分析
date: 2020-09-12
tags: 
  - java
author: Menfre
location: Shenzhen
---

## 继承关系

实现接口：

* Cloneable：实例拥有字段到字段拷贝的能力，对没有实现 Cloneable 的实例执行 clone() 将会抛出 CloneNotSupportedException
* Deque：双向队列，能够在两端对元素进行添加和移除操作。Deque 继承了 Queue，LindedList 同时也是一个 Queue
* List：List 继承了 Iterable，LindedList 能通过 iterator() 获取 Iterator 和使用 foreach() 遍历元素

## 内部类

LindedList 的元素存在内部类 Node 中。Node 的成员变量如下：

* E item
* Node\<E> next
* Node\<E> prev

Node 类有两个引用，用于向前和向后寻址，关联其他 Node。

## 源码

LindedList 的核心源码比较简单，它就是一个双向链表的标准实现。

LindedList 支持如下操作：

* add(E)
* add(int, E)
* remove(int)

### add(E)

```java
    public boolean add(E e) {
        linkLast(e);
        return true;
    }

    void linkLast(E e) {
        final Node<E> l = last;
        // 创建新的节点用于存放添加元素
        final Node<E> newNode = new Node<>(l, e, null);
        last = newNode;
        // last 节点为空，说明新添加的节点是第一个节点，也就是头部节点
        if (l == null)
            first = newNode;
        else
            // 其他情况，将前一个节点的 next 引用指向新的节点 
            l.next = newNode;
        size++;
        modCount++;
    }
```

### add(int, E)

```java
    public void add(int index, E element) {
        // 检查下标是否越界
        checkPositionIndex(index);
					
        // 如果插入的位置是在尾部，与顺序添加的情况一致
        if (index == size)
            linkLast(element);
        else
            // 其他情况，需要移动当前位置以及前后节点的 next/prev 引用完成插入
            linkBefore(element, node(index));
    }
		
  	// 通过遍历链来寻找指定下标的节点
    Node<E> node(int index) {
        // assert isElementIndex(index);
				
      	// 寻找的节点在前半部分，通过头部节点向后寻找
        if (index < (size >> 1)) {
            Node<E> x = first;
            for (int i = 0; i < index; i++)
                x = x.next;
            return x;
        } else {
            // 寻找的节点在后半部分，通过尾部节点向前寻找
            Node<E> x = last;
            for (int i = size - 1; i > index; i--)
                x = x.prev;
            return x;
        }
    }

    void linkBefore(E e, Node<E> succ) {
        // assert succ != null;
        final Node<E> pred = succ.prev;
        // 创建新节点
        final Node<E> newNode = new Node<>(pred, e, succ);
        // 原节点的 prev 引用指向新创建的节点
        succ.prev = newNode;
        // pred 节点为空，说明插入的位置为头部
        if (pred == null)
            first = newNode;
        else
            // 其他情况，将前一个节点的 next 引用指向当前节点
            pred.next = newNode;
        size++;
        modCount++;
    }
```

### remove(int)

```java
    public E remove(int index) {
        // 检查下标是否越界
        checkElementIndex(index);
        return unlink(node(index));
    }

    E unlink(Node<E> x) {
        // assert x != null;
        final E element = x.item;
        final Node<E> next = x.next;
        final Node<E> prev = x.prev;
        
      	// prev 节点为空，说明当前移除节点为头部节点
        if (prev == null) {
            // 直接将头部节点更换为下一个节点
            first = next;
        } else {
            // 其他情况，prev 节点的 next 引用指向 next 节点 
            prev.next = next;
            // 让移除节点的 prev 引用变为游离态，加速 GC 回收
            x.prev = null;
        }
				
        // next 节点为空，说明当前移除节点为尾部节点
        if (next == null) {
           // 直接将尾部节点更换为上一个节点
            last = prev;
        } else {
            // 其他情况，next 节点的 prev 引用指向 prev 节点 
            next.prev = prev;
            x.next = null;
        }

        x.item = null;
        size--;
        modCount++;
        return element;
    }
```

### 总结

LindedList 由双向链表实现，它可以从头部和尾部两个方向进行寻址。LinkedList 插入和移除元素开销较小，只要更换前后节点的引用可。但 LinkedList 长度过大时，寻址性能会下降。LinkedList 做插入和移除操作时，性能开销集中寻址，访问的速度与节点所在位置会由中间向前和向后呈现出越接近两端速度越快，越接近中间速度越慢的关系。

 
 <comment/> 

 
 <comment/> 
