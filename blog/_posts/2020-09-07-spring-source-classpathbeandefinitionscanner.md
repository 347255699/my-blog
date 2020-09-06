---
title: Spring 源码分析 —— 对 ClassPathBeanDefinitionScanner 详细解析
date: 2020-09-07
tags: 
  - spring
author: Menfre
location: Shenzhen
---

介于之前我设置的目标 —— Spring 是如何通过 @Bean 注解来加载对象的？所以需要对 scan 做一个全面的分析以达成目标。 

我们尝试在一个宏观的平面化的视角来分析 AnnotationApplicationContext 的 scan 功能。这里尝试在 xmind 上画出围绕 AnnotationApplicationContext 关于 scan() 方法几乎所有抽象。

AnnotationApplicationContext 抽象平面图：

![AnnotationApplicationContext](/image/spring/AnnotationApplicationContext.png)

这里的抽象平面图看起来十分复杂，其实内部都有规律可循，是一个循序渐进的过程。听我慢慢道来。

首先 AnnotationApplicationContext 的 scan() 是由内部的 ClassPathBeanDefinitionScanner 代劳的。ClassPathBeanDefinitionScanner 先是调用 ResourcePatternResolver 对 classpath 进行解析，得到一组 Resource——Resource 是对 classpath 上文件的抽象。遍历 Resource 集合，使用 MetadataReaderFactory 解析 Resource 获得 MetadataReader，同时使用 TypeFilter 对 MetadataReader 进行过滤。最后将 MetadataReader 包装成 ScannedGenericBeanDefinition，ScannedGenericBeanDefinition 是这个 scan 过程的初步输出。

> 从平面图中，我们看到 BeanDefinition 是一个很重要的抽象，几乎所有的类都是围绕它在工作。

## ScannedGenericBeanDefinition

ScannedGenericBeanDefinition 继承关系图：

![ScannedGenericBeanDefinition](/image/spring/ScannedGenericBeanDefinition.png)

图中我们可以看出 ScannedGenericBeanDefinition 的顶层接口是 BeanDefinition，而它也是我们最后需要注册到 BeanDefinitionRegistry 的最终产物。

我们在得到 BeanDefinition(ScannedGenericBeanDefinition) 后还需要对它应用一些设置让它成为一个完成品。先使用 ScopeMetadataResolver 解析 BeanDefinition 获得 ScopeMetadata，再将 ScopeMetadata 应用回 BeanDefiniton。如果它是一个 AbstractBeanDefinition 我们需要使用 BeanDefinitionDefaults 对它进行设置；如果它是 AnnotatedBeanDefinition 的话，需要通过它的 AnnotatedTypeMetadata 或 AnnotationMetadata 来产生 AnnotationAttributes，最后将这些 AnnotationAttributes 全部应用到 BeanDefinition 身上，按照上面的继承关系，显然它两者都是。最后使用 BeanNameGenerator 解析出 BeanDefinition 得到 beanName。再然后将 beanName、BeanDefinition 以及 BeanDefinition 的 aliases 别名数组作为一个整体注册到 BeanDefinitionRegistry，也就是注册到 AnnotationApplicationContext 里面。以便在之后的时间里可以通过 getBean() 方法来夹在类或  BeanDefinition 信息。

> 当然这里需要先调用 refresh() 来使扫描的 BeanDefinition 生效后才能使用 getBean()。

## 关键代码

