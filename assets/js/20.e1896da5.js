(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{360:function(s,t,a){"use strict";a.r(t);var e=a(9),n=Object(e.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h2",{attrs:{id:"_1-安装机器"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-安装机器"}},[s._v("#")]),s._v(" 1. 安装机器")]),s._v(" "),a("p",[s._v("由于 qiong，买不起云服务器，这里我们直接在 mac 上安装虚拟机来创建环境，这里我们使用 Oracle 开源的 VirtualBox 作为我们的虚拟机。")]),s._v(" "),a("p",[s._v("机器配置：")]),s._v(" "),a("ul",[a("li",[s._v("ubuntu 64")]),s._v(" "),a("li",[s._v("8 G 内存")]),s._v(" "),a("li",[s._v("3 Core")]),s._v(" "),a("li",[s._v("10 G 存储")])]),s._v(" "),a("h2",{attrs:{id:"_2-安装-kubernetes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-安装-kubernetes"}},[s._v("#")]),s._v(" 2. 安装 kubernetes")]),s._v(" "),a("p",[s._v("这里我们没有额外的机器了，因此只部署单节点，之后有额外的机器可以加入集群环境。")]),s._v(" "),a("h3",{attrs:{id:"_2-1-系统检查"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-系统检查"}},[s._v("#")]),s._v(" 2.1 系统检查")]),s._v(" "),a("ul",[a("li",[s._v("切换 root 账号")]),s._v(" "),a("li",[s._v("节点主机名唯一，写入 hosts")]),s._v(" "),a("li",[s._v("禁止 swap 分区")]),s._v(" "),a("li",[s._v("关闭防火墙")])]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 设置 root 密码，切换 root 用户")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("passwd")]),s._v(" root\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("su")]),s._v(" root\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 设置静态主机名")]),s._v("\nhostnamectl set-hostname k8s-master\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Status: inactive")]),s._v("\nufw status \n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 临时关闭 swap")]),s._v("\nswapoff -a\n")])])]),a("h3",{attrs:{id:"_2-2-docker-ce"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-docker-ce"}},[s._v("#")]),s._v(" 2.2 docker-ce")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# step 1: 安装必要的一些系统工具")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-get")]),s._v(" -y "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" apt-transport-https ca-certificates "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" software-properties-common\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# step 2: 安装GPG证书")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" apt-key "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" -\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Step 3: 写入软件源信息")]),s._v("\nadd-apt-repository "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu '),a("span",{pre:!0,attrs:{class:"token variable"}},[a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$(")]),s._v("lsb_release -cs"),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v(")")])]),s._v(' stable"')]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Step 4: 更新并安装 Docker-CE")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-get")]),s._v(" -y update\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 安装指定版本的Docker-CE:")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Step 1: 查找Docker-CE的版本:")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-cache")]),s._v(" madison docker-ce\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# sudo apt-get -y install docker-ce=[VERSION]   //安装格式")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-get")]),s._v(" -y "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" docker-ce"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("18.06")]),s._v(".3~ce~3-0~ubuntu\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("###配置docker-hub源")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("tee")]),s._v(" /etc/docker/daemon.json "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<<-")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('\'EOF\'\n{\n"registry-mirrors": ["https://dhq9bx4f.mirror.aliyuncs.com"]\n}\nEOF')]),s._v("\n\nsystemctl daemon-reload "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" systemctl restart docker\n")])])]),a("h3",{attrs:{id:"_2-3-kubeadm"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-3-kubeadm"}},[s._v("#")]),s._v(" 2.3 kubeadm")]),s._v(" "),a("p",[s._v("为方便部署容器，这里我们需要安装 kubernetes dashboard，因此需要确认下 dashboard 当前支持的最新的 kubernetes 版本。"),a("a",{attrs:{href:"https://github.com/kubernetes/dashboard/releases/",target:"_blank",rel:"noopener noreferrer"}},[s._v("链接到 dashboard releases"),a("OutboundLink")],1)]),s._v(" "),a("p",[s._v("这里我们查询到 dashboard 支持的最新版本为 1.18。接下来我们需要安装的 kubelet、kubeadm、kubectl 均为 1.18。")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-get")]),s._v(" update "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-get")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" -y apt-transport-https\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" -fsSL https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" apt-key "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" -\nadd-apt-repository "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"deb [arch=amd64] https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main"')]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-get")]),s._v(" update\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看1.18的最新版本，这里我们查村到最新版本为 1.18.2")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-cache")]),s._v(" madison kubelet kubectl kubeadm "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("grep")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'1.18'")]),s._v("     \n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 安装指定的版本")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" -y "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("kubelet")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.18")]),s._v(".2-00 "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("kubectl")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.18")]),s._v(".2-00 "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("kubeadm")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.18")]),s._v(".2-00        \n")])])]),a("p",[s._v("确认安装已完成")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("root@k8s-master:/home/mendora"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# kubectl version --client=true -o yaml")]),s._v("\nclientVersion:\n  buildDate: "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"2020-04-16T11:56:40Z"')]),s._v("\n  compiler: gc\n  gitCommit: 52c56ce7a8272c798dbc29846288d7cd9fbae032\n  gitTreeState: clean\n  gitVersion: v1.18.2\n  goVersion: go1.13.9\n  major: "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"1"')]),s._v("\n  minor: "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"18"')]),s._v("\n  platform: linux/amd64\n")])])]),a("p",[s._v("配置 kubelet 禁用 swap")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("tee")]),s._v(" /etc/default/kubelet "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<<-")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'EOF'\nKUBELET_EXTRA_ARGS=\"--fail-swap-on=false\"\nEOF")]),s._v("\n\nsystemctl daemon-reload "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" systemctl restart kubelet\n")])])]),a("blockquote",[a("p",[s._v("注意：目前 kubelet 服务启动异常是因为缺少很多参数配置文件，需要等待 kubeadm init 后生成才能正常启动")])]),s._v(" "),a("h3",{attrs:{id:"_2-4-初始化-k8s"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-初始化-k8s"}},[s._v("#")]),s._v(" 2.4 初始化 k8s")]),s._v(" "),a("p",[s._v("使用 kubeadm init 初始化，这里用默认的容器仓库会比较慢，我们需要指定 aliyun 的容器仓库。")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("registry.aliyuncs.com/google_containers\n")])])]),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("kubeadm init "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n  --kubernetes-version"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("v1.18.2 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n  --image-repository registry.aliyuncs.com/google_containers "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n  --pod-network-cidr"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("10.24")]),s._v(".0.0/16 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n  --ignore-preflight-errors"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("Swap\n")])])]),a("p",[s._v("看到如下信息就代表成功了。")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("Your Kubernetes control-plane has initialized successfully"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("\n\nTo start using your cluster, you need to run the following as a regular user:\n\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("mkdir")]),s._v(" -p "),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("$HOME")]),s._v("/.kube\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("cp")]),s._v(" -i /etc/kubernetes/admin.conf "),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("$HOME")]),s._v("/.kube/config\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("chown")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token variable"}},[a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$(")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("id")]),s._v(" -u"),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v(")")])]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token variable"}},[a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$(")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("id")]),s._v(" -g"),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v(")")])]),s._v(" "),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("$HOME")]),s._v("/.kube/config\n\nYou should now deploy a pod network to the cluster.\nRun "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"kubectl apply -f [podnetwork].yaml"')]),s._v(" with one of the options listed at:\n  https://kubernetes.io/docs/concepts/cluster-administration/addons/\n\nThen you can "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("join")]),s._v(" any number of worker nodes by running the following on each as root:\n\nkubeadm "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("join")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),s._v(".3.35:6443 --token y18cm0.gmqf40jm3954qs7n "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n    --discovery-token-ca-cert-hash sha256:801a774913200684ebc405c5728d40cb2b5c26c7c1effbd80513eb137651c7f5\n")])])]),a("p",[s._v("创建一个常规的账户：")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("mkdir")]),s._v(" -p "),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("$HOME")]),s._v("/.kube\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("cp")]),s._v(" -i /etc/kubernetes/admin.conf "),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("$HOME")]),s._v("/.kube/config\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("chown")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token variable"}},[a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$(")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("id")]),s._v(" -u"),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v(")")])]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),a("span",{pre:!0,attrs:{class:"token variable"}},[a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$(")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("id")]),s._v(" -g"),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v(")")])]),s._v(" "),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("$HOME")]),s._v("/.kube/config\n")])])]),a("p",[s._v("添加一个 k8s 网络容器：")]),s._v(" "),a("p",[s._v("这里我们使用 flannel overlay 来实现多节点间的 pod 通信。")]),s._v(" "),a("p",[s._v("我们需要访问到 github 的 yaml 文件来安装容器。github 上的静态资源通过 raw.githubusercontent.com 来访问，这里我们需要确保 raw.githubusercontent.com 域名不受污染。")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("199.232")]),s._v(".68.133 raw.githubusercontent.com "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>")]),s._v(" /etc/hosts\nkubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml\n")])])]),a("p",[s._v("我们通过 kubectl get pods -A 来确认容器的运行情况：")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("root@k8s-master:/etc"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# kubectl get pods -A")]),s._v("\nNAMESPACE     NAME                                 READY   STATUS    RESTARTS   AGE\nkube-system   coredns-7ff77c879f-6j22p             "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          24m\nkube-system   coredns-7ff77c879f-97mm8             "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          24m\nkube-system   etcd-k8s-master                      "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          24m\nkube-system   kube-apiserver-k8s-master            "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          24m\nkube-system   kube-controller-manager-k8s-master   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          24m\nkube-system   kube-flannel-ds-amd64-dzqq9          "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          3m31s\nkube-system   kube-proxy-xphzw                     "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          24m\nkube-system   kube-scheduler-k8s-master            "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          24m\n")])])]),a("h3",{attrs:{id:"_2-5-dashboard"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-5-dashboard"}},[s._v("#")]),s._v(" 2.5 dashboard")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml\n")])])]),a("p",[s._v("查询容器安装情况：")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("root@k8s-master:/etc"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# kubectl get pods -A")]),s._v("\nNAMESPACE              NAME                                         READY   STATUS    RESTARTS   AGE\nkube-system            coredns-7ff77c879f-6j22p                     "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          27m\nkube-system            coredns-7ff77c879f-97mm8                     "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          27m\nkube-system            etcd-k8s-master                              "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          28m\nkube-system            kube-apiserver-k8s-master                    "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          28m\nkube-system            kube-controller-manager-k8s-master           "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          28m\nkube-system            kube-flannel-ds-amd64-dzqq9                  "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          7m20s\nkube-system            kube-proxy-xphzw                             "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          27m\nkube-system            kube-scheduler-k8s-master                    "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          28m\nkubernetes-dashboard   dashboard-metrics-scraper-6b4884c9d5-nw2gj   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          49s\nkubernetes-dashboard   kubernetes-dashboard-7b544877d5-824nv        "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("/1     Running   "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("          49s\n")])])]),a("p",[s._v("查询访问信息：")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("root@k8s-master:/etc"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# kubectl get namespace")]),s._v("\nNAME                   STATUS   AGE\ndefault                Active   30m\nkube-node-lease        Active   30m\nkube-public            Active   30m\nkube-system            Active   30m\nkubernetes-dashboard   Active   3m11s\nroot@k8s-master:/etc"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# kubectl cluster-info")]),s._v("\n\nKubernetes master is running at https://192.168.3.35:6443\nKubeDNS is running at https://192.168.3.35:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy\n\nTo further debug and diagnose cluster problems, use "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'kubectl cluster-info dump'")]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v("\n")])])]),a("p",[s._v("访问格式：")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("https:")]),s._v("//<master-ip>:<apiserver-port>/api/v1/namespaces/<namespaces>/services/https:kubernetes-dashboard:/proxy/\n")])])]),a("p",[s._v("dashboard 访问地址：")]),s._v(" "),a("div",{staticClass:"language-http extra-class"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[s._v("https:")]),s._v("//192.168.3.35:6443/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/\n")])])]),a("p",[s._v("这里我们还需要创建账户和制作证书才能访问。")]),s._v(" "),a("p",[s._v("创建账户：")]),s._v(" "),a("p",[s._v("admin-user.yaml")]),s._v(" "),a("div",{staticClass:"language-yaml extra-class"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("apiVersion")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" v1\n"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("kind")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" ServiceAccount\n"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("metadata")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("name")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" admin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("user\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("namespace")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" kube"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("system\n")])])]),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("kubectl create -f admin-user.yaml\n")])])]),a("p",[s._v("绑定角色：")]),s._v(" "),a("p",[s._v("默认 kubeadm 已经为我们创建了 admin 角色，我们只需要绑定即可。")]),s._v(" "),a("p",[s._v("dmin-user-role-binding.yaml")]),s._v(" "),a("div",{staticClass:"language-yaml extra-class"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("apiVersion")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" rbac.authorization.k8s.io/v1beta1\n"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("kind")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" ClusterRoleBinding\n"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("metadata")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("name")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" admin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("user\n"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("roleRef")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("apiGroup")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" rbac.authorization.k8s.io\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("kind")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" ClusterRole\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("name")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" cluster"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("admin\n"),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("subjects")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("kind")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" ServiceAccount\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("name")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" admin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("user\n  "),a("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("namespace")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" kube"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("system\n")])])]),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("kubectl create -f  admin-user-role-binding.yaml\n")])])]),a("p",[s._v("获取 Token：")]),s._v(" "),a("p",[s._v("登录 dashboard 时，我们需要一个 Token。")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("root@k8s-master:~/yaml"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')")]),s._v("\nName:         admin-user-token-f95cm\nNamespace:    kube-system\nLabels:       "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("none"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\nAnnotations:  kubernetes.io/service-account.name: admin-user\n              kubernetes.io/service-account.uid: 542a7d0d-ac84-4a87-bae4-d79f7aa03b19\n\nType:  kubernetes.io/service-account-token\n\nData\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v("\nca.crt:     "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1025")]),s._v(" bytes\nnamespace:  "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(" bytes\ntoken:      eyJhbGciOiJSUzI1NiIsImtpZCI6IldjdXFlNXFIY0EwQ3p1YkpreW56RE9oODg2VXh0UG1acnNCZzFDbWNvRkkifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLWY5NWNtIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI1NDJhN2QwZC1hYzg0LTRhODctYmFlNC1kNzlmN2FhMDNiMTkiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.UdbFGS0DkBI8Ut7AL8z9jI0J-gfA80PI5x0WssP2_t5TW-AdocphGzQHw-GXXZJrBfqDKqm5L0hQ0KGaB7OY5mBb3LlxGXm5VjdKvmPfLlGpAhGZP7EPOfOEHeA54mp45l_JC9EQWz49mvHu8dNipSClg5l8Pxy_K7OqynHAQUOoyjO0bSYM3Q1ZjPzOBWUZgvRQcCgB3hhcDcAQ25sYmvokdA55ViyP77tqgfnwHr5t_jexflha-4uAm0mCCcILthjEWknD7Xj1gAscetvxX2mlD4fSJbr8qDzNagBmnz1DOys9gWSEDbfGvJfwjrY_eme_Zkj8FGJsKyscPfRmYw\n")])])]),a("p",[s._v("制作证书：")]),s._v(" "),a("p",[s._v("k8s 默认启用了 RBAC，并为未认证用户赋予了一个默认的身份 anonymous。对于 API Server 来说，它是使用证书进行认证的，我们需要先创建一个证书。")]),s._v(" "),a("p",[s._v("我们使用client-certificate-data和client-key-data生成一个p12文件。")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 生成client-certificate-data")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("grep")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'client-certificate-data'")]),s._v(" ~/.kube/config "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("head")]),s._v(" -n "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("awk")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'{print "),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$2")]),s._v("}'")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" base64 -d "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>")]),s._v(" kubecfg.crt\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 生成client-key-data")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("grep")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'client-key-data'")]),s._v(" ~/.kube/config "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("head")]),s._v(" -n "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("awk")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'{print "),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$2")]),s._v("}'")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" base64 -d "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>")]),s._v(" kubecfg.key\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 生成p12")]),s._v("\nopenssl pkcs12 -export -clcerts -inkey kubecfg.key -in kubecfg.crt -out kubecfg.p12 -name "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"kubernetes-client"')]),s._v("\n")])])]),a("p",[s._v("下载生成 kubecfg.p12 文件，并在本地双击完成证书安装。")]),s._v(" "),a("p",[s._v("Ok, 接下来我们就可以访问链接了。https://192.168.3.35:6443/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/")]),s._v(" "),a("p",[s._v("一切顺利我们会得到如下登录界面，这里我们使用前面生成的 Token 登录。")]),s._v(" "),a("p",[a("img",{attrs:{src:"/image/kubernetes-dashboard-login.jpg",alt:"kubernetes-dashboard-login"}})]),s._v(" "),a("p",[s._v("最终我们登录完成进入控制台：")]),s._v(" "),a("p",[a("img",{attrs:{src:"/image/kubernetes-dashboar-index.jpg",alt:"kubernetes-dashboar-index"}})]),s._v(" "),a("h2",{attrs:{id:"参考资料"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参考资料"}},[s._v("#")]),s._v(" 参考资料")]),s._v(" "),a("p",[a("a",{attrs:{href:"https://www.cnblogs.com/xiaochina/p/11650520.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("mvpbang"),a("OutboundLink")],1)]),s._v(" "),a("comment"),s._v(" "),a("comment")],1)}),[],!1,null,null,null);t.default=n.exports}}]);