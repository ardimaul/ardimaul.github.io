---
layout: article
title: Challenge System Engineer Junior
author: Ardiansyah Maulana
tags: Linux
key: 20200527-challenge-engineer-junior
---
## SYSTEMS AND SITES RELIABILITY ENGINEER HOMEWORK
 
## My Answer
As far I go with that challenges, Only this what can I do for this challenge..

### First,
I don't have CC so I can't get trial of VPS.. I'm just do this challenge with my Laptop 4GB Ram Intel i3 gen 2. I'm prefer KVM with Virtual machine manager for GUI in Linux OS.. I don't like VMware or Virtualbox.. (Vmware eating ram and Virtualbox not stable) so I don't use it.

This is my Virtual Machine detailed :
>- OS : Debian 10 with codename Buster
>- Total Physical Interfaces : 2 (NAT and Local to my PC)
>- Repository : Full Offline (I have 3 CDs of Debian, which i have download with my wifi schools) and mix some Online (For Docker repository)

### Second,
I install Docker and whatever packages who need for this challenges
I'm just following this [Docker Documentation](https://docs.docker.com/engine/install/debian/), and all about Docker installation is Done.

### Third,
I create an Docker Compose file with yml extension, Even for this I just follow this [Docker Compose Documentation](https://docs.docker.com/compose/compose-file/) and all is Done..

Oh btw, this is my Docker compose file,
```yaml
version: "3"
services:

    web:
        image: nginx:alpine
        deploy:
            restart_policy:
                condition: on-failure
                delay: 5s
                max_attempts: 3
        volumes:
            - ~/ambyarlur/ambyar-dir:/usr/share/nginx/html
            - ~/ambyarlur/nginxlogs:/var/log/nginx
        ports:
            - "8080:80"
```

Hmm I will explain it one by one
I follow this challenge to use alpine based, so I use it with nginx image and alpine tag
```yaml
        image: nginx:alpine
```
And other is my improv, In challenge I follow to start automatically container after reboot. So i do this,
```yaml
        deploy:
            restart_policy:
                condition: on-failure
                delay: 5s
                max_attempts: 3
```
But, on-failure mean the container will restart if the exit-code indicates an on-failure error. Delay mean, after container error, it will restart with delay 5 seconds. And max_attempts mean if machine cannot start the container after 3 attempts, the machine will surrend to start container again.. Default value is never surrender arrgh it will eating my thread and ram.

Oh, This is useful link of volume directory, so i do this..
```yaml
        volumes:
            - ~/ambyarlur/ambyar-dir:/usr/share/nginx/html
            - ~/ambyarlur/nginxlogs:/var/log/nginx
```
And of course to link between container port and host port,
```yaml
        ports:
            - "8080:80"
```

Finally after writing docker compose, we need to build up.. We need docker-compose command and yahh I follow this [Docker Compose Installation Documentation](https://docs.docker.com/compose/install/) to install it

Save the docker compose file as `docker-compose.yml`

And repeal this command in with bash wand.. Make sure docker compose file in that directory
```bash
root@ardi:~/ambyarlur# docker-compose up -d
```
And voila, it will run container from an image..

### Fourth, Let's code
The code is simple I mean, We only search of api that provide get IP Public of Client..

And this is my main html code,
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>What's your IP Address</title>
  <meta name="description" content="Dikala anda gabut">
  <meta name="author" content="Ardiansyah Maulana" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" media="screen" href="css/style.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js">
  </script>

<!-- Main script get client Address -->
  <script>
        $.getJSON("https://api.ipify.org/?format=json",
        function(data) {
            $(".ip").html(data.ip);
        })
  </script>
  
</head>
<body>

<!-- particles.js container -->
<div id="particles-js"></div>

<!-- particles.js script-->
<script src="particles.js"></script>
<script src="js/app.js"></script>

<div class=box>
  <span>
	<h1>Ardiansyah Maulana</h1><br>
	<p class=teks>IP Publik anda : <div class="ip teks"></div></p>
  </span>
</div>
</body>
</html>
```
The code is simple, I'm using ipify as api to get client address and assign it to html class so i can call it via html tag
```javascript
$.getJSON("https://api.ipify.org/?format=json",
function(data) {
	$(".ip").html(data.ip);
})
```
I save it as `ip` class html and call it via this element
```html
<div class=box>
  <span>
	<h1>Ardiansyah Maulana</h1><br>
	<p class=teks>IP Publik anda : <div class="ip teks"></div></p>
  </span>
</div>
```
And.. the other is my improv, I'm using particle js animation.. I found that in this <https://github.com/VincentGarreau/particles.js>

This is my preview of code.. <https://nyl6t.csb.app/>
Or you can open it in via this link.. <https://ardimaul.github.io/ambyarlur>, Don't forget to disable adblock if you counter error can't show ip address
### Last
Thanks for this pretest challenge, I'm glad to learn new things.. And sorry, I can't finish up this challenge
