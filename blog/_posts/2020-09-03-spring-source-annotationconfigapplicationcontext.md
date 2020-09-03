---
title: Spring 源码分析 —— 对 AnnotationConfigApplicationContext 的初步认识
date: 2020-09-03
tags: 
  - spring
author: Menfre
location: Shenzhen
---

源码分析的第一步是设定一个目标。而我们的目标就是 —— Spring 是如何通过 @Bean 注解来加载对象的？根据这个目标我们会自然而然的找上 AnnotationConfigApplicationContext。

## AnnotationConfigApplicationContext

通常为了更好的了解和熟悉一个对象，我们需要了解它的继承关系以及它所实现的各个接口所提供的功能和特性。

AnnotationConfigApplicationContext 继承关系图如下：

![annotation-application-context-hierarchy](/image/spring/annotation-application-context-hierarchy.png)

这里我们对 AnnotationConfigApplicatoinContext 作一个初步的介绍。

位于最上层 BeanFactory 是 Spring 访问 Bean 容器的顶层接口，也是 Bean 容器最基本的 client view。HierarchicalBeanFactory 是 BeanFactory 的子接口，在 BeanFactory 之上定义了获取父 BeanFactory 的方法，让实现类拥有继承特性。

ListableBeanFactory 与 HierarchicalBeanFactory 一样也是 BeanFactory 的子接口，它定义了一组通过枚举(集合)的方式来获取 Bean 实例与信息以及获取 BeanDefinition 信息的接口。 

ApplicationContext 除了继承 HierarchicalBeanFactory 和 ListableBeanFactory 外，还同时继承了 EnvironmentCapable、MessageSource、ApplicationEventPublisher、ResourcePatternResolver。ApplicationContext 在 BeanFactory 之上增加了获取应用上下文的方法。其中 EnvironmentCapable 是加载 Profiles 的特性来源、MessageSource 是解析字符串信息和国际化特性的来源、ApplicationEventPublisher 是时间回掉的来源、ResourcePatternResolver 是资源路径解析特性的来源。

ConfigurableApplicationContext 除继承了 ApplicationContext 外还继承了 Lifecycle 和 Closeable。 ConfigurableApplicationContext 在 ApplicationContext 之上定义了一组应用上下文的设置方法，其中最重要的是 refresh() 方法，用来重置和启动应用上下文。

最后 AbstractApplicationContext 以及 GenericApplicationContext 是对前面所以的所有功能特性的一个初步实现和通用实现。

> 小知识：看源码时，一定要先看类注释和方法注释，避免一头扎进源码的深海中不能自拔。

### BeanFactory

前面提到 BeanFactory 是 Spring 访问 Bean 容器的顶层接口，它定义一组获取和判断 Bean 属性的接口。

下面是它的一组核心方法：

* getBean(String) ：通过 bean 名称获取 bean 实例。
* getBean(Class\<T\>)：通过 bean 类型获取 bean 实例。
* getBeanProvider(Class\<T\>)：通过 bean 类型获取 BeanProvider，BeanProvider 是 ObjectFactory 的一个变种，类似 Java 8 的 Optional 提供了更多丰富的 Bean 获取方式。
* containsBean(String)：通过 Bean 名称判断是否包含 BeanDefinition 或是外部注册进来的单例。
* isSingleton(String)：判断这个 bean 是否是单例。
* isPrototype(String)：判断这个 bean 是否是原型模式。
* isTypeMatch(String, Class<?>)：判断给定的 Bean 名和类型是否匹配。
* getType(String)：获得 Bean 名称对应的类型。
* getAliases(String)：获得 Bean 名称对应的一组别名。

> 美妙的设计思想：读写分离

### HierarchicalBeanFactory

HierarchicalBeanFactory 是 BeanFactory 的子接口，它定义两个接口。

* getParentBeanFactory()：获取父级 BeanFactory。
* containsLocalBean(String)：判断本地是否包含给定 Bean 名称的 Bean。

> 美妙的设计思想：让相同的对象拥有继承关系，即拓宽了对象的作用域又能将相同类型的对象紧密的联系在一起

### ApplicationContext

ApplicationContext 是 Spring 中最重要的对象之一，它定义了一组关于获取应用上下文的接口：

* getId()：获取应用上下文 ID。
* getApplicationName()：获取应用名称，默认为空；猜测可以通过 profiles 赋予。
* getDisplayName()：获取较为友好的上下文名称。
* getStartupDate()：获得当前应用第一次启动的时间戳。
* getParant()：获得父 ApplicationContext。
* getAutowireCapableBeanFactory()：获得 AutowireCapableBeanFactory 对象。