```java
	protected Set<BeanDefinitionHolder> doScan(String... basePackages) {
		Set<BeanDefinitionHolder> beanDefinitions = new LinkedHashSet<>();
		for (String basePackage : basePackages) {
			/**
			 * men:annotation3.2.1 加载候选 BeanDefinition
			 */
			Set<BeanDefinition> candidates = findCandidateComponents(basePackage);
			for (BeanDefinition candidate : candidates) {
				/**
				 * men:annotation3.2.2 解析 BeanDefinition 的 Scope
				 * 从 BeanDefinition 解析获取到 Scope 参数，Scope 默认值为 单例，无代理。
				 */
				ScopeMetadata scopeMetadata = this.scopeMetadataResolver.resolveScopeMetadata(candidate);
				candidate.setScope(scopeMetadata.getScopeName());
				/**
				 * men:annotation3.2.3 从 Annotation 获取 bean 名称
				 * 若 Annotation 没有，默认为 class simpleName 驼峰命名
				 */
				String beanName = this.beanNameGenerator.generateBeanName(candidate, this.registry);
				if (candidate instanceof AbstractBeanDefinition) {
					/**
					 * men:annotation3.2.4 如果候选 BeanDefinition 是 AbstractBeanDefinition，对 BeanDefinition 设置默认配置
					 */
					postProcessBeanDefinition((AbstractBeanDefinition) candidate, beanName);
				}
				if (candidate instanceof AnnotatedBeanDefinition) {
					/**
					 * men:annotation3.2.5 如果候选 BeanDefinition 是 AnnotatedBeanDefinition，从 Annotation 中获取 BeanDefinition 的配置参数并应用
					 */
					AnnotationConfigUtils.processCommonDefinitionAnnotations((AnnotatedBeanDefinition) candidate);
				}
				if (checkCandidate(beanName, candidate)) {
					/**
					 * men:annotation3.2.6 校验候选 BeanDefinition 是否在注册中心已经存在并冲突，不冲突则添加在注册中心
					 */
					BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(candidate, beanName);
					// Scoped Proxy 暂不展开;
					definitionHolder =
							AnnotationConfigUtils.applyScopedProxyMode(scopeMetadata, definitionHolder, this.registry);
					beanDefinitions.add(definitionHolder);
					registerBeanDefinition(definitionHolder, this.registry);
				}
			}
		}
		return beanDefinitions;
	}
```

```java
private Set<BeanDefinition> scanCandidateComponents(String basePackage) {
		Set<BeanDefinition> candidates = new LinkedHashSet<>();
		try {
			String packageSearchPath = ResourcePatternResolver.CLASSPATH_ALL_URL_PREFIX +
					resolveBasePackage(basePackage) + '/' + this.resourcePattern;
      // 解析出包路径下的所有 Resource 
			Resource[] resources = getResourcePatternResolver().getResources(packageSearchPath);
			for (Resource resource : resources) {
				if (resource.isReadable()) {
          // 权限为可读则继续
					try {
            // 解析出 MetadataReader，里面存放是 Resource 的元数据
						MetadataReader metadataReader = getMetadataReaderFactory().getMetadataReader(resource);
            
            // 过滤出持有特定 annotation 的 MetadataReader
						if (isCandidateComponent(metadataReader)) {
							ScannedGenericBeanDefinition sbd = new ScannedGenericBeanDefinition(metadataReader);
							sbd.setSource(resource);
              // 是否符合候选要求
							if (isCandidateComponent(sbd)) {
								candidates.add(sbd);
							}
           	}
					catch (Throwable ex) {
						throw new BeanDefinitionStoreException(
								"Failed to read candidate component class: " + resource, ex);
					}
				}
			}
		}
		catch (IOException ex) {
			throw new BeanDefinitionStoreException("I/O failure during classpath scanning", ex);
		}
		return candidates;
	}
```

> 小知识：上面向你展示了两种分析源码的技巧。一种是将对象达成某种功能的关系模型在平面图上画出来。另一种是通过在源码中打上锚点，标记阅读轨迹方便反复查阅；如我的标记 —— `men:annotation3.2.1 加载候选 BeanDefinition` 。结合关系模型、阅读锚点、测试用例阅读、继承关系分析以及注释阅读，相信可以让你在源码的世界中游刃有余。

> 下篇我们将分析 AbstractApplicationContext 的 refresh() 方法，了解 BeanFactory 的整个生命周期。




 
 <comment/> 
