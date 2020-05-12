---
title: 认真学习 kubernetes——搭建 Harbor
date: 2020-05-06
tags: 
  - k8s
author: Menfre
location: Shenzhen
---

通常情况下我们需要一个类似 Java Maven Nexus 一样的私库作为我们私有注册中心以便用来维护我们的应用容器。

## 1. docker-compose

这里我们选择 docker-compose 的方式来安装。[查询 docker-compose releases](https://github.com/docker/compose/releases)

这里我们下载的版本是 [1.26.0-rc4](https://github.com/docker/compose/releases/tag/1.26.0-rc4)，选择二进制文件  [docker-compose-Linux-x86_64](https://github.com/docker/compose/releases/download/1.26.0-rc4/docker-compose-Linux-x86_64)

这里我是通过本地 download 然后 scp 到虚拟机服务器的方式来安装。

```shell
scp docker-compose-Linux-x86_64 ubuntu0:/usr/local/bin
```

> 这里的 ubuntu0 等价于 mendora@192.168.3.35。默认 /usr/local/bin 其他用户是没有写入权限的，我们需要添加 chmod 777 /usr/local/bin。或者通过 scp 到其他目录，再 mv 到 /usr/local/bin

```shell
cd /usr/local/bin && mv docker-compose-Linux-x86_64 docker-compose
chmod +x docker-compose
```

确认下安装：

```shell
mendora@k8s-master:/usr/local/bin$ docker-compose --version
docker-compose version 1.25.5, build 8a1c60f6
```

## 2. 离线安装 Harbor

[查询 harbor releases](https://github.com/goharbor/harbor/releases)

这里我们下载的版本是 [v2.0.0-rc2](https://github.com/goharbor/harbor/releases/tag/v2.0.0-rc2)，选择压缩包 [harbor-offline-installer-v2.0.0-rc2.tgz](https://github.com/goharbor/harbor/releases/download/v2.0.0-rc2/harbor-offline-installer-v2.0.0-rc2.tgz)

```shell
scp harbor-offline-installer-v2.0.0-rc2.tgz ubuntu0:/opt
```

```shell
cd /opt && tar -zxvf harbor-offline-installer-v2.0.0-rc2.tgz
mkdir installed && mv harbor-offline-installer-v2.0.0-rc2.tgz ./installed
```

我们 cd 到 harbor 文件夹，能看到如下列表：

```shell
mendora@k8s-master:/opt$ cd harbor && ls
common.sh  harbor.v2.0.0.tar.gz  harbor.yml.tmpl  install.sh  LICENSE  prepare
```

接下来我们需要修改 harbor.yml.tmpl 配置文件，此时配置文件是临时的还不能被使用。我需要修改一下并重命名。

```shell
vim harbor.yml.tmpl
mv harbor.yml.tmpl harbor.yml
```

### 2.1 配置 https

#### 2.1.1 配置域名
配置一个虚拟的域名，以方便后续的镜像推送和拉取。
在需要访问 harbor 的机器上设置 hosts。

```shell
echo 192.168.3.35 harbor.com >> /etc/hosts
```

#### 2.1.2 自签名证书
这里我们是在本地环境部署的 harbor 并不需要真的买一个证书，这里我们采用自签名证书即可。  
这里我们通过 openssl 来生成。

> 记得在证书生成的过程中将 harbor.com 换成你自己的域名。

##### CA 证书

生成 CA 私钥：
```shell
openssl genrsa -out ca.key 4096
```

生成 CA 证书：
```shell
openssl req -x509 -new -nodes -sha512 -days 3650 \
 -subj "/C=CN/ST=Beijing/L=Beijing/O=example/OU=Personal/CN=harbor.com" \
 -key ca.key \
 -out ca.crt
```

##### 服务器证书

生成私钥：
```shell
openssl genrsa -out harbor.com.key 4096
```

生成 CSR:
```shell
openssl req -sha512 -new \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=example/OU=Personal/CN=harbor.com" \
    -key harbor.com.key \
    -out harbor.com.csr
```

生成 x509 v3 扩展文件：
```shell
cat > v3.ext <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1=harbor.com
DNS.2=harbor
DNS.3=192.168.3.35
EOF
```

使用 v3.ext 为我们的机器生成证书：
```shell
openssl x509 -req -sha512 -days 3650 \
    -extfile v3.ext \
    -CA ca.crt -CAkey ca.key -CAcreateserial \
    -in harbor.com.csr \
    -out harbor.com.crt
```

#### 2.1.3 为 Docker 和 harbor 提供证书

复制证书到 harbor 主机上：
```shell
cp harbor.com.crt /opt/harbor/data/cert/
cp harbor.com.key /opt/harbor/data/cert/
```

> 默认 harboar data 目录是在 /data，因此你需要复制证书到 /data/cert/ 下。data 目录可以在 harbor.yml 中配置。

将 harbor.com.crt 转换为 harbor.com.cert 以便给 Docker 使用：

```shell
openssl x509 -inform PEM -in harbor.com.crt -out harbor.com.cert
```

拷贝服务器证书以及 CA 文件到 Docker 证书目录下：

```shell
cp harbor.com.cert /etc/docker/certs.d/harbor.com/
cp harbor.com.key /etc/docker/certs.d/harbor.com/
cp ca.crt /etc/docker/certs.d/harbor.com/
```

重启Docker:

```shell
systemctl restart docker
```

最后你能看到 docker 的证书目录：

```text
/etc/docker/certs.d/
    └── harbor.com:port
       ├── harbor.com.cert  <-- Server certificate signed by CA
       ├── harbor.com.key   <-- Server key signed by CA
       └── ca.crt               <-- Certificate authority that signed the registry certificate
```

#### 2.1.4  配置 harbor.yml

```yaml
hostname: harbor.com

# http related config
http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  port: 80

# https related config
https:
  # https port for harbor, default is 443
  port: 443
  # The path of cert and key files for nginx
  certificate: /opt/harbor/data/cert/harbor.com.crt
  private_key: /opt/harbor/data/cert/harbor.com.key
```

> 这里除了配置域名和开启 https 外，还需要设置 admin 账户密码，数据库密码，data 目录等。按实际需要来配置就好。

### 2.2 启动脚本

启动安装脚本：

```shell
./prepare.sh
./install.sh
```

看到如下信息代表安装完成了。

```shell
Creating network "harbor_harbor" with the default driver
Creating harbor-log ... done
Creating harbor-portal ... done
Creating redis         ... done
Creating registry      ... done
Creating harbor-db     ... done
Creating registryctl   ... done
Creating harbor-core   ... done
Creating harbor-jobservice ... done
Creating nginx             ... done
✔ ----Harbor has been installed and started successfully.----
```

访问我们的 harbor。

```http
https://harbor.com
```

使用 admin/[你设置的 admin 密码] 完成登录。

![harbor](/image/harbor.png)

下一章我们将使用 harbor 来分发和部署我们的容器应用。

## 参考资料
1. [dz45693](https://www.cnblogs.com/majiang/p/11218792.html)
2. [官方文档——Run the Installer Script](https://goharbor.io/docs/1.10/install-config/run-installer-script/)

 
 <comment/> 
