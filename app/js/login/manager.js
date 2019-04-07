//アカウントマネージャ
//最初に読むやつ
function load() {
	$("#acct-list").html("");
	var prof = localStorage.getItem("prof");
	$(".my-prof").attr("src", prof);
	var name = localStorage.getItem("name");
	$("#now-name").text(name);
	var user = localStorage.getItem("user");
	$("#now-user").text(user);
	var domain = localStorage.getItem("domain");
	$(".now-domain").text(domain);
	var multi = localStorage.getItem("multi");
	if (!multi) {
		var obj = [];
	} else {
		var obj = JSON.parse(multi);
	}
	if(obj[0]){
		if(!obj[0].at){
			obj=[];
			localStorage.removeItem("multi");
		}
	}
	
	console.log(obj);
	var templete;
	Object.keys(obj).forEach(function(key) {
		var acct = obj[key];
		var list = key * 1 + 1;
		if(acct.background!="def" && acct.text!="def"){
			var style='style="background-color:#'+acct.background+'; color:'+acct.text+';"'
		}else{
			var style=""
		}
		if(acct.name){
			var name=acct.name;
		}else{
			var name=acct.user;
		}
		templete = '<div id="acct_' + key + '" class="card" '+style+'><div class="card-content "><span class="lts">' + list +
			'.</span><img src="' + acct.prof + '" width="40" height="40"><span class="card-title">' +
			name + '</span>' + escapeHTML(acct.user) + '@' + acct.domain +
			'</div><div class="card-action"><a class="waves-effect disTar pointer white-text" onclick="data(\'' +
			acct.domain +
			'\')"><i class="material-icons">info</i>'+lang.lang_manager_info+'</a><a class="waves-effect disTar pointer  white-text" onclick="refresh(' +
			key +
			')"><i class="material-icons">refresh</i>'+lang.lang_manager_refresh+'</a><a class="waves-effect disTar pointer red-text" onclick="multiDel(' +
			key +
			')"><i class="material-icons">delete</i>'+lang.lang_manager_delete+'</a><br>'+lang.lang_manager_color+'<div id="colorsel_'+key+'" class="colorsel"></div></div></div>';
		$("#acct-list").append(templete);
	colorpicker(key)
	});
	multisel();
	var acctN = localStorage.getItem("acct");
	if (!acctN) {
		localStorage.setItem("acct", 0);
		var acctN = 0;
	}
	//全部チェックアリでいいと思うの
	$("#linux").prop("checked", true);

}
//最初に読む
load();
support();

//instances.social/instances API
function data(domain) {
	$("#ins-upd").text("Loading...");
	$("#ins-add").text("Loading...");
	$("#ins-connect").text("Loading...");
	$("#ins-toot").text("Loading...");
	$("#ins-sys").text("Loading...");
	$("#ins-per").text("Loading...");
	$("#ins-user").text("Loading...");
	$("#ins-ver").text("Loading...");
	$("#ins-name").text("Loading...");
	$("#ins-prof").attr('src', "../../img/loading.svg");
	var start = "https://instances.social/api/1.0/instances/show?name=" + domain;
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer tC8F6xWGWBUwGScyNevYlx62iO6fdQ4oIK0ad68Oo7ZKB8GQdGpjW9TKxBnIh8grAhvd5rw3iyP9JPamoDpeLQdz62EToPJUW99hDx8rfuJfGdjQuimZPTbIOx0woA5M'
		},
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		if (!json.error) {
			$("#ins-name").text(json.name);
			$("#ins-upd").text(date(json.checked_at, 'full'));
			$("#ins-add").text(date(json.added_at, 'full'));
			$("#ins-connect").text(json.connections);
			$("#ins-toot").text(json.statuses);
			$("#ins-sys").text(date(json.updated_at, 'full'));
			$("#ins-per").text(json.uptime * 100);
			$("#ins-user").text(json.users);
			$("#ins-ver").text(json.version);
		}
	});
	var start = "https://" + domain +"/api/v1/instance";
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		if (!json.error) {
			$("#ins-title").text(json.title);
			$("#ins-desc").html(json.description);
			$("#ins-email").text(json.email);
			$("#ins-toot").text(json.stats.status_count);
			$("#ins-user").text(json.stats.user_count);
			$("#ins-ver").text(json.version);
			$("#ins-prof").attr('src', json.thumbnail);
			$("#ins-admin").text(escapeHTML(json.contact_account.display_name)+"("+json.contact_account.acct+")");
			$("#ins-admin").attr("href","index.html?mode=user&code="+json.contact_account.username+"@"+domain);
		}
	});
}

