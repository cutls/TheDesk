//絵文字ピッカー
//最初に読み込む
$("#emoji-before").addClass("disabled");
$("#emoji-next").addClass("disabled");

//絵文字ボタンのトグル
function emoji() {
	var acct_id = $("#post-acct-sel").val();
	var selin = $("#textarea").prop('selectionStart');
	if(!selin){
		selin=0;
	}
	localStorage.setItem("cursor", selin);
	if ($("#emoji").hasClass("hide")) {
		$("#emoji").removeClass("hide")
		if (!localStorage.getItem("emoji_" + acct_id)) {
			var html =
				'<button class="btn waves-effect green" style="width:100%; padding:0; margin-top:0;" onclick="emojiGet(\'true\');">絵文字リスト取得</button>';
			$("#emoji-list").html(html);
		} else {
			emojiList('home');
		}
	} else {
		$("#emoji").addClass("hide")
	}


}

//絵文字リスト挿入
function emojiGet(parse) {
	$('#emoji-list').html('Loading...');
	var acct_id = $("#post-acct-sel").val();
	var domain = localStorage.getItem("domain_" + acct_id);
	var start = "https://" + domain + "/api/v1/custom_emojis";
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		},
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if (parse == "true") {
			$('#emoji-list').html('Parsing...');
			//絵文字をマストドン公式と同順にソート
			json.sort(function(a, b) {
				if (a.shortcode < b.shortcode) return -1;
				if (a.shortcode > b.shortcode) return 1;
				return 0;
			});
			localStorage.setItem("emoji_" + acct_id, JSON.stringify(json));
		} else {
			localStorage.setItem("emoji_" + acct_id, JSON.stringify(json));
		}
		localStorage.setItem("emojiseek", 0);
		emojiList('home')
	});
}

//リストの描画
function emojiList(target) {
	$("#now-emoji").text("カスタム絵文字");
	var acct_id = $("#post-acct-sel").val();
	var start = localStorage.getItem("emojiseek");
	if (target == "next") {
		var start = start * 1 + 127;
		localStorage.setItem("emojiseek", start);
	} else if (target == "before") {
		var start = start - 127;
		localStorage.setItem("emojiseek", start);
	} else {
		var start = 0;
		localStorage.getItem("emojiseek", 0)
	}
	var html = '';
	var obj = JSON.parse(localStorage.getItem("emoji_" + acct_id));
	var num = obj.length;
	if (num < start) {
		var start = 0;
		localStorage.setItem("emojiseek", start);
	}
	var page = Math.ceil(num / 126);
	$("#emoji-sum").text(page);
	var ct = Math.ceil(start / 126);
	if (ct == 0) {
		var ct = 1;
		$("#emoji-before").addClass("disabled");
	} else {
		$("#emoji-before").removeClass("disabled");
	}
	$("#emoji-next").removeClass("disabled");
	$("#emoji-count").text(ct);
	for (i = start; i < start + 126; i++) {
		var emoji = obj[i];
		if (emoji) {
			html = html + '<a onclick="emojiInsert(\':' + emoji.shortcode +
				': \')" class="pointer"><img src="' + emoji.url + '" width="20"></a>';
		}
	}
	$("#emoji-list").html(html);
}

//絵文字など様々なものをテキストボックスに挿入
function emojiInsert(code, del) {
	var now = $("#textarea").val();
	var selin = localStorage.getItem("cursor");
	console.log(selin);
	var now = $("#textarea").val();
	if(selin>0){
		var before   = now.substr(0, selin);
		var after    = now.substr(selin, now.length);
		newt = before + " "+ code+" " + after;
	}else{
		newt = code+" ";
	}
	if (!del) {
		$("#textarea").val(newt);
		//emoji();
	} else {
		var regExp = new RegExp(del, "g");
		var now = now.replace(regExp, "");
		$("#textarea").val(now + " " + code);
	}
	$("#textarea").focus();
}
//改行挿入
function brInsert(code) {
	var now = $("#textarea").val();
	$("#textarea").val(now + code);
	$("#textarea").focus();
}

//入力時に絵文字をサジェスト
var etimer = null;

var einput = document.getElementById("emoji-suggest");

var prev_val = einput.value;
var oldSuggest;
var suggest;
einput.addEventListener("focus", function() {
	$(".emoji-control").addClass("hide");
	$("#suggest").html("");
	window.clearInterval(etimer);
	etimer = window.setInterval(function() {
		var new_val = einput.value;
		var html="";
		if (prev_val != new_val && new_val.length > 3) {
			var obj = JSON.parse(localStorage.getItem("emoji_" + acct_id));
			var num = obj.length;
			for (i = 0; i < num; i++) {
				var emoji = obj[i];
				if ( ~emoji.shortcode.indexOf(new_val)) {
					//strにhogeを含む場合の処理
					if (emoji) {
					html = html + '<a onclick="emojiInsert(\':' + emoji.shortcode +
						': \')" class="pointer"><img src="' + emoji.url + '" width="20"></a>';
					}
				}
				}
		$("#emoji-list").html(html+'<br><a onclick="customEmoji()" class="pointer waves-effect">リセット</a>');
		};
		oldSuggest = suggest;
		prev_value = new_val;
	}, 1000);
}, false);

einput.addEventListener("blur", function() {
	window.clearInterval(etimer);
}, false);