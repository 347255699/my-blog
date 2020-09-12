---
title: Java 集合类 Overview
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
> 小知识：其实 Collection 所定义的集合操作接口大多能够对应到数学的交并补概念。如 retainAll() 体现的就是一个交集的概念。另外这种概念还能体现在 sql 的 left/right/inner join 等表连接操作上。

## Iterator

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

## Iterable

实现了 Iterable 的 Java 对象都能通过 for-each 或 Iterator 对元素进行遍历。

如下例子：

```java
List<String> list = new ArrayList<>();
list.add("1");
list.add("2");
list.add("3");

// 方式 1
for(String ele : list){
  System.out.println(ele);
}

// 方式 2
Iterator<String> iterator = list.iterator();
while(iterator.hasNext()){
  String ele = iterator.next();
  System.out.println(ele);
}

// 方式 3：这里只不过是 Lambda 语法糖而已，内部还是通过 foreach 对元素进行迭代
list.forEach(ele -> {
  System.out.println(ele);
});
```

Iterable 定义如下方法：

* iterator()
* spliterator()
* forEach(Consumer<? super T> action)

iterator() 方法必须被实现，其余两个可选。这里的 iterator() 会返回一个 Iterator 对象用于支持 for-each 遍历元素。

结合前面的 MyIterator 实现自己的 Iterable：

```java
public class MyIterable implements Iterable {
    private List<Person> persons = new ArrayList<Person>();    
    
    public Iterator<Person> iterator() {
        return new MyIterator<>(this.person);
    }
}
```

### Iterable 性能

在某些特殊的场景下 for-each 的性能远不如普通的 for 循环。在较小时间单位内进行数千次的迭代，如一秒内对 List 进行上千次的迭代。这种场景下 for-each 每迭代一次都会产生一个 Iterator 对象，上千次迭代就会产生上千个 Iterator 对象；反观普通的 for 循环，无论迭代多少次都不会有新对象的开销，如果使用的是 ArrayList 还能使用连续的内存空间特性来提升迭代性能。

当然在一般情况下，for-each 和 普通 for 循环的迭代开销还是差异比较小的。

普通 for 循环：

```java
List<String> list = new ArrayList<>();
list.add("1");
list.add("2");
list.add("3");

for(int i=0; i<list.size(); i++) {
    String ele = list.get(i);
}
```

## Collection

Collection 是集合类中顶层接口之一，它定义了如下方法：

* add()：添加元素
* remove()：移除元素
* addAll()：添加另一个集合对象，将另一个集合对象中存在的元素逐个添加到原集合中，是否允许添加重复元素由实现类决定
* removeAll()：传递一个集合参数，移除原集合中与参数集合中匹配的元素，若参数集合中的元素在原集合匹配不到则忽略。
* retainAll()：传递一个集合参数，移除原集合中与参数集合中不匹配的元素，若参数集合中的元素在原集合匹配不到则忽略。
* contains()/containsAll()：检查集合中是否包含一个或一组元素，包含返回 true，不包含返回 false。检查是否包含一组元素时，需要全部元素都包含才会返回 true，否则返回 false。默认集合都是通过元素的 equal() 方法判断元素是否相同。特别的，判断是否包含 null 值时会通过 == 来比较。
* size()：返回元素个数。

## Collections

Collections 包含了一组作用于 Java 集合类的工具方法。

### addAll()

能够通过可变参数为集合类添加元素。

```java
List<String> list = new ArrayList<>();

Collections.addAll(list, "ele1", "ele2", "ele3");
```

### binarySearch()

二分查找，能对集合类使用二分查找来检索对应的元素。应用二分查找前需要对集合进行排序。

```java
List<String> list = new ArrayList<>();
list.add("one");
list.add("two");
list.add("three");
list.add("four");
list.add("five");

Collections.sort(list);

// 找出对应元素的下标，如果没有返回 -1 
int index = Collections.binarySearch(list, "four");
```

### copy()

将一个集合类中的元素 copy 到另一个集合类。

```java
List<String> src = new ArrayList<>();
Collections.addAll(src, "e1", "e2", "e3");

List<String> dest = new ArrayList<>();
Collections.copy(dest, src);
```

### shuffle()

对集合类中的元素进行打乱或称为洗牌。

```java
List<String> list = new ArrayList<String>();

list.add("one");
list.add("two");
list.add("three");

Collections.shuffle(list);
```

### sort()

对集合类元素进行排序。

### min()

依赖排序结果，取集合中最小元素。

### max()

依赖排序结果，取集合中最大元素。

### replaceAll()

查询替换，将集合中出现目标元素的位置都替换为新值。

```java
List source = new ArrayList();
source.add("your");
source.add("their");
source.add("your");

// 至少有一个元素查询和替换成功，返回 true，否则为 false
boolean replacedAny = source.replaceAll(source, "your", "my");
```

### unmodifiableSet()

将普通的 Set 集合变成不可变集合。

```java
Set normalSet = new HashSet();
Set immutableSet = Collections.unmodifiableSet(normalSet);
```

## List

List 代表一个元素有序且允许重复的集合。

