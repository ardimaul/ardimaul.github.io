---
layout: article
title: Keyboard Shortcut di IOS Cisco
author: Ardiansyah Maulana
tags: Cisco
key: 20191127-key-shortcut-cisco-ios
---

Kalian pernah ga si mau ngetik suatu command di cisco, eh malah typo. Ujung-ujungnya muncul kayak begini
```bash
Router>wkwk
Translating "wkwk"...domain server (255.255.255.255)
```
Kalau udah muncul kayak gitu ya cuma bisa nunggu, tapi ada caranya supaya command typo kita tidak di lookup ke domain server.. Ah salah, maksudnya kita mau mengakhiri proses translating cisco tersebut karena kalau ingin mendisable domain lookup ada caranya tersendiri hehe, cukup mudah dengan kombinasi **CTRL + SHIFT + 6**. Shortcut itu buat meng interrupt (memotong) Cisco IOS Process, jadi bisa juga kalau kita ingin memberhentikan proses traceroute, ping atau lainnya. Kondisional deh..

Nah untuk keyboard shortcut Cisco IOS ini banyak sih.. Cuma saya bakal ngasih tau yang saya tau aja hehe

**TAB** = Untuk melengkapi command yang kita ketik separuh, misal nih cuma ngetik `int` habis itu klik tombol TAB, pasti command itu bakal jadi lengkap kayak gini contohnya
```bash
Router(config)#int
Router(config)#interface
```
**CTRL + E** = Memindahkan kursor ke paling akhir  
**CTRL + A** = Memindahkan kursor ke paling awal  
**CTRL + K** = Menghapus karakter mulai dari kursor sampai karakter paling akhir  
**CTRL + X** = Menghapus karakter mulai dari kursor sampai karakter paling awal  
**CTRL + D** = Fungsinya sama kayak tombol DEL, lebih tepatnya penggantinya sih..  
**CTRL + W** = Menghapus kata per kata, cocok buat typo user xD  
**CTRL + Z** = Keluar config mode, balik ke Privileged exec mode

Nah kalau mau nge list command apa aja yang ada di mode konfigurasi itu, bisa menekan tombol **?**, bakal terjadi kayak gini. Jreng..
```
Router>?
Exec commands:
  <1-99>      Session number to resume
  connect     Open a terminal connection
  disable     Turn off privileged commands
  disconnect  Disconnect an existing network connection
  enable      Turn on privileged commands
  exit        Exit from the EXEC
  logout      Exit from the EXEC
  ping        Send echo messages
  resume      Resume an active network connection
  show        Show running system information
  ssh         Open a secure shell client connection
  telnet      Open a telnet connection
  terminal    Set terminal line parameters
  traceroute  Trace route to destination
  ```
  
Udah ya, besok lagi. Oke.. sekian terimakasih dan semoga berguna buat catetan xD

Sumber :  
- <https://www.ciscozine.com/cisco-ios-keyboard-shortcuts/>
