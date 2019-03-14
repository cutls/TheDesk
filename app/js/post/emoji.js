//絵文字ピッカー
//最初に読み込む
$("#emoji-before").addClass("disabled");
$("#emoji-next").addClass("disabled");

//絵文字ボタンのトグル
function emojiToggle() {
	var acct_id = $("#post-acct-sel").val();
	var selin = $("#textarea").prop('selectionStart');
	if(!selin){
		selin=0;
	}
	localStorage.setItem("cursor", selin);

	if ($("#emoji").hasClass("hide")) {
		$("#emoji").removeClass("hide")
		$("#right-side").show()
		$("#suggest").html("");
		if (!localStorage.getItem("emoji_" + acct_id)) {
			var html =
				'<button class="btn waves-effect green" style="width:100%; padding:0; margin-top:0;" onclick="emojiGet(\'true\');">'+lang.lang_emoji_get+'</button>';
			$("#emoji-list").html(html);
		} else {
			emojiList('home');
		}
	} else {
		$("#poll").addClass("hide")
		$("#emoji").addClass("hide")
		$("#suggest").html("");
		$("#right-side").hide()
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
	$("#now-emoji").text(lang.lang_emoji_custom);
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
	if (ct === 0) {
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
	var selin = $("#textarea").prop('selectionStart');
	if(!selin){
		selin=0;
	}
	localStorage.setItem("cursor", selin);
}
//改行挿入
function brInsert(code) {
	if(!$('#post-box').hasClass("appear")){
		localStorage.setItem("nohide",true);
		show();
	}
	var now = $("#textarea").val();
	$("#textarea").val(now + code);
	$("#textarea").focus();
}
