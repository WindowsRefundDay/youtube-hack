// ==UserScript==
// @name        Bypass YouTube age verification Improved
// @id          DelvinFox.Userscript.Bypass-YouTube-age-verification
// @namespace   delvin@userscripts.org
// @description A script that bypasses YouTube age verification without logging in.
// @author      DelvinFox, Volkan K.
// @licence     GNU General Public License version 3 or any later version; https://www.gnu.org/licenses/gpl-3.0.html
// @copyright   2011 DelvinFox, 2012-2013 Volkan K.
// @homepageURL https://userscripts.org/users/108756
// @version     2.6
// @updateURL   https://userscripts.org/scripts/source/156725.meta.js
// @domain      youtube.com
// @domain      www.youtube.com
// @include     http://youtube.com/verify_age*
// @include     http://www.youtube.com/verify_age*
// @include     https://youtube.com/verify_age*
// @include     https://www.youtube.com/verify_age*
// @include     http://youtube.com/verify_controversy*
// @include     http://www.youtube.com/verify_controversy*
// @include     https://youtube.com/verify_controversy*
// @include     https://www.youtube.com/verify_controversy*
// @include     http://youtube.com/watch*
// @include     http://www.youtube.com/watch*
// @include     https://youtube.com/watch*
// @include     https://www.youtube.com/watch*
// ==/UserScript==

if ( window.location.pathname.match("/verify_controversy") ) {
	please_no_more_action = true;
	if ( ignorecont=document.getElementById('ignorecont') ) {
		ignorecont.checked=true;
		ignorecont.form.submit();
	} 
	else if ( verify_actions=document.getElementById('verify-actions') ) {
		buttons=verify_actions.getElementsByTagName('button');
		for (var i=0;i<buttons.length;i++) {
			if ( buttons[i].getAttribute("type")=="submit" ) {
				buttons[i].click();
			}
		}
	}
}

var url=null;
var base_tag_needed=false;
var match_next_url = window.location.search.match( /[^?&]*next_url=([^&]*)/ );
if (match_next_url!=null){
	var base_tag_needed = true;
	var url = decodeURIComponent( match_next_url[1] );
}

function do_your_thing_romeo( url , base_tag_needed ) {
 //alert(url); return false; // for debug
 GM_xmlhttpRequest({
  method: "GET",
  headers: {
   "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
  },
  url: url,
  onload: function( response ) {
   if ( response.status == 200 ) {
    if( response.finalUrl.match( "/verify_controversy" ) ) {
     window.location.href = url + "&skipcontrinter=1";
    } else {
	 if (base_tag_needed && !(/<base /i.test(response.responseText)) && response.finalUrl) {
     	result = response.responseText.replace(/(<head[^>]*>)([ \t]*)([\r]?[\n]?)/ig, '$1$2$3<base href="'+response.finalUrl+'">$3');
		replace_my_page(result);
     } else {
		replace_my_page(response.responseText);
     }
    }
   }
  }
 });
}

function replace_my_page(resultHTML){
	unsafeWindow.my_resultHTML=resultHTML;
	replace_js='document.open( "text/html", "replace" );'+"\r\n"
	+'document.write(my_resultHTML);'+"\r\n"
	+'document.close();'+"\r\n";
	addScript(document.body, replace_js);
}

// Function : addScript()
// Source: http://userscripts.org/groups/51

function addScript(body, js, link) {
	if (!body){
		var body = document.body; 
	}
	script = document.createElement('script');
    if (!body) return;
    script.type = 'text/javascript';
	if ( (js=='') && (link!='') ){
		script.src = link;
	} else {
		script.textContent = js;
	}
    body.appendChild(script);
	//return script;
}

function helloworld(){
	if( url && url.match( /^\/|(https?:\/\/(www\.)?youtube\.com\/)/ ) && document.getElementById( "verify" ) ) {
		if ( (typeof please_no_more_action == "undefined") || (please_no_more_action != true) ){
			do_your_thing_romeo(url, base_tag_needed);
		}
	} else if ( document.getElementById('watch7-player-age-gate-content') ) {
		do_your_thing_romeo(window.location.href);
	}
}

window.addEventListener("load", helloworld, false);
