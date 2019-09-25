//レイアウトの設定

var websocketOld = [];
var websocket = [];
var websocketHome = [];
var websocketLocal = [];
var websocketNotf = [];

//カラム追加ボックストグル
function addColumnMenu() {
	$("#left-menu div").removeClass("active");
	$("#addColumnMenu").addClass("active");
	$(".menu-content").addClass("hide");
	$("#add-box").removeClass("hide");
	addselCk()
}
$('.type').click(function () {
	$(".type").removeClass("active");
	$(this).addClass("active");
	$("#type-sel").val($(this).attr("data-type"))
})
//最初、カラム変更時に発火
function parseColumn(target, dontclose) {
	if (target === 0) {
		//this is kuso
		target = "zero"
	}
	console.log("%c Parse column", "color:red;font-size:125%");
	var size = localStorage.getItem("size");
	if (size) {
		$("#timeline-container").css("font-size", size + "px");
		$(".toot-reset").css("font-size", size + "px");
		$(".cont-series").css("font-size", size + "px");
	}
	if (localStorage.getItem("menu-done")) {
		$("#fukidashi").addClass("hide")
	}
	if (!dontclose && !target) {
		tlCloser();
	}

	var multi = localStorage.getItem("multi");
	if (multi) {
		var obj = JSON.parse(multi);

		var templete;
		Object.keys(obj).forEach(function (key) {
			var acct = obj[key];
			localStorage.setItem("name_" + key, acct.name);
			localStorage.setItem("user_" + key, acct.user);
			localStorage.setItem("user-id_" + key, acct.id);
			localStorage.setItem("prof_" + key, acct.prof);
			localStorage.setItem("domain_" + key, acct.domain);
			localStorage.setItem("acct_" + key + "_at", acct.at);
			notf(key, 0);
			ckdb(key);
			//フィルターデータ読もう
			getFilter(key);
			var domain = localStorage.getItem("domain_" + key);
			if (localStorage.getItem("mode_" + domain) == "misskey") {
				localStorage.removeItem("misskey_wss_" + key)
				connectMisskey(key, false)
			}
		});
	}
	var acctlist = obj;
	console.table(obj);
	/*var xed=localStorage.getItem("xed");
	if(xed){
		xpand();
	}*/
	var col = localStorage.getItem("column");
	if (!col) {
		var obj = [{
			domain: 0,
			type: 'local'
		}];
		var json = JSON.stringify(obj);
		localStorage.setItem("column", json);
	} else {
		var obj = JSON.parse(col);
	}
	var numtarget = false
	if (target == "add") {
		var tlidtar = obj.length - 1
		obj = [obj[tlidtar]]
	} else if (target) {
		var tlidtar = target
		if (target == "zero") {
			target = 0
		}
		obj = [obj[target]]
		numtarget = true
	} else {
		var tlidtar = null
		if ($("#timeline-container").length) {
			$("#timeline-container").html("");
			$(".box, .boxIn").resizable("destroy");
		}
	}
	var basekey = 0;
	for (var key = 0; key < obj.length; key++) {
		var next = key + 1;
		//acctって言いながらタイムライン
		var acct = obj[key];
		if (tlidtar) {
			if (tlidtar == "zero") {
				key = 0
			} else {
				key = tlidtar
			}

		}
		if (acct.type == "notf") {
			var notf_attr = ' data-notf=' + acct.domain;
			var if_notf = "hide";
		} else {
			var notf_attr = '';
			var if_notf = "";
		}
		if (localStorage.getItem("notification_" + acct.domain)) {
			var unique_notf = lang.lang_layout_thisacct.replace("{{notf}}", localStorage.getItem("notification_" + acct.domain));
		} else {
			if (lang.language == "ja") {
				var notflocale = "通知";
			} else if (lang.language == "en") {
				var notflocale = "Notification";
			}
			var unique_notf = lang.lang_layout_thisacct.replace("{{notf}}", notflocale);
		}
		var insert = "";
		var icnsert = "";
		if (acct.background) {
			if (acct.text == "def") {

			} else {
				if (acct.text == "black") {
					var txhex = "000000";
					var ichex = "9e9e9e"
				} else if (acct.text == "white") {
					var txhex = "ffffff";
					var ichex = "eeeeee"
				}
				insert = 'background-color:#' + acct.background + '; color: #' + txhex + '; ';
				icnsert = ' style="color: #' + ichex + '" ';
			}
		}
		console.log(acct);
		if (acctlist[acct.domain]) {
			if (acctlist[acct.domain].background != "def") {
				insert = insert + " border-bottom:medium solid #" + acctlist[acct.domain].background + ";";
			}
		}
		if (acct.type == "notf" && localStorage.getItem("setasread") == "no") {
			localStorage.setItem("hasNotfC_" + acct.domain, "true");
		} else {
			localStorage.removeItem("hasNotfC_" + acct.domain);
		}
		var width = localStorage.getItem("width");
		if (width) {
			var css = " min-width:" + width + "px;"
		}
		if(acct.width){
			var css = " min-width:" + acct.width + "px;max-width:" + acct.width + "px;"
		}
		if(!css){
			var css = ""
		}
		if (acct.type == "webview") {
			if (localStorage.getItem("fixwidth")) {
				var fixwidth = localStorage.getItem("fixwidth");
				var css = " min-width:" + fixwidth + "px;"
			} else {
				var css = "";
			}
			var html = webviewParse("https://tweetdeck.twitter.com", key, insert, icnsert, css);
			$("#timeline-container").append(html);
		} else if (acct.type == "tootsearch") {
			if (!acct.left_fold) {
				basekey = key;
			}

			var anime = localStorage.getItem("animation");
			if (anime == "yes" || !anime) {
				var animecss = "box-anime";
			} else {
				var animecss = "";
			}
			unstreamingTL(acct.type, key, basekey, insert, icnsert, acct.left_fold, css, animecss, acct.data);
		} else {
			var anime = localStorage.getItem("animation");
			if (anime == "yes" || !anime) {
				var animecss = "box-anime";
			} else {
				var animecss = "";
			}
			var unread = '<a id="unread_' + key + '" onclick="showUnread(' + key + ',\'' + acct.type + '\',\'' + acct.domain + '\')" class="setting nex" title="' + lang.lang_layout_unread + '"><i class="material-icons waves-effect nex">more</i></a>'
			if (acct.type == "notf") {
				var exclude = lang.lang_excluded + ':<br><label><input type="checkbox" class="filled-in" id="exc-reply-' + key + '" ' + excludeCk(key, "mention") + ' /><span><i class="fas fa-share exc-icons"></i></span></label> ' +
					'<label><input type="checkbox" class="filled-in" id="exc-fav-' + key + '"  ' + excludeCk(key, "favourite") + ' /><span><i class="fas fa-star exc-icons"></i></span></label> ' +
					'<label><input type="checkbox" class="filled-in" id="exc-bt-' + key + '" ' + excludeCk(key, "reblog") + ' /><span><i class="fas fa-retweet exc-icons"></i></span></label> ' +
					'<label><input type="checkbox" class="filled-in" id="exc-follow-' + key + '" ' + excludeCk(key, "follow") + ' /><span><i class="fas fa-users exc-icons"></i></span></label> ' +
					'<label><input type="checkbox" class="filled-in" id="exc-poll-' + key + '" ' + excludeCk(key, "poll") + ' /><span><i class="fas fa-tasks exc-icons"></i></span></label> ' +
					'<button class="btn waves-effect" style="width:60px; padding:0;" onclick="exclude(' + key + ')">Filter</button>';
				if (checkNotfFilter(key)) {
					exclude = exclude + '<button class="btn red waves-effect" style="width:60px; padding:0;" onclick="resetNotfFilter(' + key + ')">Clear all</button>'
				}
				exclude = exclude + "<br>";

			} else if (acct.type == "home") {
				var exclude = '<a onclick="ebtToggle(' + key +
					')" class="setting nex"><i class="fas fa-retweet waves-effect nex" title="' + lang.lang_layout_excludingbt + '" style="font-size:24px"></i><span id="sta-bt-' +
					key + '">Off</span></a>' + lang.lang_layout_excludingbt + '<br>';

			} else {
				var exclude = "";
				unread = ""
			}
			var markers = localStorage.getItem("markers");
			if (markers == "yes") {
				markers = true;
			} else {
				markers = false
			}
			if (!markers) {
				unread = ""
			}
			if (!acct.left_fold) {
				basekey = key;
				if (!numtarget) {
					var basehtml = '<div style="' + css + '" class="box ' + animecss + '" id="timeline_box_' + basekey + '_parentBox"></div>';
					$("#timeline-container").append(basehtml);
				}
				var left_hold = '<a onclick="leftFoldSet(' + key + ')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_leftFold + '">view_agenda</i></a>' + lang.lang_layout_leftFold + '</span><br>';
			} else {
				var left_hold = '<a onclick="leftFoldRemove(' + key + ')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_leftUnfold + '">view_column</i></a>' + lang.lang_layout_leftUnfold + '</span><br>';
			}
			if (key === 0) {
				left_hold = '';
			}
			if (localStorage.getItem("mode_" + localStorage.getItem("domain_" + acct.domain)) == "misskey") {
				var isMisRed = ""
				exclude = ""
				var if_misskey_hide = "hide"
			} else {
				var isMisRed = "red-text"
				var if_misskey_hide = ""
			}
			if(acct.height){
				var addHeight = " min-height:" + acct.height + "px;max-height:" + acct.height + "px;"
			}else {
				var addHeight = ""
			}
			var html = '<div class="boxIn" id="timeline_box_' + key + '_box" tlid="' + key +
				'" data-acct="' + acct.domain + '" style="' + addHeight + '"><div class="notice-box z-depth-2" id="menu_' + key + '" style="' + insert + ' ">' +
				'<div class="area-notice"><i class="material-icons waves-effect ' + isMisRed + '" id="notice_icon_' + key + '"' + notf_attr + ' style="font-size:40px; padding-top:25%;" onclick="checkStr(\'' + acct.type + '\', \'' + data + '\', \'' + acct.domain + '\', \'' + key + '\', \'' + delc + '\',\'' + voice + '\',null)" title="' + lang.lang_layout_gotop + '"></i></div>' +
				'<div class="area-notice_name"><span id="notice_' + key + '" class="tl-title"></span></div>' +
				'<div class="area-a1"><a onclick="notfToggle(' + acct.domain + ',' + key +
				')" class="setting nex ' + if_notf + '" title="' + unique_notf + '"' + icnsert + '><i class="material-icons waves-effect nex notf-icon_' +
				acct.domain + '">notifications</i></a>' + unread + '</div><div class="area-sta"><span class="new badge teal notf-reply_' + acct.domain + ' hide" data-badge-caption="Reply">0</span><span class="new badge yellow black-text notf-fav_' + acct.domain + ' hide" data-badge-caption="Fav">0</span><span class="new badge blue notf-bt_' + acct.domain + ' hide" data-badge-caption="BT">0</span><span class="new badge orange notf-follow_' + acct.domain + ' hide" data-badge-caption="Follow">0</span></div>' +
				'<div class="area-a2"><a onclick="removeColumn(' + key +
				')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_delthis + '"' + icnsert + '>cancel</i></a></div>' +
				'<div class="area-a3"><a onclick="setToggle(' + key +
				')" class="setting nex" title="' + lang.lang_layout_setthis + '"' + icnsert + '><i class="material-icons waves-effect nex">settings</i></a></div></div>' +
				'<div class="column-hide notf-indv-box z-depth-4" id="notf-box_' + key +
				'"><div id="notifications_' + key +
				'" data-notf="' + acct.domain + '" data-type="notf" class="notf-timeline"></div></div><div class="column-hide notf-indv-box" id="util-box_' + key +
				'" style="padding:5px;">' + exclude + left_hold + '<a onclick="mediaToggle(' + key +
				')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_mediafil + '">perm_media</i><span id="sta-media-' +
				key + '">On</span></a>' + lang.lang_layout_mediafil + '<br><a onclick="cardToggle(' + key +
				')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_linkanades + '">link</i><span id="sta-card-' +
				key + '">On</span></a>' + lang.lang_layout_linkana + '<br><a onclick="voiceToggle(\'' + key +
				'\')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_tts + '">hearing</i><span id="sta-voice-' + key + '">' + 
				'">On</span></a>' + lang.lang_layout_tts + 'TL<br><a onclick="columnReload(' + key +
				',\'' + acct.type + '\')" class="setting nex ' + if_misskey_hide + '"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_reconnect + '">refresh</i></a><span>' + lang.lang_layout_reconnect + '</span><br>' + lang.lang_layout_headercolor + '<br><div id="picker_' + key + '" class="color-picker"></div></div><div class="tl-box" tlid="' + key + '"><div id="timeline_' + key +
				'" class="tl ' + acct.type + '-timeline " tlid="' + key + '" data-type="' + acct.type + '" data-acct="' + acct.domain + '" data-const="' + acct.type + '_' + acct.domain + '"><div id="landing_' + key + '" style="text-align:center">' + lang.lang_layout_nodata + '</div></div></div>'
			if (numtarget) {
				$('timeline_box_' + key + '_box').html(html)
			} else {
				$('#timeline_box_' + basekey + '_parentBox').append(html)
			}
			localStorage.removeItem("pool_" + key);
			if (acct.data) {
				var data = acct.data;
			} else {
				var data = "";
			}
			if (localStorage.getItem("catch_" + key)) {
				var delc = "true";
			} else {
				var delc = "false";
			}

			if (localStorage.getItem("voice_" + key)) {
				var voice = true;
			} else {
				var voice = false;
			}
			tl(acct.type, data, acct.domain, key, delc, voice, "");
			cardCheck(key);
			ebtCheck(key);
			mediaCheck(key);
			catchCheck(key);
			voiceCheck(key);
			var css = ""
		}
	}
	var box = localStorage.getItem("box");
	if (box == "absolute") {
		setTimeout(show, 1000);
	}
	if (localStorage.getItem("reverse")) {
		$("#bottom").removeClass("reverse");
		$(".leftside").removeClass("reverse");
	}
	$("#bottom").removeClass("hide");
	if (localStorage.getItem("sec") && localStorage.getItem("sec") != "nothing") {
		secvis(localStorage.getItem("sec"));
	}
	favTag();
	var cw = localStorage.getItem("always-cw");
	if (cw == "yes") {
		if (!$("#cw").hasClass("cw-avail")) {
			$("#cw-text").show();
			$("#cw").addClass("yellow-text");
			$("#cw").addClass("cw-avail");
			var cwt = localStorage.getItem("cw-text");
			if (cwt) {
				$("#cw-text").val(cwt);
			}
		}
	}
	$(".box, .boxIn").resizable({
		minHeight: 50,
		minWidth: 50,
		grid: 50,
		resize: function (event, ui) {
			$(this).css("min-width", ui.size.width + "px")
			$(this).css("max-width", ui.size.width + "px")
			$(this).css("min-height", ui.size.height + "px")
			$(this).css("max-height", ui.size.height + "px")
		},
		stop: function (event, ui) {
			var col = localStorage.getItem("column");
			var o = JSON.parse(col);
			var width = ui.size.width
			var height = ui.size.height
			if ($(this).hasClass("boxIn")) {
				//縦幅。その縦幅を持つカラムのidは
				console.log("tate")
				var key = $(this).attr("tlid")
				var obj = o[key];
				obj.height = height;
				o[key] = obj;
			} else {
				//横幅。その縦幅を持つカラムのidは
				console.log("yoko")
				var key = $(this).find(".boxIn").attr("tlid")
				var obj = o[key];
				obj.width = width;
				o[key] = obj;
			}
			var json = JSON.stringify(o);
			localStorage.setItem("column", json);
		}
	});
}
function checkStr(type, data, acct_id, key, delc, voice) {
	if ($('#notice_icon_' + key).hasClass("red-text") && type != "notf" && type != "mix") {
		goTop(key);
		tlDiff(type, data, acct_id, key, delc, voice, "");
	} else {
		goTop(key);
	}
}
//セカンダリートゥートボタン
function secvis(set) {
	if (set == "public") {
		$("#toot-sec-icon").text("public");
		$("#toot-sec-btn").addClass("purple");
	} else if (set == "unlisted") {
		$("#toot-sec-icon").text("lock_open");
		$("#toot-sec-btn").addClass("blue");
	} else if (set == "private") {
		$("#toot-sec-icon").text("lock");
		$("#toot-sec-btn").addClass("orange");
	} else if (set == "direct") {
		$("#toot-sec-icon").text("mail");
		$("#toot-sec-btn").addClass("red");
	} else if (set == "limited") {
		$("#toot-sec-icon").text("group");
		$("#toot-sec-btn").addClass("teal");
	} else if (set == "local") {
		$("#toot-sec-icon").text("visibility");
		$("#toot-sec-btn").addClass("light-blue");
	}
	$("#toot-sec-btn").removeClass("hide");
}
//カラム追加
function addColumn() {
	var acct = $("#add-acct-sel").val();
	if (acct != "webview" && acct != "noauth") {
		localStorage.setItem("last-use", acct);
	}
	var type = $("#type-sel").val();
	if (acct == "noauth") {
		acct = $("#noauth-url").val();
		type = "noauth"
	} else if (acct == "webview") {
		acct = "";
		type = "webview"
	}
	var add = {
		domain: acct,
		type: type
	};
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	if (!obj) {
		var leng = 0;
		var json = JSON.stringify([add]);
		localStorage.setItem("column", json);
	} else {
		var leng = obj.length;
		obj.push(add);
		var json = JSON.stringify(obj);
		localStorage.setItem("column", json);
	}

	parseColumn('add');
}
function addselCk() {
	var acct = $("#add-acct-sel").val();
	var domain = localStorage.getItem("domain_" + acct);
	if (acct == "webview") {
		$("#auth").addClass("hide");
		$("#noauth").addClass("hide");
		$("#webview-add").removeClass("hide");
	} else if (acct == "noauth") {
		$("#auth").addClass("hide");
		$("#noauth").removeClass("hide");
		$("#webview-add").addClass("hide");
	} else {
		$("#auth").removeClass("hide");
		$("#noauth").addClass("hide");
		$("#webview-add").addClass("hide");
	}
	if (domain == "knzk.me" || domain == "mstdn.y-zu.org") {
		$("#type-sel").append('<option value="dm" data-trans="dm" id="direct-add">' + lang.layout_dm + '</option>');
	} else {
		$("#direct-add").remove();
	}
}
//カラム削除
function removeColumn(tlid) {
	$("#sort-box").addClass("hide");
	$("#sort-box").removeClass("show");
	Swal.fire({
		title: lang.lang_layout_deleteColumn,
		text: lang.lang_layout_deleteColumnDesc,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no
	}).then((result) => {
		if (result.value) {
			var multi = localStorage.getItem("column");
			var obj = JSON.parse(multi);
			obj.splice(tlid, 1);
			var json = JSON.stringify(obj);
			localStorage.setItem("column", json);
			sortLoad()
			$("#timeline_box_" + tlid + "_parentBox").remove()
		}
		$("#sort-box").removeClass("hide");
		$("#sort-box").addClass("show");
	});
}