//アカウントデータ　消す
function multiDel(target) {
	var multi = localStorage.getItem("multi");
	var obj = JSON.parse(multi);
	//削除確認ダイアログ
	if (confirm(obj[target]["user"] + "@" + obj[target]["domain"] +lang.lang_manager_confirm)) {
		Object.keys(obj).forEach(function(key) {
			var nk=key-1;
			//公開範囲(差分のみ)
			if(key>=target){
				var oldvis=localStorage.getItem("vis-memory-"+key);
				console.log(oldvis);
				if(oldvis){
					localStorage.setItem("vis-memory-"+nk,oldvis);
				}
			}
			//独自ロケール
			localStorage.removeItem("home_" + key);
			localStorage.removeItem("local_" + key);
			localStorage.removeItem("public_" + key);
			localStorage.removeItem("notification_" + key);
			//アクセストークンとドメイン、プロフ(差分)
			if(key>target){
				var olddom=localStorage.getItem("domain_"+key);
				localStorage.setItem("domain_"+nk,olddom);
				var oldat=localStorage.getItem("acct_"+key+"_at");
				localStorage.setItem("acct_"+nk+"_at",oldat);
				localStorage.setItem("name_" + nk, localStorage.getItem("name_" + key));
				localStorage.setItem("user_" + target, localStorage.getItem("user_" + key));
				localStorage.setItem("user-id_" + target, localStorage.getItem("user-id_" + key));
				localStorage.setItem("prof_" + target, localStorage.getItem("prof_" + key));
			}

		});
		//とりあえず消す
		obj.splice(target, 1);
		console.log(obj);
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
		load();
		//カラムデータコンフリクト
		var col = localStorage.getItem("column");
		var oldcols = JSON.parse(col);
		var newcols=[];
		Object.keys(oldcols).forEach(function(key) {
			var nk=key-1;
			var oldcol=oldcols[key];
			if(target<oldcol.domain){
				var newdom=oldcol.domain-1;
			}else{
				var newdom=oldcol.domain;
			}
			var type=oldcol.type;
			//消した垢のコラムじゃないときコピー
			if(target!=oldcol.domain){
				var add = {
					domain: newdom,
					type: type
				};
				newcols.push(add);
			}
		});
		var json = JSON.stringify(newcols);
		localStorage.setItem("column", json);
		
	}
}
function multiDel2(target) {
	var multi = localStorage.getItem("multi");
	var obj = JSON.parse(multi);
	if (confirm(obj[target]["user"] + "@" + obj[target]["domain"] +lang.lang_manager_confirm)) {
		obj.splice(target, 1);
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
		Object.keys(obj).forEach(function(key) {
		if(key>=target){
			var oldvis=localStorage.getItem("vis-memory-"+key);
			console.log(oldvis);
			if(oldvis){
				var nk=key-1;
				localStorage.setItem("vis-memory-"+nk,oldvis);
			}
		}
		localStorage.removeItem("home_" + key);
		localStorage.removeItem("local_" + key);
		localStorage.removeItem("public_" + key);
		localStorage.removeItem("notification_" + key);
		refresh(key);
	});
			var col = localStorage.getItem("column");
			if (!col) {
				var obj = [{
					domain: 0,
					type: 'local'
				}];
				localStorage.setItem("card_0","true");
				var json = JSON.stringify(obj);
				localStorage.setItem("column", json);
			} else {
				var cobj = JSON.parse(col);
			}
			Object.keys(cobj).forEach(function(key) {
				var column = cobj[key];
				if(column.domain>target){
					var nk=key-1;
					column.domain=nk;
					cobj[key]=column;
				}else if(column.domain==target){
					localStorage.removeItem("card_" + tlid);
					cobj.splice(key, 1);
				}
			});
			var json = JSON.stringify(column);
			localStorage.setItem("column", json);
		load();
	}
}

//サポートインスタンス
function support() {
		Object.keys(idata).forEach(function(key) {
			var instance = idata[key];
			if (instance == "instance") {
				templete = '<a onclick="login(\'' + key +
					'\')" class="collection-item pointer transparent">' + idata[key + "_name"] + '(' + key + ')</a>';
				$("#support").append(templete);
			}
		});
}

