// This JS will add some features to OpenWebRx WebSDR.
// You can enable the script by adding this line into "Photo description" text field in General Settings.
// <script src="https://0xaf.org/af-owrx.js"></script>
//
// The script will add some help texts in the Settings menus.
//
// Copyright (C) 2022, Stanislav Lechev.
// License: WTFPL

var af_owrx_version = '2022-03-19';
var emitter;

function af_owrx_addon_load() {
  if (typeof af_owrx_version_loaded !== 'undefined') {
    // console.log(`af-owrx v${af_owrx_version_loaded} script already loaded.`);
    return;
  }

  window.idle_guest_timeout_in_minutes = window.idle_guest_timeout_in_minutes || 5;
  window.idle_client_timeout_in_minutes = window.idle_client_timeout_in_minutes || 30;
  window.import_bookmarks_from_af = window.import_bookmarks_from_af || 0;

  // import local css
  var style = document.createElement('style');
  style.innerHTML = af_addon_css;
  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded", function () {
    af_add_app();

    // send messages to parent page if this sdr is loaded as iframe
    function locationHashChanged(e) {
      window.parent.postMessage(location.hash, '*');
    }
    window.onhashchange = locationHashChanged;

    // add basic client tracking (Firefox will block it by default I think)
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


    var a = document.querySelector('.webrx-rx-photo-title');
    if (a) a.insertAdjacentHTML("afterend",
      `<div class="title-info-added-features">With extra features provided by <a href="https://0xaf.org">LZ2SLL</a> [0xAF].</div>`
    );

    var a = document.querySelector('.webrx-rx-title');
    if (a) a.setAttribute("title", `With extra features provided by LZ2SLL [0xAF].`);

    var a = document.querySelector('.settings-grid');
    if (a) a.insertAdjacentHTML("afterend", /*html*/ `
    <div class='af-help'><b>AF:</b> Features added as of <b>${af_owrx_version}</b>.<br>
    <br>
    <b>-</b> Logo link and title can be changed from <b>General settings</b>-&gt;<b>Photo Description</b>.<br>
    <b>-</b> '<b>Under development</b>' notification is removed (if you're using a dev version of OWR).<br>
    <b>-</b> Bookmarks can be split into 2 lines by adding '<b>:</b>' character in the name.<br>
    <b>-</b> Guest users (not logged in) are automatiocally disconnected from the slot if idle
    for more than 30 minutes (no mouse/keyboard event).<br>
    <b>-</b> You can hide device name from profiles by adding '<b>[-]</b>' in front of the name.<br>
    <b>-</b> You can hide some profiles from guests (not logged in), by adding '<b>[-]</b>'
    somewhere in the profile name.<br>
    <b>-</b> You can disable profile change for guests (not logged in) by adding '<b>[-]</b>'
    in <b>General settings</b>-><b>Receiver name</b>.<br>
    <b>-</b> You can add user tracking (site visitors) with ClustrMaps.
    See the help in <b>General settings</b>-><b>Photo Description</b>.<br>
    <b>-</b> You can use '<b>receiver-info-in-title</b>' class for nice semi-dark transparent
    background in the expanded title.<br>
    <b>-</b> You can <b>IMPORT MY BOOKMARKS</b> if you want.
    See the help in <b>General settings</b>-&gt;<b>Photo Description</b>.<br>
    <hr>
    Example configuration to put in <b>General settings</b>-&gt;<b>Photo Description</b>
    (change the underlined texts):<br>
    <code>
    &lt;div class='receiver-info-in-title'&gt;<br>
    Receiver is operated by: &lt;a href='mailto:<u>YOUR@EMAIL.COM</u>'
      target='_blank'&gt;<u>YOUR_CALL_SIGN</u>&lt;/a&gt;&lt;br&gt;&lt;br&gt;<br>
    Device: <u>RTL-SDR</u>&lt;br&gt;<br>
    Antenna: <u>Diamond X-300</u>&lt;br&gt;<br>
    &lt;/div&gt;<br>
    &ltscript src='https://0xaf.org/af-owrx.js'&gt;&lt;/script&gt;<br>
    &lt;script&gt;<br>
    &nbsp;&nbsp;window.idle_client_timeout_in_minutes = <u>30</u>; <br>
    &nbsp;&nbsp;// window.clustrmaps_id = '<u>clustrmaps_id</u>';<br>
    &nbsp;&nbsp;window.sdr_url = '//<u>sdr.0xaf.org</u>/';<br>
    &nbsp;&nbsp;window.sdr_title = '<u>SDR in Varna, Bulgaria</u>';<br>
    &nbsp;&nbsp;window.import_bookmarks_from_af = <u>1</u>;<br>
    &lt;/script&gt;<br>
    </code>
    </div>
    `);

    var a = document.querySelector('.settings-body .removable-item > input[placeholder="Device name"]');
    if (a) a.insertAdjacentHTML("afterend",
      "<small class='af-help'><b>AF:</b> If you want to hide the device name from profiles, put '<b>[-]</b>' in front of the name (square brackets with minus inside).</small>"
    );

    var a = document.querySelector('.settings-body .removable-item > input[placeholder="Receiver name"]');
    if (a) a.insertAdjacentHTML("afterend",
      "<small class='af-help'><b>AF:</b> If you want to to disable profile changing for guest users (not logged in), put '<b>[-]</b>' in front of the name (square brackets with minus inside).</small>"
    );

    var a = document.querySelector('div[data-field="photo_desc"] > div > div > textarea');
    if (a) a.insertAdjacentHTML("afterend", /*html*/ `
    <small class='af-help'>
      <b>Param</b>: <u>idle_client_timeout_in_minutes</u>&nbsp;
      [current value: <b>${window.idle_client_timeout_in_minutes} minutes</b>]<br>

      <b>Description</b>: Guests will be disconnected after some minutes of inactivity.<br>
      To change the timeout, add the code to the 'Photo description' (at the end)
      and change to appropriate time.<br>

      <b>Code</b>:<br>
      <code>&lt;script&gt; window.idle_client_timeout_in_minutes = 30; &lt;/script&gt;</code>

      <hr>

      <b>Param</b>: <u>clustrmaps_id</u>&nbsp;
      [current value: <b>${window.clustrmaps_id}</b>]<br>

      <b>Description</b>: If you want to track users with
        <a href='https://clustrmaps.com' target='_blank'>Clustrmaps</a>, register an account,
        create new widget and take the <b>id</b> from the link of the widget
        (should be the <b>d=</b> parameter of the url). Then add this code to the 'Photo description' (at the end).<br>

      <b>Code</b>:<br>
      <code>&lt;script&gt; window.clustrmaps_id = '<u>xxx_replace_with_real_id_xxx</u>'; &lt;/script&gt;</code>

      <hr>

      <b>Param</b>: <u>sdr_url</u> and <u>sdr_title</u>&nbsp;
      [current value: <b>${window.sdr_url}</b> and <b>${window.sdr_title}</b>]<br>

      <b>Description</b>: If you want to change the logo url and title (upper left 'OpenWebRX' logo),
      add this code to the 'Photo description' (at the end) and change the underlined text.<br>

      <b>Code</b>:<br>
      <code>&lt;script&gt;<br>
        window.sdr_url = '//<u>sdr.0xaf.org</u>/';<br>
        window.sdr_title = '<u>SDR in Varna, Bulgaria</u>';<br>&lt;/script&gt;
      </code>

      <hr>

      <b>Param</b>: <u>import_bookmarks_from_af</u>&nbsp;
      [current value: <b>${window.import_bookmarks_from_af}</b>]<br>

      <b>Description</b>: If you want to <b>IMPORT MY BOOKMARKS</b>, then add this
        code to 'Photo description' (at the end):<br>
      My bookmarks will not replace your bookmarks if you already have the same frequency,
      and will be shown in <b>Purple</b> color.<br>

      <b>Code</b>:<br>
      <code>&lt;script&gt; window.import_bookmarks_from_af = 1; &lt;/script&gt;</code>
    </small>
    `);

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


  });


  // function getCookie(name) {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(';').shift();
  // }



  // rework the bookmarks a bit...
  function af_add_app() {
    if (location.pathname.startsWith('/settings') || location.pathname.startsWith('/login')) {
      console.log('we are in settings');
      return;
    }

    // add chat button on top
    var a = document.querySelector('.openwebrx-main-buttons');
    if (a) {
      a.insertAdjacentHTML('afterbegin', /*html*/ `
            <div class="button" onClick="emitter.emit('toggleChat')" style="display: block;">
            <i class="fas fa-comment-dots" style="font-size: 2.7rem;"> </i>Chat</div>
          `);
      a.removeChild(a.lastElementChild);
      a.insertAdjacentHTML('beforeend', /*html*/ `
            <div class="button" onClick="emitter.emit('logout')" style="display: block;">
            <i class="fas fa-arrow-right-from-bracket" style="font-size: 2.7rem;"> </i>Logout</div>
          `);
    }


    // add to head
    var head = document.head || document.getElementsByTagName('head')[0];
    head.insertAdjacentHTML("beforeend", /*html*/ `
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet" type="text/css">
      <link href="https://use.fontawesome.com/releases/v6.0.0/css/all.css" rel="stylesheet" type="text/css">
      <link href="https://cdn.jsdelivr.net/npm/animate.css@^4.0.0/animate.min.css" rel="stylesheet" type="text/css">
      <link href="https://cdn.jsdelivr.net/npm/quasar@2.6.0/dist/quasar.prod.css" rel="stylesheet" type="text/css">
    `);

    var scr_mitt = document.createElement('script');
    scr_mitt.src = 'https://unpkg.com/mitt/dist/mitt.umd.js';
    scr_mitt.async = false; // optionally

    var scr_vue = document.createElement('script');
    scr_vue.src = 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js';
    scr_vue.async = false; // optionally

    var scr_quasar = document.createElement('script');
    scr_quasar.src = 'https://cdn.jsdelivr.net/npm/quasar@2.6.0/dist/quasar.umd.prod.js';
    scr_quasar.async = false; // optionally

    var scr_fa = document.createElement('script');
    scr_fa.src = 'https://cdn.jsdelivr.net/npm/quasar@2.6.0/dist/icon-set/svg-fontawesome-v6.umd.prod.js';
    // scr_fa.src = 'https://cdn.jsdelivr.net/npm/quasar@2.6.0/dist/icon-set/fontawesome-v6.umd.prod.js';
    scr_fa.async = false; // optionally

    var scr_ub = document.createElement('script');
    scr_ub.src = 'https://sdk.userbase.com/2/userbase.js';
    scr_ub.async = false; // optionally

    var scr_day = document.createElement('script');
    scr_day.src = 'https://unpkg.com/dayjs@1.8.21/dayjs.min.js';
    scr_day.async = false; // optionally

    var scr_dayrt = document.createElement('script');
    scr_dayrt.src = 'https://unpkg.com/dayjs@1.8.21/plugin/relativeTime.js';
    scr_dayrt.async = false; // optionally

    head.appendChild(scr_mitt);
    scr_mitt.addEventListener('load', () => {
      emitter = mitt();
      head.appendChild(scr_vue);
      scr_vue.addEventListener('load', () => {
        head.appendChild(scr_quasar);
        scr_quasar.addEventListener('load', () => {
          head.appendChild(scr_fa);
          scr_fa.addEventListener('load', () => {
            head.appendChild(scr_ub);
            scr_ub.addEventListener('load', () => {
              head.appendChild(scr_day);
              scr_day.addEventListener('load', () => {
                head.appendChild(scr_dayrt);
                scr_dayrt.addEventListener('load', () => {
                  dayjs.extend(window.dayjs_plugin_relativeTime);
                  af_start_app();
                });
              });
            });
          });
        });
      });
    });

    // add app
    // document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", `
    var a = document.querySelector('.webrx-top-container');
    // var a = document.querySelector('#openwebrx-panels-container-right');
    // var a = document.getElementById("openwebrx-panels-container");
    if (a) a.insertAdjacentHTML("afterend", /*html*/ `
<div id="q-app" class="af-app">
  <q-dialog
      v-model="dialog"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
    <q-card bordered class="my-card">
      <q-bar>
        <q-icon name="fas fa-tower-broadcast"></q-icon>
        <div>${document.querySelector('.webrx-rx-title').innerHTML}</div>
        <q-space></q-space>
      </q-bar>

      <q-card-section class="q-pb-xs">
        <div class="text-h4">Login</div>
      <div class="text-subtitle2">${document.querySelector('.webrx-rx-title').innerHTML} | ${document.querySelector('.webrx-rx-desc').innerHTML}</div>
      </q-card-section>

      <q-separator inset></q-separator>

      <q-card-section class="">
      <div class="text-h6">Guest user</div>
      <div class="text-subtitle2">You will be logged out after <b class="text-negative">${window.idle_guest_timeout_in_minutes}</b> minutes of inactivity. And you won't be able to change profiles if there is another user logged in.</div>
      <div class="q-pa-sm" style="max-width: 400px">
        <q-form @submit="loginGuest" class="q-gutter-xs">
          <div>
            <q-btn label='Login as Guest' type="submit" color="primary"></q-btn>
          </div>
        </q-form>
      </div>
      </q-card-section>

      <q-separator dark inset></q-separator>
      <q-card-section>
        <div class="text-h6">Registered user</div>
        <div class="text-subtitle2">You will be logged out after <b class="text-negative">${window.idle_client_timeout_in_minutes}</b> minutes of inactivity.</div>
        <div class="text-subtitle2 text-negative" v-html="ub_error">&nbsp;</div>
        <div class="q-pa-md" style="max-width: 400px">
          <q-form class="q-gutter-md" @submit="loginUser" ref="loginForm">
            <q-input
              filled
              dense
              v-model="user"
              label="Call Sign *"
              hint="Enter your call sign"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please enter your call sign.']"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              autocomplete="on"
              name="username"
            ></q-input>

            <q-input
              filled
              dense
              type="password"
              v-model="pass"
              label="Password *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please enter password.']"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              name="password"
            ></q-input>

            <!-- <q-toggle v-model="rememberUser" label="Remember me"></q-toggle> -->

            <div>
              <q-btn label="Login" type="submit" color="primary"></q-btn>
              <q-btn label="Register" @click="registerUser()" color="warning" class="q-ml-sm"></q-btn>
            </div>
          </q-form>
        </div>
      </q-card-section>




      <div class="af-login-actions">
        <q-separator></q-separator>
        <q-card-actions align="right" class="q-dark">
          <q-btn flat color="primary">
            af-owrx addon version ${af_owrx_version}
          </q-btn>
        </q-card-actions>
      </div>

    </q-card>
  </q-dialog>


  <div class="af-chat-window" class="q-pa-none">
    <q-layout view="hHh lpR fFf" container style="width:400px; height: 400px;" class="shadow-2 rounded-borders">
      <q-header elevated>
        <q-bar dark>
            <q-icon name="fas fa-comment-dots"></q-icon>
            <div>Chat - {{user}}</div>
          <q-space></q-space>
          <!-- <q-btn dense flat round icon="fas fa-bars" @click="rightDrawerOpen = !rightDrawerOpen"></q-btn> -->
          <q-btn dense flat round icon="fas fa-square-minus" color="negative" @click="deleteOldest()">
            <q-tooltip>Remove oldest 10 info messages.</q-tooltip>
          </q-btn>
          <q-btn dense flat round :icon="noJoined ? 'fas fa-eye' : 'fas fa-eye-slash'" @click="noJoined = !noJoined">
            <q-tooltip>{{ noJoined ? 'Show' : 'Hide' }} info messages.</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="fas fa-window-minimize" @click="toggleChat">
            <q-tooltip>Minimize</q-tooltip>
          </q-btn>
        </q-bar>
      </q-header>

      <q-drawer mini behavior="desktop" persistent v-model="rightDrawerOpen" side="right" bordered>
        <!-- drawer content -->
      </q-drawer>

      <q-page-container>
        <q-page class="q-pa-xs">
          <div class="q-pa-xs row justify-center" style="height:320px;">
            <q-scroll-area ref="chatScrollArea" style="width:100%; height:100%;">
            <template v-for="(m, i) in chatMessages" :key="'chat-'+i">
                <q-chat-message
                  v-if="!noJoined || m.text"
                  class="q-ma-xs"
                  stamp-html
                  label-html
                  :label="m.joined"
                  :name="m.name"
                  :text="m.text"
                  :sent="m.sent"
                  :stamp="m.ago"
                  autocomplete="off"
                >
                  <div v-if="m.text" class="q-pr-md">
                    <q-btn
                      round
                      size="xs"
                      color="red"
                      icon="fas fa-trash-can"
                      class="absolute-top-right"
                      v-if="isAdmin()"
                      @click="dbRemoveItem(m.itemId)"
                    ><q-tooltip>Remove</q-tooltip>
                    </q-btn>
                    {{ m.text[0] }}
                  </div>

                  <template v-slot:stamp v-if="m.ago">
                    <q-chip dense outline dark color="dark" size="sm">
                      <q-tooltip>{{ m.stamp }}</q-tooltip>
                      {{ m.ago }}
                    </q-chip>
                  </template>

                  <template v-slot:label v-if="m.joined">
                    <div style="position: relative" class="q-mb-xs text-info">
                      <q-btn
                        round
                        size="xs"
                        color="red"
                        icon="fas fa-trash-can"
                        class="absolute-top-right"
                        v-if="isAdmin()"
                        @click="dbRemoveItem(m.itemId)"
                      ><q-tooltip>Remove</q-tooltip>
                      </q-btn>
                      <span v-html="m.joined"></span>
                      <div class="x-text-overline">
                        <q-chip dense outline dark size="sm">
                          <q-tooltip>{{ m.stamp }}</q-tooltip>
                          {{ m.ago }}
                        </q-chip>
                      </div>
                    </div>
                  </template>

                  <template v-slot:name v-if="m.name">
                    <q-chip :color="m.sent ? 'primary' : 'secondary'" text-color="white">
                      {{ m.name }}
                    </q-chip>
                  </template>
                </q-chat-message>
              </template>
            </q-scroll-area>
          </div>

        </q-page>
      </q-page-container>

      <q-footer elevated class="bg-grey-8 text-white">
        <!--<q-bar>-->
            <div style="width: 100%">
              <q-form @submit="chatSend" class="">
                <q-input
                  v-model='chatMsg'
                  ref="chatMsgInput"
                  filled
                  dense
                  autofocus
                  name="chat"
                >
                  <template v-slot:after>
                    <q-btn type="submit" @click="chatSend" round dense flat icon="fas fa-paper-plane"></q-btn>
                  </template>
                </q-input>
              </q-form>
            </div>
        <!--</q-bar>-->
      </q-footer>

    </q-layout>
  </div>

</div>
  `);
  }


  function af_start_app() {
    if (typeof Vue === 'undefined') {
      console.log('no Vue yet.');
      return;
    }
    if (window.af_app_started) {
      console.log('already started');
      return;
    }
    window.af_app_started = 1;

    const {
      useQuasar,
      date,
      debounce
    } = Quasar;
    const {
      ref,
      nextTick
    } = Vue;

    const af_app = Vue.createApp({
      setup() {
        const $q = useQuasar();
        const small_size = 650;
        const dialog = ref(true);
        const user = ref(null);
        const pass = ref(null);
        const loginForm = ref(null);
        const chatMessages = ref(null);
        const ub_error = ref(null);
        const rememberUser = ref(false);
        const chatMsg = ref(null);
        const chatMsgInput = ref(null);
        const chatScrollArea = ref(null);
        const rightDrawerOpen = ref(false);
        const noJoined = ref(false);
        // let chatLastStamp = 0;
        const shareToken =
          'Mjc1MzA3NmItNjNkZS00NDgwLThiOTctN2FiZjUyZjUyNmI1qRPSqVABryaDyjpMP1NKp+RwVzp199N0CDUSsqx2Rs8=';
        const appId = 'd3279b8e-4f8e-4564-b827-063c6221e6b5';
        let current_clients = 0;
        let timeout;

        chatMessages.value = new Array();

        function mute() {
          if (!audioEngine || !audioEngine.onStart) {
            setTimeout(() => mute(), 100);
          } else {
            audioEngine.onStart(() => {
              // console.log('audio started');
              if (!window.af_user || !window.af_user.username) {
                // console.log('mute');
                audioEngine.setVolume(0);
              }
            });
          }
        }
        mute();

        function hijack_ws() {
          if (!ws) {
            setTimeout(() => hijack_ws(), 100);
          } else {
            ws.onmessage = ws_rcv;
          }
        }
        hijack_ws();

        $q.dark.set(true);

        $q.loading.show({
          delay: 400
        });
        // if (audioEngine && audioEngine.audioContext && audioEngine.audioContext.suspend) audioEngine.audioContext.suspend();

        emitter.on('toggleChat', () => toggleChat());
        emitter.on('logout', () => logoutUser());

        userbase.init({
            appId,
            allowServerSideEncryption: true
          })
          .then((session) => {
            if (session.user) {
              session.user.username = session.user.username.toUpperCase();
              window.af_user = session.user;
              user.value = session.user.username.toUpperCase();
              dialog.value = false;
              console.log(`user ${af_user.username} returned.`);
              userLoggedIn(true);
              $q.notify({
                type: 'announcement',
                message: 'Welcome back ' + af_user.username,
                timeout: 1000,
              });
            } else {
              if (session.lastUsedUsername) user.value = session.lastUsedUsername.toUpperCase();
              dialog.value = true;
            }
          })
          .catch((e) => {
            console.error(e);
            dialog.value = true;
          })
          .finally(() => {
            $q.loading.hide();
            if (audioEngine) {
              // console.log('unmute');
            }
            // if (audioEngine && audioEngine.audioContext && audioEngine.audioContext.resume) audioEngine.audioContext.resume();
          });

        function onResize() {
          // $q.notify(`w: ${$q.screen.width}, h: ${$q.screen.height}`);
          if ($q.screen.width < small_size) {
            document.querySelector('#q-app').classList.add("af-app-small-screen");
            document.querySelector('#openwebrx-panel-status').style.width = $q.screen.width + 'px';
            document.querySelector('#openwebrx-panel-receiver').style.opacity = 0.75;
          } else {
            document.querySelector('#q-app').classList.remove("af-app-small-screen");
            document.querySelector('#openwebrx-panel-status').style.width = small_size + 'px';
            document.querySelector('#openwebrx-panel-receiver').style.opacity = 1;
          }
        }
        window.addEventListener('resize', debounce(() => onResize(), 300));
        onResize();

        // logout on timeout timeout
        window.addEventListener('load', resetTimer, true);
        var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(function (name) {
          document.addEventListener(name, resetTimer, true);
        });


        // --------------------------------

        function ws_rcv(evt) {
          on_ws_recv(evt);
          if (typeof evt.data === 'string') {
            try {
              var json = JSON.parse(evt.data);
              switch (json.type) {
                case 'clients':
                  current_clients = json['value'];
                  break;
                case 'bookmarks':
                  rework_bookmarks();
                  break;
                case 'profiles':
                  rework_profiles();
                  break;

                case 'smeter':
                case 'cpuusage':
                  break;
                default:
                  // console.log(json);
                  break;
              }
            } catch (e) {}
          }
        }

        function isAdmin() {
          return (window.af_user && window.af_user.profile && window.af_user.profile.admin == '1') ?
            true : false;
        }

        function isGuest() {
          return (window.af_user && window.af_user.profile && window.af_user.profile.guest == '1') ?
            true : false;
        }

        function isUser() {
          return (window.af_user && (!window.af_user.profile || !window.af_user.profile.guest)) ?
            true : false;
        }

        function isLogged() {
          return (window.af_user && window.af_user.username) ? true : false;
        }

        function deleteOldest() {
          if (!isAdmin()) return;
          let operations = new Array();
          chatMessages.value.forEach((obj) => {
            if (operations.length < 10 && obj.label) {
              operations.push({
                command: 'Delete',
                itemId: obj.itemId
              });
            }
          });

          userbase.putTransaction({
            shareToken,
            operations
          }).then(() => {
            $q.notify({
              message: '10 info item deleted.'
            });
            // console.log('Item ' + id + ' deleted.');
          }).catch((e) => {
            divlog(e);
            $q.notify({
              type: 'negative',
              e
            });
          });
        }

        function dbAddMsg(x) {
          // dont send info msgs if we are developing
          if (window.location.href.indexOf("localhost") && !x.text) {
            console.log(x);
            return;
          }
          x.sent = undefined;
          return userbase.insertItem({
            shareToken,
            item: x
          });
        }

        function dbRemoveItem(id) {
          if (!isAdmin()) return;
          userbase.deleteItem({
            shareToken,
            itemId: id
          }).then(() => {
            $q.notify({
              message: 'Item deleted.'
            });
            // console.log('Item ' + id + ' deleted.');
          }).catch((e) => {
            divlog(e);
            $q.notify({
              type: 'negative',
              e
            });
          });
        }

        function chatSend() {
          if (!chatMsg.value || !chatMsg.value.length) {
            chatMsgInput.value.focus();
            return;
          }
          dbAddMsg({
              name: user.value,
              sent: true,
              text: [chatMsg.value],
              stamp: date.formatDate(new Date(), 'YY-MM-DD HH:mm:ss')
            })
            .then(() => {
              chatMsg.value = '';
              chatMsgInput.value.focus();
            })
            .catch((e) => {
              divlog(e, true);
              $q.notify({
                type: 'negative',
                message: e
              });
            });
        }

        async function getIP() {
          const data = await fetch("/cdn-cgi/trace").then(res => res
            .text());
          let arr = data.trim().split('\n').map(e => e.split('='));
          return Object.fromEntries(arr);
        }

        function dbChangeHandler(items) {
          // console.log('db changed');
          if (items.length === 0) {} else {
            chatMessages.value = new Array();
            for (let i = 0; i < items.length; i++) {
              // console.log(items[i]);
              let cb = items[i].createdBy;
              let obj = items[i].item;
              obj.itemId = items[i].itemId;
              obj.ago = dayjs().to(cb.timestamp);

              if (obj.name) {
                obj.name = obj.name.toUpperCase();
                if (cb.username && cb.username.toUpperCase() == user.value.toUpperCase()) // if it's sent by us
                  obj.sent = true;
              } else { // label
                if (obj.ipData && obj.ipData.ip && isAdmin()) {
                  obj.joined = `${obj.label} [${obj.ipData.ip}]`;
                } else {
                  obj.joined = obj.label;
                }
              }

              chatMessages.value.push(obj);
            }

            setTimeout(() => {
              console.log('new message - scrolling');
              const st = chatScrollArea.value.getScrollTarget();
              chatScrollArea.value.setScrollPosition('vertical', st.scrollHeight, 300);
              // chatScrollArea.value.setScrollPercentage('vertical', 1, 300)
            }, 1000);

            if (isChatHidden()) {
              const last = chatMessages.value[chatMessages.value.length - 1];
              if (last.joined) {
                $q.notify(last.label);
              } else {
                $q.notify(last.name + ": " + last.text[0]);
              }
            }

          }
        }

        function userLoggedIn(returning = false) {
          if ($q.screen.width < small_size || $q.screen.height < small_size) {
            // close receiver menu on small screen
            setTimeout(() => toggle_panel("openwebrx-panel-receiver", false), 2000);
            setTimeout(() => toggleChat(), 1500);
          }
          if (audioEngine && audioEngine.started) updateVolume();
          userbase.openDatabase({
              // databaseName: 'chat',
              shareToken,
              changeHandler: dbChangeHandler
            })
            .then(() => {
              getIP()
                .then((ipdata) => {
                  // console.log(ipdata);
                  window.af_user.ipData = ipdata;
                })
                .catch((e) => {
                  console.error(`No IP: ${e}`);
                })
                .finally(() => {
                  dbAddMsg({
                    label: `${af_user.username} `+(returning ? 'returned' : 'joined'),
                    stamp: date.formatDate(new Date(), 'YY-MM-DD HH:mm:ss'),
                    ipData: window.af_user.ipData,
                  });
                });
            })
            .catch((e) => {
              console.error(e);
              divlog(e, true);
            });
        }

        function toggleChat() {
          document.querySelector('#q-app').classList.toggle("af-app-hide");
        }

        function isChatHidden() {
          return document.querySelector('#q-app').classList.contains('af-app-hide');
        }

        function registerUser() {
          ub_error.value = '';
          loginForm.value.validate().then(success => {
            if (success) {
              // console.log('ok registering');
              userbase.signUp({
                  username: user.value,
                  password: pass.value,
                  rememberMe: 'local'
                })
                .then((uobj) => {
                  uobj.username = uobj.username.toUpperCase();
                  window.af_user = uobj;
                  dialog.value = false;
                  console.log(`user ${af_user.username} registered.`);
                  userLoggedIn();
                  $q.notify({
                    type: 'positive',
                    message: 'You have been registered as ' + af_user.username,
                  });

                })
                .catch((e) => ub_error.value = e);
            }
          });
        }

        function loginUser() {
          ub_error.value = '';
          loginForm.value.validate().then(success => {
            if (success) {
              // console.log('ok logging');
              userbase.signIn({
                  username: user.value,
                  password: pass.value,
                  rememberMe: 'local'
                })
                .then((uobj) => {
                  uobj.username = uobj.username.toUpperCase();
                  window.af_user = uobj;
                  dialog.value = false;
                  console.log(`user ${af_user.username} logged in.`);
                  userLoggedIn();
                  $q.notify({
                    type: 'announcement',
                    message: 'Welcome ' + af_user.username,
                  });

                })
                .catch((e) => ub_error.value = e);
            }
          });
        }

        function loginGuest() {
          user.value = "Guest";
          pass.value = "guestaccess";
          setTimeout(() => loginUser(), 100);
        }

        function logoutUser(x = '') {
          function disconnect(x) {
            audioEngine.audioContext.suspend();
            ws.close();
            for (var i = 0; i < 1000; i++) {
              clearTimeout(i);
              clearInterval(i);
            }
            document.querySelector('body').innerHTML = /*html*/ `
<style> body { background: black; color: white; } </style>
<br><br><br><br><br>
<center>
You have been logged out.<br>${x}
<br>
<a href="#" style="color: tomato" onClick="window.location.reload()">RELOAD</a>
</center>
`;
          }

          if (window.af_user && window.af_user.username) {
            dbAddMsg({
              label: `${af_user.username} left`,
              stamp: date.formatDate(new Date(), 'YY-MM-DD HH:mm:ss'),
              ipData: window.af_user.ipData,
            });
            userbase.signOut()
              .then(() => {
                window.af_user = null;
                disconnect(x);
              })
              .catch((e) => {
                $q.notify({
                  type: 'negative',
                  message: e
                });
              });
          } else {
            dialog.value = false;
            disconnect(x);
          }
        }

        function rework_bookmarks() {
          if (typeof bookmarks !== 'undefined' && bookmarks &&
            bookmarks.bookmarks &&
            bookmarks.bookmarks.server &&
            bookmarks.bookmarks.server.length > 0 &&
            bookmarks.bookmarks.server[bookmarks.bookmarks.server.length - 1].source != "final"
          ) {
            console.log('rework bookmarks');
            // bookmarks are loaded
            bookmarks.bookmarks.server.forEach(function (b) {
              b.name = b.name.replace(':', "<br>");
            });

            if (window.import_bookmarks_from_af) {
              fetch("https://0xaf.org/af-owrx-bookmarks.json")
                // fetch("http://127.0.0.1:3000/bookmarks.json")
                .then(res => res.json())
                .then((out) => {
                  // var out = af_imported_bookmarks;
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
                })
                .catch(err => console.error(err));
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
          var select = document.getElementById("openwebrx-sdr-profiles-listbox");
          if (select && select.options && select.options.length > 0) {
            console.log('rework profiles');
            // disable changing of profiles
            select.onchange = function (event) {
              if (document.querySelector(".webrx-rx-title").innerHTML.indexOf("[-]") !== -1) {
                if (isAdmin() || ((isGuest() || isUser()) && current_clients == 1)) {
                  dbAddMsg({
                    label: `${af_user.username} [${select.options[select.selectedIndex].text}] (alone or admin)`,
                    stamp: date.formatDate(new Date(), 'YY-MM-DD HH:mm:ss'),
                  });
                  sdr_profile_changed();
                  return true;
                } else {
                  $q.notify({
                    type: 'negative',
                    message: 'SDR Admin has disabled changing of profiles at the moment.'
                  });
                  event.preventDefault();
                  event.stopPropagation();
                  return false;
                }
              } else {
                if (isUser() || (isGuest() && current_clients == 1)) {
                  dbAddMsg({
                    label: `${af_user.username} [${select.options[select.selectedIndex].text}]`,
                    stamp: date.formatDate(new Date(), 'YY-MM-DD HH:mm:ss'),
                  });
                  sdr_profile_changed();
                } else {
                  $q.notify({
                    type: 'negative',
                    message: 'As Guest, you are not allowed to change the profile while others are using the SDR.'
                  });
                  event.preventDefault();
                  event.stopPropagation();
                  return false;
                }
              }
            };

            // remove private profiles for non-admin users
            for (var i = 0; i < select.options.length; i++) {
              select.options[i].text = select.options[i].text.replace(/^\[-]\s+/, '');
              if (!isAdmin() &&
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


        function resetTimer() {
          clearTimeout(timeout);
          if (!isAdmin()) {
            timeout = setTimeout(() => {
                logoutUser(`
  Please do not take the client slot forever.<br>
  Give others a chance to use the SDR.<br>
                `);
                console.log(`user ${window.af_user.username} has been logged out for idleing.`)
              },
              (isGuest() ? window.idle_guest_timeout_in_minutes : window
                .idle_client_timeout_in_minutes) * 60 * 1000
            );
          }
        }




        return {
          console,
          dialog,
          user,
          pass,
          chatMessages,
          ub_error,
          rememberUser,
          loginForm,
          chatMsg,
          chatMsgInput,
          chatScrollArea,
          rightDrawerOpen,
          noJoined,

          toggleChat,
          onResize,
          registerUser,
          loginUser,
          chatSend,
          isAdmin,
          dbRemoveItem,
          loginGuest,
          deleteOldest,
        }
      }
    });

    af_app.use(Quasar, {
      config: {
        /*
        brand: {
          // primary: '#e46262',
          // ... or all other brand colors
        },
        notify: {...}, // default set of options for Notify Quasar plugin
        loading: {...}, // default set of options for Loading Quasar plugin
        loadingBar: { ... }, // settings for LoadingBar Quasar plugin
        // ..and many more (check Installation card on each Quasar component/directive/plugin)
        */
      }
    });
    Quasar.iconSet.set(Quasar.iconSet.svgFontawesomeV6);
    // Quasar.iconSet.set(Quasar.iconSet.fontawesomeV6)
    af_app.mount('#q-app');

    // Quasar.Notify.create({
    //   type: 'announcement',
    //   textColor: 'white',
    //   timeout: 5000,
    //   message: 'AF-OWRX',
    //   caption: af_owrx_version_loaded
    // });

  } // af_start_app

} // af_owrx_addon_load



// local css
var af_addon_css = /*css*/ `
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
	border: 1px dotted orange;
	display: block;
}
.af-help>code {
  border: 1px dashed darkorange;
  padding:3px;
  margin: 5px;
  display: inline-block;
}
.af-help>hr {
  margin: 10px 0;;
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
.title-info-added-features {
  color: deepskyblue;
  margin: -10px 15px 0px 15px;
	background: rgba(0,0,0,0.5);
  width: fit-content;
  padding: 3px;
  border-radius: 5px;
  font-size: smaller;
}
.title-info-added-features > a:visited {
  color: #5ca8ff;
  text-shadow: none;
}
#openwebrx-bookmarks-container .bookmark[data-source=AF] {
    background-color: #F6F;
}

#openwebrx-bookmarks-container .bookmark[data-source=AF]:after {
    border-top-color: #F6F;
}
#openwebrx-bookmarks-container .bookmark .bookmark-content {
    box-sizing: inherit;
    line-height: normal;
}
.bookmark {
  color: black;
}
.q-notification__message {
  white-space: nowrap;
}
.af-app {
  position: fixed;
  bottom: 0;
  right: 300px;
  z-index: 1;
  color: #aaa;
  background: #575757;
  height: 400px;
  width: 400px !important;
  visibility: visible;
  opacity: 0.75;
  transition: visibility 0s linear 0s, opacity 300ms, bottom 300ms;
}
.af-app-hide {
  visibility: hidden;
  opacity: 0;
  bottom: -400px;
  transition: visibility 0s linear 300ms, opacity 300ms, bottom 300ms;
}
.af-app.af-app-small-screen {
  right: 0;
}
h1 {
  font-size: 3rem;
  line-height: 1.2;
}
h3 {
  line-height: 1.2;
  font-size: 2rem;
}
.af-login-actions {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.q-message-label {
  margin: 0 !important;
}
`;



af_owrx_addon_load();

// keep last in file
var af_owrx_version_loaded = af_owrx_version;
