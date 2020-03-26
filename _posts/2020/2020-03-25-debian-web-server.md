---
layout: article
title: Eksperimen Web server pada Debian
author: Ardiansyah Maulana
tags: Linux
key: 20200325-debian-web-server
---
## Perkenalan Web Server
Web server adalah suatu server yang melayani web request. Chrome, Firefox dan UC Browser ialah contoh aplikasi yang meminta web request atau kita bisa menamainya dengan *Web Browser*.

Lalu bagaimana cara kerjanya?
Mula-mula, pada saat kalian mengetik alamat www.google.com pada kolom URL, perangkat kalian akan mencari alamat IP dari Domain tersebut (Contact DNS Server).

Setelah itu, barulah Web Browser melakukan kontak dengan alamat IP yang didapat, tentu saja dengan menggunakan layanan Web (HTTP/HTTPS). Terakhir, halaman Google akan tampil.

Sesimpel itu bukan? Iya simpel di sisi Web Browser (Client) namun rumit di sisi lainnya (Server) wkwk

Layanan Web menggunakan 2 protokol yakni HTTP dan HTTPS, perbedaannya hanya di keamanannya, S dibelakang berarti Safe/Secure yang artinya koneksi yang berjalan itu terenkripsi.

HTTP menggunakan protokol TCP dengan port 80, sedangkan HTTPS menggunakan protocol yang sama namun berbeda port yakni 443.

Ciri-ciri HTTPS yang terverifikasi atau sertifikatnya terdaftar akan terdapat tanda kunci hijau pada sebelah kiri/kanan URL tergantung Web Browser yang kalian digunakan.

Berbicara soal kerumitan server, saya akan membahas bagaimana caranya memasang web server pada Linux Debian. Untuk versi Debian yang saya gunakan ialah versi 10 (Buster).

Namun bukan mustahil juga untuk diterapkan pada Linux distro lainnya, yang berbeda hanyalah letak file atau command. Artinya untuk konsep ialah sama saja.

## Perkenalan Nginx dan Apache
Nginx adalah salah satu Web server handal yang diciptakan untuk mengatasi C10K problem pada masanya. C10K adalah tantangan bagi Web server untuk melayani 10 ribu koneksi secara bersamaan. Nginx dirilis pada tahun 2004 dan terbentuklah perusahaan pada tahun 2011.

Sedangkan Apache adalah Web server yang berpengalaman, karena dirilis pada tahun 1995. Web ini terkenal akan fitur yang lengkap dan konfigurasi yang friendly (mudah).

## Perbedaan Nginx dan Apache
Kedua web server ini tentunya memiliki kelebihan dan kekurangan nya masing-masing, oleh karena itu tentunya kedua software ini memiliki cara kerja yang berbeda. Perbedaannya sebagai berikut :

Jika Apache memiliki konsep kerja based on process, maka Nginx menggunakan konsep based on event. Apache based on process yang dimaksud ialah dia akan membuat proses/thread baru untuk pekerjaan baru.

Sedangkan Nginx tidak akan membuat proses/thread baru untuk pekerjaan baru karena proses/thread pertama masih dapat/mampu menjalankan pekerjaan tersebut.

Agar lebih mengerti mari buat analogi, Mula mula kita imajinasikan web server sebagai toko piza yang mancatat pesanan dari pelanggan melalui telepon (Request Web pages).

### Analogi cara kerja Apache
Toko piza ini mempekerjakan operator (proses/thread) untuk mengambil pesanan melalui telepon. Setiap operator hanya memiliki satu sambungan telepon.

Setelah operator selesai menerima pesanan, operator ini tetap dalam sambungan teleponnya sampai piza nya selesai dibuat dan memberitahu pelanggan bahwa piza sudah siap untuk diambil.

Artinya toko piza ini perlu mempekerjakan banyak operator sebanyak pesanan piza yang bisa disiapkan sekaligus, tujuannya untuk melayani semua pelanggan yang menelepon.

### Analogi cara kerja Nginx
Toko piza ini hanya memiliki satu operator, namun operator ini sudah terlatih untuk menutup telepon jika sudah menerima pesanan, dan menelepon pelanggan kembali jika piza sudah siap untuk diambil.

Sekarang, satu operator pun dapat menangani banyak pelanggan.

Humm, saya rasa sudah cukup teorinya. Mari lanjut ke Konfigurasi..

## Instalasi & Konfigurasi Nginx
Loginlah sebagai root supaya leluasa untuk mengatur hal-hal yang berkaitan dengan sistem. Lalu update repository dan Install paket Nginx
```
root@server:~# apt update && apt install -y nginx
```
Biasanya proses nginx akan otomatis berjalan dengan konfigurasi bawaan, coba lah verifikasi dengan mengakses alamat IP web server pada Web Browser  
![Verifikasi Nginx web server](/image/2020/2020-03-25-debian-web-server/Web-Nginx.png)

