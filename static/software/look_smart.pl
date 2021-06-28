#!/usr/bin/perl
#use Modern::Perl;
use autodie;

#
# look_smart.pl:
#
# Copyright (c) 2005 Stanislav Lechev [AngelFire].
#     <af@0xAF.org> [initial date 19.May.2005]
#
# 2017-01-16: Reworked to use Modern::Perl
#
# Released under GPLv2.
#
# note:
#  this little proggie is to make your pc look smart ...
#  it looks like an FBI tracking program.
#  it was inspired from one program called MTRXP by
#  "The Entity Known As MikeeUSA" as he says.
#


use Term::ANSIColor qw(:constants);
use Time::HiRes qw(usleep);

print RESET;

my ($randbits, $zip, $ip, $lines, $rand);


my $head=YELLOW.qq(
+--------+-------+------------+-------+----------+------+---------------+
|  BITS  |       |   PHONE    |       |   ZIP    |      |  IP ADDRESS   |
+--------+-------+------------+-------+----------+------+---------------+
).RESET;

format STDOUT =
 @<<<<<<<         @0# @0# @0##         @|   @0###        @>>>>>>>>>>>>>> 
$randbits, rand(999), rand(999), rand(9999), $zip, rand(99999), $ip
.

my @ZIP_CHARS = ('A'..'Z');

&rotate(100, CLS()."\n\n\ninitializing the system ... please stand by ... .");
print BOLD.RED."\n\n\n... tracking ...\n".RESET;
print $head;

while(++$lines) {
	$rand=int(rand(750000));
	$randbits='';
	# lets see which bits are set... (any simpler way to get the bits ?)
	$randbits.= (($rand & (2**$_)) ? "1" : "0") for (0..7);
	$randbits.=RESET;

	$zip=$ZIP_CHARS[rand(@ZIP_CHARS)] . $ZIP_CHARS[rand(@ZIP_CHARS)];
	$ip=sprintf("%d.%d.%d.%d", rand(220)+3, rand(255), rand(255), rand(255));
	print BOLD unless ($rand % 56);
	print GREEN;
	write;
	print RESET;
	unless ($rand % 56) {
		print BOLD.BLUE."    Data:         ".BOLD.YELLOW;
		print usleep(10000) ? (sprintf ("0x%X%s", (int(rand(240)) + 16), (($_ % 8) ? " " :
			"\n                  "))) : "" for (1..32);
	}
	print RESET."\r";
	&rotate(50, "\n".BOLD.RED.
		"loosing this track. recalculating to find new one ... ".
		RESET.".", "\n$head") unless ($lines % (rand(100)+5));
	usleep(150000+$rand);
}



sub CLS { "\e[2J\e[0H"; };

sub rotate {
	my $times=shift;
	my @ROTATE = ('-', '\\', '|', '/');
	# unbuffer the output
	$|=1;
	print shift;
	print usleep(rand(100000)) ? ("\x08".$ROTATE[($_ & 3)]) : '' for (0..$times);
	print shift || '';
}

