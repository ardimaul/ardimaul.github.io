---
layout: article
title: "[Day One] Belajar Gitlab CI/CD"
author: Ardiansyah Maulana
tags: DevOps CI-CD
key: 20200621-day-one-learn-gitlab-ci-cd
---
# Belajar Gitlab CI/CD hari ke-1

## Pengenalan Konsep

### CI (Continous Integration)

Singkatnya CI ini adalah sistem manajemen code. Dengan mengintegrasikan antara code baru atau yang berubah dengan code yang sudah ada.

Kalau soal automation itu bukanlah point utamanya, maksudnya automation disini bertindak supaya tujuan utama dari CI itu tercapai. Ya seperti integritas antar code itu benar, nggak berantakan. Dibentuklah automation, supaya ketika kita merge code baru itu nggak berantakan dengan code yang udah ada, tetap membuat fitur yang lama jalan seperti biasanya.

CI ini contohnya seperti Github, Bitbucket, dan Ofc gitlab..

Bicara soal tugasnya, seperti ini lah kira-kira:

- Compile source code
- Testing code
- Auto generate documentation, ya contohnya kayak penambahan api baru
- Build Installer

### CD (Continous Deployment)

Ini adalah lanjutan dari CI, fungsinya supaya bisa tracking hal-hal apa yang udah berubah, misalnya kayak fitur baru, konfigurasi, bug fix, eksperimen. Dan tujuan utamanya, supaya ketika produk di deploy atau sampai ketangan user itu aman dan cepat dalam proses yang berkelanjutan atau berulang..

Contoh tugasnya kira-kira seperti ini:

- Publishing app ke store seperti app stores
- Deploying/updating kubernetes deployment
- Rilis ke platform lain, misalnya electron biar multi-platform

## Jobs dan Pipeline

Dalam Gitlab CI/CD kita punya 3 base utama,

### Jobs

Adalah sekumpulan perintah, dan jobs ini bakal dieksekusi secara berurutan. Jobs 1 lalu jobs 2 dan seterusnya. Ketika ada jobs yang berhenti, maka proses ci/cd pun berhenti artinya jobs selanjutnya nggak bakal dilanjutkan. Contoh jobs ini misalkan compile atau test code

### Stages

Stages itu kumpulan jobs, tugasnya lebih kearah kapan jobs bakal dijalankan. Karena dalam stages ini bakal ada 1 atau lebih jobs. Misalnya stages kita bakal test app, setelah stages compiling selesai. Sama dengan stages test bakal berhenti kalau stages compiling gagal.

Tiap stage dapat menjalankan image yang berbeda..

### Pipeline

Adalah alur bagaimana ketika awal code berubah sampai bisa ke tahap deployment. Biasanya dalam pipeline bakal terdapat 3 stages yakni pertama Build, kedua Testing dan ketika Deploy..

Maksudnya begini, ketika semua jobs dalam stages pertama sukses maka pipeline bakal lanjut ke stage kedua begitupun seterusnya maupun sebaliknya, misal stages pertama gagal.. Stages kedua nggak akan dilanjut.

Biasanya pipeline lanjutan itu bakal tereksekusi otomatis, namun ada saat dimana kita membuatnya manual. Seperti ketika ingin lanjut ke stages berikutnya harus kita confirm terlebih dahulu. Case nya, seperti kita deploy ke server testing lalu cek" dulu, kalau oke baru confirm untuk deploy ke server production..

### Arsitektur Deployment Gitlab CI/CD

1. Developer pull code yang berasal dari Gitlab
2. Setelah bersenang ria dengan codingan entah merubah atau menambahkan, developer melakukan push ke Gitlab
3. Kalau ada perubahan, Gitlab bakal ngelakuin building dan push ke Docker registry
4. Setelah berhasil, Gitlab bakal eksekusi kubernetes buat ngepull image dari docker registry dan deploy image terbaru
5. Kalau semuanya berhasil, maka container siap dijalankan..

Gitlab punya tempat untuk registri image juga, hanya saja saya mencobanya dengan docker hub registri..

## Gitlab Runner

Soal jobs ini yang tadi dijelaskan bakal dijalankan di Runner. Konsepnya begini, Runner dijalankan pada sisi server, tugas nya bakal ngejalanin tugas-tugas yang udah didefinisikan pada file `.gitlab-ci.yml` 

File itu berisi tentang 3 pion utama tadi, yakni soal jobs stage dan pipeline.

### Tipe - tipe Runner

- Shared

Ini untuk semua project, konsep satu untuk semua. Misalnya dalam 1 runner punya spesifikasi yang sama, bisa menggunakan runner ini untuk beberapa hal project. Misalnya khusus build docker image..

