+++
weight = 10
title = "PWL Dumper"
[taxonomies]
tags = ["c", "tools"]
+++

This is a port to Linux of PWLDump for DOS by Hard Wisdom.  
I was using this back in the dial-up days, to steal prepaid accounts from people who shared (via Samba) their system drive (C:) w/o password (which was somewhat normal back in the days of Win95/98).  
I had a fully automated scripts which will scan the few /24 networks (of my local ISPs) and if an open share is found, will automatically download the PWL files from \WINDOWS dir (I had to hack a bit the code of smbclient tool), then dump (decrpyt) the contents (user/pass) and store them in file, for me to inspect later.

{{ code_listing(path="/software/pwldump.c", hlang="c", use_listing=true) }}
