// This JS will add some features to OpenWebRx WebSDR.
// You can enable the script by adding this line into "Photo description" text field in General Settings.
// <script src="https://0xaf.org/af-owrx.js"></script>
//
// The script will add some help texts in the Settings menus.
//
// Copyright (C) 2022, Stanislav Lechev.
// License: WTFPL

var af_owrx_version = '2022-02-21';

var bookmark_add_on_click;
window.idle_client_timeout_in_minutes = window.idle_client_timeout_in_minutes || 30;
window.import_bookmarks_from_af = window.import_bookmarks_from_af || 0;
//window.sdr_url
//window.sdr_title
//window.clustrmaps_id

// add basic client tracking (Firefox will block it by default I think)
document.addEventListener("DOMContentLoaded", function () {
  // add cluster maps tracking
  if (typeof window.clustrmaps_id !== 'undefined' && window.clustrmaps_id.length) {
    var cmscr = document.createElement('script');
    cmscr.setAttribute('src', '//clustrmaps.com/map_v2.js?d=' + window.clustrmaps_id +
      '&cl=ffffff&w=a&t=t');
    cmscr.setAttribute('id', 'clustrmaps');
    cmscr.setAttribute('target', '_blank');
    var a = document.getElementById("openwebrx-panel-log");
    if (a) a.appendChild(cmscr);
  }

  var a = document.querySelector('.settings-grid');
  if (a) a.insertAdjacentHTML("afterend",
    "<div class='af-help'><b>AF:</b> Features added as of <b>"+af_owrx_version+"</b>.<br><br>" +
    "<b>-</b> Logo link and title can be changed from <b>General settings</b>-><b>Photo Description</b>.<br>" +
    "<b>-</b> '<b>Under development</b>' notification is removed (if you're using a dev version of OWR).<br>" +
    "<b>-</b> Bookmarks can be split into 2 lines by adding '<b>:</b>' character in the name.<br>" +
    "<b>-</b> Guest users (not logged in) are automatiocally disconnected from the slot if idle for more than 30 minutes (no mouse/keyboard event).<br>" +
    "<b>-</b> You can hide device name from profiles by adding '<b>[-]</b>' in front of the name.<br>" +
    "<b>-</b> You can hide some profiles from guests (not logged in), by adding '<b>[-]</b>' somewhere in the profile name.<br>" +
    "<b>-</b> You can disable profile change for guests (not logged in) by adding '<b>[-]</b>' in <b>General settings</b>-><b>Receiver name</b>.<br>" +
    "<b>-</b> You can add user tracking (site visitors) with ClustrMaps. See the help in <b>General settings</b>-><b>Photo Description</b>.<br>" +
    "<b>-</b> You can use '<b>receiver-info-in-title</b>' class for nice semi-dark transparent background in the expanded title.<br>" +
    "<b>-</b> You can <b>IMPORT MY BOOKMARKS</b> if you want. See the help in <b>General settings</b>-><b>Photo Description</b>.<br>" +
    "<hr>Example configuration to put in <b>General settings</b>-><b>Photo Description</b> (change the underlined texts):<br>" +
    "<code>" +
    "&lt;div class='receiver-info-in-title'&gt;<br>" +
    "Receiver is operated by: &lt;a href='mailto:<u>YOUR@EMAIL.COM</u>' target='_blank'&gt;<u>YOUR_CALL_SIGN</u>&lt;/a&gt;&lt;br&gt;<br>" +
    "This SDR has added&lt;br&gt;features by LZ2SLL.&lt;br&gt;&lt;br&gt;<br>" +
    "Device: <u>RTL-SDR</u>&lt;br&gt;<br>" +
    "Antenna: <u>Diamond X-300</u>&lt;br&gt;<br>" +
    "&lt;/div&gt;<br>" +
    "&ltscript src='https://0xaf.org/af-owrx.js'&gt;&lt;/script&gt;<br>" +
    "&lt;script&gt;<br>" +
    "&nbsp;&nbsp;window.idle_client_timeout_in_minutes = <u>30</u>; <br>" +
    "&nbsp;&nbsp;// window.clustrmaps_id = '<u>clustrmaps_id</u>';<br>" +
    "&nbsp;&nbsp;window.sdr_url = '//<u>sdr.0xaf.org</u>/';<br>" +
    "&nbsp;&nbsp;window.sdr_title = '<u>SDR in Varna, Bulgaria</u>';<br>" +
    "&nbsp;&nbsp;window.import_bookmarks_from_af = <u>1</u>;<br>" +
    "&lt;/script&gt;<br>" +
    "</code>" +
    "</div>"
  );

  var a = document.querySelector('.settings-body .removable-item > input[placeholder="Device name"]');
  if (a) a.insertAdjacentHTML("afterend",
    "<small class='af-help'><b>AF:</b> If you want to hide the device name from profiles, put '<b>[-]</b>' in front of the name (square brackets with minus inside).</small>"
  );

  var a = document.querySelector('.settings-body .removable-item > input[placeholder="Receiver name"]');
  if (a) a.insertAdjacentHTML("afterend",
    "<small class='af-help'><b>AF:</b> If you want to to disable profile changing for guest users (not logged in), put '<b>[-]</b>' in front of the name (square brackets with minus inside).</small>"
  );

  var a = document.querySelector('div[data-field="photo_desc"] > div > div > textarea');
  if (a) a.insertAdjacentHTML("afterend", "<small class='af-help'>" +
    "<b>AF:</b> Guests will be disconnected after 30 minutes of inactivity. " +
    "To change the timeout, add this text in the 'Photo description' and change to appropriate time.<br>" +
    "<code> &lt;script&gt; window.idle_client_timeout_in_minutes = 30; &lt;/script&gt; </code><hr>" +
    "If you want to track users with <a href='https://clustrmaps.com' target='_blank'>Clustrmaps</a>, register an account, " +
    "create new widget and take the <b>id</b> from the link of the widget (should be the <b>d=</b> parameter of the url). " +
    "Then add this script to the 'Photo description'.<br>" +
    "<code> &lt;script&gt; window.clustrmaps_id = 'xxx_replace_with_real_id_xxx'; &lt;/script&gt; </code><hr>" +
    "If you want to change the logo url and title (upper left 'OpenWebRX' logo), add this script to the 'Photo description'.<br>" +
    "<code> &lt;script&gt; window.sdr_url = '//sdr.0xaf.org/';<br>window.sdr_title = 'SDR in Varna, Bulgaria'; &lt;/script&gt;</code><hr>" +
    "If you want to <b>IMPORT MY BOOKMARKS</b>, then add this script to 'Photo description':<br> " +
    "They will not replace your bookmarks if you already have the same frequency, and will be shown in <b>Purple</b> color.<br>" +
    "<code> &lt;script&gt; window.import_bookmarks_from_af = 1; &lt;/script&gt; </code><hr>" +
    "</small>");

  var a = document.querySelector('.settings-body .removable-item > input[placeholder="Profile name"]');
  if (a) a.insertAdjacentHTML("afterend",
    "<small class='af-help'><b>AF:</b> If you want to hide this profile from guest users (not logged in), put '<b>[-]</b>' somewhere in the name (square brackets with minus inside).</small>"
  );


  var a = document.querySelector('.bookmark-add');
  if (a) a.addEventListener("click", function (e) {
    setTimeout(function () {
      var name = document.querySelector('tr[data-id="new"] > .name > input');
      if (name) {
        name.insertAdjacentHTML("afterend",
          "<br><small class='af-help'><b>AF:</b> Use '<b>:</b>' (colon) to separate the bookmark name on 2 lines.</small>"
        );
      }
      var freq = document.querySelector('tr[data-id="new"] > .frequency > div > div > select');
      freq.value = "6";
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
#openwebrx-bookmarks-container .bookmark[data-source=AF] {
    background-color: #F6F;
}

#openwebrx-bookmarks-container .bookmark[data-source=AF]:after {
    border-top-color: #F6F;
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
  for (var i = 0; i < 100; i++) {
    clearTimeout(i);
    clearInterval(i);
  }
  document.querySelector('body').innerHTML = `
<style> body { background: black; color: white; } </style>

<br><br><br><br><br>
<center>
You have been logged out for being idle.<br>
Please do not take the client slot forever.<br>
Give others a chance to use the SDR.<br>
<br>
<a href="`+window.sdr_url+`">Reload</a>
</center>
`;
}

function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(logout, window.idle_client_timeout_in_minutes * 60 * 1000);
}
window.addEventListener('load', resetTimer, true);
var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
events.forEach(function (name) {
  document.addEventListener(name, resetTimer, true);
});


// rework the bookmarks a bit...
function rework_bookmarks() {
  if (typeof bookmarks !== 'undefined' && bookmarks &&
    bookmarks.bookmarks &&
    bookmarks.bookmarks.server &&
    bookmarks.bookmarks.server.length > 0 &&
    bookmarks.bookmarks.server[bookmarks.bookmarks.server.length - 1].source != "final"
  ) {
    // bookmarks are loaded
    bookmarks.bookmarks.server.forEach(function (b) {
      b.name = b.name.replace(':', "<br>");
    });

    if (window.import_bookmarks_from_af) {
      // fetch("https://0xaf.org/af-owrx-bookmarks.json")
        // .then(res => res.json())
        // .then((out) => {
        var out = af_imported_bookmarks;
          var freq = get_visible_freq_range();
          var to_import = out.filter((bm) => {
            if (bm.frequency < freq.start || bm.frequency > freq.end) return false;
            var found = false;
            bookmarks.bookmarks.server.forEach((sb) => {
              if (sb.frequency == bm.frequency) found = true;
            });
            bookmarks.bookmarks.local.forEach((lb) => {
              if (lb.frequency == bm.frequency) found = true;
            });
            return found ? false : true;
          });
          to_import.forEach((ib) => {
            ib.name = ib.name.replace(':', "<br>");
            bookmarks.bookmarks.dial_frequencies.push({
              name: ib.name,
              frequency: ib.frequency,
              modulation: ib.modulation,
              source: 'AF',
              editable: false
            });
          })
          bookmarks.render(); // re-render the bookmarks
        // })
        // .catch(err => console.error(err));
    }

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
    select.onchange = function (event) {
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
    for (var i = 0; i < select.options.length; i++) {
      select.options[i].text = select.options[i].text.replace(/^\[-]\s+/, '');
      if (!is_logged() &&
        (
          select.options[i].value.indexOf("[-]") !== -1 ||
          select.options[i].text.indexOf("[-]") !== -1
        )
      ) {
        select.options[i].hidden = true;
      }
    }
  } else {
    setTimeout(rework_profiles, 50);
  }
}

var af_imported_bookmarks =
  [
    {
      "name": "TWR-Varna:LBWN",
      "frequency": 119500000,
      "modulation": "am"
    },
    {
      "name": "APP-Varna:???",
      "frequency": 121000000,
      "modulation": "am"
    },
    {
      "name": "CHAIKA:025",
      "frequency": 123025000,
      "modulation": "am"
    },
    {
      "name": "CHAIKA:050",
      "frequency": 123050000,
      "modulation": "am"
    },
    {
      "name": "APP-Varna:LBWN",
      "frequency": 124600000,
      "modulation": "am"
    },
    {
      "name": "ATIS-Varna:LBWN",
      "frequency": 126875000,
      "modulation": "am"
    },
    {
      "name": "TWR-Varna:LBWN",
      "frequency": 128050000,
      "modulation": "am"
    },
    {
      "name": "AIR",
      "frequency": 128650000,
      "modulation": "am"
    },
    {
      "name": "Varna:LBWN",
      "frequency": 134700000,
      "modulation": "am"
    },
    {
      "name": "RUS",
      "frequency": 144350000,
      "modulation": "nfm"
    },
    {
      "name": "APRS",
      "frequency": 144800000,
      "modulation": "packet"
    },
    {
      "name": "IN:R7",
      "frequency": 145175000,
      "modulation": "nfm"
    },
    {
      "name": "Parot",
      "frequency": 145225000,
      "modulation": "nfm"
    },
    {
      "name": "S",
      "frequency": 145450000,
      "modulation": "nfm"
    },
    {
      "name": "S",
      "frequency": 145500000,
      "modulation": "nfm"
    },
    {
      "name": "BURGAS:R0",
      "frequency": 145600000,
      "modulation": "nfm"
    },
    {
      "name": "PROVADIA:R1",
      "frequency": 145625000,
      "modulation": "nfm"
    },
    {
      "name": "BOTEV:R2",
      "frequency": 145650000,
      "modulation": "nfm"
    },
    {
      "name": "CHUMERNA:R3",
      "frequency": 145675000,
      "modulation": "nfm"
    },
    {
      "name": "KARANDILA:R4",
      "frequency": 145700000,
      "modulation": "nfm"
    },
    {
      "name": "DOBRICH:R5",
      "frequency": 145725000,
      "modulation": "nfm"
    },
    {
      "name": "R6",
      "frequency": 145750000,
      "modulation": "nfm"
    },
    {
      "name": "VARNA:R7",
      "frequency": 145775000,
      "modulation": "nfm"
    },
    {
      "name": "\u0411\u0414\u0416",
      "frequency": 150088000,
      "modulation": "nfm"
    },
    {
      "name": "\u0411\u0414\u0416",
      "frequency": 150725000,
      "modulation": "nfm"
    },
    {
      "name": "\u0411\u0414\u0416",
      "frequency": 150850000,
      "modulation": "nfm"
    },
    {
      "name": "TA",
      "frequency": 155775000,
      "modulation": "nfm"
    },
    {
      "name": "TA",
      "frequency": 156000000,
      "modulation": "nfm"
    },
    {
      "name": "1",
      "frequency": 156050000,
      "modulation": "nfm"
    },
    {
      "name": "2",
      "frequency": 156100000,
      "modulation": "nfm"
    },
    {
      "name": "3",
      "frequency": 156150000,
      "modulation": "nfm"
    },
    {
      "name": "4",
      "frequency": 156200000,
      "modulation": "nfm"
    },
    {
      "name": "5",
      "frequency": 156250000,
      "modulation": "nfm"
    },
    {
      "name": "6",
      "frequency": 156300000,
      "modulation": "nfm"
    },
    {
      "name": "7",
      "frequency": 156350000,
      "modulation": "nfm"
    },
    {
      "name": "8",
      "frequency": 156400000,
      "modulation": "nfm"
    },
    {
      "name": "68",
      "frequency": 156425000,
      "modulation": "nfm"
    },
    {
      "name": "9",
      "frequency": 156450000,
      "modulation": "nfm"
    },
    {
      "name": "9",
      "frequency": 156450000,
      "modulation": "nfm"
    },
    {
      "name": "10",
      "frequency": 156500000,
      "modulation": "nfm"
    },
    {
      "name": "11",
      "frequency": 156550000,
      "modulation": "nfm"
    },
    {
      "name": "12",
      "frequency": 156600000,
      "modulation": "nfm"
    },
    {
      "name": "72",
      "frequency": 156625000,
      "modulation": "nfm"
    },
    {
      "name": "13",
      "frequency": 156650000,
      "modulation": "nfm"
    },
    {
      "name": "73",
      "frequency": 156675000,
      "modulation": "nfm"
    },
    {
      "name": "14",
      "frequency": 156700000,
      "modulation": "nfm"
    },
    {
      "name": "15",
      "frequency": 156750000,
      "modulation": "nfm"
    },
    {
      "name": "16:SOS",
      "frequency": 156800000,
      "modulation": "nfm"
    },
    {
      "name": "17",
      "frequency": 156850000,
      "modulation": "nfm"
    },
    {
      "name": "77",
      "frequency": 156875000,
      "modulation": "nfm"
    },
    {
      "name": "78A",
      "frequency": 156925000,
      "modulation": "nfm"
    },
    {
      "name": "MARINE BUL.",
      "frequency": 161900000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 165450000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 165850000,
      "modulation": "nfm"
    },
    {
      "name": "HOR",
      "frequency": 26400000,
      "modulation": "wfm"
    },
    {
      "name": "40C CH",
      "frequency": 26955000,
      "modulation": "nfm"
    },
    {
      "name": "18 CH",
      "frequency": 27145000,
      "modulation": "nfm"
    },
    {
      "name": "25 CH",
      "frequency": 27245000,
      "modulation": "nfm"
    },
    {
      "name": "APP-Varna:LBWN",
      "frequency": 309025000,
      "modulation": "am"
    },
    {
      "name": "TWR-Varna:LBWN",
      "frequency": 377600000,
      "modulation": "am"
    },
    {
      "name": "R7 Uplink",
      "frequency": 430340000,
      "modulation": "nfm"
    },
    {
      "name": "IN:LZ0VNA",
      "frequency": 430700000,
      "modulation": "nfm"
    },
    {
      "name": "IN:LZ0DAD",
      "frequency": 430900000,
      "modulation": "dstar"
    },
    {
      "name": "IN:LZ0DAV",
      "frequency": 430950000,
      "modulation": "dstar"
    },
    {
      "name": "IN:LZ0VDR",
      "frequency": 431125000,
      "modulation": "dmr"
    },
    {
      "name": "IN:LZ0KVA",
      "frequency": 431300000,
      "modulation": "nfm"
    },
    {
      "name": "IN:LZ0RDP",
      "frequency": 431400000,
      "modulation": "nfm"
    },
    {
      "name": "IN:LZ0SEA",
      "frequency": 431500000,
      "modulation": "nfm"
    },
    {
      "name": "Y",
      "frequency": 433250000,
      "modulation": "nfm"
    },
    {
      "name": "LZ0PAR",
      "frequency": 433300000,
      "modulation": "nfm"
    },
    {
      "name": "S",
      "frequency": 433500000,
      "modulation": "nfm"
    },
    {
      "name": "S",
      "frequency": 435235000,
      "modulation": "nfm"
    },
    {
      "name": "S",
      "frequency": 436600000,
      "modulation": "nfm"
    },
    {
      "name": "LZ0VNA",
      "frequency": 438300000,
      "modulation": "nfm"
    },
    {
      "name": "LZ0DAH",
      "frequency": 438400000,
      "modulation": "dstar"
    },
    {
      "name": "LZ0DAF",
      "frequency": 438450000,
      "modulation": "dmr"
    },
    {
      "name": "LZ0DAD",
      "frequency": 438500000,
      "modulation": "dstar"
    },
    {
      "name": "LZ0DAV",
      "frequency": 438550000,
      "modulation": "dstar"
    },
    {
      "name": "LZ0SMN",
      "frequency": 438700000,
      "modulation": "nfm"
    },
    {
      "name": "LZ0VDR",
      "frequency": 438725000,
      "modulation": "dmr"
    },
    {
      "name": "LZ0KVA",
      "frequency": 438900000,
      "modulation": "nfm"
    },
    {
      "name": "LZ0RDP",
      "frequency": 439000000,
      "modulation": "nfm"
    },
    {
      "name": "LZ0SEA",
      "frequency": 439100000,
      "modulation": "nfm"
    },
    {
      "name": "?",
      "frequency": 439825000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:1",
      "frequency": 446006000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:2",
      "frequency": 446019000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:3",
      "frequency": 446031000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:4",
      "frequency": 446044000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:5",
      "frequency": 446056000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:6",
      "frequency": 446069000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:7",
      "frequency": 446081000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:8",
      "frequency": 446094000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:9",
      "frequency": 446106000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:10",
      "frequency": 446119000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:11",
      "frequency": 446131000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:12",
      "frequency": 446144000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:13",
      "frequency": 446156000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:14",
      "frequency": 446169000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:15",
      "frequency": 446181000,
      "modulation": "nfm"
    },
    {
      "name": "PMR:16",
      "frequency": 446194000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 457526000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 457550000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 457575000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 457650000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 459338000,
      "modulation": "dmr"
    },
    {
      "name": "V",
      "frequency": 459399000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 459623000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 459699000,
      "modulation": "nfm"
    },
    {
      "name": "ISS",
      "frequency": 145800000,
      "modulation": "nfm"
    },
    {
      "name": "IN:ISS",
      "frequency": 145200000,
      "modulation": "nfm"
    },
    {
      "name": "IN:R14",
      "frequency": 144750000,
      "modulation": "nfm"
    },
    {
      "name": "IN:R0",
      "frequency": 145000000,
      "modulation": "nfm"
    },
    {
      "name": "IN:R1",
      "frequency": 145025000,
      "modulation": "nfm"
    },
    {
      "name": "IN:R2",
      "frequency": 145050000,
      "modulation": "nfm"
    },
    {
      "name": "IN:R3",
      "frequency": 145075000,
      "modulation": "nfm"
    },
    {
      "name": "IN:R4",
      "frequency": 145100000,
      "modulation": "nfm"
    },
    {
      "name": "IN:R5",
      "frequency": 145125000,
      "modulation": "nfm"
    },
    {
      "name": "IN:R6",
      "frequency": 145150000,
      "modulation": "nfm"
    },
    {
      "name": "R14",
      "frequency": 145350000,
      "modulation": "nfm"
    },
    {
      "name": "Packet:ISS",
      "frequency": 145825000,
      "modulation": "packet"
    },
    {
      "name": "Packet:ISS",
      "frequency": 437550000,
      "modulation": "packet"
    },
    {
      "name": "ISS",
      "frequency": 437800000,
      "modulation": "nfm"
    },
    {
      "name": "IN:ISS",
      "frequency": 145990000,
      "modulation": "nfm"
    },
    {
      "name": "Balchik",
      "frequency": 122155000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 121875000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 122025000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 122375000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 123400000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 123530000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 131475000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 132150000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 132199999,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 132825500,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 132870000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 469175000,
      "modulation": "nfm"
    },
    {
      "name": "COT",
      "frequency": 469400000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 469800000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 458712500,
      "modulation": "nfm"
    },
    {
      "name": "\u0411\u0414\u0416",
      "frequency": 150600000,
      "modulation": "nfm"
    },
    {
      "name": "\u0411\u0414\u0416",
      "frequency": 150550000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 165050000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 165800000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 166100000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 155650000,
      "modulation": "nfm"
    },
    {
      "name": "79A",
      "frequency": 156975000,
      "modulation": "nfm"
    },
    {
      "name": "1",
      "frequency": 446003125,
      "modulation": "nxdn"
    },
    {
      "name": "2",
      "frequency": 446009375,
      "modulation": "nxdn"
    },
    {
      "name": "3",
      "frequency": 446015625,
      "modulation": "nxdn"
    },
    {
      "name": "4",
      "frequency": 446021875,
      "modulation": "nxdn"
    },
    {
      "name": "5",
      "frequency": 446028125,
      "modulation": "nxdn"
    },
    {
      "name": "6",
      "frequency": 446034375,
      "modulation": "nxdn"
    },
    {
      "name": "7",
      "frequency": 446040625,
      "modulation": "nxdn"
    },
    {
      "name": "8",
      "frequency": 446046875,
      "modulation": "nxdn"
    },
    {
      "name": "9",
      "frequency": 446053125,
      "modulation": "nxdn"
    },
    {
      "name": "10",
      "frequency": 446059375,
      "modulation": "nxdn"
    },
    {
      "name": "11",
      "frequency": 446065625,
      "modulation": "nxdn"
    },
    {
      "name": "12",
      "frequency": 446071875,
      "modulation": "nxdn"
    },
    {
      "name": "13",
      "frequency": 446078125,
      "modulation": "nxdn"
    },
    {
      "name": "14",
      "frequency": 446084375,
      "modulation": "nxdn"
    },
    {
      "name": "15",
      "frequency": 446090625,
      "modulation": "nxdn"
    },
    {
      "name": "16",
      "frequency": 446096875,
      "modulation": "nxdn"
    },
    {
      "name": "17",
      "frequency": 446103125,
      "modulation": "nxdn"
    },
    {
      "name": "18",
      "frequency": 446109375,
      "modulation": "nxdn"
    },
    {
      "name": "19",
      "frequency": 446115625,
      "modulation": "nxdn"
    },
    {
      "name": "20",
      "frequency": 446121875,
      "modulation": "nxdn"
    },
    {
      "name": "21",
      "frequency": 446128125,
      "modulation": "nxdn"
    },
    {
      "name": "22",
      "frequency": 446134375,
      "modulation": "nxdn"
    },
    {
      "name": "23",
      "frequency": 446140625,
      "modulation": "nxdn"
    },
    {
      "name": "24",
      "frequency": 446146875,
      "modulation": "nxdn"
    },
    {
      "name": "25",
      "frequency": 446153125,
      "modulation": "nxdn"
    },
    {
      "name": "26",
      "frequency": 446159375,
      "modulation": "nxdn"
    },
    {
      "name": "27",
      "frequency": 446165625,
      "modulation": "nxdn"
    },
    {
      "name": "28",
      "frequency": 446171875,
      "modulation": "nxdn"
    },
    {
      "name": "29",
      "frequency": 446178125,
      "modulation": "nxdn"
    },
    {
      "name": "30",
      "frequency": 446184375,
      "modulation": "nxdn"
    },
    {
      "name": "31",
      "frequency": 446190625,
      "modulation": "nxdn"
    },
    {
      "name": "32",
      "frequency": 446196875,
      "modulation": "nxdn"
    },
    {
      "name": "PRS:1",
      "frequency": 409750000,
      "modulation": "nfm"
    },
    {
      "name": "PRS:2",
      "frequency": 409765200,
      "modulation": "nfm"
    },
    {
      "name": "PRS:3",
      "frequency": 409775000,
      "modulation": "nfm"
    },
    {
      "name": "PRS:4",
      "frequency": 409787500,
      "modulation": "nfm"
    },
    {
      "name": "PRS:5",
      "frequency": 409800000,
      "modulation": "nfm"
    },
    {
      "name": "PRS:6",
      "frequency": 409812500,
      "modulation": "nfm"
    },
    {
      "name": "PRS:7",
      "frequency": 409825000,
      "modulation": "nfm"
    },
    {
      "name": "PRS:8",
      "frequency": 409837500,
      "modulation": "nfm"
    },
    {
      "name": "PRS:9",
      "frequency": 409850000,
      "modulation": "nfm"
    },
    {
      "name": "PRS:10",
      "frequency": 409862500,
      "modulation": "nfm"
    },
    {
      "name": "PRS:11",
      "frequency": 409875000,
      "modulation": "nfm"
    },
    {
      "name": "PRS:12",
      "frequency": 409887500,
      "modulation": "nfm"
    },
    {
      "name": "PRS:13",
      "frequency": 409900000,
      "modulation": "nfm"
    },
    {
      "name": "PRS:14",
      "frequency": 409912500,
      "modulation": "nfm"
    },
    {
      "name": "PRS:15",
      "frequency": 409925000,
      "modulation": "nfm"
    },
    {
      "name": "PRS:16",
      "frequency": 409937500,
      "modulation": "nfm"
    },
    {
      "name": "PRS:17",
      "frequency": 409950000,
      "modulation": "nfm"
    },
    {
      "name": "PRS:18",
      "frequency": 409962500,
      "modulation": "nfm"
    },
    {
      "name": "PRS:19",
      "frequency": 409975000,
      "modulation": "nfm"
    },
    {
      "name": "PRS:20",
      "frequency": 409987500,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 125575000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 131125000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 132775000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 132324999,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 131824999,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 131725000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 132375000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 133550000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 137100000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 130300000,
      "modulation": "am"
    },
    {
      "name": "SOS",
      "frequency": 121500000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 132949999,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 135175000,
      "modulation": "am"
    },
    {
      "name": "Sofia-East:Botev",
      "frequency": 129100000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 130400000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 123175000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 121175000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 122600000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 122530000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 125100000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 128725000,
      "modulation": "am"
    },
    {
      "name": "\u0428\u0443\u043c\u0435\u043d-\u0412\u0435\u043d\u0435\u0446:\u0411\u041d\u0420 \u0428\u0443\u043c\u0435\u043d",
      "frequency": 87600000,
      "modulation": "wfm"
    },
    {
      "name": "\u041a\u0430\u0432\u0430\u0440\u043d\u0430-\u041a\u0430\u043b\u0438\u0430\u043a\u0440\u0430:\u0411\u041d\u0420 \u0425\u043e\u0440\u0438\u0437\u043e\u043d\u0442",
      "frequency": 88100000,
      "modulation": "wfm"
    },
    {
      "name": "\u0421\u043b.\u0411\u0440\u044f\u0433-\u0415\u0434\u0435\u043b\u0432\u0430\u0439\u0441:\u0411\u041d\u0420 \u0412\u0430\u0440\u043d\u0430",
      "frequency": 88500000,
      "modulation": "wfm"
    },
    {
      "name": "\u041f\u0440\u043e\u0432\u0430\u0434\u0438\u044f-\u0420\u043e\u044f\u043a:\u0411\u041d\u0420 \u0425\u043e\u0440\u0438\u0437\u043e\u043d\u0442",
      "frequency": 88900000,
      "modulation": "wfm"
    },
    {
      "name": "\u041a\u0430\u0432\u0430\u0440\u043d\u0430-\u041a\u0430\u043b\u0438\u0430\u043a\u0440\u0430:\u0421\u0438\u0442\u0438",
      "frequency": 89000000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:\u0424\u043e\u043a\u0443\u0441 \u0412\u0430\u0440\u043d\u0430",
      "frequency": 89500000,
      "modulation": "wfm"
    },
    {
      "name": "\u041a\u0430\u0432\u0430\u0440\u043d\u0430-\u041a\u0430\u043b\u0438\u0430\u043a\u0440\u0430:\u0411\u041d\u0420 \u0425\u0440.\u0411\u043e\u0442\u0435\u0432",
      "frequency": 90100000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0411\u043e\u0440\u043e\u0432\u0435\u0446:N-Joy",
      "frequency": 90600000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:Energy",
      "frequency": 91200000,
      "modulation": "wfm"
    },
    {
      "name": "\u0428\u0443\u043c\u0435\u043d-\u041f\u043b\u0430\u0442\u043e\u0442\u043e:\u0414\u0430\u0440\u0438\u043a \u0412\u0430\u0440\u043d\u0430",
      "frequency": 91400000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0411\u043e\u0440\u043e\u0432\u0435\u0446:BG ON AIR",
      "frequency": 91700000,
      "modulation": "wfm"
    },
    {
      "name": "\u041a\u0430\u0432\u0430\u0440\u043d\u0430-\u041a\u0430\u043b\u0438\u0430\u043a\u0440\u0430:\u0420\u0430\u0434\u0438\u043e 1",
      "frequency": 92300000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0411\u043e\u0440\u043e\u0432\u0435\u0446:\u0412\u0438\u0442\u043e\u0448\u0430",
      "frequency": 92600000,
      "modulation": "wfm"
    },
    {
      "name": "\u0428\u0443\u043c\u0435\u043d-\u041f\u043b\u0430\u0442\u043e\u0442\u043e:\u0411\u041d\u0420 \u0428\u0443\u043c\u0435\u043d",
      "frequency": 93400000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:\u0420\u0430\u0434\u0438\u043e 1",
      "frequency": 93800000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0411\u0435\u043b\u043e\u0441\u043b\u0430\u0432:\u0424\u043e\u043a\u0443\u0441 \u0412\u0430\u0440\u043d\u0430",
      "frequency": 94200000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0411\u043e\u0440\u043e\u0432\u0435\u0446:FM+",
      "frequency": 94600000,
      "modulation": "wfm"
    },
    {
      "name": "\u041a\u0430\u0432\u0430\u0440\u043d\u0430-\u041a\u0430\u043b\u0438\u0430\u043a\u0440\u0430:\u0424\u043e\u043a\u0443\u0441",
      "frequency": 95000000,
      "modulation": "wfm"
    },
    {
      "name": "\u0421\u043b.\u0411\u0440\u044f\u0433-\u0415\u0434\u0435\u043b\u0432\u0430\u0439\u0441:\u0411\u041d\u0420 \u0425\u0440.\u0411\u043e\u0442\u0435\u0432",
      "frequency": 95300000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0411\u043e\u0440\u043e\u0432\u0435\u0446:Z-Rock",
      "frequency": 95900000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0413\u0430\u043b\u0430\u0442\u0430:\u041c\u0430\u044f \u0412\u0430\u0440\u043d\u0430",
      "frequency": 96400000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0411\u0435\u043b\u043e\u0441\u043b\u0430\u0432:Energy",
      "frequency": 96400000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:\u0412\u0435\u0440\u043e\u043d\u0438\u043a\u0430",
      "frequency": 97300000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:\u0411\u0413 \u0420\u0430\u0434\u0438\u043e",
      "frequency": 97800000,
      "modulation": "wfm"
    },
    {
      "name": "\u041a\u0430\u0432\u0430\u0440\u043d\u0430-\u041a\u0430\u043b\u0438\u0430\u043a\u0440\u0430:\u0411\u041d\u0420 \u0412\u0430\u0440\u043d\u0430",
      "frequency": 98200000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:City",
      "frequency": 98600000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:\u0414\u0430\u0440\u0438\u043a \u0412\u0430\u0440\u043d\u0430",
      "frequency": 99300000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0411\u043e\u0440\u043e\u0432\u0435\u0446:Fresh",
      "frequency": 100300000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:\u0425\u043e\u0440\u0438\u0437\u043e\u043d\u0442",
      "frequency": 100900000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:\u0420\u0430\u0434\u0438\u043e 1 \u0420\u043e\u043a",
      "frequency": 101500000,
      "modulation": "wfm"
    },
    {
      "name": "\u0428\u0443\u043c\u0435\u043d-\u0412\u0435\u043d\u0435\u0446:\u0425\u043e\u0440\u0438\u0437\u043e\u043d\u0442",
      "frequency": 102000000,
      "modulation": "wfm"
    },
    {
      "name": "\u0421\u043b.\u0411\u0440\u044f\u0433-\u0415\u0434\u0435\u043b\u0432\u0430\u0439\u0441:\u0425\u043e\u0440\u0438\u0437\u043e\u043d\u0442",
      "frequency": 102500000,
      "modulation": "wfm"
    },
    {
      "name": "\u041f\u0440\u043e\u0432\u0430\u0434\u0438\u044f-\u0420\u043e\u044f\u043a:\u0425\u0440.\u0411\u043e\u0442\u0435\u0432",
      "frequency": 102900000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:\u0411\u041d\u0420 \u0412\u0430\u0440\u043d\u0430",
      "frequency": 103400000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:\u0425\u0440.\u0411\u043e\u0442\u0435\u0432",
      "frequency": 104800000,
      "modulation": "wfm"
    },
    {
      "name": "\u041f\u0440\u043e\u0432\u0430\u0434\u0438\u044f-\u0420\u043e\u044f\u043a:\u0411\u041d\u0420 \u0412\u0430\u0440\u043d\u0430",
      "frequency": 105300000,
      "modulation": "wfm"
    },
    {
      "name": "\u041a\u0430\u0432\u0430\u0440\u043d\u0430-\u041a\u0430\u043b\u0438\u0430\u043a\u0440\u0430:N-Joy",
      "frequency": 105400000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0411\u043e\u0440\u043e\u0432\u0435\u0446:Melody",
      "frequency": 105700000,
      "modulation": "wfm"
    },
    {
      "name": "\u0412\u0430\u0440\u043d\u0430-\u0424\u0440\u0430\u043d\u0433\u0430\u0442\u0430:\u0412\u0435\u0441\u0435\u043b\u0438\u043d\u0430",
      "frequency": 106300000,
      "modulation": "wfm"
    },
    {
      "name": "\u041a\u0430\u0432\u0430\u0440\u043d\u0430-\u041a\u0430\u043b\u0438\u0430\u043a\u0440\u0430:\u0414\u0430\u0440\u0438\u043a \u0412\u0430\u0440\u043d\u0430",
      "frequency": 106800000,
      "modulation": "wfm"
    },
    {
      "name": "\u041f\u0440\u043e\u0432\u0430\u0434\u0438\u044f-\u0420\u043e\u044f\u043a:Energy",
      "frequency": 107200000,
      "modulation": "wfm"
    },
    {
      "name": "VOLMET-Sofia:Botev",
      "frequency": 126600000,
      "modulation": "am"
    },
    {
      "name": "ATIS-Burgas:LBBG",
      "frequency": 126975000,
      "modulation": "am"
    },
    {
      "name": "ATIS-Varna:LBWN",
      "frequency": 128923000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 128800000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 132550000,
      "modulation": "am"
    },
    {
      "name": "Balchik:LBWB",
      "frequency": 121125000,
      "modulation": "am"
    },
    {
      "name": "Varna-Izgrev:LBWV",
      "frequency": 122450000,
      "modulation": "am"
    },
    {
      "name": "APP-Varna:LBWN",
      "frequency": 130449999,
      "modulation": "am"
    },
    {
      "name": "VOR-Burgas:BGS",
      "frequency": 112000000,
      "modulation": "am"
    },
    {
      "name": "VOR-Varna:WRN",
      "frequency": 112400000,
      "modulation": "am"
    },
    {
      "name": "VOR-Emine:EMO",
      "frequency": 113650000,
      "modulation": "am"
    },
    {
      "name": "TWR-Varna:LBWN",
      "frequency": 118900000,
      "modulation": "am"
    },
    {
      "name": "V",
      "frequency": 160975000,
      "modulation": "nfm"
    },
    {
      "name": "V",
      "frequency": 161050000,
      "modulation": "nfm"
    },
    {
      "name": "AF",
      "frequency": 1000000000000,
      "modulation": "nfm"
    }
  ];