//設定トグル
function setToggle(tlid) {
	colorpicker(tlid);
	if ($("#util-box_" + tlid).hasClass("column-hide")) {
		$("#util-box_" + tlid).css("display", "block")
		$("#util-box_" + tlid).animate({
			'height': '200px'
		}, {
			'duration': 300,
			'complete': function () {
				$("#util-box_" + tlid).css("overflow-y", "scroll")
				$("#util-box_" + tlid).removeClass("column-hide")
			}
		});
	} else {
		$("#util-box_" + tlid).css("overflow-y", "hidden")
		$("#util-box_" + tlid).animate({
			'height': '0'
		}, {
			'duration': 300,
			'complete': function () {
				$("#util-box_" + tlid).addClass("column-hide")
				$("#util-box_" + tlid).css("display", "none")
			}
		});
	}
}
function colorpicker(key) {
	temp =
		'<div onclick="coloradd(' + key + ',\'def\',\'def\')" class="pointer">Default</div>' +
		'<div onclick="coloradd(' + key + ',\'f44336\',\'white\')" class="red white-text pointer">Red</div>' +
		'<div onclick="coloradd(' + key + ',\'e91e63\',\'white\')" class="pink white-text pointer">Pink</div>' +
		'<div onclick="coloradd(' + key + ',\'9c27b0\',\'white\')" class="purple white-text pointer">Purple</div>' +
		'<div onclick="coloradd(' + key + ',\'673ab7\',\'white\')" class="deep-purple white-text pointer">Deep-purple</div>' +
		'<div onclick="coloradd(' + key + ',\'3f51b5\',\'white\')" class="indigo white-text pointer">Indigo</div>' +
		'<div onclick="coloradd(' + key + ',\'2196f3\',\'white\')" class="blue white-text pointer">Blue</div>' +
		'<div onclick="coloradd(' + key + ',\'03a9f4\',\'black\')" class="light-blue black-text pointer">Light-blue</div>' +
		'<div onclick="coloradd(' + key + ',\'00bcd4\',\'black\')" class="cyan black-text pointer">Cyan</div>' +
		'<div onclick="coloradd(' + key + ',\'009688\',\'white\')" class="teal white-text pointer">Teal</div>' +
		'<div onclick="coloradd(' + key + ',\'4caf50\',\'black\')" class="green black-text pointer">Green</div>' +
		'<div onclick="coloradd(' + key + ',\'8bc34a\',\'black\')" class="light-green black-text pointer">Light-green</div>' +
		'<div onclick="coloradd(' + key + ',\'cddc39\',\'black\')" class="lime black-text pointer">Lime</div>' +
		'<div onclick="coloradd(' + key + ',\'ffeb3b\',\'black\')" class="yellow black-text pointer">Yellow</div>' +
		'<div onclick="coloradd(' + key + ',\'ffc107\',\'black\')" class="amber black-text pointer">Amber</div>' +
		'<div onclick="coloradd(' + key + ',\'ff9800\',\'black\')" class="orange black-text pointer">Orange</div>' +
		'<div onclick="coloradd(' + key + ',\'ff5722\',\'white\')" class="deep-orange white-text pointer">Deep-orange</div>' +
		'<div onclick="coloradd(' + key + ',\'795548\',\'white\')" class="brown white-text pointer">Brown</div>' +
		'<div onclick="coloradd(' + key + ',\'9e9e9e\',\'white\')" class="grey white-text pointer">Grey</div>' +
		'<div onclick="coloradd(' + key + ',\'607d8b\',\'white\')" class="blue-grey white-text pointer">Blue-grey</div>' +
		'<div onclick="coloradd(' + key + ',\'000000\',\'white\')" class="black white-text pointer">Black</div>' +
		'<div onclick="coloradd(' + key + ',\'ffffff\',\'black\')" class="white black-text pointer">White</div>';
	$("#picker_" + key).html(temp);
}
function coloradd(key, bg, txt) {
	var col = localStorage.getItem("column");
	var o = JSON.parse(col);
	var obj = o[key];
	obj.background = bg;
	obj.text = txt;
	o[key] = obj;
	var json = JSON.stringify(o);
	localStorage.setItem("column", json);
	if (txt == "def") {
		$("#menu_" + key).css("background-color", "");
		$("#menu_" + key).css("color", "");
	} else {
		$("#menu_" + key).css('background-color', '#' + bg);
		if (txt == "black") {
			var bghex = "000000";
			var ichex = "9e9e9e"
		} else if (txt == "white") {
			var bghex = "ffffff";
			var ichex = "eeeeee"
		}
		$("#menu_" + key + " .nex").css('color', '#' + ichex);
		$("#menu_" + key).css('color', '#' + bghex);
	}
}
//禁断のTwitter
function webviewParse(url, key, insert, icnsert, css) {
	var html = '<div class="box" id="timeline_box_' + key + '_box" tlid="' + key +
		'" style="' + css + '"><div class="notice-box z-depth-2" id="menu_' + key + '" style="' + insert + '">' +
		'<div class="area-notice"><i class="fab fa-twitter waves-effect" id="notice_icon_' + key + '" style="font-size:40px; padding-top:25%;"></i></div>' +
		'<div class="area-notice_name tl-title">WebView(' + url + ')</div>' +
		'<div class="area-sta"></div>' +
		'<div class="area-a2"><a onclick="removeColumn(' + key +
		')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_delthis + '"' + icnsert + '>cancel</i></a></div>' +
		'<div class="area-a3"><a onclick="setToggle(' + key +
		')" class="setting nex" title="' + lang.lang_layout_setthis + '"' + icnsert + '><i class="material-icons waves-effect nex">settings</i></a></div></div>' +
		'<div class="column-hide notf-indv-box z-depth-4" id="notf-box_' + key +
		'"></div><div class="column-hide notf-indv-box" id="util-box_' + key +
		'" style="padding:5px;">' + lang.lang_layout_headercolor + '<br><div id="picker_' + key + '" class="color-picker"></div></div><div class="tl-box" tlid="' + key + '" style="width:100%;height:100%;"><div id="timeline_' + key +
		'" class="tl" tlid="' + key + '" data-type="webview" style="width:100%;height:100%;"><webview src="' + url + '" style="width:100%;height:100%;" id="webview" preload="./js/platform/twitter.js"></webview></div></div></div>';
	return html;
}
function unstreamingTL(type, key, basekey, insert, icnsert, left_fold, css, animecss, q) {
	if (!left_fold) {
		var basehtml = '<div style="' + css + '" class="box ' + animecss + '" id="timeline_box_' + basekey + '_parentBox"></div>';
		$("#timeline-container").append(basehtml);
		var left_hold = '<a onclick="leftFoldSet(' + key + ')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_leftFold + '">view_agenda</i></a>' + lang.lang_layout_leftFold + '</span><br>';
	} else {
		var left_hold = '<a onclick="leftFoldRemove(' + key + ')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_leftUnfold + '">view_column</i></a>' + lang.lang_layout_leftUnfold + '</span><br>';
	}
	var html = '<div class="boxIn" id="timeline_box_' + key + '_box" tlid="' + key +
		'"><div class="notice-box z-depth-2" id="menu_' + key + '" style="' + insert + ' ">' +
		'<div class="area-notice"><i class="material-icons waves-effect" id="notice_icon_' + key + '" style="font-size:40px; padding-top:25%;" onclick="tootsearch(' + key + ',\'' + q + '\');" title="' + lang.lang_layout_gotop + '"></i></div>' +
		'<div class="area-notice_name"><span id="notice_' + key + '" class="tl-title"></span></div>' +
		'<div class="area-a1"></div><div class="area-sta"></div>' +
		'<div class="area-a2"><a onclick="removeColumn(' + key +
		')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_delthis + '"' + icnsert + '>cancel</i></a></div>' +
		'<div class="area-a3"><a onclick="setToggle(' + key +
		')" class="setting nex" title="' + lang.lang_layout_setthis + '"' + icnsert + '><i class="material-icons waves-effect nex">settings</i></a></div></div>' +
		'<div class="column-hide notf-indv-box" id="util-box_' + key +
		'" style="padding:5px;">' + left_hold + '<a onclick="mediaToggle(' + key +
		')" class="setting nex"><i class="material-icons waves-effect nex" title="' + lang.lang_layout_mediafil + '">perm_media</i><span id="sta-media-' +
		key + '">On</span></a>' + lang.lang_layout_mediafil + '<br>' + lang.lang_layout_headercolor + '<br><div id="picker_' + key + '" class="color-picker"></div></div><div class="tl-box" tlid="' + key + '"><div id="timeline_' + key +
		'" class="tl ' + type + '-timeline " tlid="' + key + '" data-type="' + type + '" data-acct="nostr"><div id="landing_' + key + '" style="text-align:center">' + lang.lang_layout_nodata + '</div></div></div>'
	$('#timeline_box_' + basekey + '_parentBox').append(html);
	tootsearch(key, q);
	cardCheck(key);
	ebtCheck(key);
	mediaCheck(key);
	catchCheck(key);
	voiceCheck(key);
	return true;
}
function leftFoldSet(key) {
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	obj[key].left_fold = true;
	var json = JSON.stringify(obj);
	localStorage.setItem("column", json);
	parseColumn();
}
function leftFoldRemove(key) {
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	obj[key].left_fold = false;
	var json = JSON.stringify(obj);
	localStorage.setItem("column", json);
	parseColumn();
}