+++
title = "Update on WebSDR"
date = 2023-10-27
[taxonomies]
tags = ["news", "ham", "sdr", "2023"]
+++

It's been a long time, since I've written here. I knew it is a doomed idea to make a blog.  
So here are some updates on the WebSDR.

WebSDR moved to new address, where I've prepared more WebSDRs for you to listen to.  
You will find them on <a href="https://varna.radio">varna.radio</a>. I will finish the site one day... :)   
There is also a database with all the repeaters in Bulgaria too. Me and LZ2DMV are maintaning the DB. It is hosted on the same site.  
You will find <a href="https://varna.radio/reps.json">the database</a> and <a href="https://varna.radio/reps.js">the JS library</a> which will help you with the DB also there.

For some time, I'm trying to make use of my free time, by contributing to <a href="https://github.com/luarvique/openwebrx">OpenWebRX+</a> project, maintained by Marat. I've integrated Leaflet with OpenStreetMaps to the project and I'm making the docker images and the RPi packages.  
You can read of how to install it <a href="https://luarvique.github.io/ppa/">here</a>, or you can use <a href="https://hub.docker.com/search?q=slechev%2Fopenwebrx">my docker images</a> or <a href="https://github.com/luarvique/openwebrx/releases/">the Raspberry Pi images</a>.

The WebSDR was upgraded too. I've replaced the RPi 4 with a TinyPC.  
A Lenovo with Intel Core-i5 and 4GB RAM.  
I needed more CPU power to be able to run all the background decoders.  
There are 3x RTL-SDR dongles and 1x RSP1 (original) receiver. One of the RTL dongles is for ADS-B reception only, because it has amplifier and filters for 1090mhz.  
The main RTL is coupled with Diamond X-300, the second RTL is coupled with Diamond X-50 and the ADS-B is with a home made antenna for 1090mhz. The SDRPlay RSP1 is coupled with Comet Discone DS-150S, which allows it to listen to the HF.

Now, let's see if it takes another 2 years to drop a line on this blog.

73, de LZ2SLL
