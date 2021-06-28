+++
weight = 10
title = "X25 NUA Scanner"
[taxonomies]
tags = ["c", "tools"]
+++

X25 NUA (Network User Address, it's the equivalent of IP address in TCP/IP network) Scanner. I was using this to find servers in X25 network (most of them were some antique VAX machines with nothing interesting in them).  
But back in the time of the BBSes with no (or very limited) access to Internet, I had a dial-up access to SprintNet (via local Post Office) and SITA (via local AirPort).  
From there I was able to connect to CompuServe (CIS), where they would allow me to create a new account (lasting 2-3 weeks) with a generated CreditCard number. After logging into their system, I was able to start a PPP session and get to the Internet. This scanner helped me in the later days to find other interesting NUAs, but I've never found anything interesting.
The `x25pad.autonet.net`, which is used as a gateway from the Internet to X25 network is not working anymore, so this peace of software is useless... 

{{ code_listing(path="/software/x25scan.c", lang="c") }}
