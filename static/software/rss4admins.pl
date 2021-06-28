#!/usr/bin/perl
#
# rss4admins.pl:
# this script will generate rss feed from your (log) files.
# i'm using it to watch the log files of my servers with 
# rss reader (akregator)
#
# Author: Stanislav Lechev [AngelFire].
#     <af@0xAF.org> [initial date 26.Jul.2006]
#
# This script is Public Domain which means you can do
# whatever you want with it.
# Just remember... I take no responsibilities for what you do with the script
# or what the script can do to you !
#
# changelog:
# 2007.05.16 	small bugfix: read the last line of the file (which was missing)
#		added one more example channel in config file
#

my $rcsid = '$Id:$';

#use strict;
use HTTP::Daemon;
use HTTP::Status; # for RC_FORBIDDEN
use XML::RSS;
my $VER="2007.05.16";
my $config_file = "/etc/rss4admins.conf";

our %CHANS;

if (! -f $config_file) {
	printf "no config file found.\ngenerating from template.\n";
	open (CNF, ">$config_file") || die "cannot create config file '$config_file': $!";
	while (<DATA>) {
		print CNF $_;
	}
	close (CNF);
	printf "please edit '$config_file' now.\n";
	exit;
}

if ($ARGV[0] !~ /^\d+$/) {
	printf "usage:\n\t$0 PORT\n\n";
	exit;
}

%CHANS = parse_config($config_file);
$SIG{'HUP'} = 'sighandler';

my $daemon = HTTP::Daemon->new(LocalPort => $ARGV[0]) || die "no daemon sorry: $!";

# this while(1) is workaround...
# becouse any signal sent to the script will break the while of the daemon
# and the program exits
while (1) { 
while (my $conn = $daemon->accept) {
	my $remote_addr = $conn->peeraddr;
	my $remote_port = $conn->peerport;
	while (my $req = $conn->get_request) {
		my $match=0;
		if ($req->method eq 'GET') {
			foreach (keys(%CHANS)) {
				if ($req->url->path eq $CHANS{$_}{url}) {
					# found a match
					my $response = HTTP::Response->new(200);
					my $rss = generate_rss($CHANS{$_});
					$response->content($rss->as_string);
					$conn->send_response($response);
					$match++;
				}
			}
		}
		if (!$match) {
			$conn->send_error(RC_FORBIDDEN);
		}
	}
	$conn->close;
	undef($conn);
}
}

exit;

sub parse_config( $ )
{
	my $cf = shift;

	#local ($/, *CONF);
	local *CONF;
	my $conf;
	open (CONF, $cf) || die "no config file: $cf";
	while (<CONF>) {
		next if (/^\s*(#.*)?$/); #empty and comment lines
		$conf.=$_;
	}
	close(CONF);
	my %C;

	while ($conf =~ /channel\s*{\s*([^}]+)\s*}/i) {
		my $inner = $1;

		my ($name) = ($inner=~/name\s*=\s*"([^"]+)"/i);
		my ($url) = ($inner=~/url\s*=\s*"([^"]+)"/i);
		my ($file) = ($inner=~/file\s*=\s*"([^"]+)"/i);
		my ($filter) = ($inner=~/filter_out\s*=\s*"([^"]+)"/i);
		my ($logfile) = ($inner=~/logfile\s*=\s*"([^"]+)"/i);
		my ($limit) = ($inner=~/limit\s*=\s*"([^"]+)"/i);

		$C{$name} = {
			name => $name,
			url => $url,
			file => $file,
			filter => $filter,
			logfile => ($logfile=~/yes/i) ? 1 : 0,
			limit => $limit,
		};
		$conf =~ s/\s*channel\s*{[^}]+}\s*//i;
	}
	return %C;
}


