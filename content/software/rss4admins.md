+++
weight = 10
title = "Generate RSS feed from your log files"
[taxonomies]
tags = ["perl", "tools", "admin"]
+++

Rss4admins is a daemon which will serve RSS feeds from your log files. Usefull to watch server logs from your news reader.
This software is probably dangerous, since it needs to run with root user. Use it behind VPN or Reverse Proxy (nginx) with basic auth at least.

{{ code_listing(path="/software/rss4admins.pl", lang="perl") }}
