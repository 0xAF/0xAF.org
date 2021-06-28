#!/usr/bin/perl
# Copyright (c) 2003 Stanislav Lechev [AngelFire].
# License: WTFPL
use strict;

# watch for new insert in mysql table
my $file='/usr/local/mysql3/data/database/table.MYD';

my $c=0;
my $o=0;
my $prog='';
my $skip1=0;
my $is1=1;

if ($#ARGV<0) {
        print "usage: $0 [-s] <prog> <prog_arg> <prog_arg>\n";
        print "    -s: skip 1st change (when $0 runs)\n\n";
        exit(1);
}

for (my $i=0; $i<=$#ARGV; $i++) {
        if (($i == 0) && ($ARGV[$i] =~ /^-s$/)) {
                $skip1++;
                next;
        }
        $prog.=$ARGV[$i]." ";
}

while (1) {
        $c=(stat($file))[7];
        if ($c != $o) {
                $o = $c;
                if ($skip1>0 and $is1>0) {
                        $is1=0;
                        next;
                }
                $is1=0;
                system($prog);
        }
        sleep(1);
}

