---
title: 开篇：使用 VuePress 搭建个人 Blog
date: 2020-04-09
tags: 
  - VuePress
author: Menfre
location: Shenzhen  
---

## 安装

首先我们需要确保机器上安装了 npm ，然后通过 npm 安装 VuePress。

> npm的安装可以自行 Google 获得，当然你也可以选择 yarn 来安装。

```shell
npm install -g vuepress
```

然后我们需要挑选合适的目录来创建博客。  
因为 VuePress 的默认主题是为 技术文档 定制，这里我们需要搭建的是 Blog，因此我需要额外安装 Blog 主题。

```shell
mkdir my-blog && cd my-blog
npm install vuepress @vuepress/theme-blog -D
```

这里我们需要一个 IDE 以便更好的编辑项目，这里我使用 WebStorm 。

VuePress 推荐的目录结构是这样的：

```text
├── blog
│   ├── _posts
│   │   ├── 2018-11-7-frontmatter-in-vuepress.md #example
│   │   ├── 2019-2-26-markdown-slot.md #example
│   │   └── 2019-5-6-writing-a-vuepress-theme.md #example
│   └── .vuepress
│       ├── `components` _(**Optional**)_
│       ├── `public` _(**Optional**)_
│       ├── `styles` _(**Optional**)_
│       │   ├── index.styl
│       │   └── palette.styl
│       ├── config.js
│       └── `enhanceApp.js` _(**Optional**)_
└── package.json
```

必要的目录：

* `blog/.vuepress/config.js`: 用于对 VuePress 进行配置，如配置我们的 Blog 插件。
* `blog/_posts`: 这里用来存放我们的文章。

项目目录结构图：

![project-structure](/image/project-structure.jpg)

其中 `blog/.vuepress/public` 用来存在我们文章中需要用到的静态资源，如上面你看到的项目目录结构图，可以在文章中通过 `/image/project-structure.jpg` 路径访问到图片。

## 基本配置 

通过 `安装` 环节，我们得到一个项目。接下来我们需要做一些简单的配置。以便能够通过 npm 管理项目以及对 blog 进行配置。

### package.json:

```json
{
  "scripts": {
    "dev": "vuepress dev blog",
    "build": "vuepress build blog"
  },
  "devDependencies": {
    "@vuepress/theme-blog": "^2.2.0",
    "vuepress": "^1.4.0"
  }
}
```
其中 `devDependencies` 在 blog 主题安装完成后会自动填充。我们需要配置 `scripts` 即可。

### config.js
```js
module.exports = {
    title: 'Menfre Blog', // Title for the site. This will be displayed in the navbar.
    theme: '@vuepress/theme-blog',
    themeConfig: {
        // Please keep looking down to see the available options.
    }
}
```
我需要配置下主题，以及给我们的博客配置一个标题。

最后我们在编写文章时需要遵循一定的规范。

## 内容生成

我们的文章一般使用 Markdown 编写，在文章开头我们可以集成如下格式化信息，以便 Blog 可以通过该信息来组织和显示文章。

```markdown
---
title: 开篇：使用 VuePress 搭建个人 Blog
date: 2020-04-09
author: Menfre
location: Shenzhen  
---

> This is official blog theme.

My content.
```

### .md 文件命名方式

这里推荐 `2020-04-09-build-blog-on-vuepress.md` 这样的命名方式，这样做可以规范文章的访问路径，我们可以通过 `http://localhost:8080/2020/04/09/build-blog-on-vuepress/` 来访问这篇文章。

### tags

我们可以通过 tags 来分类和索引文章。

```markdown
---
title: 开篇：使用 VuePress 搭建个人 Blog
date: 2020-04-09
tags: 
  - VuePress
  - Vue
author: Menfre
location: Shenzhen  
---
```

## 运行和构建

现在我们有一个完整的 my-blog 项目了，接下来我们通过 npm 来运行和构建我们的项目。

```shell
# 运行
npm run dev
# 构建
npm run build
```

构建生成的文件会被放在 `blog/.vuepress/dist` 下。

## 部署

这里我们简单使用 GitHub Pages 来部署。

首先我们在自己的 github 上的添加一个仓库。

然后我们在项目中编写一个 deploy.sh 用于完成项目部署。

```shell
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd blog/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -

```

> 其中 `<USERNAME>` 是你的 github 账户名，`<REPO>` 是你的仓库名。

执行：
```shell
chmod +x ./deploy.sh
./deploy.sh
```

最后通过 `https://<USERNAME>.github.io/<REPO>/` 即可访问到你的博客了。

[点击尝试访问我的博客](https://347255699.github.io/my-blog/)

## 更多

我们可以为 Blog 的 footer 上配置一些信息，如 联系方式和 copyright 等。 也可以配置下 Blog 里时间的格式。

### 时间格式

```js
module.exports = {
  themeConfig: {
    dateFormat: 'YYYY-MM-DD'
  }
}
```

### 添加联系方式

```js
module.exports = {
  themeConfig: {
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/vuejs/vuepress',
        },
        {
          type: 'twitter',
          link: 'https://github.com/vuejs/vuepress',
        },
      ],
    },
  },
}
```

联系方式支持的类型：

* codepen
* codesandbox
* facebook
* github
* gitlab
* instagram
* linkedin
* mail
* messenger
* music
* phone
* twitter
* video
* web
* youtube

### 添加 copyright

```js
module.exports = {
  themeConfig: {
    footer: {
      copyright: [
        {
          text: 'Privacy Policy',
          link: 'https://policies.google.com/privacy?hl=en-US',
        },
        {
          text: 'MIT Licensed | Copyright © 2018-present Vue.js',
          link: '',
        },
      ],
    },
  },
}
```

## 参考资料

1. [VuePress](https://vuepress.vuejs.org/zh/) VuePress 官网
2. [@vuepress/theme-blog](https://vuepress-theme-blog.ulivz.com/#intro) Blog 主题指南

 
 <comment/> 
 