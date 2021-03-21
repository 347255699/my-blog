(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{370:function(t,a,n){"use strict";n.r(a);var s=n(9),e=Object(s.a)({},(function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("p",[t._v("源码分析的第一步是设定一个目标。而我们的目标就是 —— Spring 是如何通过 @Bean 注解来加载对象的？根据这个目标我们会自然而然的找上 AnnotationConfigApplicationContext。")]),t._v(" "),n("h2",{attrs:{id:"annotationconfigapplicationcontext"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#annotationconfigapplicationcontext"}},[t._v("#")]),t._v(" AnnotationConfigApplicationContext")]),t._v(" "),n("p",[t._v("通常为了更好的了解和熟悉一个对象，我们需要了解它的继承关系以及它所实现的各个接口所提供的功能和特性。")]),t._v(" "),n("p",[t._v("AnnotationConfigApplicationContext 继承关系图如下：")]),t._v(" "),n("p",[n("img",{attrs:{src:"/image/spring/annotation-application-context-hierarchy.png",alt:"annotation-application-context-hierarchy"}})]),t._v(" "),n("p",[t._v("这里我们对 AnnotationConfigApplicatoinContext 作一个初步的介绍。")]),t._v(" "),n("p",[t._v("位于最上层 BeanFactory 是 Spring 访问 Bean 容器的顶层接口，也是 Bean 容器最基本的 client view。HierarchicalBeanFactory 是 BeanFactory 的子接口，在 BeanFactory 之上定义了获取父 BeanFactory 的方法，让实现类拥有继承特性。")]),t._v(" "),n("p",[t._v("ListableBeanFactory 与 HierarchicalBeanFactory 一样也是 BeanFactory 的子接口，它定义了一组通过枚举(集合)的方式来获取 Bean 实例与信息以及获取 BeanDefinition 信息的接口。")]),t._v(" "),n("p",[t._v("ApplicationContext 除了继承 HierarchicalBeanFactory 和 ListableBeanFactory 外，还同时继承了 EnvironmentCapable、MessageSource、ApplicationEventPublisher、ResourcePatternResolver。ApplicationContext 在 BeanFactory 之上增加了获取应用上下文的方法。其中 EnvironmentCapable 是加载 Profiles 的特性来源、MessageSource 是解析字符串信息和国际化特性的来源、ApplicationEventPublisher 是时间回掉的来源、ResourcePatternResolver 是资源路径解析特性的来源。")]),t._v(" "),n("p",[t._v("ConfigurableApplicationContext 除继承了 ApplicationContext 外还继承了 Lifecycle 和 Closeable。 ConfigurableApplicationContext 在 ApplicationContext 之上定义了一组应用上下文的设置方法，其中最重要的是 refresh() 方法，用来重置和启动应用上下文。")]),t._v(" "),n("p",[t._v("最后 AbstractApplicationContext 以及 GenericApplicationContext 是对前面所以的所有功能特性的一个初步实现和通用实现。")]),t._v(" "),n("blockquote",[n("p",[t._v("小知识：看源码时，一定要先看类注释和方法注释，避免一头扎进源码的深海中不能自拔。")])]),t._v(" "),n("h3",{attrs:{id:"beanfactory"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#beanfactory"}},[t._v("#")]),t._v(" BeanFactory")]),t._v(" "),n("p",[t._v("前面提到 BeanFactory 是 Spring 访问 Bean 容器的顶层接口，它定义一组获取和判断 Bean 属性的接口。")]),t._v(" "),n("p",[t._v("下面是它的一组核心方法：")]),t._v(" "),n("ul",[n("li",[t._v("getBean(String) ：通过 bean 名称获取 bean 实例。")]),t._v(" "),n("li",[t._v("getBean(Class<T>)：通过 bean 类型获取 bean 实例。")]),t._v(" "),n("li",[t._v("getBeanProvider(Class<T>)：通过 bean 类型获取 BeanProvider，BeanProvider 是 ObjectFactory 的一个变种，类似 Java 8 的 Optional 提供了更多丰富的 Bean 获取方式。")]),t._v(" "),n("li",[t._v("containsBean(String)：通过 Bean 名称判断是否包含 BeanDefinition 或是外部注册进来的单例。")]),t._v(" "),n("li",[t._v("isSingleton(String)：判断这个 bean 是否是单例。")]),t._v(" "),n("li",[t._v("isPrototype(String)：判断这个 bean 是否是原型模式。")]),t._v(" "),n("li",[t._v("isTypeMatch(String, Class<?>)：判断给定的 Bean 名和类型是否匹配。")]),t._v(" "),n("li",[t._v("getType(String)：获得 Bean 名称对应的类型。")]),t._v(" "),n("li",[t._v("getAliases(String)：获得 Bean 名称对应的一组别名。")])]),t._v(" "),n("blockquote",[n("p",[t._v("美妙的设计思想：读写分离")])]),t._v(" "),n("h3",{attrs:{id:"hierarchicalbeanfactory"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#hierarchicalbeanfactory"}},[t._v("#")]),t._v(" HierarchicalBeanFactory")]),t._v(" "),n("p",[t._v("HierarchicalBeanFactory 是 BeanFactory 的子接口，它定义两个接口。")]),t._v(" "),n("ul",[n("li",[t._v("getParentBeanFactory()：获取父级 BeanFactory。")]),t._v(" "),n("li",[t._v("containsLocalBean(String)：判断本地是否包含给定 Bean 名称的 Bean。")])]),t._v(" "),n("blockquote",[n("p",[t._v("美妙的设计思想：让相同的对象拥有继承关系，即拓宽了对象的作用域又能将相同类型的对象紧密的联系在一起")])]),t._v(" "),n("h3",{attrs:{id:"applicationcontext"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#applicationcontext"}},[t._v("#")]),t._v(" ApplicationContext")]),t._v(" "),n("p",[t._v("ApplicationContext 是 Spring 中最重要的对象之一，它定义了一组关于获取应用上下文的接口：")]),t._v(" "),n("ul",[n("li",[t._v("getId()：获取应用上下文 ID。")]),t._v(" "),n("li",[t._v("getApplicationName()：获取应用名称，默认为空；猜测可以通过 profiles 赋予。")]),t._v(" "),n("li",[t._v("getDisplayName()：获取较为友好的上下文名称。")]),t._v(" "),n("li",[t._v("getStartupDate()：获得当前应用第一次启动的时间戳。")]),t._v(" "),n("li",[t._v("getParant()：获得父 ApplicationContext。")]),t._v(" "),n("li",[t._v("getAutowireCapableBeanFactory()：获得 AutowireCapableBeanFactory 对象。")])]),t._v(" "),n("blockquote",[n("p",[t._v("关于 AutowireCapableBeanFactory 这里不作展开，ApplicationContext 并没有实现 AutowireCapableBeanFactory，但可以从它的 getAutowireCapableBeanFactory() 方法获取 AutowireCapableBeanFactory。AutowireCapableBeanFactory 更多的是为一些生命周期非 Spring 控制的类，如其他希望使用 Spring DI 的外部框架提供一组集成方法。Spring 内部很少使用该接口。")])]),t._v(" "),n("h3",{attrs:{id:"configurableapplicationcontext"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#configurableapplicationcontext"}},[t._v("#")]),t._v(" ConfigurableApplicationContext")]),t._v(" "),n("p",[t._v("这是 AnnotationConfigApplicationContext 关系链中最下层的接口。针对 web 和 非 web 上下文开始有了不同的继承和实现分支。")]),t._v(" "),n("ul",[n("li",[n("p",[t._v("setId()：设置应用上下文 ID。")])]),t._v(" "),n("li",[n("p",[t._v("setParent(ApplicationContext)：设置父 ApplicationContext。")])]),t._v(" "),n("li",[n("p",[t._v("setEnvironment(ConfigurableEnvironment)：设置环境信息，一般环境信息从 yaml/xml/properties 等 profile 文件上获取。")]),t._v(" "),n("p",[t._v("setApplicationStartup()：设置 ApplicationStartup，Startup 是 Spring 中用于执行日志和记录的无实际功能操作的类。")])]),t._v(" "),n("li",[n("p",[t._v("addBeanFactoryPostProcessor(BeanFactoryPostProcessor)：添加 BeanFactoryPostProcessor，BeanFactoryPostProcessor 是 BeanFactory 生命周期中用于改变 Bean 属性的一个会回调接口。")])]),t._v(" "),n("li",[n("p",[t._v("addApplicationListener(ApplicationListener<?>)：添加用于传递上下文变更事件的监听器，如更新、关闭等事件。")])]),t._v(" "),n("li",[n("p",[t._v("setClassLoader(ClassLoader)：class path 资源或类加载器。")])]),t._v(" "),n("li",[n("p",[t._v("addProtocolResolver(ProtocolResolver)：添加不同的协议解析器，能够针对不同的资源路径和资源名进行解析。")])]),t._v(" "),n("li",[n("p",[t._v("refresh()：刷新已经持久化的配置信息，该方法执行完成会摧毁已经创建的 bean 实例(单例)并重新创建。")])]),t._v(" "),n("li",[n("p",[t._v("registerShutdownHook()：注册一个 jvm 运行时关闭钩子。")])]),t._v(" "),n("li",[n("p",[t._v("close()：关闭 ApplicationContext，释放所有资源。")])]),t._v(" "),n("li",[n("p",[t._v("isActive()：判断 ApplicationContext 是否激活，若 ApplicationContext 至少调用一次 refresh() 后没有调用 close() 即为激活状态。")])]),t._v(" "),n("li",[n("p",[t._v("getBeanFactory()：获取 ConfigurableListableBeanFactory 对象。")])])]),t._v(" "),n("h3",{attrs:{id:"abstractapplicationcontext"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#abstractapplicationcontext"}},[t._v("#")]),t._v(" AbstractApplicationContext")]),t._v(" "),n("p",[t._v("提供 ApplicationContext 和 ConfigurableApplicationContext 大部分默认实现。同时它也继承了 DefaultResourceLoader，是一个资源加载器。")]),t._v(" "),n("p",[t._v("其中较为关键的是 AbstractApplicationContext 实现了 refresh() 方法。")]),t._v(" "),n("h3",{attrs:{id:"genericapplicationcontext"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#genericapplicationcontext"}},[t._v("#")]),t._v(" GenericApplicationContext")]),t._v(" "),n("p",[t._v("更进一步的，GenericApplicationContext 提供了 ApplicationContext 和 ConfigurableApplicationContext 的全部实现，并实现了 BeanDefinitionRegistry，对完成 BeanDefinition 的注册和获取。")]),t._v(" "),n("h3",{attrs:{id:"annotationconfigapplicationcontext-2"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#annotationconfigapplicationcontext-2"}},[t._v("#")]),t._v(" AnnotationConfigApplicationContext")]),t._v(" "),n("p",[t._v("AnnotationConfigApplicationContext 继承了 GenericApplicationContext 的全部实现，同时实现了 AnnotationConfigRegistry。它额外扩展了能通过扫描 package 或是直接调用注册方法的方式来加载带有特定 Annotation Bean 的功能。")]),t._v(" "),n("h3",{attrs:{id:"基本案例"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#基本案例"}},[t._v("#")]),t._v(" 基本案例")]),t._v(" "),n("p",[t._v("准备了一个 Package 路径，并在该路径下放置了几个简单的测试类。")]),t._v(" "),n("p",[t._v("ConfigurationForScan.java：")]),t._v(" "),n("div",{staticClass:"language-java extra-class"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[n("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Configuration")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ConfigurationForScan")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Bean")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TestBean")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("testBean")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TestBean")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("p",[t._v("ComponentForScan.java：")]),t._v(" "),n("div",{staticClass:"language-java extra-class"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[n("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Component")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ComponentForScan")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("p",[t._v("TestBean.java：")]),t._v(" "),n("div",{staticClass:"language-java extra-class"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TestBean")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" name "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Your Test Bean"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("p",[t._v("测试扫描和获取类：")]),t._v(" "),n("div",{staticClass:"language-java extra-class"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationApplicationContextTest")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Test")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("scanAndRefresh")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationConfigApplicationContext")]),t._v(" ctx "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationConfigApplicationContext")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 扫描")]),t._v("\n      \tctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("scan")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"org.example.annotation"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 刷新")]),t._v("\n        ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("refresh")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      \n\t\t\t\t"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 加载 @Configuration")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ConfigurationForScan")]),t._v(" configurationForScan "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getBean")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("uncapitalize")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ConfigurationForScan")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getSimpleName")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ConfigurationForScan")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Assertions")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("assertNotNull")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("configurationForScan"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 加载 @Component")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ComponentForScan")]),t._v(" componentForScan "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getBean")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("uncapitalize")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ComponentForScan")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getSimpleName")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ComponentForScan")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Assertions")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("assertNotNull")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("componentForScan"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 加载 @Configuration 中的 @Bean 方法定义的 Bean")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TestBean")]),t._v(" testBean "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getBean")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"testBean"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TestBean")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Assertions")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("assertEquals")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Your Test Bean"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" testBean"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n      \t"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 通过")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Map")]),n("span",{pre:!0,attrs:{class:"token generics"}},[n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Object")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" map "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getBeansWithAnnotation")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Configuration")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("map"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("containsKey")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"configDemo"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ConfigurationForScan")]),t._v(" configDemo "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ConfigurationForScan")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" map"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("uncapitalize")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ConfigurationForScan")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getSimpleName")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TestBean")]),t._v(" testBean2 "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" configDemo"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("testBean")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Assertions")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("assertEquals")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Your Test Bean"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" testBean2"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("p",[t._v("scan() 的来源是 AnnotationConfigRegistry，AnnotationConfigApplicationContext 实现了它，这里说明 AnnotationConfigApplicationContext 本身是一个 Annotation 配置的注册中心，能完成 Annotation 配置的注册和获取等操作。")]),t._v(" "),n("p",[t._v("scan() 基本功能是扫描目标包路径并筛选出符合要求的类，将类抽象为 BeanDefinition 并注册到容器中，此时还没有生成类的实例(单例)。符合目标的 Annotation 有 @Configuration、@Component、@Named 等。其中 @Named 是 Jsr330 的注解。说明 Spring 兼容 jsr330。")]),t._v(" "),n("p",[t._v("refresh() 的来源是 ConfigurableApplicationContext 并由 AbstractApplicationContext 实现。refresh() 的实现内容比较多，这里可以大概总结为：加载环境参数，如 profiles、执行 bean 实例化前的生命周期方法、实例化 bean(将 BeanDefinition 实例化)、执行 bean 实例化后的生命周期方法，摧毁和刷新已经创建的 bean 实例和环境配置等。")]),t._v(" "),n("p",[t._v("除了通过扫描的方式，还能直接通过 register() 方式来注册 Bean，当然这也是 AnnotationConfigRegistry 定义的接口。Spring 在注册自己的 Bean 的时大多采用这种方式。")]),t._v(" "),n("div",{staticClass:"language-java extra-class"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationConfigApplicationContext")]),t._v(" context "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationConfigApplicationContext")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\ncontext"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("register")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ConfigurationForScan")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ComponentForScan")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),n("blockquote",[n("p",[t._v("小知识：阅读源码附带的测试用例是了解和熟悉对象的好方法。")])]),t._v(" "),n("h2",{attrs:{id:"annotationconfigwebapplicationcontext"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#annotationconfigwebapplicationcontext"}},[t._v("#")]),t._v(" AnnotationConfigWebApplicationContext")]),t._v(" "),n("p",[t._v("AnnotationConfigWebApplicationContext 是 AnnotationConfigApplicationContext 的一个 Web 版本，这里我们大致了解一下即可。")]),t._v(" "),n("p",[t._v("AnnotationConfigApplicationContext 继承关系图如下：")]),t._v(" "),n("p",[n("img",{attrs:{src:"/image/spring/annotation-application-context-hierarchy2.png",alt:"annotation-application-context-hierarchy2"}})]),t._v(" "),n("p",[t._v("从关系图中我们可以看出 AnnotationConfigWebApplicationContext 与 AnnotationConfigApplicationContext 的继承链在 ConfigurableApplicationContext 这里产生了分支 。也就是说 AnnotationConfigWebApplicationContext 实际上拥有 AnnotationConfigApplicationContext 的全部特性。")]),t._v(" "),n("p",[t._v("ConfigurableWebApplicationContext 继承了 WebApplicationContext。WebApplicationContext 提供了获取 ServletContext 的接口，ConfigurableWebApplicationContext 提供了一组设置 ServletContext 的接口。")]),t._v(" "),n("p",[t._v("AbstractRefreshableWebApplicationContext 继承了 AbstractRefreshableConfigApplicationContext 并实现了 ConfigurableWebApplicationContext。")]),t._v(" "),n("blockquote",[n("p",[t._v("小知识：这里更能深刻体会到 Java 的继承特性与生物学上的分类如出一辙，不同实现类都有共同的祖先也就拥有了共同的特性。")])]),t._v(" "),n("h3",{attrs:{id:"configurablewebapplicationcontext"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#configurablewebapplicationcontext"}},[t._v("#")]),t._v(" ConfigurableWebApplicationContext")]),t._v(" "),n("p",[t._v("在 ConfigurableApplicationContext 之上提供了一组设置 Web 上下文的方法。值得注意的是在调用其他顶层接口定义的方法前需要先调用当前接口提供的 setter，其他顶层接口自己并不能产生 context。")]),t._v(" "),n("ul",[n("li",[t._v("setServletContext(ServletContext)：设置 ServletContext。")]),t._v(" "),n("li",[t._v("setServletConfig(ServletConfig)：设置 ServletConfig。")]),t._v(" "),n("li",[t._v("setNamespace(String)：为当前 web application context 设置命名空间，默认根 web application context 没有命名空间。")]),t._v(" "),n("li",[t._v("setConfigLocattions(String...)：设置配置加载路径，如果没有设置会默认使用命名空间或是顶层 web application context 的配置。")])]),t._v(" "),n("h3",{attrs:{id:"annotationconfigwebapplicationcontext-2"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#annotationconfigwebapplicationcontext-2"}},[t._v("#")]),t._v(" AnnotationConfigWebApplicationContext")]),t._v(" "),n("p",[t._v("AnnotationConfigWebApplicationContext 继承了 AbstractRefreshableWebApplicationContext 并实现了 AnnotationConfigRegistry 接口。与 AnnotationConfigApplicationContext 一样实现了通过扫描 package 或是直接调用注册方法的方式来加载带有特定 Annotation Bean 的功能。")]),t._v(" "),n("h3",{attrs:{id:"基本案例-2"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#基本案例-2"}},[t._v("#")]),t._v(" 基本案例")]),t._v(" "),n("div",{staticClass:"language-java extra-class"},[n("pre",{pre:!0,attrs:{class:"language-java"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationApplicationContextTest")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t"),n("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Test")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("configLocationWithBasePackage")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationConfigWebApplicationContext")]),t._v(" ctx "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationConfigWebApplicationContext")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setConfigLocation")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"org.example.annotation"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("refresh")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n        "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TestBean")]),t._v(" bean "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getBean")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TestBean")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("assertThat")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bean"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("isNotNull")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Test")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("withBeanNameGenerator")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationConfigWebApplicationContext")]),t._v(" ctx "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationConfigWebApplicationContext")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setBeanNameGenerator")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AnnotationBeanNameGenerator")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Override")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("generateBeanName")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("BeanDefinition")]),t._v(" definition"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                                           "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("BeanDefinitionRegistry")]),t._v(" registry"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"custom-"')]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("super")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("generateBeanName")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("definition"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" registry"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("setConfigLocation")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ConfigurationForScan")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("getName")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("refresh")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("assertThat")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ctx"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("containsBean")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v('"custom-configurationForScan"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("isTrue")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),n("p",[t._v("setConfigLocation() 由 AbstractRefreshableConfigApplicationContext 实现，用于直接加载特定包路径下的配置类。")]),t._v(" "),n("p",[t._v("setBeanNameGenerator() 是 AnnotationApplicationContextTest 提供的用于设置修改 Bean 名称的回调方法。")]),t._v(" "),n("h3",{attrs:{id:"总结"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结")]),t._v(" "),n("p",[t._v("本文暂时未涉及到代码细节，在了解 AnnotationConfigApplicationContext 和设计思路的前提下再来看代码细节才有事半功倍的效果。最后发表下感触，Spring 充分了体现了抽象的精髓，以及无处不在的读写分离思想。更是将 Java 继承和接口运用得神来之笔。")]),t._v(" "),n("comment"),t._v(" "),n("comment"),t._v(" "),n("comment")],1)}),[],!1,null,null,null);a.default=e.exports}}]);