//URL指定してポップアップ
function login(url) {
	var multi = localStorage.getItem("multi");
	var obj = JSON.parse(multi);
	if($('#misskey:checked').val()=="on" || url=="misskey.xyz"){
		$("#misskey").prop("checked", true);
		misskeyLogin(url);
		return;
	}
	if($('#linux:checked').val()=="on"){
		var red = "https://thedesk.top/hello.html"
	}else{
		var red = 'thedesk://manager';
	}
	console.log(red);
	localStorage.setItem("redirect", red);
	var start = "https://" + url + "/api/v1/apps";
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.responseType = "json";
	httpreq.send(JSON.stringify({
		scopes: 'read write follow',
		client_name: "TheDesk(PC)",
		redirect_uris: red,
		website: "https://thedesk.top"
	}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			console.log(json);
			localStorage.setItem("msky","false");
			var auth = "https://" + url + "/oauth/authorize?client_id=" + json[
					"client_id"] + "&client_secret=" + json["client_secret"] +
				"&response_type=code&scope=read+write+follow&redirect_uri=" + encodeURIComponent(red);
			localStorage.setItem("domain_tmp", url);
			localStorage.setItem("client_id", json["client_id"]);
			localStorage.setItem("client_secret", json["client_secret"]);
			$("#auth").show();
			$("#add").hide();
			const {
				shell
			} = require('electron');
			
			shell.openExternal(auth);
			var electron = require("electron");
			var ipc = electron.ipcRenderer;
			if ($('#linux:checked').val() == "on") {} else {
				ipc.send('quit', 'go');
			}
		}
	}
	

}
//これが後のMisskeyである。
function misskeyLogin(url) {
	if(!url){
		var url=$("#misskey-url").val();
	}
	var start = "https://"+url+"/api/app/create";
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.responseType = "json";
	localStorage.setItem("msky","true");
	httpreq.send(JSON.stringify({
			name: "TheDesk(PC)",
			description: "Mastodon client for PC",
			permission: [
				"account-read",
				"account-write",
				"account/read",
				"account/write",
				"drive-read",
				"drive-write",
				"favorite-read",
				"favorite-write",
				"favorites-read",
				"following-read",
				"following-write",
				"messaging-read",
				"messaging-write",
				"note-read",
				"note-write",
				"notification-read",
				"notification-write",
				"reaction-read",
				"reaction-write",
				"vote-read",
				"vote-write"
			]
	}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			console.log(json);
			misskeyAuth(url, json.secret)
		}
	}
	

}
function misskeyAuth(url, mkc){
	var start = "https://"+url+"/api/auth/session/generate";
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.responseType = "json";

	localStorage.setItem("mkc",mkc)
	localStorage.setItem("msky","true");
	httpreq.send(JSON.stringify({
		appSecret: mkc
	}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			console.log(json);
			const {
				shell
			} = require('electron');
			var token=json.token;
			$("#auth").show();
			$("#code").val(token);
			$("#add").hide();
			$("#misskey").prop("checked", false);
			localStorage.setItem("domain_tmp",url);
			shell.openExternal(json.url);
		}
	}
}

//テキストボックスにURL入れた
function instance() {
	var url = $("#url").val();
	if(url.indexOf("@")!=-1 || url.indexOf("https")!=-1){
		alert("入力形式が違います。(Cutls@mstdn.jpにログインする場合、入力するのは\"mstdn.jp\"です。)")
		return false;
	}
	login(url);
}

