---
title: 继篇：GitHub Pages 自定义域名 
date: 2020-04-09
tags: 
  - Github
  - DNS
author: Menfre
location: Shenzhen  
---

## 前言

这里是接上 【开篇：使用 VuePress 搭建个人 Blog】 写的，主要是觉得没有自定义域名称不上博客，还有在配置 dns 解析市踩了坑，所以需要记录一下。

## 域名购买

这里我选择国外的域名注册商 `namesilo`，选择它的原因很简单，不用备案，便宜，还可以用 `alipay` 支付。 

打开主页，能感受到 `namesilo` 有一定历史了。

![namesilo](/image/namesilo.jpg)

大概步骤如下：

1. 点击右上角 Create New Account 按钮创建账号，填写一些个人信息，可以填中文。
2. 点击 Log In ，填写 Username 和 Password 登录。
3. 找到 domain search，检索自己喜欢的域名，加到购物车，使用 alipay 买单。

对于经常网上购物的人来说问题不是很大。

## 域名解析

点击右上角 Manage My Domains, 进入管理界面。

![domain-manage](/image/domain-manage.jpg)

找到 domain 列表，这里我购买的域名是 `menfre.info`，鼠标移动到右边 Options 列中蓝色圆球上。你能看到上面的 tips 是 `Manage DNS for this domain`。

Ok，接下来点击它进入 DNS 解析页面。

![manage-dns](/image/manage-dns.jpg)

我们总共需要添加两条解析记录，一条 A 类型 和 一条 CName 类型。实际生效是 CName 类型这条解析记录。
这里以我的 Github Pages 地址为例，这里是将 `www.menfre.info` 解析到 `347255699.github.io` 上，即为我的 Github Pages 取了别名。
而我们添加的 A 记录，主要是将 `menfre.info` 解析到 `192.30.252.153` 地址上。这里 `192.30.252.153` 我没有深究是什么地址。但大概能了解它的作用是将 `menfre.info` 的流量转发到 `www.menfre.info` 上。

【注意】配置完成后，需要等待 30 分钟以上以保证解析生效并同步到全球 DNS 服务器上，不要马上去验证解析生效没有。

到这里我们就成功将 `menfre.info` 和 `www.menfre.info` 解析到 `347255699.github.io` 上了。

## 配置 Github Pages 自定义域名

最后我们需要在 `blog/.vuepress/dist/` 目录中生成一个 CNAME 文件，并将我们的域名 `www.menfre.info` 写入到文件提交到 Github 仓库上完成域名配置。我们将这个操作写到 `deploy.sh` 中。

```shell
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd blog/.vuepress/dist

# 如果是发布到自定义域名
echo 'www.menfre.info' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:347255699/my-blog.git master:gh-pages

cd -
```

执行 `./delpoy.sh` 完成部署。

还有需要在 Github 仓库的 Settings 中的 GitHub Pages配置上钩上 `Enforce HTTPS`。

配置中有一项 Custom domain，这里的配置等同于我们创建的 CNAME 文件都是配置自定义域名。

![github-settings](/image/github-settings.jpg)


 








