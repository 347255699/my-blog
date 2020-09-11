---
title: ArrayList 源码分析
date: 2020-09-13
tags: 
  - java
author: Menfre
location: Shenzhen
---

## 继承关系

实现接口：

* RandomAccess：常数阶 N(O) 随机访问的能力

* Cloneable：实例拥有字段到字段拷贝的能力，对没有实现 Cloneable 的实例执行 clone() 将会抛出 CloneNotSupportedException

* List：List 继承了 Iterable，ArrayList 能通过 iterator() 获取 Iterator 和使用 foreach() 遍历元素

## 容量分配

ArrayList 的容量增长大小与初始容量息息相关。

容量分配：

* n(n, n > 0)：分配的初始容量将作为增长因子, 容量增长会呈现出 n = n + n / 2 的增长序列。n 越大空间消耗越大，扩容次数越少。n 越小空间消耗越小，扩容次数越多
* 0：使用 0 作为初始容量，容量增长会呈现出 1、2、3、4、6、9、13、19 ... 的增长序列。容量分配的一个极端，空间消耗最小，扩容次数最多
* 10：使用无参构造函数时的默认容量分配，在第一次添加元素时触发，容量增长会呈现出 10、15、33、49 ... 的增长序列
* n(n, n < 0)：抛出 IllegalArgumentException

> ArrayList 的内部数组的最大容量为  2 的 31 次方 - 1，也就是 int 原始数据类型最大值。

如果提前知道集合的最大容量，可以直接分配固定容量，减少扩容带来性能开销。如果预期集合的元素添加数量庞大可以适当分配较大的初始容量来减少扩容次数。这条法则对大多数有扩容机制的集合类都有效。

ArrayList 三种构造函数：

* ArrayList(int)：可以分配 n(n, n 属于 Z)
* ArrayList()：默认构造函数，初始容量为 10
* ArrayList(Collection)：初始容量为参数 Collection.size()

## add()

ArrayList 支持如下操作：

* add(E)
* add(int, E)
* remove(int)
* remove(E)

### add(E)

关键源码分析：

```java
    public boolean add(E e) {
        // 确认当前数组容量
        ensureCapacityInternal(size + 1);  // Increments modCount!!
        elementData[size++] = e;
        return true;
    }

    private void ensureCapacityInternal(int minCapacity) {
        ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
    }

    private static int calculateCapacity(Object[] elementData, int minCapacity) {
      	// 使用默认构造函数实例化对象并首次添加元素
        if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
            return Math.max(DEFAULT_CAPACITY, minCapacity);
        }
        return minCapacity;
    }

		private void ensureExplicitCapacity(int minCapacity) {
        modCount++;

        // overflow-conscious code
      	// 判断当前数组容量是否超出容量，超出则进行扩容
        if (minCapacity - elementData.length > 0)
            grow(minCapacity);
    }

    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        // 执行 n = n + n / 2
        int newCapacity = oldCapacity + (oldCapacity >> 1);
  
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        // 扩容后的数组容量超过最大限制
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        // 执行扩容，调用  System.arraycopy() 执行数组拷贝
        elementData = Arrays.copyOf(elementData, newCapacity);
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
      	// minCapacity <= MAX_ARRAY_SIZE || minCapacity > MAX_ARRAY_SIZE
        return (minCapacity > MAX_ARRAY_SIZE) ?
            Integer.MAX_VALUE :
            MAX_ARRAY_SIZE;
    }
```

 ### add(int, E)

```java
    public void add(int index, E element) {
        // 检查下标是否越界
        rangeCheckForAdd(index);
				
      	// 确认当前数组容量 
        ensureCapacityInternal(size + 1);  // Increments modCount!!
        
        // 拷贝数据，将当前下标元素以及后面所有的元素都往后移动一位
        System.arraycopy(elementData, index, elementData, index + 1,
                         size - index);
        elementData[index] = element;
        size++;
    }
```

### remove(int)

```java
    public E remove(int index) {
        // 检查下标是否越界
        rangeCheck(index);

        modCount++;
        E oldValue = elementData(index);

        // 需要移动的元素数量
        int numMoved = size - index - 1;
        if (numMoved > 0)
            // 拷贝数据，将当前下标后面的所有元素向前移动一位
            System.arraycopy(elementData, index+1, elementData, index,
                             numMoved);
        // 让最后一位元素变为游离态，让 GC 尽早回收内存
        elementData[--size] = null; // clear to let GC do its work

        return oldValue;
    }
```

### remove(E)

```java
    public boolean remove(Object o) {
        if (o == null) {
            for (int index = 0; index < size; index++)
              	// 查找第一个 null 的下标，执行移除操作，这里 List 是支持重复插入的，可能有多个 null
                if (elementData[index] == null) {
                    fastRemove(index);
                    return true;
                }
        } else {
            for (int index = 0; index < size; index++)
                // 查找第一个匹配元素的下标，执行移除操作，这里 List 是支持重复插入的，可能有多个匹配元素
                if (o.equals(elementData[index])) {
                    fastRemove(index);
                    return true;
                }
        }
        return false;
    }

    private void fastRemove(int index) {
        modCount++;
        
        // 需要移动的元素数量
        int numMoved = size - index - 1;
        if (numMoved > 0)
            // 拷贝数据，将当前下标后面的所有元素向前移动一位
            System.arraycopy(elementData, index+1, elementData, index,
                             numMoved);
        // 让最后一位元素变为游离态，让 GC 尽早回收内存
        elementData[--size] = null; // clear to let GC do its work
    }
```

最后我们发现每个操作中对会对 modCount 变量自增 1，这个变量的作用是在对集合执行遍历的过程中，让 Iterator 能够知道元素是否被改动了，此时会抛出 ConcurrentModificationExceptions







 
 <comment/> 
