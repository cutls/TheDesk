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
		var obj = [{
			at: localStorage.getItem(localStorage.getItem("domain_0") + "_at"),
			name: localStorage.getItem("name_0"),
			domain: localStorage.getItem("domain_0"),
			user: localStorage.getItem("user_0"),
			prof: localStorage.getItem("prof_0"),
			id: localStorage.getItem("user-id_0")
		}];
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
	} else {
		var obj = JSON.parse(multi);
	}
	console.log(obj);
	var templete;
	Object.keys(obj).forEach(function(key) {
		var acct = obj[key];
		var list = key * 1 + 1;
		templete = '<div id="acct_' + key + '" class="card"><div class="card-content white-text"><span class="lts">' + list +
			'.</span><img src="' + acct.prof + '" width="40" height="40"><span class="card-title">' +
			acct.name + '</span>' + escapeHTML(acct.user) + '@' + acct.domain +
			'</div><div class="card-action"><a class="waves-effect disTar pointer white-text" onclick="data(\'' +
			acct.domain +
			'\')"><i class="material-icons">info</i>インスタンス情報</a><a class="waves-effect disTar pointer  white-text" onclick="refresh(' +
			key +
			')"><i class="material-icons">refresh</i>情報更新</a><a class="waves-effect disTar pointer red-text" onclick="multiDel(' +
			key +
			')"><i class="material-icons">delete</i>削除</a></div></div>';
		$("#acct-list").append(templete);
	});
	multisel();
	var acctN = localStorage.getItem("acct");
	if (!acctN) {
		localStorage.setItem("acct", 0);
		var acctN = 0;
	}
	var electron = require("electron");
          var remote=electron.remote;
          var platform=remote.process.platform;
	    if(platform=="win32"){
           
        }else{
			$("#linux").prop("checked", true);
        }

}
//最初に読む
load();
support();

//instances.social
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
	$("#ins-prof").attr('src', "./img/loading.svg");
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
			$("#ins-prof").attr('src', json.thumbnail);
		}
	});
}

//アカウントデータ　消す
function multiDel(target) {
	var multi = localStorage.getItem("multi");
	var obj = JSON.parse(multi);
	if (confirm(obj[target]["user"] + "@" + obj[target]["domain"] + "を削除します")) {
		obj.splice(target, 1);
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
	Object.keys(obj).forEach(function(key) {
		refresh(key);
	});
		load();
	}
}

//サポートインスタンス
function support() {
	var json=JSON.parse(localStorage.getItem("instance"));
		console.log(json);
		Object.keys(json).forEach(function(key) {
			var instance = json[key];
			if (instance == "instance") {
				templete = '<a onclick="login(\'' + key +
					'\')" class="collection-item pointer transparent">' + json[key + "_name"] + '(' + key + ')</a>';
				$("#support").append(templete);
			}
		});
}

//URL指定してポップアップ
function login(url) {
	var multi = localStorage.getItem("multi");
	var obj = JSON.parse(multi);
	var ng;
	Object.keys(obj).forEach(function(key) {
		var acct = obj[key];
		if (acct.domain == url) {
			Materialize.toast(url + "は登録できません。同一インスタンスには一つのアカウントでしかログインできません。", 5000);
			ng = "true";
			return;
		}
	});
	if (ng) {
		return;
	}
	if($('#linux:checked').val()=="on"){
		var red = "urn:ietf:wg:oauth:2.0:oob"
	}else{
		var red = 'thedesk://manager';
	}
	console.log(red);
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
				"&response_type=code&scope=read+write+follow&redirect_uri=" + red;
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

//テキストボックスにURL入れた
function instance() {
	var url = $("#url").val();
	login(url);
}

//コード入れてAccessTokenゲット
function code(code) {
	localStorage.removeItem("redirect")
	if(!code){
		var code = $("#code").val();
	}
	var url = localStorage.getItem("domain_tmp");
	localStorage.removeItem("domain_tmp");
	var start = "https://" + url + "/oauth/token";
	var id = localStorage.getItem("client_id");
	var secret = localStorage.getItem("client_secret");
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.responseType = 'json';
	httpreq.send(JSON.stringify({
		grant_type: "authorization_code",
		redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
		client_id: id,
		client_secret: secret,
		code: code
	}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
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
		load();
	});
}

//ユーザーデータ更新
function refresh(target) {
	var multi = localStorage.getItem("multi");
	var obj = JSON.parse(multi);
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
			Materialize.toast("エラーが発生しました。しばらく待ってから再起動してください。Error:" + json.error,
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
			id: json["id"]
		};
		localStorage.setItem("name_" + target, json["display_name"]);
		localStorage.setItem("user_" + target, json["acct"]);
		localStorage.setItem("user-id_" + target, json["id"]);
		console.log("user-id_" + target+":"+json["id"])
		console.log(localStorage.getItem("user-id_"+target));
		localStorage.setItem("prof_" + target, avatar);
		obj[target] = ref;
		console.log(obj);
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);

		load();
	});
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
		$("#add-acct-sel").html('<option value="noauth">認証せずに見る</option>');
	}else{
	Object.keys(obj).forEach(function(key) {
		var acct = obj[key];
		var list = key * 1 + 1;
		if (key == last) {
			sel = "selected";
			mainb="(既定)"
			var domain = localStorage.getItem("domain_" + key);
			var profimg=localStorage.getItem("prof_"+key);
			var domain=localStorage.getItem("domain_"+key);
			if(!profimg){
				profimg="./img/missing.svg";
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
	Materialize.toast("メインアカウントを設定しました。", 3000);
}