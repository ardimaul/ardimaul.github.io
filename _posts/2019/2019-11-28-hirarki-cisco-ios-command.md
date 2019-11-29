---
layout: article
title: Hirarki Cisco IOS Command
author: Ardiansyah Maulana
tags: Cisco
key: 20191128-hirarki-cisco-ios-command
---

Jadi begini, Router sekelas Cisco ga mungkin dalam pengaksesan nya tidak dilengkapi fitur keamanan. Untuk itulah dipisah antara User Exec Mode dan Privileged Exec Mode. Bingung? Yak lanjut saja, tara..

Secara umum, Cisco membagi mode konfigurasi menjadi 2 akses level, yakni User Exec Mode dan Privileged Exec Mode. Akses utama (Administrator-sama) berada di Privileged Exec Mode, disana kalian bebas konfigurasi Router. Sudah tentu di kedua mode tersebut bisa dibuat password nya masing-masing ketika ingin login.

Nah dari Privileged Exec Mode kalian bisa mengakses semua mode turunannya lagi, ada 5 mode yakni : Global Configuration Mode, Interface Configuration Mode, SubInterface Configuration Mode, Router Configuration Mode dan Line Configuration Mode. Sebenernya di Privileged mode ini masih banyak turunan mode lainnya, cuma penulis sebut mode itu aja. Ngikut dokumentasi cisco aja wkwk..

Jadi kalau ditotal ada 7 mode ya, antara lain :

Router> | User Exec Mode
Router# | Privileged Exec Mode
Router(config)# | Global Configuration Mode
Router(config-if)# | Interface Configuration Mode
Router(config-subif)# | SubInterface Configuration Mode
Router(config-router)# | Router Configuration Mode
Router(config-line)# | Line Configuration Mode

**User Exec Mode**  
Muncul pada saat pertama kali kita login kedalam IOS Cisco. Dalam mode ini, kita hanya dapat melakukan perintah monitoring dasar. Kayak gini..
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
**Privileged Exec Mode**  
Masuk dari User Exec Mode dengan command *enable*
```
Router>enable
Router#
```
Isi command nya berisi debugging, verifikasi, dan monitoring advance. ini daftar command nya..
```
Router#?
Exec commands:
  <1-99>      Session number to resume
  auto        Exec level Automation
  clear       Reset functions
  clock       Manage the system clock
  configure   Enter configuration mode
  connect     Open a terminal connection
  copy        Copy from one file to another
  debug       Debugging functions (see also 'undebug')
  delete      Delete a file
  dir         List files on a filesystem
  disable     Turn off privileged commands
  disconnect  Disconnect an existing network connection
  enable      Turn on privileged commands
  erase       Erase a filesystem
  exit        Exit from the EXEC
  logout      Exit from the EXEC
 --more--
```
  
**Global Configuration Mode**  
Masuk dari Privileged Mode dengan perintah *configure terminal*,
```
Router>enable
Router#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
Router(config)#
```
Berisi command untuk konfigurasi Router secara menyeluruh.

**Interface Configuration Mode**  
Berisi konfigurasi untuk interface, contohnya menambahkan IP Address.
```
Router(config)#interface fa0/0
Router(config-if)#?
  arp                Set arp type (arpa, probe, snap) or timeout
  bandwidth          Set bandwidth informational parameter
  cdp                CDP interface subcommands
  channel-group      Add this interface to an Etherchannel group
  crypto             Encryption/Decryption commands
  custom-queue-list  Assign a custom queue list to an interface
  delay              Specify interface throughput delay
  description        Interface specific description
  duplex             Configure duplex operation.
  exit               Exit from interface configuration mode
  fair-queue         Enable Fair Queuing on an Interface
  hold-queue         Set hold queue depth
  ip                 Interface Internet Protocol config commands
  ipv6               IPv6 interface subcommands
  lldp               LLDP interface subcommands
  mac-address        Manually set interface MAC address
 --More-- 
```

**SubInterface Configuration Mode**  
Untuk membuat sub interface, berisi perintah seputar virtual interface seperti enkapsulasi dot1q dll.
```
Router(config)#interface fa0/0.10
Router(config-subif)#?
  arp            Set arp type (arpa, probe, snap) or timeout
  bandwidth      Set bandwidth informational parameter
  delay          Specify interface throughput delay
  description    Interface specific description
  encapsulation  Set encapsulation type for an interface
  exit           Exit from interface configuration mode
  ip             Interface Internet Protocol config commands
  ipv6           IPv6 interface subcommands
  mtu            Set the interface Maximum Transmission Unit (MTU)
  no             Negate a command or set its defaults
  shutdown       Shutdown the selected interface
  standby        HSRP interface configuration commands
```

**Router Configuration Mode**  
Untuk membuat dan konfigurasi routing dinamis, seperti bgp, ospf, rip dan eigrp.
```
Router(config)#router ospf 1
Router(config-router)#?
  area                   OSPF area parameters
  auto-cost              Calculate OSPF interface cost according to bandwidth
  default-information    Control distribution of default information
  distance               Define an administrative distance
  exit                   Exit from routing protocol configuration mode
  log-adjacency-changes  Log changes in adjacency state
  neighbor               Specify a neighbor router
  network                Enable routing on an IP network
  no                     Negate a command or set its defaults
  passive-interface      Suppress routing updates on an interface
  redistribute           Redistribute information from another routing protocol
  router-id              router-id for this OSPF process
```

**Line Configuration Mode**  
Tempat untuk menentukan siapa saja yang dapat mengakses command line, ntah itu ingin dispesifik siapa saja ataupun seberapa banyak yang boleh login.
```
Router(config)#line vty 0
Router(config-line)#?
Virtual Line configuration commands:
  access-class   Filter connections based on an IP access list
  accounting     Accounting parameters
  databits       Set number of data bits per character
  exec-timeout   Set the EXEC timeout
  exit           Exit from line configuration mode
  flowcontrol    Set the flow control
  history        Enable and control the command history function
  ipv6           IPv6 options
  logging        Modify message logging facilities
  login          Enable password checking
 --more--
```

Jika kalian ingin keluar dari spesifik mode (Global mode, Interface mode, dkk). Kalian dapat melakukan 3 cara :
- Dengan perintah **end**, akan keluar dan masuk kedalam Privileged Exec Mode
- Dengan perintah **exit**, akan keluar dan masuk ke 1 tingkat mode sebelumnya
- Key Combo **CTRL + Z**, sama fungsinya seperti command *end*

Oke, sekiranya seperti itu saja. Terimakasih..