Untuk proses Nginx dapat diverifikasi dengan command berikut
```
root@server:~# systemctl status nginx
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2020-03-25 10:47:12 WIB; 11min ago
     Docs: man:nginx(8)
 Main PID: 1481 (nginx)
    Tasks: 2 (limit: 242)
   Memory: 11.6M
   CGroup: /system.slice/nginx.service
           ├─1481 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
           └─1482 nginx: worker process

Mar 25 10:47:10 server systemd[1]: Starting A high performance web server and a reverse proxy server...
Mar 25 10:47:12 server systemd[1]: nginx.service: Failed to parse PID from file /run/nginx.pid: Invalid argument
Mar 25 10:47:12 server systemd[1]: Started A high performance web server and a reverse proxy server.
```
Jika proses tersebut nonaktif, kalian bisa mengaktifkannya dengan command berikut
```
root@server:~# systemctl start nginx
```
Hmm rasanya kurang keren deh kalau mau mengakses situs menggunakan alamat IP, kenapa? Males hafalin deretan angka, ngga familiar banget. Oke, kita akan menggunakan domain dengan memasang DNS Server. Caranya? Oh.. Cek postingan lain, terpisah hehe

Setelah DNS terpasang, cobalah mengaksesnya dengan domain yang sudah didaftarkan  
![Ini Nginx](/image/2020/2020-03-25-debian-web-server/Verifikasi-Web-Nginx.png)
![Verifikasi Domain Web Nginx](/image/2020/2020-03-25-debian-web-server/Domain-Web-Nginx.png)  
Horee bisaaa

### Multi Site Nginx
Letak konfigurasi situs ada di */etc/nginx/sites-available/* dan jika ingin situs tersebut diaktifkan tinggal copy atau symlink ke direktori */etc/nginx/sites-enabled/*

Secara bawaan terdapat file bernama default, berisi konfigurasi situs bawaan. Sekarang tujuan kita ialah menambah situs tersebut dan mengaksesnya menggunakan domain yang berbeda.

Salin terlebih dahulu konfigurasi bawan untuk dijadikan konfigurasi situs 1 dan 2
```
root@server:~# for file in situs1 situs2 ; do cp /etc/nginx/sites-available/default /etc/nginx/sites-available/$file ; done
```
Lalu symlink konfigurasi situs 1 dan 2 ke direktori *sites-enabled*
```
root@server:~# for file in situs1 situs2 ; do ln -s /etc/nginx/sites-available/$file /etc/nginx/sites-enabled/$file ; done
```
Saatnya mengganti isi konfigurasinyaa
```
root@server:~# vim /etc/nginx/sites-enabled/situs1
```
Isi file nya kurang lebih seperti ini, ingat saya hanya menampilkan baris konfigurasi yang aktif saja. Baris konfigurasi yang terdapat tanda semicolon (;) tidak akan ditampilkan.
```
server {
	listen 80 default_server;
	listen [::]:80 default_server;
	root /var/www/html;
	
	index index.html index.htm;
	
	server_name _;
	
	location / {
		try_files $uri $uri/ =404;
	}
}
```
Yang perlu diganti ialah root dan server_name, sisanya opsional. Contoh isi konfigurasi situs 1 saya seperti ini
```
server {
	listen 80;
	listen [::]:80;
	root /var/www/html/situs1.ardimaul.id;
	
	index index.html index.htm;
	
	server_name situs1.ardimaul.id;
	
	location / {
		try_files $uri $uri/ =404;
	}
}
```
Jangan lupa, lakukan juga hal tersebut pada konfigurasi situs 2. Jika sudah, jangan lupa untuk salin file indeks bawaan ke direktori situs 1 dan situs 2
```
root@infosapu:~# cd /var/www/html
root@infosapu:/var/www/html# mkdir situs1.ardimaul.id situs2.ardimaul.id
root@infosapu:/var/www/html# for file in situs1 situs2 ; do cp index.nginx-debian.html $file.ardimaul.id/index.html ; done
```
```
root@infosapu:~# systemctl reload nginx
```
Kalian boleh mengubah isi index tersebut supaya lebih ganteng wkwk..

Sudah semua? Saatnya verifikasi dengan mengakses masing-masing domain.. Berikut hasil dari pekerjaan saya  
![Verifikasi Multi Site Nginx](/image/2020/2020-03-25-debian-web-server/Multi-Site-Nginx.png)
## Instalasi & Konfigurasi Apache
Lakukan update repository dan Install paket Apache dengan command ini
```
root@server:~# apt update && apt install -y apache2
```
Akan ada pemberitahuan bahwa Apache gagal aktif, wajar saja karena port 80 sudah ditempati Nginx sebelumnya.

Supaya Apache dapat berjalan, ganti port tersebut. Letak file konfigurasinya berada di */etc/apache2/ports.conf*. Berhubung Web saya tidak berniat menggunakan HTTPS maka port tersebut tidak saya otak atik, untuk itu cukup ganti port 80 tersebut, contoh seperti ini
```
Listen 8080

<IfModule ssl_module>
	Listen 443
</IfModule>

<IfModule mod_gnutls.c>
	Listen 443
</IfModule>
```
Aktifkan kembali proses Apachenya dengan command berikut,
```
root@server:~# systemctl start apache2
```
Sampai tahap ini seharusnya Web Server Apache kalian dapat diakses dengan alamat IP maupun domain, dengan catatan harus menggunakan port 8080. Berikut contohnya  
![Ini Apache](/image/2020/2020-03-25-debian-web-server/Verifikasi-Web-Apache.png)
![Verifikasi Apache web server](/image/2020/2020-03-25-debian-web-server/Apache-Web-Server.png)  
Sip bisa..