提到 List 就不得不提 Set，List 和 Set 在元素的遍历和添加上有两点不同。第一点在于 List 是有序，能通过下标去获得对应的元素，能按照顺序对元素进行遍历；而 Set 则不能保证遍历的顺序。第二点在于 List 能添加重复值，而 Set 不能。特别的 List 允许添加多个 null 值。

List 有多个实现类，其中用得比较多的是 ArrayList。 实现类列表如下：

* ArrayList
* LinkedList
* Vector
* Stack

> 当然在 java.util.concurrent 包下也有 List 的实现类，这里暂不提 concurrent 包的东西。

除继承 Collection 所定义的方法外，List 还定义了如下方法：

* add(index, element)：在指定的下标插入元素，若所指定的下标已有元素，当前下标以及之后的元素都会整体向后移动一个位置。
* get(index)：获得指定下标的元素。
* indexOf()/lastIndexOf()：查询一个元素在 List 中是否存在，存在返回下标，不存在返回 -1。indexOf() 多个元素匹配时返回第一个下标，lastIndexOf() 多个元素匹配时返回最后一个下标。
* remove(index)：通过下标移除元素，移除的下标之后还有元素的话会整体向前移动一个位置。
* clear()：移除所有元素。
* subList(startIndex, endIndex )：通过下标区间截取元素，如 [1, 3)，取得下标为 1、2 的元素作为新集合的元素。

将数组转换为 List：

```java
String[] values = new String[]{ "one", "two", "three" };

List<String> list = Arrays.asList(values);
```

排序：

除了使用默认的 Collections.sort() 排序外，还能通过 Collections.sort(Collection, Comparator) 来自定义排序规则。

##  Set

Set 代表一个元素不能重复的集合。Set 与 List 的不同，前面已经对比过了，这里不再赘述。

Set 有多个实现类，不同的实现类在元素遍历顺序的保证以及插入和获取元素的时间性能都截然不同。

* EnumSet
* HashSet
* LinkedHashSet
* TreeSet

HashSet 来源于 HashMap，它无法保证元素的遍历顺序。

LinkedHashSet，能够保证元素的遍历顺序与元素插入的顺序相同。

TreeSet，能够保证元素的遍历顺序，但保证的是元素通过 Collections.sort() 排序后的顺序而非添加顺序。

> 当然在 java.util.concurrent 包下也有 Set 的实现类，这里暂不提 concurrent 包的东西。
>
> 小知识：通常集合类的特性越多越复杂预示着需要额外多的性能开销来维护这些特性。

Set 所定义的方法与 List 除去下标操作部分外所定义的方法高度一致，这里将不再赘述。

特别的，Set 与 List 都继承了 Collection，因此都可以通过 addAll() 来相互添加彼此。

## SortedSet

SortedSet 是 Set 的一个子接口，与它的名字一样，它代表着一个内部元素排过序的 Set。

SortedSet 只有 TreeSet 这一个实现类。

> 当然在 java.util.concurrent 包下也有 SortedSet 的实现类，这里暂不提 concurrent 包的东西。

TreeSet 默认使用元素的自然排序，即元素默认的 Comparator。若元素没有 Comparator，你可以为 TreeSet 指定一个。

自定义排序：

```java
Comparator comparator = new MyComparatorImpl();

SortedSet sortedSet = new TreeSet(comparator);
```

集合中默认获得 Iterator 都是升序的(若集合本身支持排序的话)。TreeSet 支持获得降序的 Iterator：

```java
TreeSet treeSet = new TreeSet();

treeSet.add("one");
treeSet.add("two");
treeSet.add("three");

Iterator<String> iterator = treeSet.descendingIterator();
while(iterator.hasNext()) {
    String ele = iterator.next();
    System.out.println(ele);
}
```

获得当前使用的 Comparator：

```java
Comparator comparator = sortedSet.comparator();
```

获得首个/最后一个元素：

```java
Object firstElement = sortedSet.first();
Object lastElement = sortedSet.last();
```

TreeSet 有三种方式来截取 Set：

* headSet(ele)：截取 ele 之前的元素，不包含 ele。[first, ele)
* tailSet(ele)：截取 ele 之后的元素，包含 ele。[ele，last]
* subSet(ele1，ele2)：截取 ele1 到 ele2 之间的元素，包含 ele1 和 ele2。[ele2, ele2]

例子：

```java
SortedSet sortedSet = new TreeSet();
sortedSet.add("a");
sortedSet.add("b");
sortedSet.add("c");
sortedSet.add("d");
sortedSet.add("e");

// {"a", "b"}
SortedSet tailSet = sortedSet.headSet("c");
// {"c", "d", "e"}
SortedSet tailSet = sortedSet.tailSet("c");
// {"c", "d", "e"}
SortedSet tailSet = sortedSet.subSet("c", "e");
```

## NavigableSet 

NavigableSet 是 SortedSet 的子接口。它在 SortedSet 的基础上额外提供了一组方法。

* descendingSet()：获得一个元素反转之后的 Set。
* ceiling(element)：获得大于等于给定元素的最小值。
* floor(element)：获得小于等于给定元素的最大值。
* higher(element)：获得大于给定元素的最小值。
* lower(element)：获得小于给定元素的最大值。
* pollFirst()：返回并移除第一个元素。
* pollLast()：返回并移除最后一个元素。

 
 <comment/> 

 
 <comment/> 

 
 <comment/> 

 
 <comment/> 
