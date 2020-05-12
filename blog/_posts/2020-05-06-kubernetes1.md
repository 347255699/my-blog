---
title: 认真学习 kubernetes——安装环境
date: 2020-05-06
tags: 
  - k8s
author: Menfre
location: Shenzhen  
---

## 1. 安装机器

由于 qiong，买不起云服务器，这里我们直接在 mac 上安装虚拟机来创建环境，这里我们使用 Oracle 开源的 VirtualBox 作为我们的虚拟机。

机器配置：

* ubuntu 64
* 8 G 内存 
* 3 Core
* 10 G 存储

## 2. 安装 kubernetes

这里我们没有额外的机器了，因此只部署单节点，之后有额外的机器可以加入集群环境。

### 2.1 系统检查

* 切换 root 账号
* 节点主机名唯一，写入 hosts
* 禁止 swap 分区
* 关闭防火墙

```shell
# 设置 root 密码，切换 root 用户
sudo passwd root
su root
# 设置静态主机名
hostnamectl set-hostname k8s-master
# Status: inactive
ufw status 
# 临时关闭 swap
swapoff -a
```

### 2.2 docker-ce

```shell
# step 1: 安装必要的一些系统工具
apt-get -y install apt-transport-https ca-certificates curl software-properties-common

# step 2: 安装GPG证书
curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | apt-key add -

# Step 3: 写入软件源信息
add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"

# Step 4: 更新并安装 Docker-CE
apt-get -y update

# 安装指定版本的Docker-CE:
# Step 1: 查找Docker-CE的版本:
apt-cache madison docker-ce

# sudo apt-get -y install docker-ce=[VERSION]   //安装格式

apt-get -y install docker-ce=18.06.3~ce~3-0~ubuntu

###配置docker-hub源
tee /etc/docker/daemon.json <<-'EOF'
{
"registry-mirrors": ["https://dhq9bx4f.mirror.aliyuncs.com"]
}
EOF

systemctl daemon-reload && systemctl restart docker
```

### 2.3 kubeadm

