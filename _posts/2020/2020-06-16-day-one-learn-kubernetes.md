---
layout: article
title: Hari kedua Belajar Kubernetes
author: Ardiansyah Maulana
tags: Kubernetes Linux
key: 20200616-day-two-learn-kubernetes
---
## Day Two

### Sejarah

Pada mulanya Google membuat internal system bernama Borg yang kemudian berganti nama menjadi Omega. System ini yang membantu developer dan infra-manager untuk memanajemen ribuan server yang ada di Google.

Sebab pengalaman Google tentang penggunaan Container management system, pada tahun 2014 Google memperkenalkan system management open source bernama Kubernetes, ya.. berbekal pengalaman dari Borg, Omega, serta internal system lainnya.

Seiring dengan rilisnya Kubernetes point 1 pada tahun 2015, Google akhirnya bekerjasama dengan Linux Foundation untuk membentuk Cloud Native Computing Foundation (CNCF) dan menawarkan Kubernetes sebagai teknologi unggulan.

### Pengenalan Konsep

Kubernetes adalah system automation deployment, juga auto scaling, dan manajemen aplikasi berbasis container. Kubernetes merupakan Aplikasi atau System open source yang paling populer saat ini. 

Ketika kalian mendeploy kubernetes, kalian bakal mendapatkan sebuah cluster. Dalam cluster ada yang namanya pekerja (worker) alias node, ya setidaknya bakal ada 1 node yang bakal menjalankan aplikasi container.

### Cara Kerjanya Rumit tapi Simple

Cara kerja Kubernetes secara garis besar tidak terlalu rumit, dibuat simple karena ingin memudahkan proses development. Dibuat rumit logika kerjanya karena ingin kubernetes bekerja secara struktural dan terorganisir. Ya semoga paham lah..

Kita sudah menyebut soal cluster sebelumnya, Nah dalam cluster itu ada 2 komponen utama yakni Kubernetes Control plane dan Kubernetes Nodes. Kubernetes Control plane yang akan memanajemen cluster serta mengontrol node (worker).

Alurnya, kita membuat file konfigurasi berupa set-set yang bakal kita terapkan ke Kubernetes. Lalu di apply ke Kubernetes Control plane, dan ya kubernetes Control plane memerintah node untuk memasang aplikasi tersebut.

### Transisi Monolith ke Microservices

Jika ada sebuah aplikasi dimana fitur itu lengkap abis, multi fungsi, multi talenta.. Aplikasi itu disebut monolith. Monolith itu masa-masa lampau dimana 1 server bakal dipasang banyak fitur.

Sedang Microservices adalah pembagian service dalam skala kecil, jadi tiap-tiap service itu punya tugasnya masing-masing. Karena hal itu, service bakal lebih fokus dan otomatis penjalanan tugas bakal lebih baik.

Nah Microservices ini merupakan arsitektur fresh dalam dunia perteknologian kita saat ini. Muncul pertanyaan, gimana kalau tetiba production kita terdapat lonjakan usage yang besar? Simple, tinggal di perbanyak bukan servicenya.

Nah masalah itu bakal ribet kalau kita masih menggunakan Monolith, karena kita bakal instalasi OS terlebih dahulu mengkonfigurasinya lalu deploy aplikasi kedalamnya. Berbeda dengan Microservice yang menggunakan basis container sebagai wadah aplikasi.

### From Virtual Machine ke Container

Nah ini sempat disinggung tadi, pada awalnya ketika hanya ada aplikasi yang support di satu platform. Lalu ingin terhubung dengan aplikasi pada platform lainnya, apa yang bakal dilakuin? Masa iya, install 2 OS hanya untuk 2 aplikasi itu. Nope, ribet.

Saat ini hadir yang namanya Container, wadah untuk aplikasi tersebut. Sejatinya Container ini hanya menyediakan libraries yang dibutuhkan oleh aplikasi tersebut, jadi kita nggak perlu lagi install satu OS untuk satu aplikasi.

#### Imajinasi

Kita gunakan pengibaratan kendaraan, ada 2 aplikasi yang berbeda ruang lingkupnya sebut saja mobil yang berjalan di darat dan kapal yang wilayah teritorialnya di air. Kedua hal itu ingin saling terhubung, jadi kita hanya perlu membawa mobil itu diatas perahu bukan? Ya untuk berjumpa dengan kapal tentunya..

Maksudnya jika hanya mobil itu, kenapa harus membawa satu daratan kota kalau kita bisa menampung mobil itu di perahu wadah bernama Container. Nah begitu paham saya..

### Komponen dalam Kubernetes

Meski kelihatannya simple, Control plane yang memanage container juga mengatur node. Namun sebenarnya pihak Control plane juga Node memiliki anggota organisasi nya sendiri.

Kubernetes Control plane :

- Kube-apiserver, ini front end dari kubernetes control plane, berupa API
- etcd, ini untuk key backingan terkait data pada cluster
- Kube scheduler, soal node baru, juga penjadwalan node untuk dijalankan merupakan tugas dia
- Kube controller manager, Ini untuk mengontrol node yang berada pada datacenter fisik kita
- Cloud controller manager, kalau ini untuk mengatur node yang berada di cloud, seperti Amazon, Google cloud, dll

Kubernetes Node :

- Kubelet, bertugas buat memastikan kalau kontainer bener-bener berjalan didalam pods. Bakal mastiin soal spesifikasi pods terhadap container/aplikasi.
- Kube-proxy, hal ini yang mengatur arus jaringan ke node, soal load balancing yang misalnya terdapat container yang sama lebih dari 1 node. Kita juga dapat mengatur tentang siapa yang boleh keluar masuk  node disini
- Container runtime/manager, ya pastinya untuk menjalankan container. Seperti docker, containerd, CRI-O, dan lainnya. Jadi istilah bagusan mana antara docker dan kubernetes itu nggak bisa disandingkan, karena keduanya saling melengkapi. Kubernetes untuk automation, docker untuk containernya.

Sekian blogging yang saya buat Hari ini, Terimakasih dan maaf bila terdapat kesalahan kata ataupun konsep didalamnya..  
Semoga bermanfaatt
