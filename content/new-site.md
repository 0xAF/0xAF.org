+++
title = "New Site"
date = 2021-06-27
[taxonomies]
tags = ["news", "zola", "2021"]
+++

It's been 10 years or so...  
Eventually I've decided to make a new site.  
Mostly because I had to move to a new server.  
The old one served a good 7 years and 9 months without even a single problem.  
No reboots, no power failures, no hardware failures, nothing... Just updates... Not to the kernel and PVE (Proxmox Virtual Environment) obviously.  
But there was more.  
The old site was a Perl CGI script, which I've wrote many years ago and haven't touched since then. If it works, don't break it. And on the new server I'm running Nginx, so I was too lazy to do the fastcgi/fcgiwrap configuration only to run my old site.  
For long time now, I wanted to use something simple for the site. To ease me as much as possible.  
So I ended up with [Zola](https://getzola.org). A static site generator, which seems to be what I need. Simple and yet advanced enough.  
And in the end, I found that I can easily put the site in CloudFlare Pages... so it turns out I dont need my server for that either.

Here is an uptime, which is not seen everyday.
{{ image(src="/pmox.itc.bg.png") }}
{{ image(src="/pmox.itc.bg.pve.png") }}
