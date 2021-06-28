#!/usr/bin/perl
# Convert DOS Cyrillic to CP1251 and transcribe to Latin characters
# Year: 2001
# License: WTFPL

use strict;

print &cyr2latin(&dos2win($_)) while (<STDIN>);


# convert dos cyr to win cyr (cp1251)
sub dos2win($) {
	my @str = split (/(.)/, shift);
	my $ret;
	foreach (@str) {
		$_ = chr(ord($_) + 64) if ((ord($_) >= 128) and (ord($_) <= 192));
		$ret.=$_;
	}
	return ($ret);
}

# convert win cyr (cp1251) to latin letters
sub cyr2latin($) {
	my $what = shift;
	my %matrix;
	$matrix{'�'} = "a";
	$matrix{'�'} = "b";
	$matrix{'�'} = "v";
	$matrix{'�'} = "g";
	$matrix{'�'} = "d";
	$matrix{'�'} = "e";
	$matrix{'�'} = "zh";
	$matrix{'�'} = "z";
	$matrix{'�'} = "i";
	$matrix{'�'} = "j";
	$matrix{'�'} = "k";
	$matrix{'�'} = "l";
	$matrix{'�'} = "m";
	$matrix{'�'} = "n";
	$matrix{'�'} = "o";
	$matrix{'�'} = "p";
	$matrix{'�'} = "r";
	$matrix{'�'} = "s";
	$matrix{'�'} = "t";
	$matrix{'�'} = "u";
	$matrix{'�'} = "f";
	$matrix{'�'} = "h";
	$matrix{'�'} = "c";
	$matrix{'�'} = "ch";
	$matrix{'�'} = "sh";
	$matrix{'�'} = "sht";
	$matrix{'�'} = "y";
	$matrix{'�'} = "y";
	$matrix{'�'} = "yu";
	$matrix{'�'} = "ya";


	$matrix{'�'} = "A";
	$matrix{'�'} = "B";
	$matrix{'�'} = "V";
	$matrix{'�'} = "G";
	$matrix{'�'} = "D";
	$matrix{'�'} = "E";
	$matrix{'�'} = "ZH";
	$matrix{'�'} = "Z";
	$matrix{'�'} = "I";
	$matrix{'�'} = "J";
	$matrix{'�'} = "K";
	$matrix{'�'} = "L";
	$matrix{'�'} = "M";
	$matrix{'�'} = "N";
	$matrix{'�'} = "O";
	$matrix{'�'} = "P";
	$matrix{'�'} = "R";
	$matrix{'�'} = "S";
	$matrix{'�'} = "T";
	$matrix{'�'} = "U";
	$matrix{'�'} = "F";
	$matrix{'�'} = "H";
	$matrix{'�'} = "C";
	$matrix{'�'} = "CH";
	$matrix{'�'} = "SH";
	$matrix{'�'} = "SHT";
	$matrix{'�'} = "Y";
	$matrix{'�'} = "Y";
	$matrix{'�'} = "YU";
	$matrix{'�'} = "YA";

	$matrix{chr()} = $matrix{chr()} ? $matrix{chr()} : chr() for(0..255);

	$what =~ s/(.)/$matrix{$1}/g;
	return ($what);
}

