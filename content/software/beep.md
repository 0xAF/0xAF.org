+++
weight = 10
title = "Beep your PC Speaker with series of tones/melody"
[taxonomies]
tags = ["c", "tools"]
+++

Beeps/tones from your PC Speaker. You can play simple melodies.  
`./beep Khz/msecs [Khz/msecs]`  
The first download uses the input system of the kernel, hence should work always.  
The second download uses the TTY output and will probably work only on linux TTY, not in terminal emulator (xterm and alike).

 - [Download](/software/beep.tar.bz2) (this one uses the input system of the kernel)
{{ code_listing(path="/software/beep_tty.c", lang="c", download_comment="(This one uses the console/tty)") }}
