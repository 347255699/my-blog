---
title: Java 集合类 —— Iterator
date: 2020-08-30
tags: 
  - java
author: Menfre
location: Shenzhen
---

实现了 Iterator 接口的 Java 对象都具有从集合中遍历元素的特性。

Iterator 定义了如下方法：

* hasNext()：如果集合中还有元素可迭代返回 true，如何没有返回 false。
* next()：获取集合中的下一个元素。
* remove()：从集合中移除上一次 next() 获得的元素。
* forEachRemaining()：遍历集合中的每一个元素，并把这些元素作为参数传递给一个 Lambda 表达式。 

前面的继承关系中我们提到了 Iterable 顶层接口，任何实现了 Iterable 的集合类，我们都能通过 iterator() 方法来获取 Iterator。这里体现了 Iterable 和 Iterator 的关系，Iterator 代表了实现类是一个可被遍历的对象，而 Iterable 实现类是一个可以产生 Iterator 的集合类。

如下例子：

获得 Iterator：

```java
List<String> list = new ArrayList<>();
list.add("1");
list.add("2");
list.add("3");
list.iterator();

Set<String> set = new HashSet<>();
set.add("1");
set.add("2");
set.add("3");
set.iterator();
```

使用 Iterator：

```java
Iterator<String> iterator = list.iterator();
// 方式 1
while(iterator.hasNext()) {
    String yourElement = iterator.next();
}
// 方式 2
iterator.forEachRemaining(ele -> {
  System.out.println(ele);
});
```

Iterator 的元素顺序取决于它是由哪个实现类提供的。如果 Iterator 是由 List 提供的那它就是有序的，如果它是 Set 提供的那么它就是无序的。

多数集合类都不允许在迭代过程中对集合的元素进行修改，一旦这么做了程序就会抛出异常。这里的修改不包含 调用 iterator 的 remove()  方法。

如下例子：

```java
List<String> list = new ArrayList<>();
list.add("1");
list.add("2");
list.add("3");

Iterator<String> iterator = list.iterator();
while(iterator.hasNext()){
  String value = iterator.next();
   if("2".equals(value)){
     // 不会抛出 ConcurrentModificationException
     iterator.remove();
   }
  if("2".equals(value)){
    // 抛出 ConcurrentModificationException
    list.add("4");
  }
}
```

Iterator 还有一个子接口 ListIterator，它提供了双向遍历的功能，普通的 Iterator 只能向后遍历元素，ListIterator 前后遍历元素都可以。

如下例子：

```java
List<String> list = new ArrayList<>();
list.add("1");
list.add("2");
list.add("3");

Iterator<String> iterator = list.listIterator();
while(iterator.hasNext()) {
    System.out.println(iterator.next());
}
        
while(iterator.hasPrevious()) {
    System.out.println(iterator.previous());
}
```

实现自己的 Iterator：

```java
import java.util.Iterator;
import java.util.List;

public class MyIterator <T> implements Iterator<T> {
    private List<T> source = null;
    private int index = 0;

    public MyIterator(List<T> source){
        this.source = source;
    }

    @Override
    public boolean hasNext() {
        return this.index < this.source.size();
    }

    @Override
    public T next() {
        return this.source.get(this.index++);
    }
}
```

> 小知识：我们可以按照类似生物学中的 界、门、纲、目、科、属、种 来对我们现实中的对象进行继承关系梳理，比如 ArrayList 首先是一个 Iterabel，然后是一个 Collection，再然后才是一个 List。每一层继承关系都是对同一类对象的特性或行为的抽象。我们人类按照生物学的定义被分类为哺乳纲、灵长目、人科、人属、智人种。
