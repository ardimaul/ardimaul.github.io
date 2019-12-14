---
layout: article
title: Wellcome Message pada Cisco IOS
author: Ardiansyah Maulana
tags: Cisco
key: 20191203-wellcome-message-cisco
---

Daripada Wellcome Message, di dunia Jaringan serta Server kita lebih mengenalnya dengan MOTD atau Message Of The Day. Sekumpulan pesan yang akan tampil pada saat kita ingin login.

Jadi begini
```
Router>enable
Router#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
Router(config)#banner motd z
Enter TEXT message.  End with the character 'z'.
Peringatan, Admin Only! z

Router(config)#
```

Masuk terlebih dahulu ke Global Configuration Mode, dan ketik command `banner motd z`. Huruf <span style="color:red">z</span> berfungsi untuk mengakhiri kalimat yang kita ketik pada Teks Message, bisa juga diganti dengan karakter lain. Setelah menulis pesan untuk MOTD, akhiri dengan karakter yang sudah ditentukan, misalnya saya menggunakan karakter <span style="color:red">z</span>, tidak masalah kita menulis huruf <span style="color:red">z</span> setelah spasi, enter, atau tanpa apapun.

Untuk verifikasi, kalian bisa keluar dari User exec Mode, dan masuk kembali. Maka akan ada pesan MOTD yang sudah kita buat sebelumnya.
```
Press RETURN to get started.

Peringatan, Admin Only! 

Router>
```

Atau bisa juga dengan melihat konfigurasi yang sudah kita buat
```
Router>enable
Router#show running-config | begin banner
banner motd ^C
Peringatan, Admin Only! ^C
!
!
```

Oke, jadi seperti itu. Terimakasih, semoga bermanfaat..
