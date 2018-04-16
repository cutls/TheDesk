/*ログイン処理・認証までのJS*/
//最初に読むやつ
//アスタルテ判定初期化

localStorage.removeItem("kirishima")
localStorage.removeItem("imas")
localStorage.removeItem("image");
var idata={
	"kirishima.cloud":"instance",
	"kirishima.cloud_name":"アスタルテ",
	"kirishima.cloud_letters":"6229",
	"kirishima.cloud_bbcode":"enabled",
	"kirishima.cloud_markdown":"disabled",
	"minohdon.jp":"instance",
	"minohdon.jp_name":"箕面丼",
	"minohdon.jp_letters":"500",
	"minohdon.jp_bbcode":"disabled",
	"minohdon.jp_markdown":"disabled",
	"knzk.me":"instance",
	"knzk.me_name":"神崎丼",
	"knzk.me_letters":"5000",
	"knzk.me_bbcode":"disabled",
	"knzk.me_markdown":"disabled",
	"mastodos.com":"instance",
	"mastodos.com_name":"マストどす",
	"mastodos.com_letters":"500",
	"mastodos.com_bbcode":"disabled",
	"mastodos.com_markdown":"disabled",
	"dev.kirishima.cloud":"hidden",
	"dev.kirishima.cloud_name":"アスタルテ(Dev)",
	"dev.kirishima.cloud_letters":"6229",
	"dev.kirishima.cloud_bbcode":"enabled",
	"dev.kirishima.cloud_markdown":"disabled",
	"mstdn.y-zu.org":"instance",
	"mstdn.y-zu.org_name":"Yづドン!(502 BadGateway)",
	"mstdn.y-zu.org_letters":"500",
	"mstdn.y-zu.org_bbcode":"disabled",
	"mstdn.y-zu.org_markdown":"disabled",
	"imastodon.net":"instance",
	"imastodon.net_name":"im@stodon",
	"imastodon.net_letters":"500",
	"imastodon.net_bbcode":"disabled",
	"imastodon.net_markdown":"disabled",
	"imastodon.net_home":"オフィス",
	"imastodon.net_local":"楽屋",
	"imastodon.net_notification":"ホワイトボード",
	"imastodon.net_public":"ライブステージ",
	"mstdn.osaka":"instance",
	"mstdn.osaka_name":"大阪丼",
	"mstdn.osaka_letters":"500",
	"mstdn.osaka_bbcode":"disabled",
	"mstdn.osaka_markdown":"disabled",
	"mstdn.osaka_home":"ウチ",
	"mstdn.osaka_local":"近所",
	"mstdn.osaka_notification":"あめちゃん",
	"mstdn.osaka_public":"新世界",
	"mstdn.kemono-friends.info":"instance",
	"mstdn.kemono-friends.info_name":"ますとどんちほー",
	"mstdn.kemono-friends.info_letters":"1024",
	"mstdn.kemono-friends.info_bbcode":"disabled",
	"mstdn.kemono-friends.info_markdown":"disabled",
	"mstdn.kemono-friends.info_home":"なわばり",
	"mstdn.kemono-friends.info_local":"ますとどんちほー",
	"mstdn.kemono-friends.info_notification":"ねえねえ!",
	"mstdn.kemono-friends.info_public":"ジャパリパーク",
	"itabashi.0j0.jp":"instance",
	"itabashi.0j0.jp_name":"板橋丼",
	"itabashi.0j0.jp_letters":"1024",
	"itabashi.0j0.jp_bbcode":"disabled",
	"itabashi.0j0.jp_markdown":"disabled",
};
localStorage.setItem("instance", JSON.stringify(idata));

