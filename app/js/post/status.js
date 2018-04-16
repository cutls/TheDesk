//お気に入り登録やブースト等、フォローやブロック等
//お気に入り登録
function fav(id, acct_id, remote) {
	if ($("#pub_" + id).hasClass("faved")) {
		var flag = "unfavourite";
	} else {
		var flag = "favourite";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send();
    httpreq.onreadystatechange = function() {
        if (httpreq.readyState == 4) {
            var json = httpreq.response;
            if(remote!="remote"){
				//APIのふぁぼカウントがおかしい
				if ($("[toot-id=" + id + "] .fav_ct").text() == json.favourites_count){
					if(flag=="unfavourite"){
						var fav=json.favourites_count - 1;
					}else{
						var fav=json.favourites_count + 1;
						//var fav = json.favourites_count;
					}
				}else{
					var fav = json.favourites_count;
				}
				$("[toot-id=" + id + "] .fav_ct").text(fav);
				if (!json.reblog) {
				} else {
					$("[toot-id=" + id + "] .rt_ct").text(fav);
				}
				if ($("[toot-id=" + id +"]").hasClass("faved")) {
					$("[toot-id=" + id +"]").removeClass("faved");
					$(".fav_" + id).removeClass("yellow-text");
				} else {
					$("[toot-id=" + id +"]").addClass("faved");
					$(".fav_" + id).addClass("yellow-text");
				}
				}else{
					Materialize.toast("お気に入り登録しました。インスタンスが違うときは時間がかかる場合があります。", 1000);
				}
        }
	}
}

//ブースト
function rt(id, acct_id, remote) {
	if ($("#pub_" + id).hasClass("rted")) {
		var flag = "unreblog";
	} else {
		var flag = "reblog";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send();
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			console.log(json);
			if (remote != "remote") {
				$("[toot-id=" + id + "] .fav_ct").text(json.favourites_count);
				if (!json.reblog) {
					if (flag == "unreblog") {
						var rt = json.reblogs_count - 1;
					} else {
						var rt = json.reblogs_count + 1;
					}
					$("[toot-id=" + id + "] .rt_ct").text(rt);
				} else {
					$("[toot-id=" + id + "] .rt_ct").text(json.reblog.reblogs_count);
				}

				if ($("[toot-id=" + id + "]").hasClass("rted")) {
					$("[toot-id=" + id + "]").removeClass("rted");
					$(".rt_" + id).removeClass("teal-text");
				} else {
					$("[toot-id=" + id + "]").addClass("rted");
					$(".rt_" + id).addClass("teal-text");
				}
			} else {
				Materialize.toast("ブーストしました。インスタンスが違うときは時間がかかる場合があります。", 1000);
			}
		}
	}
}

//フォロー
function follow(acct_id,remote) {
	if (!acct_id && acct_id!="selector") {
		var acct_id = $('#his-data').attr("use-acct");
	}else if (acct_id=="selector") {
		var acct_id = $("#user-acct-sel").val();
	}
	if (!remote && $("#his-data").hasClass("following")) {
		var flag = "unfollow";
	} else {
		var flag = "follow";
	}
	var id = $("#his-data").attr("user-id");
	if(!remote){
		var remote = $("#his-data").attr("remote");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if(remote=="true" && flag=="follow"){
		var start = "https://" + domain + "/api/v1/follows";
		var user=$("#his-acct").text();
		var ent={"uri":user}
	}else{
		var start = "https://" + domain + "/api/v1/accounts/" + id + "/" + flag;
		var ent={}
	}
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send();
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			console.log(json);
			if ($("#his-data").hasClass("following")) {
				$("#his-data").removeClass("following");
				$("#his-follow-btn").text("フォロー");
			} else {
				$("#his-data").addClass("following");
				$("#his-follow-btn").text("フォロー解除");
			}
		}
	}
}

//ブロック
function block(acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var id = $("#his-data").attr("user-id");
	if ($("#his-data").hasClass("blocking")) {
		var flag = "unblock";
	} else {
		var flag = "block";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/accounts/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send();
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			if ($("#his-data").hasClass("blocking")) {
				$("#his-data").removeClass("blocking");
				$("#his-block-btn").text("ブロック");
			} else {
				$("#his-data").addClass("blocking");
				$("#his-block-btn").text("ブロック解除");
			}
		}
	}
}

//ミュート
function mute(acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var id = $("#his-data").attr("user-id");
	if ($("#his-data").hasClass("muting")) {
		var flag = "unmute";
	} else {
		var flag = "mute";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/accounts/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send();
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			if ($("#his-data").hasClass("muting")) {
				$("#his-data").removeClass("muting");
				$("#his-mute-btn").text("ミュート");
			} else {
				$("#his-data").addClass("muting");
				$("#his-mute-btn").text("ミュート解除");
			}
		}
	}
}

//投稿削除
function del(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id;
	var httpreq = new XMLHttpRequest();
	httpreq.open('DELETE', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send();
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
		}
	}
}
//ピン留め
function pin(id, acct_id) {
	if ($("#pub_" + id).hasClass("pined")) {
		var flag = "unpin";
	} else {
		var flag = "pin";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('DELETE', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send();
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			console.log(json);
			if ($("[toot-id=" + id + "]").hasClass("pined")) {
				$("[toot-id=" + id + "]").removeClass("pined");
				$(".pin_" + id).removeClass("blue-text");
			} else {
				$("[toot-id=" + id + "]").addClass("pined");
				$(".pin_" + id).addClass("blue-text");
			}
		}
	}
}

//フォロリク
function request(id, flag, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/follow_requests/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send();
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			console.log(json);
			showReq();
		}
	}
}

//ドメインブロック(未実装)
function domainblock(add, flag, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/domain_blocks"
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send();
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			console.log(json);
			showDom();
		}
	}
}

function addDomainblock() {
	var domain = $("#domainblock").val();
	domainblock(domain, 'POST');
}
//ユーザー強調
function empUser(){
	var usr = localStorage.getItem("user_emp");
	var obj = JSON.parse(usr);
	var id=$("#his-acct").attr("fullname");
	console.log(id);
	if(!obj){
		var obj=[];
		obj.push(id);
		Materialize.toast(id+"を強調します。設定を適用するにはF5を押して下さい。", 4000);
	}else{
		var can;
		Object.keys(obj).forEach(function(key) {
			var usT = obj[key];
			if(usT!=id && !can){
				can=false;
			}else{
				can=true;
				obj.splice(key, 1);
				Materialize.toast(id+"の強調を解除しました。設定を適用するにはF5を押して下さい。", 4000);
			}
		});
	}
	var json = JSON.stringify(obj);
	localStorage.setItem("user_emp", json);
}
//URLコピー
function tootUriCopy(url){
	execCopy(url);
	Materialize.toast("トゥートURLをコピーしました", 1500);
}

//他のアカウントで…
function staEx(mode){
	var url=$("#tootmodal").attr("data-url");
	var acct_id = $("#status-acct-sel").val();
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/search?resolve=true&q="+url
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		}
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		var id=json.statuses[0].id;
		if(mode=="rt"){
			rt(id, acct_id, 'remote')
		}else if(mode=="fav"){
			fav(id, acct_id, 'remote')
		}else if(mode=="reply"){
			reEx(id)
		}
	});
	return;
}