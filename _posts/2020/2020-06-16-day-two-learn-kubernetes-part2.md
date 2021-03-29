---
layout: article
title: Hari kedua Belajar Kubernetes Part 2
author: Ardiansyah Maulana
tags: Kubernetes Linux
key: 20200616-day-two-learn-kubernetes-part2
---
## Belajar Kubernetes part 2

Dalam memanajemen kubernetes terdapat 3 teknik dalam mendeploy suatu aplikasi,

Management technique | Operates on | Recommended environment | Supported writers | Learning curve
-------------------- | ----------- | ----------------------- | ----------------- | --------------
Imperative commands | Live objects | Development projects | 1+ | Lowest
Imperative object configuration | Individual files | Production projects | 1 | Moderate
Declarative object configuration | Directories of files | Production projects | 1+ | Highest

Jadi, Imperative commands adalah saat dimana kita mendeploy aplikasi yang berinteraksi dengan command line seperti bash. Untuk rekomendasinya adalah project development misalnya yang skala kecil, ya biasanya yang seperti itu. Dan ya kurva pembelajaran ini singkat.. Karena tidak mempelajari YAML file configuration API kubernetes, hanya perlu menghafal command terkait mendeploy suatu app dari suatu images.

Untuk Imperative object configuration digunakan untuk skala produksi project. Objectnya individual maksudnya kita hanya mendeploy aplikasi dengan sedikit file configuration. Kurva pembelajarannya sedang.

Dan terakhir Declarative object configuration, sama seperti sebelumnya yakni untuk skala produksi. Namun, disini file konfigurasi yang dihandle lebih banyak otomatis deploying app juga lebih banyak. Kita bakal membuat suatu direktori yang isinya file configuration, setelah itu semua file yang berada disitu bakal di deploy, massif/massal deployment ya seperti itu saya menyebutnya.

### Labels dan Selector Kubernetes

Labels merupakan pemberian informasi kepada suatu resource dalam kubernetes, bisa digunakan untuk memberikan informasi tambahan, mengorganisir resource tersebut, juga memberi tanda. Oh ya, yang dimaksud resource disini seperti pods, replica set, service, replication controller, dll.

Untuk pembuatan label ini tidak boleh terdapat spasi, jadi meskipun untuk informasi tambahan.. Penggunaan label ini tidak ditujukan untuk tujuan seperti memberi deskripsi pada resource tersebut. Ya untuk hal itu sudah anotation namanya..

Pada file yaml, label diberikan seperti ini

```yaml
metadata:
  name: nginx
  labels:
    app: nginx
    version: 1.19.0-alpine
    environment: dev
    release: stable
```

Nah label itu terdapat key dan value.. Key dicontoh itu seperti `version`, `environment`, `release`. Sedang value disitu seperti `1.19.0-alpine`, `dev`, dan `stable`.

Sedang selector itu menselect app berdasar label yang sudah ditunjuk, misalnya kita membuat service tambahan untuk meng ekspose port node.. Check this yaml,

```yaml
---

apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: NodePort
  selector:
    matchLabels:
      app: nginx
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30001
```

Look at `selector.matchLabels` terdapat penyocokan terhadap label dengan `app: nginx`. Yang artinya service baru itu akan menset deployment ke app dengan label `app: nginx`

### Expose service App

Untuk expose bisa menggunakan nodePort yang diterapkan pada yaml sebelumnya. Bisa juga menggunakan command interaktif

```bash
kubectl expose deployment/nginx-deployment --type="NodePort" --port 8080
```

Sekian laporan yang saya buat Hari ini, Terimakasih dan maaf bila terdapat kesalahan kata ataupun konsep didalamnya, mohon koreksinya