>  关于 AutowireCapableBeanFactory 这里不作展开，ApplicationContext 并没有实现 AutowireCapableBeanFactory，但可以从它的 getAutowireCapableBeanFactory() 方法获取 AutowireCapableBeanFactory。AutowireCapableBeanFactory 更多的是为一些生命周期非 Spring 控制的类，如其他希望使用 Spring DI 的外部框架提供一组集成方法。Spring 内部很少使用该接口。

### ConfigurableApplicationContext

这是 AnnotationConfigApplicationContext 关系链中最下层的接口。针对 web 和 非 web 上下文开始有了不同的继承和实现分支。 

* setId()：设置应用上下文 ID。
* setParent(ApplicationContext)：设置父 ApplicationContext。
* setEnvironment(ConfigurableEnvironment)：设置环境信息，一般环境信息从 yaml/xml/properties 等 profile 文件上获取。

  setApplicationStartup()：设置 ApplicationStartup，Startup 是 Spring 中用于执行日志和记录的无实际功能操作的类。
* addBeanFactoryPostProcessor(BeanFactoryPostProcessor)：添加 BeanFactoryPostProcessor，BeanFactoryPostProcessor 是 BeanFactory 生命周期中用于改变 Bean 属性的一个会回调接口。
* addApplicationListener(ApplicationListener<?>)：添加用于传递上下文变更事件的监听器，如更新、关闭等事件。
* setClassLoader(ClassLoader)：class path 资源或类加载器。
* addProtocolResolver(ProtocolResolver)：添加不同的协议解析器，能够针对不同的资源路径和资源名进行解析。
* refresh()：刷新已经持久化的配置信息，该方法执行完成会摧毁已经创建的 bean 实例(单例)并重新创建。
* registerShutdownHook()：注册一个 jvm 运行时关闭钩子。
* close()：关闭 ApplicationContext，释放所有资源。
* isActive()：判断 ApplicationContext 是否激活，若 ApplicationContext 至少调用一次 refresh() 后没有调用 close() 即为激活状态。
* getBeanFactory()：获取 ConfigurableListableBeanFactory 对象。

### AbstractApplicationContext 

提供 ApplicationContext 和 ConfigurableApplicationContext 大部分默认实现。同时它也继承了 DefaultResourceLoader，是一个资源加载器。

其中较为关键的是 AbstractApplicationContext 实现了 refresh() 方法。

### GenericApplicationContext

更进一步的，GenericApplicationContext 提供了 ApplicationContext 和 ConfigurableApplicationContext 的全部实现，并实现了 BeanDefinitionRegistry，对完成 BeanDefinition 的注册和获取。

### AnnotationConfigApplicationContext

AnnotationConfigApplicationContext 继承了 GenericApplicationContext 的全部实现，同时实现了 AnnotationConfigRegistry。它额外扩展了能通过扫描 package 或是直接调用注册方法的方式来加载带有特定 Annotation Bean 的功能。

### 基本案例

准备了一个 Package 路径，并在该路径下放置了几个简单的测试类。

ConfigurationForScan.java：

```java
@Configuration
public class ConfigurationForScan {
    @Bean
    public TestBean testBean() {
        return new TestBean();
    }
}
```

ComponentForScan.java：

```java
@Component
public class ComponentForScan {
}
```

TestBean.java：

```java
public class TestBean {
    public String name = "Your Test Bean";
}
```

测试扫描和获取类：

```java
public class AnnotationApplicationContextTest {
    @Test
    public void scanAndRefresh() {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
        // 扫描
      	ctx.scan("org.example.annotation");
        // 刷新
        ctx.refresh();
      
				// 加载 @Configuration
        final ConfigurationForScan configurationForScan = ctx.getBean(uncapitalize(ConfigurationForScan.class.getSimpleName()), ConfigurationForScan.class);
        Assertions.assertNotNull(configurationForScan);
        // 加载 @Component
        final ComponentForScan componentForScan = ctx.getBean(uncapitalize(ComponentForScan.class.getSimpleName()), ComponentForScan.class);
        Assertions.assertNotNull(componentForScan);
        // 加载 @Configuration 中的 @Bean 方法定义的 Bean
        final TestBean testBean = ctx.getBean("testBean", TestBean.class);
        Assertions.assertEquals("Your Test Bean", testBean.name);

      	// 通过
        final Map<String, Object> map = ctx.getBeansWithAnnotation(Configuration.class);
        if (map.containsKey("configDemo")) {
            final ConfigurationForScan configDemo = (ConfigurationForScan) map.get(uncapitalize(ConfigurationForScan.class.getSimpleName()));
            TestBean testBean2 = configDemo.testBean();
            Assertions.assertEquals("Your Test Bean", testBean2.name);
        }
    }
}
```

scan() 的来源是 AnnotationConfigRegistry，AnnotationConfigApplicationContext 实现了它，这里说明 AnnotationConfigApplicationContext 本身是一个 Annotation 配置的注册中心，能完成 Annotation 配置的注册和获取等操作。