### Multi Site Apache
Hampir sama seperti Nginx, letak konfigurasi situs Apache berada di */etc/apache2/sites-available* dan jika ingin konfigurasi situs diaktifkan, tinggal copy atau symlink ke direktori */etc/apache2/sites-enabled*.

Mula-mula salin terlebih dahulu file konfigurasi bawaan untuk situs 3 dan 4
```
root@server:~# for file in situs3 situs4 ; do cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/$file.conf ; done
```
Lalu aktifkan konfigurasi yang sudah disalin, khusus Apache debian. Kita diberi kemudahan, tidak perlu menggunakan command *ln -s*, cukup dengan a2ensite (Mengaktifkan) dan a2dissite (Menonaktifkan).
```
root@server:~# a2ensite situs3.conf situs4.conf
```
Saatnya mengganti isi konfigurasinya..
```
root@server:~# vim /etc/apache2/sites-available/situs3.conf
```
Nah isinya akan seperti ini
```
<VirtualHost *:8080>
        #ServerName www.example.com

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
Cukup hilangkan comment (#) pada bagian ServerName dan ganti url menjadi domain milik kita, juga ganti parameter pada DocumentRoot. Sekiranya akan menjadi seperti ini
```
<VirtualHost *:8080>
        ServerName situs3.ardimaul.id

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html/situs3.ardimaul.id

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
Lakukan juga hal tersebut pada situs 4. Lalu salin file index bawaan ke direktori situs 3 dan 4.
```
root@infosapu:~# cd /var/www/html
root@infosapu:/var/www/html# mkdir situs3.ardimaul.id situs4.ardimaul.id
root@infosapu:/var/www/html# for file in situs3 situs4 ; do cp index.html $file.ardimaul.id/index.html ; done
```
```
root@infosapu:~# systemctl reload apache2
```
Seperti biasa, kalian dapat mengubah isi file index tersebut supaya lebih kece..

Jika sudah semua, silahkan verifikasi dengan membuka masing-masing domain pada web browser, ingat harus menggunakan port 8080.  
![Verifikasi Situs 3 Apache](/image/2020/2020-03-25-debian-web-server/Situs3-Apache.png)
![Verifikasi Situs 4 Apache](/image/2020/2020-03-25-debian-web-server/Situs4-Apache.png)
## Combine Nginx with Apache
Tujuan kita sebelumnya ialah memasang 2 situs pada 1 web server, tapi yang kita pasang pada server bukan hanya 1, melainkan 2 web server. Tujuan baru kita cukup menantang..

Bagaimana caranya kita mengakses situs 3 dan 4 menggunakan port 80?? Sedangkan port 80 sudah digunakan Nginx, nah loh..

Cukup simple sih sebenernya, dengan memanfaatkan teknik reverse proxy milik Nginx. Kita dapat merequest koneksi ke Nginx, lalu Nginx lah yang meneruskan ke Apache port 8080.

Sama ketika kita ingin menambahkan situs baru, kita harus menambahkan konfigurasi untuk situs 3 dan 4. Cukup ikuti langkah sebelumnya.
```
root@server:~# for file in situs3 situs4 ; do cp /etc/nginx/sites-available/default /etc/nginx/sites-available/$file ; done
```
Rubah isi file konfigurasi sehingga seperti ini,
```
server {
	listen 80;
	listen [::]:80;
		
	server_name situs3.ardimaul.id;
	
	location / {
		proxy_pass http://situs3.ardimaul.id:8080;
	}
}
```
```
root@server:~# systemctl reload nginx
```
Perihal root folder, index, dll itu tidak berguna. Karena fungsi nginx disini hanya meneruskan web server milik apache.. Sekiranya seperti itu.

Jangan lupa lakukan juga dengan situs 4, sudah semua? Lanjut, buka domain masing-masing.  
![Verifikasi Reverse Proxy](/image/2020/2020-03-25-debian-web-server/Situs3-reverse-proxy.png)
![Verifikasi Reverse Proxy](/image/2020/2020-03-25-debian-web-server/Situs4-reverse-proxy.png)  
Woah, it's works.. :D

Sumber? Oh tentu saja ada
- https://daverecycles.tumblr.com/post/3104767110/explain-event-driven-web-servers-to-your-grandma
- https://foxutech.com/apache-vs-nginx-architecture/