function ck() {
	var domain = localStorage.getItem("domain_0");
	var at = localStorage.getItem(domain + "_at");
	//コード受信
	if(location.search){
		var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/);
		var mode=m[1];
		var codex=m[2];
		if(mode=="manager" || mode=="login"){
			code(codex,mode);
		}else{
			
		}
		
	}
	
	if (at) {
		$("#tl").show();
		parseColumn();
		multi();
	} else {
		$("#tl").show();
		multi();
	}
}
ck();
//ログインポップアップ
function login(url) {
	if($('#linux:checked').val()=="on"){
		var red = "urn:ietf:wg:oauth:2.0:oob"
	}else{
		var red = 'thedesk://login';
	}
	localStorage.setItem("redirect", red);
	var start = "https://" + url + "/api/v1/apps";
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			scopes: 'read write follow',
			client_name: "TheDesk(PC)",
			redirect_uris: red,
			website: "https://thedesk.top"
		})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		var auth = "https://" + url + "/oauth/authorize?client_id=" + json[
				"client_id"] + "&client_secret=" + json["client_secret"] +
			"&response_type=code&redirect_uri="+red+"&scope=read+write+follow";
		localStorage.setItem("domain_" + acct_id, url);
		localStorage.setItem("client_id", json["client_id"]);
		localStorage.setItem("client_secret", json["client_secret"]);
		$("#auth").show();
		$("#masara").hide();
		const {
  			shell
  		} = require('electron');

		  shell.openExternal(auth);
		  
		  if($('#linux:checked').val()=="on"){
		}else{
			var electron = require("electron");
			var ipc = electron.ipcRenderer;
			ipc.send('quit', 'go');
		}
		  
	});
}

//テキストボックスにURL入れた
function instance() {
	var url = $("#url").val();
	login(url);
}


//コードを入れた後認証
function code(code,mode) {
	var red = localStorage.getItem("redirect");
	localStorage.removeItem("redirect")
	if(!code){
		var code = $("#code").val();
	}
	if(localStorage.getItem("domain_tmp")){
		var url = localStorage.getItem("domain_tmp");
	}else{
		var url = localStorage.getItem("domain_" + acct_id);
	}
	var start = "https://" + url + "/oauth/token";
	var id = localStorage.getItem("client_id");
	var secret = localStorage.getItem("client_secret");
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			grant_type: "authorization_code",
			redirect_uri: red,
			client_id: id,
			client_secret: secret,
			code: code
		})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		todo(json);
		if (json["access_token"]) {
			localStorage.setItem(url + "_at", json["access_token"]);
			if(mode=="manager"){
				getdataAdv(url, json["access_token"]);
			}else{
				getdata();
			}
			
		}
	});
}

//ユーザーデータ取得(最初)
function getdata() {
	var acct_id = 0;
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/accounts/verify_credentials";
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		if (json.error) {
			console.error("Error:" + json.error);
			Materialize.toast("エラーが発生しました。しばらく待ってから再起動してください。Error:" + json.error,
				5000);
			return;
		}
		var avatar=json["avatar"];
		//missingがmissingなやつ
		if(avatar=="/avatars/original/missing.png"){
			avatar="./img/missing.svg";
		}
		var obj = [{
			at: at,
			name: json["display_name"],
			domain: domain,
			user: json["acct"],
			prof: avatar
		}];
		var json = JSON.stringify(obj);
		console.log(obj);
		localStorage.setItem("multi", json);
		localStorage.setItem("name_" + acct_id, json["display_name"]);
		localStorage.setItem("user_" + acct_id, json["acct"]);
		localStorage.setItem("user-id_" + acct_id, json["id"]);
		localStorage.setItem("prof_" + acct_id, avatar);
		$("#masara").hide();
		$("#auth").hide();
		$("#tl").show();
		parseColumn()
		ckdb();
	});
}
//ユーザーデータ取得(追加)
function getdataAdv(domain, at) {
	var start = "https://" + domain + "/api/v1/accounts/verify_credentials";
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		if (json.error) {
			console.error("Error:" + json.error);
			Materialize.toast("エラーが発生しました。しばらく待ってから再起動してください。Error:" + json.error,
				5000);
			return;
		}
		var avatar=json["avatar"];
		//missingがmissingなやつ
		if(avatar=="/avatars/original/missing.png"){
			avatar="./img/missing.svg";
		}
		var add = {
			at: at,
			name: json["display_name"],
			domain: domain,
			user: json["acct"],
			prof: avatar,
			id: json["id"]
		};
		var multi = localStorage.getItem("multi");
		var obj = JSON.parse(multi);
		var target = obj.lengtth;
		obj.push(add);
		localStorage.setItem("name_" + target, json["display_name"]);
		localStorage.setItem("user_" + target, json["acct"]);
		localStorage.setItem("user-id_" + target, json["id"]);
		localStorage.setItem("prof_" + target, avatar);
		console.log(obj);
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
		location.href="index.html";
	});
}