//コード入れてAccessTokenゲット
function code(code) {
	localStorage.removeItem("redirect")
	if(!code){
		var code = $("#code").val();
		$("#code").val("");
	}
	var url = localStorage.getItem("domain_tmp");
	localStorage.removeItem("domain_tmp");
	console.log(localStorage.getItem("msky"));
	if(localStorage.getItem("msky")=="true"){
		var start = "https://"+url+"/api/auth/session/userkey";
		var httpreq = new XMLHttpRequest();
		httpreq.open('POST', start, true);
		httpreq.setRequestHeader('Content-Type', 'application/json');
		httpreq.responseType = "json";
		httpreq.send(JSON.stringify({
			token:code,
			appSecret:localStorage.getItem("mkc")
		}));
    	httpreq.onreadystatechange = function() {
			if (httpreq.readyState === 4) {
				var json = httpreq.response;
				var i = sha256(json.accessToken + localStorage.getItem("mkc"));
				console.log(json);
				var avatar=json["user"]["avatarUrl"];
				var priv="public";
				var add = {
					at: i,
					name: json["user"]["name"],
					domain: url,
					user: json["user"]["username"],
					prof: avatar,
					id: json["user"]["id"],
					vis: priv,
					mode: "misskey"
				};
				localStorage.setItem("mode_" + url,"misskey")
				var multi = localStorage.getItem("multi");
				var obj = JSON.parse(multi);
				var target = obj.lengtth;
				obj.push(add);
				localStorage.setItem("name_" + target, json["user"]["name"]);
				localStorage.setItem("user_" + target, json["user"]["username"]);
				localStorage.setItem("user-id_" + target, json["user"]["id"]);
				localStorage.setItem("prof_" + target, avatar);
				console.log(obj);
				var json = JSON.stringify(obj);
				localStorage.setItem("multi", json);

				load();
				return;
			}
		}	
		return;
	}else{
		var start = "https://" + url + "/oauth/token";
		var id = localStorage.getItem("client_id");
		var secret = localStorage.getItem("client_secret");
		var httpreq = new XMLHttpRequest();
		httpreq.open('POST', start, true);
		httpreq.setRequestHeader('Content-Type', 'application/json');
		httpreq.responseType = "json";
		httpreq.send(JSON.stringify({
			grant_type: "authorization_code",
			redirect_uri: "https://thedesk.top/hello.html",
			client_id: id,
			client_secret: secret,
			code: code
		}));
		httpreq.onreadystatechange = function() {
			if (httpreq.readyState === 4) {
				var json = httpreq.response;
				console.log(json);
				if (json["access_token"]) {
					$("#auth").hide();
					$("#add").show();
					getdata(url, json["access_token"]);
				}
			}
		}
	}
	
}
//ユーザーデータ取得
function getdata(domain, at) {
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
			Materialize.toast(lang.lang_fatalerroroccured+"Error:" + json.error,
				5000);
			return;
		}
		var avatar=json["avatar"];
		//missingがmissingなやつ
		if(avatar=="/avatars/original/missing.png"){
			avatar="../../img/missing.svg";
		}
		if(json["source"]){
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
			vis: priv,
			mode: "mastodon"
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
		load();
	});
}

