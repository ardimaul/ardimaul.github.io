---
layout: article
title: "[Day Three] Belajar Kubernetes"
author: Ardiansyah Maulana
tags: Kubernetes Linux
key: 20200617-day-three-learn-kubernetes
---
## Pods

Pods adalah layer abstrak yang dibuat kubernetes, karena didalam pods akan terdapat 1 atau lebih container/aplikasi. Pods itu tempat dimana sharing storage, network, serta resource ke container ke container lain yang masih dalam 1 pods yang sama.

Menambahkan Pods

Buat konfigurasi file dengan kind pods,

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    environment: dev
    version: 1.19.0-alpine
  annotations:
    description: This is Nginx with alpine based
spec:
  containers:
    - name: nginx
      image: nginx:alpine
      ports:
        - containerPort: 80
```

Dan apply seperti biasa,

```yaml
kubectl apply -f nginx-pods.yaml
```

Lalu apa bedanya kind Pods dan Deployment, merujuk pada forum stackoverflow tentang pembahasan perbedaan keduanya [disini](https://stackoverflow.com/questions/41325087/what-is-the-difference-between-a-pod-and-a-deployment)

Saya menyimpulkan,

1. Dalam skala produksi, menggunakan object kind pods hampir tidak akan pernah, sebab tidak akan bertanggung jawab jika pods itu hilang. Ya kita butuh object kind seperti Deployment, replication controller, atau replicaset supaya pods itu tetap hidup meski jatuh karena bakal direplikasi
2. Kita membutuhkan yang namanya service object, karena pods dalam deployment dapat hilang, ntah itu diskala kecilkan atau diperbanyak. Yang pada pastinya, kita tidak bisa mengandalkan IP Addressnya karena tidaklah tetap. Jadi kita membutuhkan yang namanya service kepada pods untuk IP yang tetap (VirtualIP)
3. Oke pada intinya, object kind pods cocok digunakan untuk skala developer sekedar untuk membuat aplikasi jangka pendek, maupun pembelajaran. Sedangkan untuk skala produksi, lebih cocok menggunakan object kind Deployment dikarenakan lebih bertanggung jawab bisa dimonitoring, maintenance, verifikasi konfigurasi, dan pastinya memastikan bahwa hal-hal yang diatur Deployment itu benar-benar ada.
4. Deployment dapat di rollout atau rollback, bahasa sayanya undo redo.

## Pods Networking

Konsep docker begini, container dapat terhubung dengan lainnya jika berada pada satu mesin yang sama. Kalau container pengen kehubung dengan kontainer lain diluar mesin, container A ini harus mendaftarkan port nya ke mesin A lalu memforward atau proxy ke mesin B lalu ke Container B.

Maknanya mereka harus mengkordinasikan port mana yang bakal digunain, harus secara cermat karena port akan dialokasikan terus secara dinamis.

Mengkordinasikan port sebanyak itu bakalan susah kalau ditambah scaling ntah itu diperkecil atau diperbanyak. Oleh karena itu kubernetes menyediakan setiap pod nya clusterIP jadi kita nggak perlu lagi memetakan port kedalam node port. Ya setiap kontainer dalam 1 pod dapat berkomunikasi dengan localhost via port, juga container dalam cluster yang sama tidak perlu berkomunikasi menggunakan NAT.

## Service

### Service dengan selector

Contoh service dengan selector,

```yaml
apiVersion: v1
kind: Service
metadata:
  name: php
  labels:
    tier: backend
spec:
  selector:
    app: php
    tier: backend
  ports:
  - protocol: TCP
    port: 9000
```

### Service tanpa Selector

Sama, cuma nggak make selector, dan endpoints harus didefinisikan manual. Ntahlah, untuk apa service tanpa selector ini, sebab endpoint kan ip pods yang nggak selalu tetap.

### Multiport Services

```yaml
...
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 9376
  - name: https
    protocol: TCP
    port: 443
    targetPort: 9377
```

### Tipe NodePort

Port container yang dipasang ke node, range nya diatas 30000 sampai 32767

### Type LoadBalancer

Begini contohnya,

```yaml
spec:
  selector:
    app: MyApp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
  clusterIP: 10.0.171.239
  loadBalancerIP: 78.11.24.19
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 146.148.47.155
```

Untuk mekanisme loadBalancernya bergantung pada cloud provider yang digunakan.

## Volume

Ada PV (Persistent Volume), Kita harus membuat ini dulu, langkah pertama karena hal ini yang bakal dijadikan sumber daya volume.

Ada juga PVC (Peresistent Volume Claim), Hal kedua yang harus dibuat karena sumber daya harus memiliki perizinan klaim atas volume yang sudah dibuat..

## Ingress

Ingin loadbalancer, SSL, juga menyatukan service yang berbeda, Ingress adalah solusinya. Dia bisa memanajemen terhadap namespace yang berbeda.


### Penutupan

Ya begitulah blog kali ini, semoga bermanfaat