//MarkdownやBBCodeの対応、文字数制限をチェック
function ckdb(acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	if(domain=="kirishima.cloud"){
		localStorage.setItem("kirishima", "true");
		$("#ranking-btn").show();
	}else if(domain=="imastodon.nat"){
		localStorage.setItem("imas", "true");
	}
	var at = localStorage.getItem(domain + "_at");
	var bbcode = domain + "_bbcode";
	var letters = domain + "_letters";
	if(localStorage.getItem("instance")){
		var json=JSON.parse(localStorage.getItem("instance"));
			if (json[bbcode]) {
				if (json[bbcode] == "enabled") {
					localStorage.setItem("bb_" + acct_id, "true");
				} else {
					localStorage.removeItem("bb_" + acct_id);
					$("[data-activates='bbcode']").addClass("disabled");
					$("[data-activates='bbcode']").prop("disabled", true);
				}
			} else {
				localStorage.removeItem("bb_" + acct_id);
				$("[data-activates='bbcode']").addClass("disabled");
				$("[data-activates='bbcode']").addClass("disabled", true);
			}
			
			if (json[domain + "_markdown"] == "enabled") {
				localStorage.setItem("md_" + acct_id, "true");
				$(".markdown").show();
			}else{
				localStorage.removeItem("bb_" + acct_id);
			}
			if(json[domain + "_home"]){
				console.log("unique name:"+json[domain + "_home"]);
				localStorage.setItem("home_" + acct_id, json[domain + "_home"]);
			}
			if(json[domain + "_local"]){
				localStorage.setItem("local_" + acct_id, json[domain + "_local"]);
			}
			if(json[domain + "_public"]){
				localStorage.setItem("public_" + acct_id, json[domain + "_public"]);
			}
			if(json[domain + "_notification"]){
				localStorage.setItem("notification_" + acct_id, json[domain + "_notification"]);
			}
	
	}
	
}

//サポートインスタンス取得
function support() {
	var json=JSON.parse(localStorage.getItem("instance"));
		console.log(json);
		Object.keys(json).forEach(function(key) {
			var instance = json[key];
			if (instance == "instance") {
				templete = '<button class="btn waves-effect" onclick="login(\'' + key +
					'\')">' + json[key + "_name"] + '(' + key + ')</button>';
				$("#support").append(templete);
			}
		});
}

//アカウントを選択…を実装
function multi() {
	var multi = localStorage.getItem("multi");
	if (!multi) {
		var obj = [];
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
	} else {
		var obj = JSON.parse(multi);
	}
	var templete;
	var last = localStorage.getItem("last-use");
	var sel;
	console.log(obj.length)
	if(obj.length<1){
		$("#src-acct-sel").html('<option value="tootsearch">Tootsearch</option>');
		$("#add-acct-sel").html('<option value="noauth">認証せずに見る</option>');
	}else{
	Object.keys(obj).forEach(function(key) {
		var acct = obj[key];
		var list = key * 1 + 1;
		if (key == last) {
			sel = "selected";
			var domain = localStorage.getItem("domain_" + key);
			if(idata[domain+"_letters"]){
				$("#textarea").attr("data-length", idata[domain+"_letters"])
			}else{
				$("#textarea").attr("data-length", 500)
			}
			var profimg=localStorage.getItem("prof_"+key);
			var domain=localStorage.getItem("domain_"+key);
			if(!profimg){
				profimg="./img/missing.svg";
			}
			$("#acct-sel-prof").attr("src",profimg);
			$("#toot-post-btn").text("トゥート("+domain+")");
			if(domain=="kirishima.cloud"){
				$("#faicon-btn").show();
			}else{
				$("#faicon-btn").hide();
			}
		} else {
			sel = "";
		}
		templete = '<option value="' + key + '" data-icon="' + acct.prof +
			'" class="left circle" ' + sel + '>' + acct.user + '@' + acct.domain +
			'</option>';
		$(".acct-sel").append(templete);
		
	});
		$("#src-acct-sel").append('<option value="tootsearch">Tootsearch</option>');
		$("#add-acct-sel").append('<option value="noauth">認証せずに見る</option>');
	}
	$('select').material_select('update');
}

//バージョンエンコ
function enc(ver){
    var ver = ver.replace( /\s/g , "" );
    var ver = ver.replace( /\(/g , "-" );
    var ver = ver.replace( /\)/g , "" );
    var ver = ver.replace( /\[/g , "_" );
    var ver = ver.replace( /\]/g , "" );
    return ver;
}
