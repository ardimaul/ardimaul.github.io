---
layout: article
title: "[Day Five] Belajar Kubernetes"
author: Ardiansyah Maulana
tags: Kubernetes Linux
key: 20200619-day-five-learn-kubernetes
---
# Belajar Kubernetes hari ke-5

## Ingress

Ingress dapat mengarahkan arus masuk ke service tertentu. Dalam ingress ada yang namanya Ingress controller, dan Ingress resources. Controller itu yang mengontrol, ada banyak kayak GCP, Nginx, Contour, HAProxy, dll. Dan resources itu tempat aturan mainnya si controller, jadi controller bakal ngelakuin apa yang udah didefinisiin di resources. Pada kali ini saya menggunakan nginx controller..

Lalu bro, Nginx ini nyediain deployment sama daemonset. Terus bedanya apa? Mengutip pada forum legendaris aka stackoverflow ini : [`https://stackoverflow.com/questions/53888389/difference-between-daemonsets-and-deployments`](https://stackoverflow.com/questions/53888389/difference-between-daemonsets-and-deployments)

Saya menyimpulkan, Deployment berguna buat manage bagaimana suatu pods disebarkan dan berfokus pada jalannya pods, ketika kita perintahkan untuk menampung 5 pods dan hanya memiliki misalnya 3 node maka dalam 1 node bakal ada yang nampung lebih dari 1 pod.

Lain hal dengan daemonset, menggunakan model 1 untuk satu, artinya 1 pod hanya menempati 1 node. Menariknya, setiap ada node baru daemonset bakal otomatis ngespawn pod didalamnya, jadi nggak perlu ngedeploy lagi. Lalu untuk apa daemonset ini? Sangat berguna buat tugas latar belakang, ya seperti nginx-ingress ini yang jalan ditiap node.. Bisa juga ceph..

### Deploy nginx-ingress daemonset

Lets, clone this github repository [`https://github.com/nginxinc/kubernetes-ingress`](https://github.com/nginxinc/kubernetes-ingress)

Masuk ke direktori deployment, lalu buka tentang dokumentasi nginx ingress disini : [`https://docs.nginx.com/nginx-ingress-controller/installation/`](https://docs.nginx.com/nginx-ingress-controller/installation/)

Dan apply beberapa command ini,

```bash
$ kubectl apply -f common/ns-and-sa.yaml
$ kubectl apply -f rbac/rbac.yaml
$ kubectl apply -f common/default-server-secret.yaml
$ kubectl apply -f daemon-set/nginx-ingress.yaml
```

### Multi Deploy

Jadi tujuan saya ingin merute berdasarkan request domain name, yang mana `[main.example.com](http://main.example.com)` bakal diarahin ke Nginx-main dan [`second.example.com`](http://second.example.com) bakal diarahin ke Nginx-secondary..

Nginx-main, berikut isi file nya

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: nginx-main
  name: nginx-deploy-main
spec:
  replicas: 1
  selector:
    matchLabels:
      run: nginx-main
  template:
    metadata:
      labels:
        run: nginx-main
    spec:
      containers:
      - image: nginx
        name: nginx
        ports:
          - containerPort: 80

---

apiVersion: v1
kind: Service
metadata:
  name: nginx-service-main
spec:
  selector:
    run: nginx-main
  ports:
    - port: 80
      targetPort: 80
      name: http
```

Nginx-secondary, berikut isinya..

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: nginx-second
  name: nginx-deploy-second
spec:
  replicas: 1
  selector:
    matchLabels:
      run: nginx-second
  template:
    metadata:
      labels:
        run: nginx-second
    spec:
      volumes:             # Volumesharing buat dimount initcontainer dan container asli
      - name: webdata
        emptyDir: {}
      initContainers:      # Init container cuma untuk mewrite index.html
      - name: web-content  # Sifatnya sekali pakai, kalau initcontainer error, container aslinya nanti nggak bakal running
        image: busybox
        volumeMounts:
        - name: webdata
          mountPath: "/webdata"
        command: ["/bin/sh", "-c", 'echo "<h1>Ini Nginx Secondary</h1>" > /webdata/index.html']
      containers:
      - image: nginx
        name: nginx
        ports:
        - containerPort: 80
        volumeMounts:
        - name: webdata
          mountPath: "/usr/share/nginx/html"

---

apiVersion: v1
kind: Service
metadata:
  name: nginx-service-second
spec:
  selector:
    run: nginx-second
  ports:
    - port: 80
      targetPort: 80
      name: http
```

### Ingress Resources

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: ingress-resource
spec:
  rules:
  - host: main.example.com
    http:
      paths:
      - backend:
          serviceName: nginx-deploy-main
          servicePort: 80
  - host: second.example.com
    http:
      paths:
      - backend:
          serviceName: nginx-deploy-second
          servicePort: 80
```

## Let's firing up

Deploy semua file yaml.. dan tunggu, eh tapi kolom ADDRESS pada ingress kok nggak muncul.. Karena hal ini, jadi soal mengaktifkan ingress pada minikube nggak make cara yang diawal.. Jadi tinggal menggunakan 1 baris command ini

```yaml
$ minikube addons enable ingress
```

Dan ya karena itu juga saya harus menghapus nginx-ingress daemonset terlebih dahulu.. Juga karena hal ini, saya kebingungan sampe nyobain nodePort dan tiap-tiap itu diload balancer menggunakan HAproxy, haduh..

pada /etc/hosts saya pointing IP node ke dua domain seperti ini

```yaml
172.17.0.2 main.example.com
172.17.0.2 second.example.com
```

Terimakasih stackoverflow : `https://stackoverflow.com/questions/51511547/empty-address-kubernetes-ingress`

Sekian dan terimagaji..