为方便部署容器，这里我们需要安装 kubernetes dashboard，因此需要确认下 dashboard 当前支持的最新的 kubernetes 版本。[链接到 dashboard releases](https://github.com/kubernetes/dashboard/releases/)

这里我们查询到 dashboard 支持的最新版本为 1.18。接下来我们需要安装的 kubelet、kubeadm、kubectl 均为 1.18。

```shell
apt-get update && apt-get install -y apt-transport-https
curl -fsSL https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main"
apt-get update
# 查看1.18的最新版本，这里我们查村到最新版本为 1.18.2
apt-cache madison kubelet kubectl kubeadm |grep '1.18'     
# 安装指定的版本
apt install -y kubelet=1.18.2-00 kubectl=1.18.2-00 kubeadm=1.18.2-00        
```

确认安装已完成

```shell
root@k8s-master:/home/mendora# kubectl version --client=true -o yaml
clientVersion:
  buildDate: "2020-04-16T11:56:40Z"
  compiler: gc
  gitCommit: 52c56ce7a8272c798dbc29846288d7cd9fbae032
  gitTreeState: clean
  gitVersion: v1.18.2
  goVersion: go1.13.9
  major: "1"
  minor: "18"
  platform: linux/amd64
```

配置 kubelet 禁用 swap

```shell
tee /etc/default/kubelet <<-'EOF'
KUBELET_EXTRA_ARGS="--fail-swap-on=false"
EOF

systemctl daemon-reload && systemctl restart kubelet
```

> 注意：目前 kubelet 服务启动异常是因为缺少很多参数配置文件，需要等待 kubeadm init 后生成才能正常启动

### 2.4 初始化 k8s

使用 kubeadm init 初始化，这里用默认的容器仓库会比较慢，我们需要指定 aliyun 的容器仓库。
```shell
registry.aliyuncs.com/google_containers
```

```shell
kubeadm init \
  --kubernetes-version=v1.18.2 \
  --image-repository registry.aliyuncs.com/google_containers \
  --pod-network-cidr=10.24.0.0/16 \
  --ignore-preflight-errors=Swap
```

看到如下信息就代表成功了。

```shell
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.3.35:6443 --token y18cm0.gmqf40jm3954qs7n \
    --discovery-token-ca-cert-hash sha256:801a774913200684ebc405c5728d40cb2b5c26c7c1effbd80513eb137651c7f5
```

创建一个常规的账户：

```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

添加一个 k8s 网络容器：

这里我们使用 flannel overlay 来实现多节点间的 pod 通信。

我们需要访问到 github 的 yaml 文件来安装容器。github 上的静态资源通过 raw.githubusercontent.com 来访问，这里我们需要确保 raw.githubusercontent.com 域名不受污染。

```shell
echo 199.232.68.133 raw.githubusercontent.com >> /etc/hosts
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

我们通过 kubectl get pods -A 来确认容器的运行情况：

```shell
root@k8s-master:/etc# kubectl get pods -A
NAMESPACE     NAME                                 READY   STATUS    RESTARTS   AGE
kube-system   coredns-7ff77c879f-6j22p             1/1     Running   0          24m
kube-system   coredns-7ff77c879f-97mm8             1/1     Running   0          24m
kube-system   etcd-k8s-master                      1/1     Running   0          24m
kube-system   kube-apiserver-k8s-master            1/1     Running   0          24m
kube-system   kube-controller-manager-k8s-master   1/1     Running   0          24m
kube-system   kube-flannel-ds-amd64-dzqq9          1/1     Running   0          3m31s
kube-system   kube-proxy-xphzw                     1/1     Running   0          24m
kube-system   kube-scheduler-k8s-master            1/1     Running   0          24m
```

### 2.5 dashboard

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml
```

查询容器安装情况：

```shell
root@k8s-master:/etc# kubectl get pods -A
NAMESPACE              NAME                                         READY   STATUS    RESTARTS   AGE
kube-system            coredns-7ff77c879f-6j22p                     1/1     Running   0          27m
kube-system            coredns-7ff77c879f-97mm8                     1/1     Running   0          27m
kube-system            etcd-k8s-master                              1/1     Running   0          28m
kube-system            kube-apiserver-k8s-master                    1/1     Running   0          28m
kube-system            kube-controller-manager-k8s-master           1/1     Running   0          28m
kube-system            kube-flannel-ds-amd64-dzqq9                  1/1     Running   0          7m20s
kube-system            kube-proxy-xphzw                             1/1     Running   0          27m
kube-system            kube-scheduler-k8s-master                    1/1     Running   0          28m
kubernetes-dashboard   dashboard-metrics-scraper-6b4884c9d5-nw2gj   1/1     Running   0          49s
kubernetes-dashboard   kubernetes-dashboard-7b544877d5-824nv        1/1     Running   0          49s
```

查询访问信息：

```shell
root@k8s-master:/etc# kubectl get namespace
NAME                   STATUS   AGE
default                Active   30m
kube-node-lease        Active   30m
kube-public            Active   30m
kube-system            Active   30m
kubernetes-dashboard   Active   3m11s
root@k8s-master:/etc# kubectl cluster-info

Kubernetes master is running at https://192.168.3.35:6443
KubeDNS is running at https://192.168.3.35:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

访问格式：

```http
https://<master-ip>:<apiserver-port>/api/v1/namespaces/<namespaces>/services/https:kubernetes-dashboard:/proxy/
```

dashboard 访问地址：

```http
https://192.168.3.35:6443/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

这里我们还需要创建账户和制作证书才能访问。

创建账户：

admin-user.yaml

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kube-system
```

```shell
kubectl create -f admin-user.yaml
```

绑定角色：

默认 kubeadm 已经为我们创建了 admin 角色，我们只需要绑定即可。

dmin-user-role-binding.yaml

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kube-system
```

```shell
kubectl create -f  admin-user-role-binding.yaml
```

获取 Token：

登录 dashboard 时，我们需要一个 Token。

```shell
root@k8s-master:~/yaml# kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')
Name:         admin-user-token-f95cm
Namespace:    kube-system
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: admin-user
              kubernetes.io/service-account.uid: 542a7d0d-ac84-4a87-bae4-d79f7aa03b19

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  11 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IldjdXFlNXFIY0EwQ3p1YkpreW56RE9oODg2VXh0UG1acnNCZzFDbWNvRkkifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLWY5NWNtIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI1NDJhN2QwZC1hYzg0LTRhODctYmFlNC1kNzlmN2FhMDNiMTkiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.UdbFGS0DkBI8Ut7AL8z9jI0J-gfA80PI5x0WssP2_t5TW-AdocphGzQHw-GXXZJrBfqDKqm5L0hQ0KGaB7OY5mBb3LlxGXm5VjdKvmPfLlGpAhGZP7EPOfOEHeA54mp45l_JC9EQWz49mvHu8dNipSClg5l8Pxy_K7OqynHAQUOoyjO0bSYM3Q1ZjPzOBWUZgvRQcCgB3hhcDcAQ25sYmvokdA55ViyP77tqgfnwHr5t_jexflha-4uAm0mCCcILthjEWknD7Xj1gAscetvxX2mlD4fSJbr8qDzNagBmnz1DOys9gWSEDbfGvJfwjrY_eme_Zkj8FGJsKyscPfRmYw
```

制作证书：

k8s 默认启用了 RBAC，并为未认证用户赋予了一个默认的身份 anonymous。对于 API Server 来说，它是使用证书进行认证的，我们需要先创建一个证书。

我们使用client-certificate-data和client-key-data生成一个p12文件。

```shell
# 生成client-certificate-data
grep 'client-certificate-data' ~/.kube/config | head -n 1 | awk '{print $2}' | base64 -d >> kubecfg.crt

# 生成client-key-data
grep 'client-key-data' ~/.kube/config | head -n 1 | awk '{print $2}' | base64 -d >> kubecfg.key

# 生成p12
openssl pkcs12 -export -clcerts -inkey kubecfg.key -in kubecfg.crt -out kubecfg.p12 -name "kubernetes-client"
```

下载生成 kubecfg.p12 文件，并在本地双击完成证书安装。

Ok, 接下来我们就可以访问链接了。https://192.168.3.35:6443/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

一切顺利我们会得到如下登录界面，这里我们使用前面生成的 Token 登录。

![kubernetes-dashboard-login](/image/kubernetes-dashboard-login.jpg)

最终我们登录完成进入控制台：

![kubernetes-dashboar-index](/image/kubernetes-dashboar-index.jpg)

## 参考资料 
[mvpbang](https://www.cnblogs.com/xiaochina/p/11650520.html)
