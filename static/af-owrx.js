// This JS will add some features to OpenWebRx WebSDR.
// You can enable the script by adding this line into "Photo description" text field in General Settings.
// <script src="https://0xaf.org/af-owrx.js"></script>
//
// The script will add some help texts in the Settings menus.
//
// Copyright (C) 2022, Stanislav Lechev.
// License: WTFPL
//


var bookmark_add_on_click;
window.idle_client_timeout_in_minutes = window.idle_client_timeout_in_minutes || 30;
//window.sdr_url
//window.sdr_title
//window.clustrmaps_id

// add basic client tracking (Firefox will block it by default I think)
document.addEventListener("DOMContentLoaded", function(){
	// add cluster maps tracking
	if (typeof window.clustrmaps_id !== 'undefined' && window.clustrmaps_id.length) {
		var cmscr = document.createElement('script');
		cmscr.setAttribute('src','//clustrmaps.com/map_v2.js?d='+window.clustrmaps_id+'&cl=ffffff&w=a&t=t');
		cmscr.setAttribute('id', 'clustrmaps');
		cmscr.setAttribute('target', '_blank');
		var a = document.getElementById("openwebrx-panel-log");
		if (a) a.appendChild(cmscr);
	}

	var a = document.querySelector('.settings-body .removable-item > input[placeholder="Device name"]');
	if (a) a.insertAdjacentHTML("afterend", "<small class='af-help'><b>AF:</b> If you want to hide the device name from profiles, put '<b>[-]</b>' in front of the name (square brackets with minus inside).</small>");

	var a = document.querySelector('.settings-body .removable-item > input[placeholder="Receiver name"]');
	if (a) a.insertAdjacentHTML("afterend", "<small class='af-help'><b>AF:</b> If you want to to disable profile changing for guest users (not logged in), put '<b>[-]</b>' in front of the name (square brackets with minus inside).</small>");

	var a = document.querySelector('div[data-field="photo_desc"] > div > div > textarea');
	if (a) a.insertAdjacentHTML("afterend", "<small class='af-help'>"+
		"<b>AF:</b> Guests will be disconnected after 30 minutes of inactivity. "+
		"To change the timeout, add this text in the 'Photo description' and change to appropriate time.<br>"+
		"<code> &lt;script&gt; window.idle_client_timeout_in_minutes = 30; &lt;/script&gt; </code><hr>"+
		"If you want to track users with <a href='https://clustrmaps.com' target='_blank'>Clustrmaps</a>, register an account, "+
		"create new widget and take the <b>id</b> from the link of the widget (should be the <b>d=</b> parameter of the url). "+
		"Then add this script to the 'Photo description'.<br>"+
		"<code> &lt;script&gt; window.clustrmaps_id = 'xxx_replace_with_real_id_xxx'; &lt;/script&gt; </code><hr>"+
		"If you want to change the logo url and title (upper left 'OpenWebRX' logo), add this script to the 'Photo description'.<br>"+
		"<code> &lt;script&gt; window.sdr_url = '//sdr.0xaf.org/';<br>window.sdr_title = 'SDR in Varna, Bulgaria'; &lt;/script&gt;</code><hr>"+
		"</small>");

	var a = document.querySelector('.settings-body .removable-item > input[placeholder="Profile name"]');
	if (a) a.insertAdjacentHTML("afterend", "<small class='af-help'><b>AF:</b> If you want to hide this profile from guest users (not logged in), put '<b>[-]</b>' somewhere in the name (square brackets with minus inside).</small>");


	var a = document.querySelector('.bookmark-add');
	if (a) a.addEventListener("click", function(e) {
		setTimeout(function () {
			var name = document.querySelector('tr[data-id="new"] > .name > input');
			if (name) {
				name.insertAdjacentHTML("afterend", "<br><small class='af-help'><b>AF:</b> Use '<b>:</b>' (colon) to separate the bookmark name on 2 lines.</small>");
			}
			var freq = document.querySelector('tr[data-id="new"] > .frequency > div > div > select');
			freq.value="6";
		}, 100);

	});

	// change the logo link to point to the sdr page instead of the project page
	if (typeof window.sdr_url !== 'undefined' && window.sdr_url.length) {
		document.querySelector(".webrx-top-bar > a").setAttribute("href", window.sdr_url);
	}
	if (typeof window.sdr_title !== 'undefined' && window.sdr_title.length) {
		document.querySelector(".webrx-top-bar > a > svg > title").innerHTML = window.sdr_title;
	}


	rework_bookmarks();
	rework_profiles();
});


