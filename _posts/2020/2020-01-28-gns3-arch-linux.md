---
layout: article
title: Instalasi GNS3 pada Arch Linux
author: Ardiansyah Maulana
tags: Linux
key: 20200128-gns3-arch-linux
---

## Build Package Management
Disini saya menggunakan pamac untuk Package Management AUR nya, banyak kok alternatif lain, seperti yay misalnya.. AUR kepanjangan dari Advanced User Repository, isinya source code milik user dan diharuskan mem build untuk memasangnya, pokoknya buatan advance user deh..
### Install alat-alat
```bash
sudo pamac -Syyu base-devel git
```
### Install Pamac
```bash
cd /tmp
git clone https://aur.archlinux.org/pamac-aur.git
cd pamac-aur
makepkg -si
```
Selesai pada tahap ini, secara teori pamac sudah terpasang.

## Install GNS3
Langsung aja install GNS3 nyaa
```bash
pamac build gns3-server gns3-gui
```
Dan ini untuk install alat-alat tambahan seperti Qemu, Dynamips, dll.
```bash
sudo pacman -S qemu
```
```bash
pamac build vpcs ubridge iouyap dynamips
```
Oke, instalasi selesai. Ada kendala? Kolom komentar terbuka luas selebar besarnya :D
