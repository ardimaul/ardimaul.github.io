---
layout: article
title: "[Day Six] Belajar Kubernetes"
author: Ardiansyah Maulana
tags: Kubernetes Linux
key: 20200620-day-three-learn-kubernetes
---
# Belajar Kubernetes hari ke-6

Saya sudah beralih menggunakan microk8s untuk menjalankan cluster.. Karena varian nya yang lebih ramah spek pc. Ada juga dengan k3s hanya saja belum mencobanya, ntah ringan yang mana namun k3s saat ini belum bisa multiple node lain hal dengan microk8s yang bisa melakukannya..

## Secrets

Kubernetes memiliki yang namanya manajemen terhadap password/secret itu sendiri. Menggunakan base64 sebagai encode/decode namun tidak dienkripsi, itu poin pertama kelemahannya. Poin kedua, secret ini bisa ditempatkan pada environment didalam pods atau mounting ke dalam volumenya.

Jadi begini, saya mendapat kecerahan lagi di stackoverflow.. Yang pada intinya menempatkan secret pada environment not recommended karena,

- Environment berjalan pada proses, bukan nggak mustahil hanya saja sulit dan ada kemungkinan untuk tracking access dan mendapatkan isi kontennya
- Umumnya hampir semua aplikasi mengambil semua environment yang ada lalu melaporkannya, ya tentu saja untuk debugging, reporting, dan sebagainya..
- Environment diturunkan kepada child process, bayangin ada aplikasi pihak ketiga mengambil environment yang tersedia. Ya karena namanya child process, akses privilegenya pun cilik..
- Sama seperti yang kedua, aplikasi crash grabbing environment dan ya secret bakal terpampang jelas dalam disk plain text
- Dan lainnya..

Pengetahuan tadi diambil dari sini `https://github.com/moby/moby/pull/9176#issuecomment-99542089` yang dapet rujukan dari stackoverflow comment pada diskusi ini `https://stackoverflow.com/questions/33621242/why-is-arg-in-a-dockerfile-not-recommended-for-passing-secrets`

Nah itu poin kelemahan kedua soal secret kubernetes tentang environment..

Ada lagi selain di passing ke pods sebagai environment, dapat juga dimount sebagai berupa file kedalam pods. Ya jadi key value secret bakal di mount didalam pods, ini nggak rekomendasi juga sih. Okelah kalau hanya 1 atau beberapa file alias password, tapi gimana kalau ada banyak? Bakal susah buat deteksi perubahan dan maintain passwordnya.. Sumber : `https://itnext.io/can-kubernetes-keep-a-secret-it-all-depends-what-tool-youre-using-498e5dee9c25`

Ya terlepas dari itu semua, ada solusi.. Seperti Sealed secrets, Helm secrets, Kamus, apalagi soal gitOps yang serba audit via git.. Jadi maksudnya untuk investigasi suatu isu produk jadi lebih mudah karena akan ada informasi soal siapa yang merubahnya, kapan, dan apa yang dirubahnya..

- https://github.com/zendesk/helm-secrets
- https://github.com/bitnami-labs/sealed-secrets

## Helm

Berfikir soal manajemen cluster sudah tentu itu namanya tugas container runtime. Tapi point yang dimaksud bukan soal maintain cluster, tapi lebih ke package manajemen, ya aplikasi dalam container disini dijadikan package. Meski hanya berupa gabungan write up konfigurasi manifes, tapi memang inilah package management seperti apt/yum/pacman dll..

Beberapa istilah dalam Helm..

- Chart, sekumpulan file yang isinya pre-configured resource aplikasi yang bakal di deploy ke kubernetes. Satu chart ini bisa mendeploy suatu app simple atau bahkan hal kompleks komplit sekalipun misalnya wordpress yang sepaket database, jenkins, dll
- Release, deployed package yang berada di kubernetes. Menariknya multiple release bisa aktif bersamaan dalam satu cluster yang sama, sebab ketika chart dideploy akan distempel suatu kode unik.

Helm repository merupakan hal yang opsional, maksudnya bisa memasang package secara offline begitu langsung dari filesystem. Jadi pipeline helm minimalis seperti ini, simple..

1. Clone git repository yang berisi chart
2. Deploy chart ke Kubernetes

## Praktik

Berhubung saya menggunakan microk8s, copy terlebih dahulu kube config ke local biar nggak cape" ketik microk8s diawal..

```bash
$ microk8s config > ~/.kube/config # Copy kubeconfig ke lokal
$ kubectl version --short # Verifikasi kubectl
```

Oh ya dalam hal ini, saya menggunakan helm v2, yang ada didalam microk8s. Sebab helm v3 merupakan major update, yang kayak `helm delete` opsi `--purge` dihilangkan, parameter `--name` di revamp pada `helm install`..

### Create Service Account dan ClusterRoleBinding

Ini supaya helm punya hak akses, dengan clusterrole `cluster-admin` seperti ngasih akses semacam admin/super-user yang punya akses ke seluruh resource kubernetes dalam semua namespace dalam cluster tentunya..

```bash
$ kubectl -n kube-system create serviceaccount tiller
$ kubectl create clusterrolebinding helm-tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
```

### Initialize Helm aka Deploy tiller

```bash
$ helm init --service-account tiller
```

Bisa di cek soal apa yang dideploy dengan ini..

```bash
$ kubectl get --all-namespaces deployment,serviceaccount,clusterrolebinding,pods,service | grep tiller
kube-system   deployment.apps/tiller-deploy         1/1     1            1           6h43m
kube-system       serviceaccount/tiller                                  1         6h47m
            clusterrolebinding.rbac.authorization.k8s.io/tiller                   ClusterRole/cluster-admin                        6h46m
kube-system   pod/tiller-deploy-84cfd9467d-gxrkk            1/1     Running   1          6h43m
kube-system   service/tiller-deploy          ClusterIP   10.152.183.90    <none>        44134/TCP   6h43m
```

### Initialize helm chart repository

```bash
$ helm repo add stable https://kubernetes-charts.storage.googleapis.com/
```

Dan beberapa command lainnya seperti,

```bash
$ helm repo update # Buat refresh list chart supaya fresh
$ helm search <some name> # Buat search package
$ helm inspect stable/jenkins # Buat nge inspect isi yaml configuration helm
```

Helm inspect berguna mengedit values sebelum dideploy, misalnya

```bash
$ helm inspect stable/jenkins > /tmp/jenkins.yaml
```

Kalau udah di edit, Lalu install dengan command ini

```bash
$ helm install --name jenkins-ci --values /tmp/jenkins.yaml stable/jenkins
```

Dan kalau mau hapus gunakan command ini..

```bash
$ helm delete --purge jenkins-ci
```

Fungsi purge buat menghapus record release dari resource itu, kalau tanpa purge bakal ada record releasenya yang sewaktu-waktu bisa di rollback.. Gone di helm v3 fungsi nya dijadikan default nggak perlu make parameter --purge lagi, mau rollback tinggal helm rollback.

Sekian dan terimagaji..
