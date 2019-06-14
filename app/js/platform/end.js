//プラットフォーム別　最後に読むやつ
//リンクを外部で開くか内部で出すか 
$(document).on('click', 'a', e => {
	var $a = $(e.target);
	var url = $a.attr('href');
	if (!url) {
		var url = $a.parent().attr('href');
	}
	var urls = [];
	if (url) {
		urls = url.match(/https?:\/\/(.+)/);
		//トゥートのURLぽかったら
		toot = url.match(/https:\/\/([a-zA-Z0-9.-]+)\/@([a-zA-Z0-9_]+)\/([0-9]+)/);
		//タグのURLぽかったら
		var tags = [];
		tags = url.match(
			/https:\/\/([-a-zA-Z0-9@.]+)\/tags\/([-_.!~*\'()a-zA-Z0-9;\/?:\&=+\$,%#]+)/
		);
		//メンションっぽかったら
		var ats = [];
		ats = url.match(
			/https:\/\/([-a-zA-Z0-9.]+)\/@([-_.!~*\'()a-zA-Z0-9;\/?:\&=+\$,%#@]+)/
		);
		if (toot) {
			if (toot[1]) {
				var acct_id = $a.parent().attr("data-acct");
				if (!acct_id) {
					acct_id = 0;
				}
				$a.parent().addClass("loadp")
				$a.parent().text("Loading...")
				detEx(url, acct_id);
			}

		} else if (tags) {
			if (tags[2]) {
				var acct_id = $a.parent().attr("data-acct");
				if (!acct_id) {
					acct_id = 0;
				}
				tl('tag', decodeURI(tags[2]), acct_id, 'add')
			}
		} else if (ats) {
			if (ats[2]) {
				//Quesdon判定
				if (!~ats[2].indexOf("@")) {
					udgEx(ats[2] + "@" + ats[1], "main");
					return false
				} else {
					const {
						shell
					} = require('electron');

					shell.openExternal(url);
				}


			}
		} else {
			//hrefがhttp/httpsならブラウザで
			if (urls) {
				if (urls[0]) {
					if (~url.indexOf("thedeks.top")) {
						//alert("If you recieve this alert, let the developer(Cutls@kirishima.cloud) know it with a screenshot.");
						url = "https://thedesk.top";
					}
					//shell.openExternal(url);
					postMessage(["openUrl", url], "*")
				} else {

					location.href = url;
				}
			} else {
				location.href = url;
			}
		}
	}
	return false;
});

//よく使うライブラリ

//コピー
function execCopy(string) {
	var temp = $("#copy");
	temp.val(string);
	temp.select();
	var result = document.execCommand('copy');
	return result;
}
function progshow(e) {
	if (e.lengthComputable) {
		var percent = e.loaded / e.total;
		console.log("Progress: " + percent * 100);
		$("#imgsel").hide();
		if (percent < 1) {
			$("#imgup").text(Math.floor(percent * 100) + "%");
		} else {
			$("#imgup").text(lang.lang_progress);
		}
	}
}
function opendev() {
	var webview = document.getElementById("webview");
	webview.openDevTools();
	/*webview.sendInputEvent({
		type: "keyDown",
		keyCode: '2'
	  });
	  */
}
function playSound() {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();
	context.createBufferSource().start(0);
	context.decodeAudioData(request.response, function (buf) {
		console.log("Playing:" + source)
		source.buffer = buf;
		source.loop = false;
	});
	source = context.createBufferSource();
	volumeControl = context.createGain();
	source.connect(volumeControl);
	volumeControl.connect(context.destination);
	volumeControl.gain.value = 0.8
	source.start(0);
}