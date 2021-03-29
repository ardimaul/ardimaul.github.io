---
layout: article
title: "[Day One] Belajar Kubernetes"
author: Ardiansyah Maulana
tags: Kubernetes Linux
key: 20200615-day-one-learn-kubernetes
---

## Day one

### Pengenalan Konsep

Kubernetes merupakan Platform as a service, ya.. platform yang menyediakan kontainer, microservices, serta juga cloud. Keuntungannya lebih fleksibel, sebab proses deployment juga dengan konsep kontainerisasi ini bisa mempercepat jalannya development juga update aplikasi.

Jadi dalam kubernetes ada istilah yang namanya node, pods, control plane, juga cluster. Didalam cluster ada node dan control plane. Control plane ini bertindak buat manajemen cluster kayak penjadwalan aplikasi, maintenance, juga me roll out new updates. Sedang node untuk pekerja, jadi node ini workernya, node juga dilengkapi tools untuk menunjang operasi container seperti docker. Saran dokumentasi docker, cluster yang ingin dibuat untuk production seminimalnya harus ada 3 node.. Node berkomunikasi dengan master itu menggunakan Kubernetes API.

Soal pods itu merupakan sub terkecil dari lingkup object kubernetes juga disebut atomic. Pods itu grup dari satu atau banyak aplikasi kontainer, didalamnya berisi tentang shared storage, ip address, juga informasi mengenai bagaimana cara menjalankannya. Pods itu bersifat mortal, ketika node meninggal maka pods yang ada di node itu bakalan hilang. Soal container runtime biasanya menggunakan Docker, namun kubernetes bisa juga menggunakan lainnya seperti CRI-O, Containerd, frakti.

Untuk belajar mengenai kubernetes, pihak sana menyediakan minikube. Yakni kubernetes versi cilik, tersedia untuk Linux, MacOS, maupun Windows. Untuk berinteraksi dengan cluster seperti membuat dan mendeploy kita membutuhkan yang namanya Kubernetes command line interface dibaca **Kubectl.** Dan ya dia menggunakan API untuk berinteraksi dengan Cluster.

Minikube saya menggunakan driver docker, jadi seperti ini

```bash
minikube start --driver=docker
```

Images yang diunduh cukup besar, ya sekitar 500MBan.. Setelah selesai bisa dilanjutkan dengan membuat yaml deployment

Saya mengambil contoh nginx pods

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
          app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```

`.metadata.name` mengindikasikan nama deployment

`.spec.replicas` bakal membuat pods menjadi 3 replika/clon

`.metadata.labels` untuk ngelabelin nama app pods nya

`.template.spec` untuk menjalankan container, bakal mengambil images dari docker hub, contohnya saya yang mengambil nginx tag latest

Terakhir, lakukan hal ini untuk membuat pods nya

```bash
kubectl apply -f <nama file>
```

Sisanya bisa seperti command

`kubectl get "deploy | all | svc | pods"` untuk mengecek hasilnya

`kubectl rollout status ...` untuk status roll out nya

`kubectl describe` untuk informasinya

Dan banyak lainnya..

Sekian blog kali ini, moga bermanfaat