sub generate_rss( % )
{
	my $e = shift;
	my %entry = %{$e};

	my $rss = new XML::RSS (version => '2.0');
	$rss->channel(
		title		=> "rss4admins: $entry{name}",
		#link		=> 'http://opensource.org',
		language	=> 'en',
		description	=> "rss feed on $entry{file}",
		copyright	=> "rss4admins v$VER. Author: Stanislav Lechev.",
	);

	$rss->image(title   => '0xAF.org',
		url         => 'http://0xAF.org/rss4admins.ico',
		link        => 'http://0xAF.org',
		width       => 88,
		height      => 31,
		description => 'rss4admins icon'
	);

	if (open (LOG, $entry{file})) {
		my @lines = <LOG>;
		close (LOG);
		my $startline = $#lines - ( $entry{limit} ? $entry{limit} : $#lines );
		$startline = 0 if ($startline < 0);

		for (my $i=$startline; $i<=$#lines; $i++) {
			$line = $lines[$i];
			next if ( eval {$line =~ /$entry{filter}/} );
			$line =~ s/\&/\&amp;/g;
			$line =~ s/\"/\&quot;/g;
			$line =~ s/\'/\&apos;/g;
			$line =~ s/\>/\&gt;/g;
			$line =~ s/\</\&lt;/g;
			my ($l,$m,$d,$t,$y);
			my $ol = $line;
			my($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = gmtime();
			my @abbr = qw( Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec );
			$m = $abbr[$mon];
			$d = $mday;
			$t = sprintf ("%02d:%02d:%02d", $hour, $min, $sec);
			$y = $year + 1900;
			if ($entry{logfile}) {
				($m, $d, $t) = ($line=~/^(\w+)\s+(\d+)\s+(\S+)/);
				$line=~s/^\S+\s+\S+\s+\S+\s+//g;
			}
			$rss->add_item(title => "$line",
				description => "$ol",
				guid => "$ol",
				pubDate => "$d $m $y $t",
			);
		}
	} else {
		my $line = "cannot parse log file $entry{file}: $!";
		$rss->add_item(title => "cannot parse the file",
			description => "$line",
			guid => "$line",
			pubDate => 'pubdate',
		);
	}
	return $rss;
}


sub sighandler {
	printf "Reloading config file $config_file\n";
	%CHANS = (); # empty the hash
	%CHANS = parse_config($config_file);
}


__END__
# config file for rss4admins.pl

# you should have entries like this:
#
# channel {
#	name		= "messages"
#	url		= "/messages"
#	file 		= "/var/log/messages"
#	filter_out 	= "cron\[\d+\]|imap(s)?|postfix\/smtpd"
#	limit		= "30"
#	logfile		= "yes"
# }
#
# name: name of the channel
# url: url to access this channel (in this case: http://host:port/messages)
# file: (log) file to read lines from
# filter_out: perl regex to filter some lines out
# limit: show only last # of lines (0 = nolimit)
# logfile: set to "yes" if this is system log file
#
# when done with the configuration you can start:
# ./rss4admins.pl <PORT>
#
# you can reload the config by sending -HUP signal to the script
#

channel {
	name		= "messages"
	url		= "/messages"
	file 		= "/var/log/messages"
	filter_out 	= "dont_want_this|and_this|and_this_too"
	logfile		= "yes"
	limit		= "30"
}

# here is what i use to parse my metalog files
# here is example of metalog line:
# May 16 17:30:01 [cron] (root) CMD (test -x /usr/sbin/run-crons && /usr/sbin/run-crons )

channel {
	name		= "systemlog"
	url		= "/syslog"
	file 		= "/var/log/everything/current"
	filter_out      = "\[named\]|\[cron\]|\[sm-mta\]|\[pluto\]|\[pop3d\]|\[courierd\]|\[imapd-ssl\]|Last output repeated|\[spamd\]|\[authdaemond\]|\[pop3d-ssl\]|\[postfix\/[^\]]+\]|\[amavis\]"
	logfile		= "yes"
	limit		= "30"
}


