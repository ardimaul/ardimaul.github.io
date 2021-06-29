---
layout: article
title: "[Day Four] Belajar Kubernetes"
author: Ardiansyah Maulana
tags: Kubernetes Linux
key: 20200618-day-four-learn-kubernetes
---
# Belajar Kubernetes hari ke-4

## Pendahuluan Storage

Dalam kubernetes kita tidak bisa menempatkan file yang berhubungan dengan service didalam pods, karena pods bersifat mortal bisa down kapan aja. Terlebih lagi soal controller yang self healing (Auto restart pods ketika nggak sehat), karena pods yang bakal di mati hidup terus. Kita nggak bisa menempatkan file didalamnya, jelas ketika pods mati maka file pun hilang.

Controller hanya menjamin pods tetap hidup, soal konfigurasi server pun hilang untuk itulah dibuat ConfigMap. Dalam pods ada juga yang namanya template, jadi controller bakal merujuk ke template ini untuk meheal pods..

## Solusi

Untuk itulah kita butuh yang namanya penyimpanan independen, yang memiliki ruang lingkupnya sendiri. Hal ini bervariasi, mulai dari yang dapat tetap menyimpan file ketika deployment dihapus sampai ke mendelete file, ya berurusan dengan reclaim policy.

## Penyimpanan Independen

Perkenalkan, ini adalah persistent volume. Tempat dimana kita bisa membuat storage independen sendiri dan tentunya bisa diakses oleh tiap pods/node.. Ya meski itu nanti berhubungan dengan Acces mode.

Urutannya, kita membuat yang namanya

1. Persistent Volume, kita harus membuat ini terlebih dahulu sebagai sumber storage. Jadi langkah pertama, buat PV aka persistent volume.. bisa menggunakan yaml juga
2. Persistent Volume Claim, Harus buat ini karena untuk request nantinya ke PV, kubernetes bakal cek soal spesifikasi yang dibutuhin user udh cocok atau belum dengan PV yang tersedia, kalau cocok ya nyangkut, mulai dari hal kapasitas juga access mode,. Istilahnya kita claim PV dengan PVC ini. Bisa menggunakan yaml juga, ini langkah setelah PV
3. Mendefinisikan pod yang mau menggunakan PV via PVC. Pada ujungnya pvc nanti merujuk ke pv lagi, jadi pod bakal menggunakan sumber penyimpanan awal aka PV..

Dalam hal penetapannya, PV dan PVc menggunakan kedua hal ini,

1. Static, Buat PVc harus udah ada PV yang mau diklaim, namanya static.
2. Dynamic, Mau buat PVc nggak harus ada PV terlebih dahulu, tapi si admin harus mendefinisikan something bernama storageclass. Jadi automation ketika buat PVc..

Soal penyimpanan ini ada yang namanya Access Mode, ada 3 buah

1. Read Write Once (RWO), Cuma bisa read write ke satu node
2. Read Write Many (RWX), Kalau yang ini semua node bisa read write, ya misalnya pods yang berada dalam node yang berbeda bisa make ini kalau pengen sharing storage
3. Read Only (ROX), nggak peduli satu ada lebih node intinya mereka cuma bisa read..

Reclaim Policy,

1. Retain, ketika PVc dihapus PV masih akan ada dan dalam kondisi yang menyangkut ke PVc, maknanya tidak bisa diklaim oleh PVc lainnya.
2. Recycle, basis nya dia bakal menghapus isi direktori volume lalu PV nya bakal bisa diklaim lagi sama PVc baru ya didaur ulang PV nya. Tapi, hal ini udah usang, kubernetes ngerekomendasiin menggunakan dynamic provisioning.
3. Delete, ketika PVc dihapus maka PV serta isi didalam filenya juga bakal dihapus..

## Contoh Konfigurasi

### PV

Disini saya menggunakan hostPath..

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: web-pv
  labels:
    type: local #this is lable
spec:
  storageClassName: manual
  persistentVolumeReclaimPolicy: Delete
  capacity:
    storage: 1Gi #kapasitas yang disediakan pv
  accessModes:
    - ReadWriteOnce #mode aksesnya
  hostPath:
    path: "/tmp/bebas" #gunakan direktori /tmp untuk reclaim policy delete supaya bisa dihapus 
```
Sebenarnya bisa menggunakan direktori lainnya, dengan catatan direktori tersebut harus memiliki owner dan akses yang tepat (bisa di read write), karena bakal di mount di pods kan..

### PVc

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: web-pvc
spec:
  storageClassName: manual #harus sama dengan PV nya, karena ini termasuk spesifikasi yang ingin di klaim
  accessModes:
    - ReadWriteOnce #salah satu node mendapat akses read write
  resources:
    requests:
      storage: 100Mi #isi lebih kecil atau sama dengan dengan pv, lebih dari itu nggak bakal cocok
```

### Pods

```yaml
apiVersion: v1
kind: pod
metadata:
  name: nginx
spec:
  volumes:
  - name: host-volume
    persistentVolumeClaim:
      claimName: web-pvc
  containers:
  - image: nginx:alpine
    name: nginx
    volumeMounts:
    - name: host-volume
      mountPath: /var/www/html #path untuk dimount dalam pod
```

Ya pada intinya hostpath ini nggak recommended diskala produksi, karena sifatnya yang numpang di node..

Nah untuk itu saya mencoba nfs, simple sih cukup hapus bagian hostpath pada bagian PV dan ganti dengan ini,

```yaml
nfs:
  server: <ip server nfs> #sebelumnya buat nfs server terlebih dahulu
  path: "/srv/nfs/kubedata"
```

Untuk pvc semuanya sama termasuk dengan storageclassname nya..

Sekian dan terimagaji
