/*ログイン処理・認証までのJS*/
//最初に読むやつ
//アスタルテ判定初期化

localStorage.removeItem("kirishima")
localStorage.removeItem("imas")
localStorage.removeItem("image");
localStorage.setItem("mode_misskey.xyz","misskey")
function ck() {
	var main = localStorage.getItem("main");
	if(!main){
		localStorage.setItem("main",0)
	}
	var domain = localStorage.getItem("domain_0");
	var at = localStorage.getItem("acct_0_at");
	var oldat = localStorage.getItem(domain + "_at");
	if(oldat){
		console.log("Move to New Account Management System")
		var multi = localStorage.getItem("multi");
		if (!multi) {
			var acctlen=1;
		} else {
			var obj = JSON.parse(multi);
			var acctlen=obj.length;
		}
		for(i=0;acctlen>i;i++){
			var domain = localStorage.getItem("domain_"+i);
			var oldat = localStorage.getItem(domain + "_at");
			var newat = localStorage.setItem("acct_"+ i + "_at",oldat);
			localStorage.removeItem(domain + "_at");
		}
	}
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
		multiSelector();
	} else {
		$("#tl").show();
		multiSelector();
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
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.responseType = 'json';
	httpreq.send(JSON.stringify({
		scopes: 'read write follow',
		client_name: "TheDesk(PC)",
		redirect_uris: red,
		website: "https://thedesk.top"
	}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			console.log(json);
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
		}
	}
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
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
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
			Materialize.toast(lang_fatalerroroccured[lang]+"Error:" + json.error,
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
			prof: avatar,
			id: json["id"],
			vis: json["source"]["privacy"]
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
			Materialize.toast(lang_fatalerroroccured[lang]+"Error:" + json.error,
				5000);
			return;
		}
		var avatar=json["avatar"];
		//missingがmissingなやつ
		if(avatar=="/avatars/original/missing.png"){
			avatar="./img/missing.svg";
		}
		if(json["source"]["privacy"]){
			var priv=json["source"]["privacy"];
		}else{
			var priv="public";
		}
		var add = {
			at: at,
			name: json["display_name"],
			domain: domain,
			user: json["acct"],
			prof: avatar,
			id: json["id"],
			vis: priv
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
//ユーザーデータ更新
function refresh(target) {
	var multi = localStorage.getItem("multi");
	var obj = JSON.parse(multi);
	if(obj[target].mode=="misskey"){
		return
	}
	var start = "https://" + obj[target].domain +
		"/api/v1/accounts/verify_credentials";
		console.log(start);
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + obj[target].at
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
			Materialize.toast(lang_fatalerroroccured[lang]+"Error:" + json.error,
				5000);
			return;
		}
		var avatar=json["avatar"];
		//missingがmissingなやつ
		if(avatar=="/avatars/original/missing.png" || !avatar){
			avatar="./img/missing.svg";
		}
		var ref = {
			at: obj[target].at,
			name: json["display_name"],
			domain: obj[target].domain,
			user: json["acct"],
			prof: avatar,
			id: json["id"],
			vis: json["source"]["privacy"]
		};
		localStorage.setItem("name_" + target, json["display_name"]);
		localStorage.setItem("user_" + target, json["acct"]);
		localStorage.setItem("user-id_" + target, json["id"]);
		console.log("user-id_" + target+":"+json["id"])
		console.log(localStorage.getItem("user-id_"+target));
		localStorage.setItem("prof_" + target, avatar);
		localStorage.setItem("follow_" + target, json["following_count"]);
		obj[target] = ref;
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);

		load();
	});
}
//MarkdownやBBCodeの対応、文字数制限をチェック
//絶対ストリーミングを閉じさせないマン
function ckdb(acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);

	if(domain=="kirishima.cloud"){
		localStorage.setItem("kirishima", "true");
		$("#ranking-btn").show();
	}else if(domain=="imastodon.net"){
		localStorage.setItem("imas", "true");
		$(".imasonly").show();
	}
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
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
				$(".anti-markdown").hide();
				$(".markdown").hide();
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
			if(json[domain + "_post"]){
				localStorage.setItem("post_" + acct_id, json[domain + "_post"]);
			}
			if(json[domain + "_fav"]){
				localStorage.setItem("fav_" + acct_id, json[domain + "_fav"]);
			}
			if(json[domain + "_bt"]){
				localStorage.setItem("bt_" + acct_id, json[domain + "_bt"]);
			}
			if(json[domain + "_follow"]){
				localStorage.setItem("follow_" + acct_id, json[domain + "_follow"]);
			}
	}
	if(localStorage.getItem("mode_" + domain)!="misskey"){
		var start = "https://" + domain + "/api/v1/instance/activity";
		fetch(start, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			},
		}).then(function(response) {
			return response.json();
		}).catch(function(error) {
			console.error(error);
		}).then(function(json) {
			console.log(json);
			if (json.error) {
				return;
			}
			if(json){
				localStorage.setItem("users_" + acct_id, json["logins"]);
				localStorage.setItem("statuses_" + acct_id, json["statuses"]);
			}
		});
		
	}else{
	}
	

}

//アカウントを選択…を実装
function multiSelector() {
	var multi = localStorage.getItem("multi");
	if (!multi) {
		var obj = [];
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
	} else {
		var obj = JSON.parse(multi);
	}
	var templete;
	if(localStorage.getItem("mainuse")=="main"){
		var last = localStorage.getItem("main");
	}else if(localStorage.getItem("last-use")){
		var last = localStorage.getItem("last-use");
	}else{
		var last=0;
	}
	var sel;
	if(obj.length<1){
		$("#src-acct-sel").html('<option value="tootsearch">Tootsearch</option>');
		$("#add-acct-sel").html('<option value="noauth">'+lang_login_noauth[lang]+'</option>');
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
			console.log(profimg);
			if(!profimg){
				profimg="./img/missing.svg";
			}
			$("#acct-sel-prof").attr("src",profimg);
			$("#toot-post-btn").text(lang_toot[lang]+"("+domain+")");
			if(acct.background && acct.background!="def" && acct.text && acct.text!="def"){
				$("#toot-post-btn").removeClass("indigo");
				$("#toot-post-btn").css("background-color","#"+acct.background);
				$("#toot-post-btn").css("color",acct.text);
			}else{
			}
			if(domain=="kirishima.cloud"){
				$("#faicon-btn").show();
			}else{
				$("#faicon-btn").hide();
			}
			if(domain=="imastodon.net"){
				trendTag();
			}else{
				$("#trendtag").html("");
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
		$("#add-acct-sel").append('<option value="noauth">'+lang_login_noauth[lang]+'</option>');
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