//ユーザーデータ更新
function refresh(target) {
	var multi = localStorage.getItem("multi");
	var obj = JSON.parse(multi);
	if(obj[target].mode=="misskey"){
		misskeyRefresh(obj,target,obj[target].domain);
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
			Materialize.toast(lang.lang_fatalerroroccured+"Error:" + json.error,
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
		obj[target] = ref;
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);

		load();
	});
}
function misskeyRefresh(obj,target,url){
	var start = "https://"+url+"/api/users/show";
		var httpreq = new XMLHttpRequest();
		httpreq.open('POST', start, true);
		httpreq.setRequestHeader('Content-Type', 'application/json');
		httpreq.responseType = "json";
		httpreq.send(JSON.stringify({
			username:obj[target].user,
			i:localStorage.getItem("at")
		}));
    	httpreq.onreadystatechange = function() {
			if (httpreq.readyState === 4) {
				var json = httpreq.response;
				console.log(json);
				return;
				var avatar=json["user"]["avatarURL"];
				var priv="public";
				var add = {
					at: json.accessToken,
					name: json["user"]["name"],
					domain: url,
					user: json["user"]["username"],
					prof: avatar,
					id: json["user"]["id"],
					vis: priv
				};
				var multi = localStorage.getItem("multi");
				var obj = JSON.parse(multi);
				var target = obj.lengtth;
				obj.push(add);
				localStorage.setItem("name_" + target, json["user"]["name"]);
				localStorage.setItem("user_" + target, json["user"]["username"]);
				localStorage.setItem("user-id_" + target, json["user"]["id"]);
				localStorage.setItem("prof_" + target, avatar);
				console.log(obj);
				var json = JSON.stringify(obj);
				localStorage.setItem("multi", json);
				load();
				return;
			}
		}	
}
//アカウントを選択…を実装
function multisel() {
	var multi = localStorage.getItem("multi");
	if (!multi) {
		var obj = [];
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
	} else {
		var obj = JSON.parse(multi);
	}
	var templete;
	var last = localStorage.getItem("main");
	var sel;
	console.log(obj.length)
	if(obj.length<1){
		$("#src-acct-sel").html('<option value="tootsearch">Tootsearch</option>');
		$("#add-acct-sel").html('<option value="noauth">'+lang.lang_login_noauth+'</option>');
	}else{
	Object.keys(obj).forEach(function(key) {
		var acct = obj[key];
		var list = key * 1 + 1;
		if (key == last) {
			sel = "selected";
			mainb='('+lang.lang_manager_def+')'
			var domain = localStorage.getItem("domain_" + key);
			var profimg=localStorage.getItem("prof_"+key);
			var domain=localStorage.getItem("domain_"+key);
			if(!profimg){
				profimg="../../img/missing.svg";
			}
		} else {
			sel = "";
			mainb=""
		}
		templete = '<option value="' + key + '" data-icon="' + acct.prof +
			'" class="left circle" ' + sel + '>' + acct.user + '@' + acct.domain +mainb+
			'</option>';
		$(".acct-sel").append(templete);
		
	});
	}
	$('select').material_select('update');
}
function mainacct(){
	var acct_id = $("#main-acct-sel").val();
	localStorage.setItem("main", acct_id);
	Materialize.toast(lang.lang_manager_mainAcct, 3000);
}
function colorpicker(key){
	temp=
		'<div onclick="coloradd('+key+',\'def\',\'def\')" class="pointer exc">'+lang.lang_manager_none+'</div>'+
		'<div onclick="coloradd('+key+',\'f44336\',\'white\')" class="red white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'e91e63\',\'white\')" class="pink white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'9c27b0\',\'white\')" class="purple white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'673ab7\',\'white\')" class="deep-purple white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'3f51b5\',\'white\')" class="indigo white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'2196f3\',\'white\')" class="blue white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'03a9f4\',\'black\')" class="light-blue black-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'00bcd4\',\'black\')" class="cyan black-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'009688\',\'white\')" class="teal white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'4caf50\',\'black\')" class="green black-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'8bc34a\',\'black\')" class="light-green black-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'cddc39\',\'black\')" class="lime black-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'ffeb3b\',\'black\')" class="yellow black-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'ffc107\',\'black\')" class="amber black-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'ff9800\',\'black\')" class="orange black-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'ff5722\',\'white\')" class="deep-orange white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'795548\',\'white\')" class="brown white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'9e9e9e\',\'white\')" class="grey white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'607d8b\',\'white\')" class="blue-grey white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'000000\',\'white\')" class="black white-text pointer"></div>'+
		'<div onclick="coloradd('+key+',\'ffffff\',\'black\')" class="white black-text pointer"></div>';
	$("#colorsel_"+key).html(temp);
}
function coloradd(key,bg,txt){
	var col = localStorage.getItem("multi");
	var o = JSON.parse(col);
	var obj=o[key];
	obj.background=bg;
	obj.text=txt;
	o[key]=obj;
	var json = JSON.stringify(o);
	localStorage.setItem("multi", json);
	if(txt=="def"){
		$("#acct_"+key).attr("style","")
	}else{
	$("#acct_"+key).css('background-color','#'+bg);
	if(txt=="black"){
		var bghex="000000";
		var ichex="9e9e9e"
	}else if(txt=="white"){
		var bghex="ffffff";
		var ichex="eeeeee"
	}
	$("#acct_"+key+" .nex").css('color','#'+ichex);
	$("#acct_"+key).css('color','#'+bghex);
	}
}
//入力時にハッシュタグと@をサジェスト
var timer = null;

var input = document.getElementById("url");

var prev_val = input.value;
var oldSuggest;
var suggest;
input.addEventListener("focus", function() {
	$("#ins-suggest").html("");
	window.clearInterval(timer);
	timer = window.setInterval(function() {
		var new_val = input.value;
		if (prev_val != new_val) {
			if (new_val.length > 3) {
				var start = "https://instances.social/api/1.0/instances/search?q=" +
					new_val;
				fetch(start, {
					method: 'GET',
					headers: {
						'content-type': 'application/json',
						'Authorization': 'Bearer tC8F6xWGWBUwGScyNevYlx62iO6fdQ4oIK0ad68Oo7ZKB8GQdGpjW9TKxBnIh8grAhvd5rw3iyP9JPamoDpeLQdz62EToPJUW99hDx8rfuJfGdjQuimZPTbIOx0woA5M'
					},
				}).then(function(response) {
					return response.json();
				}).catch(function(error) {
					todo(error);
					console.error(error);
				}).then(function(json) {
					console.log(json);
					if (!json.error) {

						var urls = "Suggest:";
						Object.keys(json.instances).forEach(function(key) {
							var url = json.instances[key];
							urls = urls + '　<a onclick="login(\'' + url.name +
								'\')" class="pointer">' + url.name + '</a>  ';
						});
						$("#ins-suggest").html(urls);
					}
				});
			}
			oldSuggest = suggest;
			prev_value = new_val;
		}
	}, 1000);
}, false);

input.addEventListener("blur", function() {
	window.clearInterval(timer);
}, false);