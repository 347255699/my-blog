---
title: Spring 源码分析 —— AnnotationConfigApplicationContext
date: 2020-09-03
tags: 
  - Spring
author: Menfre
location: Shenzhen  
---

源码分析的第一步是设定一个目标。而我们的目标就是 —— Spring 是如何通过 @Bean 注解来加载对象的？

## AnnotationConfigApplicationContext

BeanFactory 是 Spring 访问 Bean 容器的顶层接口。也是 Bean 容器最基本的 client view。由于 BeanFactory 的子接口和实现类种类繁多，我们需要从中找到符合我们预期的实现类。

这里我们关注到 AnnotationConfigApplicationContext 相对比较符合我们的预期，接下来我们将逐步分析它的功能和实现细节。

通常一个类所拥有的特性和实现的功能是由多个继承关系叠加出来，所以除了分析类本身的功能外我们还需要关心它的继承关系。

AnnotationConfigApplicationContext 继承关系如下：

![annotation-application-context-hierarchy](/image/spring/annotation-application-context-hierarchy.png)

AnnotationConfigApplicationContext 的继承链十分长，我们并不需要了解它的每一个细节，只要了解对 AnnotationConfigApplicationContext 起关键作用的即可。这里主要分析实现类从它的父接口或父类中继承了什么特性或功能。接下来随着深入了解 AnnotationConfigApplicationContext，我们会慢慢与它的关系链联系起来。

> 小知识：如果想知道某个实现类的使用场景，通过阅读它在源码中的测试用例是非常不错的途径。

### BeanFactory

前面提到 BeanFactory 是 Spring 访问 Bean 容器的顶层接口，它定义一组获取和判断 Bean 的接口。

* getBean(String) ：通过 bean 名获取 bean。
* getBean(Class\<T\>)：通过 bean 类型获取 bean。
* getBeanProvider(Class\<T\>)：通过 bean 类型获取 BeanProvider，BeanProvider 是 ObjectFactory 的一个变种，类似 Java 8 的 Optional 提供了更多丰富的 Bean 获取方式。
* containsBean(String)：通过 Bean 名称判断是否包含这个类。
* isSingleton(String)：判断某个类是否是单例。
* isPrototype(String)：判断某个类是否是原型模式。
* isTypeMatch(String, Class<?>)：判断给定的 Bean 名是否跟给定的类型匹配。
* getType(String)：获得 Bean 名称对应的类型。
* getAliases(String)：获得 Bean 名称对应的一组别名。

### HierarchicalBeanFactory

HierarchicalBeanFactory 是 BeanFactory 的子接口，它定义两个接口。

* getParentBeanFactory()：获取父级 BeanFactory。
* containsLocalBean(String)：判断本地是否包含给定 Bean 名称的 Bean。

### ApplicationContext

ApplicationContext 是较为顶层的接口，它定义了一组关于获取应用上下文的接口：

* getId()：应用上下文 ID。
* getApplicationName()：应用名称，默认为空；猜测可以通过 profiles 赋予。
* getDisplayName()：获取较为友好的上下文名称。
* getStartupDate()：获得当前应用第一次启动时间戳。
* getParant()：获得父 ApplicationContext； ApplicationContext 实现了 HierarchicalBeanFactory，能够与其他 ApplicationContext 构成父子关系。
* getAutowireCapableBeanFactory()：获得 AutowireCapableBeanFactory 对象。

>  关于 AutowireCapableBeanFactory 这里不作展开，ApplicationContext 并没有实现 AutowireCapableBeanFactory，但可以从它的 getAutowireCapableBeanFactory() 方法获取 AutowireCapableBeanFactory。AutowireCapableBeanFactory 更多的是为一些生命周期非 Spring 控制的类，如其他希望使用 Spring DI 的外部框架提供一组集成方法。

### ConfigurableApplicationContext

这是 AnnotationConfigApplicationContext 关系链中最下层的接口。

