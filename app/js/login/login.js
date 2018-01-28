/*ログイン処理・認証までのJS*/
//最初に読むやつ
function ck() {
	var domain = localStorage.getItem("domain_0");
	var at = localStorage.getItem(domain + "_at");
	if (at) {
		ckdb();
		$("#tl").show();
		parseColumn();
		multi();
	} else {
		$("#masara").show();
		console.log("Please Login");
		support();
	}
}
ck();

//ログインポップアップ
function login(url) {
	var start = "https://" + url + "/api/v1/apps";
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			scopes: 'read write follow',
			client_name: "TheDesk(PC)",
			redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
			website: "https://desk.cutls.com"
		})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		var auth = "https://" + url + "/oauth/authorize?client_id=" + json[
				"client_id"] + "&client_secret=" + json["client_secret"] +
			"&response_type=code&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=read+write+follow";
		localStorage.setItem("domain_" + acct_id, url);
		localStorage.setItem("client_id", json["client_id"]);
		localStorage.setItem("client_secret", json["client_secret"]);
		$("#auth").show();
		$("#masara").hide();
		window.open(auth);
	});
}

//テキストボックスにURL入れた
function instance() {
	var url = $("#url").val();
	login(url);
}

//コードを入れた後認証
function code() {
	var code = $("#code").val();
	var url = localStorage.getItem("domain_" + acct_id);
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
			redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
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
		if (json["access_token"]) {
			localStorage.setItem(url + "_at", json["access_token"]);
			getdata();
		}
	});
}

//名前とか@とか取得
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
		var obj = [{
			at: at,
			name: json["display_name"],
			domain: domain,
			user: json["acct"],
			prof: json["avatar"]
		}];
		var json = JSON.stringify(obj);
		console.log(obj);
		localStorage.setItem("multi", json);
		localStorage.setItem("name_" + acct_id, json["display_name"]);
		localStorage.setItem("user_" + acct_id, json["acct"]);
		localStorage.setItem("user-id_" + acct_id, json["id"]);
		localStorage.setItem("prof_" + acct_id, json["avatar"]);
		$("#my-prof").attr("src", json["avatar"]);
		$("#auth").hide();
		$("#tl").show();
		parseColumn()
		ckdb();
	});
}

//TheDesk独自のマストドンDBでMarkdownやBBCodeの対応、文字数制限をチェック
function ckdb() {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var bbcode = domain + "_bbcode";
	var letters = domain + "_letters";
	var start = "https://desk.cutls.com/mastodon_data.json";
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
		console.log(json);
		console.log(json[letters]);
		if (json[bbcode]) {
			if (json[bbcode] == "enabled") {

			} else {
				$("[data-activates='bbcode']").addClass("disabled");
				$("[data-activates='bbcode']").prop("disabled", true);
			}
		} else {
			$("[data-activates='bbcode']").addClass("disabled");
			$("[data-activates='bbcode']").addClass("disabled", true);
		}
		if (json[letters]) {
			$("#textarea").attr("data-length", json[letters]);
		} else {}
		if (json[domain + "_markdown"] == "enabled") {
			$(".markdown").show();
		}

	});
}

//サポートインスタンス取得
function support() {
	var start = "https://desk.cutls.com/mastodon_data.json";
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		},
		//body: JSON.stringify({})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		Object.keys(json).forEach(function(key) {
			var instance = json[key];
			if (instance == "instance") {
				templete = '<button class="btn waves-effect" onclick="login(\'' + key +
					'\')">' + json[key + "_name"] + '(' + key + ')</button>';
				$("#support").append(templete);
			}
		});
	});
}

//アカウントを選択…を実装
function multi() {
	var multi = localStorage.getItem("multi");
	if (!multi) {
		var obj = [{
			at: localStorage.getItem(localStorage.getItem("domain_" + acct_id) + "_at"),
			name: localStorage.getItem("name_" + acct_id),
			domain: localStorage.getItem("domain_" + acct_id),
			user: localStorage.getItem("user_" + acct_id),
			prof: localStorage.getItem("prof_" + acct_id)
		}];
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
	} else {
		var obj = JSON.parse(multi);
	}
	var templete;
	var last = localStorage.getItem("last-use");
	var sel;
	Object.keys(obj).forEach(function(key) {
		var acct = obj[key];
		var list = key * 1 + 1;
		if (key == last) {
			sel = "selected";
		} else {
			sel = "";
		}
		templete = '<option value="' + key + '" data-icon="' + acct.prof +
			'" class="left circle" ' + sel + '>' + acct.user + '@' + acct.domain +
			'</option>';
		$(".acct-sel").append(templete);
		$('select').material_select('update');
	});
}
//現在使用停止(Uzukiより前)
function multiLogin(target) {
	var multi = localStorage.getItem("multi");
	var obj = JSON.parse(multi);
	var acct = obj[target];
	localStorage.setItem("domain_" + target, acct.domain);
	localStorage.setItem(domain + "_at", acct.at);
	localStorage.setItem("acct", target);
	location.href = "index.html";
}