Karena ini tipe shared yang ngejalanin multiple project tentunya punya algoritma nya sendiri dalam memprioritaskan jobs.. Jadi seperti ini

- Job 1 for Project 1 = A
- Job 2 for Project 1 = B
- Job 3 for Project 1 = C
- Job 4 for Project 2 = D
- Job 5 for Project 2 = E
- Job 6 for Project 3 = F

(A) dijalankan pertama karena project 1 dan job 1, selanjutnya tidak lanjut ke jobs kedua (B) melainkan lanjut ke Project 2 Jobs 4 (D), lanjut ke project 3 jobs 6 (F) baru deh lanjut ke project 1 lagi tapi jobs 2 (B), lanjut ke (E), dan akhir lanjut ke (C)

Itu contoh pertama, ada contoh lainnya selengkapnya cek algoritma nya disini : `https://docs.gitlab.com/ee/ci/runners/#how-shared-runners-pick-jobs`

- Group

Ini untuk semua project yang berada dalam grup yang sama, menggunakan algoritma FIFO queue..

- Specific

Dan ini untuk ke spesifik project, hanya 1 runner untuk 1 project.

### Instalasi Runner pada Kubernetes

Untuk instalasi ini saya menggunakan helm v2, dan pastinya ada beberapa values yang diubah..

```bash
$ helm inspect values gitlab/gitlab-runner > /tmp/gitlab-runner.yaml
```

Mari edit filenya

```yaml
## Isi dengan gitlab server URL termasuk dengan protokolnya
gitlabUrl: https://gitlab.com
## Token yang sudah diberikan oleh gitlab
runnerRegistrationToken: "<isi dengan token>"
## Untuk membuat rbac, bisa juga tanpa ini tapi harus mendefinisikan service name account untuk hak akses tentunya
rbac:
  create: true
runners:
  ## Digunakan untuk base image default bagi service runner nanti, kalau image udah didefinisikan nggak bakal menggunakan base image ini
  image: ubuntu:16.04
  ## Ini merupakan sistem tagging, kita bisa menspesifikkan server runner yang ingin dijalankan dengan tag ini
  tags: "build,deploy"
  ## Ini untuk mendefinisikan apakah server bakal ngejalanin untagged stage, defaultnya true kalau tags nggak didefinisikan begitupun sebaliknya
  #runUntagged: true
  ## Untuk menjalankan docker kita butuh parameter ini, bisa disebut nested container seperti di lxd
  privileged: true
  ## secret ini berisi runner registration token milik kita, bakal di mount ke runner
  secret: gitlab-runner
  ## namespace untuk runner, saat install helm pastikan menggunakan parameter --namespace
  namespace: gitlab-runner
```

Kalau sudah mari lanjut install gitlab-runner nya, sebelumnya buat namespace `gitlab-runner` terlebih dahulu

```bash
$ kubectl create namespace gitlab-runner
$ helm install --name gitlab-runner --namespace gitlab-runner --values /tmp/gitlab-runner.yaml gitlab/gitlab-runner
```

> Permasalahan yang saya alami pas sesi ini, adalah ketika mengambil values tidak menggunakan 'helm inspect values' tapi langsung 'helm inspect'. Tanpa diketahui, saya pun kebingungan kenapa setelah didefinisikan values nya runner masih meminta token. Akhirnya paham setelah mendebug saat install dengan menggunakan parameter '--debug' pada helm install

Belum cukup, secara default rbac masih membutuhkan hak akses ke apiGroups ya untuk beberapa kasus tadi runner saya membutuhkannya, kalau tidak salah untuk mendefine secret. Ya memang defaultnya akses ke resources dan verbs bakal di isi dengan any ('*') tapi lain hal dengan apiGroups.. Untuk itu mari tambahkan aksesnya..

```bash
$ kubectl edit role gitlab-runner-gitlab-runner -n gitlab-runner
```

Edit pada value `apiGroups` menjadi seperti ini

```yaml
...
rules:
- apiGroups:
  - '*'
...
```
*Adegan ini hanya dilakukan di environment dev, jangan coba-coba kasih akses * (all) di rbac kubernetes production hoho

Oke, seharusnya gitlab-runner sudah terhubung dan tinggal menunggu sampai pada gitlab muncul runner.. Untuk mengecek ngecek status pods bisa dengan ini

```bash
$ watch "kubectl describe pods -n gitlab-runner | tail"
# Atau dengan ini untuk rollout status deployment nya
$ kubectl rollout status deploy gitlab-runner-gitlab-runner -n gitlab-runner
```
Selesai.. Tunggu dan gitlab runner siap dipakai  
Sekian dan terimagaji..