scan() 基本功能是扫描目标包路径并筛选出符合要求的类，将类抽象为 BeanDefinition 并注册到容器中，此时还没有生成类的实例(单例)。符合目标的 Annotation 有 @Configuration、@Component、@Named 等。其中 @Named 是 Jsr330 的注解。说明 Spring 兼容 jsr330。

refresh() 的来源是 ConfigurableApplicationContext 并由 AbstractApplicationContext 实现。refresh() 的实现内容比较多，这里可以大概总结为：加载环境参数，如 profiles、执行 bean 实例化前的生命周期方法、实例化 bean(将 BeanDefinition 实例化)、执行 bean 实例化后的生命周期方法，摧毁和刷新已经创建的 bean 实例和环境配置等。

除了通过扫描的方式，还能直接通过 register() 方式来注册 Bean，当然这也是 AnnotationConfigRegistry 定义的接口。Spring 在注册自己的 Bean 的时大多采用这种方式。

```java
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
context.register(ConfigurationForScan.class, ComponentForScan.class);
```

> 小知识：阅读源码附带的测试用例是了解和熟悉对象的好方法。

## AnnotationConfigWebApplicationContext

AnnotationConfigWebApplicationContext 是 AnnotationConfigApplicationContext 的一个 Web 版本，这里我们大致了解一下即可。

AnnotationConfigApplicationContext 继承关系图如下：

![annotation-application-context-hierarchy2](/image/spring/annotation-application-context-hierarchy2.png)

从关系图中我们可以看出 AnnotationConfigWebApplicationContext 与 AnnotationConfigApplicationContext 的继承链在 ConfigurableApplicationContext 这里产生了分支 。也就是说 AnnotationConfigWebApplicationContext 实际上拥有 AnnotationConfigApplicationContext 的全部特性。

ConfigurableWebApplicationContext 继承了 WebApplicationContext。WebApplicationContext 提供了获取 ServletContext 的接口，ConfigurableWebApplicationContext 提供了一组设置 ServletContext 的接口。

AbstractRefreshableWebApplicationContext 继承了 AbstractRefreshableConfigApplicationContext 并实现了 ConfigurableWebApplicationContext。

> 小知识：这里更能深刻体会到 Java 的继承特性与生物学上的分类如出一辙，不同实现类都有共同的祖先也就拥有了共同的特性。

### ConfigurableWebApplicationContext

在 ConfigurableApplicationContext 之上提供了一组设置 Web 上下文的方法。值得注意的是在调用其他顶层接口定义的方法前需要先调用当前接口提供的 setter，其他顶层接口自己并不能产生 context。

* setServletContext(ServletContext)：设置 ServletContext。
* setServletConfig(ServletConfig)：设置 ServletConfig。
* setNamespace(String)：为当前 web application context 设置命名空间，默认根 web application context 没有命名空间。
* setConfigLocattions(String...)：设置配置加载路径，如果没有设置会默认使用命名空间或是顶层 web application context 的配置。

### AnnotationConfigWebApplicationContext

AnnotationConfigWebApplicationContext 继承了 AbstractRefreshableWebApplicationContext 并实现了 AnnotationConfigRegistry 接口。与 AnnotationConfigApplicationContext 一样实现了通过扫描 package 或是直接调用注册方法的方式来加载带有特定 Annotation Bean 的功能。

### 基本案例

```java
public class AnnotationApplicationContextTest {
		@Test
    public void configLocationWithBasePackage() {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.setConfigLocation("org.example.annotation");
        ctx.refresh();

        TestBean bean = ctx.getBean(TestBean.class);
        assertThat(bean).isNotNull();
    }

    @Test
    public void withBeanNameGenerator() {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.setBeanNameGenerator(new AnnotationBeanNameGenerator() {
            @Override
            public String generateBeanName(BeanDefinition definition,
                                           BeanDefinitionRegistry registry) {
                return "custom-" + super.generateBeanName(definition, registry);
            }
        });
        ctx.setConfigLocation(ConfigurationForScan.class.getName());
        ctx.refresh();
        assertThat(ctx.containsBean("custom-configurationForScan")).isTrue();
    }
}
```

setConfigLocation() 由 AbstractRefreshableConfigApplicationContext 实现，用于直接加载特定包路径下的配置类。

setBeanNameGenerator() 是 AnnotationApplicationContextTest 提供的用于设置修改 Bean 名称的回调方法。

### 总结

本文暂时未涉及到代码细节，在了解 AnnotationConfigApplicationContext 和设计思路的前提下再来看代码细节才有事半功倍的效果。最后发表下感触，Spring 充分了体现了抽象的精髓，以及无处不在的读写分离思想。更是将 Java 继承和接口运用得神来之笔。

 
 <comment/> 

 
 <comment/> 