// remove the annoying "under development" message
var style = document.createElement('style');
style.innerHTML = `
[data-panel-name="client-under-devel"] {
	display: none;
}
#openwebrx-bookmarks-container .bookmark {
	max-height: none;
	text-align: center;
}
.webrx-top-bar {
	height: 5rem;
}
.af-help {
	background: #111;
	color: tomato;
	width: 100%;
	padding: 0.25rem;
	border: 1px dashed orange;
	display: block;
}
.af-help>b {
	color: violet;
}
.receiver-info-in-title {
	background: rgba(0,0,0,0.25);
	padding: 0.25rem;
	display: inline-block;
	border-radius: 0.5rem;
}
`;
document.head.appendChild(style);

function is_logged() {
	var z = getCookie('owrx-session');
	if (z && z.length) return true;
	return false;
}

function getCookie(name) {
	  const value = `; ${document.cookie}`;
	  const parts = value.split(`; ${name}=`);
	  if (parts.length === 2) return parts.pop().split(';').shift();
}

// automatic logout in 30 minutes of inactivity (unless user is logged in)
var timeout;
function logout() {
	if (is_logged()) {
		return;
	}
	//location.href = 'https://0xAF.org';
	ws.close();
	for (var i = 0 ; i < 100 ; i++) { clearTimeout(i); clearInterval(i); }
	document.querySelector('body').innerHTML = `
<style> body { background: black; color: white; } </style>

<br><br><br><br><br>
<center>
You have been logged out for being idle.<br>
Please do not take the client slot forever.<br>
Give others a chance to use the SDR.<br>
<br>
<a href="https://sdr.0xaf.org/">Reload</a>
</center>
`;
}

function resetTimer() {
	clearTimeout(timeout);
	timeout = setTimeout(logout, window.idle_client_timeout_in_minutes * 60 * 1000);
}
window.addEventListener('load', resetTimer, true);
var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
events.forEach(function(name) { document.addEventListener(name, resetTimer, true); });


// rework the bookmarks a bit...
function rework_bookmarks() {
	if (typeof bookmarks !== 'undefined' && bookmarks
	&& bookmarks.bookmarks
	&& bookmarks.bookmarks.server
	&& bookmarks.bookmarks.server.length > 0
	&& bookmarks.bookmarks.server[bookmarks.bookmarks.server.length - 1].source != "final"
	) {
		// bookmarks are loaded
		bookmarks.bookmarks.server.forEach(function(b) {
			b.name = b.name.replace(':', "<br>");
		});
		// add marker to signal the next calls to not rework again
		bookmarks.bookmarks.server.push({
			name: '',
			frequency: 0,
			modulation: '',
			source: 'final',
			editable: false
		});
		bookmarks.render(); // re-render the bookmarks
	}
	setTimeout(rework_bookmarks, 50);
}

function rework_profiles() {
	is_logged();
	var select = document.getElementById("openwebrx-sdr-profiles-listbox");
	if (select && select.options && select.options.length > 0) {
		// disable changing of profiles
		select.onchange = function(event) {
			if (document.querySelector(".webrx-rx-title").innerHTML.indexOf("[-]") !== -1) {
				if (is_logged()) {
					sdr_profile_changed();
					return true;
				} else {
					alert("Changing the profile has been disabled by the SDR Operator.");
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
			} else {
				sdr_profile_changed();
			}
		};

		// remove private profiles for non-logged users
		for (var i=0; i< select.options.length; i++) {
			select.options[i].text = select.options[i].text.replace(/^\[-]\s+/, '');
			if ( !is_logged() && 
				(
					select.options[i].value.indexOf("[-]") !== -1 
					|| select.options[i].text.indexOf("[-]") !== -1
				)
			) {
				select.options[i].hidden = true;
			}
		}
	} else {
		setTimeout(rework_profiles, 50);
	}
}