* setId()：设置应用上下文 ID。
* setParent(ApplicationContext)：设置父 ApplicationContext。
* setEnvironment(ConfigurableEnvironment)：设置环境信息，一般环境信息从 yaml/xml/properties 等 profile 文件上获取。
* setApplicationStartup()：设置 ApplicationStartup，Startup 是 Spring 中用于执行日志和记录的无实际功能操作的类。
* addBeanFactoryPostProcessor(BeanFactoryPostProcessor)：添加 BeanFactoryPostProcessor，BeanFactoryPostProcessor 是 BeanFactory 生命周期中用于改变 Bean 属性的一个回调类。
* addApplicationListener(ApplicationListener<?>)：添加用于传递上下文变更事件的监听器，如更新、关闭等事件。
* setClassLoader(ClassLoader)：添加加载 class path 资源或类的类加载器。
* addProtocolResolver(ProtocolResolver)：能够对指定路径上的资源进行解析的解析器。如从远端 http 地址加载 bean，这是允许的事情。(注意这里为主观解释)
* refresh()：刷新已经持久化的配置信息，该方法执行完成会摧毁已经创建的 bean 实例(单例)并重新创建。
* registerShutdownHook()：注册一个 jvm 运行时关闭钩子。
* close()：关闭 ApplicationContext，释放所有资源。
* isActive()：判断 ApplicationContext 是否激活，若 ApplicationContext 调用至少一次 refresh() 后没有调用过 close() 即为激活状态。
* getBeanFactory()：获取 ConfigurableListableBeanFactory 对象。

> ConfigurableListableBeanFactory 是 ListableBeanFactory 的子接口。ListableBeanFactory 提供了一组能通过集合获取 bean 或 bean 属性的方法。ConfigurableListableBeanFactory 在此之上添加了一组设置 BeanDefinition 以及预先实例化单例模式 bean 的方法。

### AbstractApplicationContext 

提供 ApplicationContext 和 ConfigurableApplicationContext 大部分默认实现。同时它也继承了 DefaultResourceLoader，是一个资源加载器。

其中较为关键的是 AbstractApplicationContext 实现了 refresh() 方法。

### GenericApplicationContext

更进一步的，GenericApplicationContext 提供了 ApplicationContext 和 ConfigurableApplicationContext 的全部实现。

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

> 如果你想挖掘 AnnotationConfigApplicationContext 更多的功能和使用场景，可以查看源码中关于它的测试用例。

## AnnotationConfigWebApplicationContext

AnnotationConfigWebApplicationContext 是 AnnotationConfigApplicationContext 的一个 Web 版。同样的我需要了解它的继承关系。

AnnotationConfigApplicationContext 继承关系如下：

![annotation-application-context-hierarchy2](/image/spring/annotation-application-context-hierarchy2.png)

从关系图中我们可以看出 AnnotationConfigWebApplicationContext 与 AnnotationWebApplicationContext 的关系链在 ConfigurableApplicationContext 这里产生了分支 。也就是说 AnnotationConfigWebApplicationContext 实际上拥有 AnnotationWebApplicationContext 的全部特性。

> 小知识：这里更能深刻体会到 Java 的继承特性与生物学上的分类如出一辙，不同实现类都有共同的祖先也就拥有了共同的特性。

### ConfigurableWebApplicationContext

在 ConfigurableApplicationContext 提供了一组设置 Web 上下文的方法。值得注意的是在调用其他顶层接口定义的方法前需要先调用当前接口提供的 setter，其他顶层接口自己并不能产生 context。

* setServletContext(ServletContext)：设置 Servlet 的上下文。
* setServletConfig(ServletConfig)：设置 Servlet 的配置信息。
* setNamespace(String)：为当前 web application context 设置命名空间，默认根 web application context 没有命名空间。
* setConfigLocattions(String...)：设置配置加载路径，如果没有设置会默认使用命名空间或是顶层 web application context 的配置。

### AbstractRefreshableWebApplicationContext

AbstractRefreshableWebApplicationContext 继承 AbstractRefreshableConfigApplicationContext 并实现了ConfigurableWebApplicationContext 接口；而 AbstractRefreshableConfigApplicationContext 又实现了 ConfigurableWebApplicationContext 接口。

### AnnotationConfigWebApplicationContext

AnnotationConfigWebApplicationContext 继承了 AbstractRefreshableWebApplicationContext 并实现了 AnnotationConfigRegistry 接口。与 AnnotationConfigApplicationContext 一致的实现了通过扫描 package 或是直接调用注册方法的方式来加载带有特定 Annotation Bean 的功能。

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

setBeanNameGenerator() 是 AnnotationApplicationContextTest 提供的用于修改 Bean 名称的回调。



 
 <comment/> 

 
 <comment/> 
