//ユーザーデータ表示
localStorage.removeItem("history");
function udg(user, acct_id) {
	if (!user) {
		user = localStorage.getItem("user-id_"+acct_id);
		console.log(user);
	}
	todo("User Data Loading...");
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/accounts/" + user;
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
		//一つ前のユーザーデータ
		if (!localStorage.getItem("history")){
			$("#his-history-btn").prop("disabled",true);
		}else{
			$("#his-history-btn").prop("disabled",false);
			$('#his-data').attr("history", localStorage.getItem("history"));
		}
		//moved設定時
		if (json.moved) {
			Materialize.toast(
				'このアカウントは移行します<button class="btn-flat toast-action" onclick="udg(\"' +
				json.moved + '\")">移行先を見る</button>', 4000)
		} else {
			$('#his-data').attr("user-id", user);
			$('#his-data').attr("use-acct", acct_id);
			if(json.username!=json.acct){
				//Remote
				$('#his-data').attr("remote", "true");
			}else{
				$('#his-data').attr("remote", "false");
			}
			$("#his-name").text(json.display_name);
			$("#his-acct").text(json.acct);
			$("#his-prof").attr("src", json.avatar);
			$('#his-data').css('background-image', 'url(' + json.header + ')');
			$("#his-sta").text(json.statuses_count);
			$("#his-follow").text(json.following_count);
			$("#his-follower").text(json.followers_count);
			$("#his-des").html(json.note);
			$('#his-data').modal('open');
			utl(json.id, '', acct_id);
			flw(json.id, '', acct_id);
			fer(json.id, '', acct_id);
			$('ul.tabs').tabs();
			$('#his-data').css('background-size', 'cover');
			$("#his-since").text(crat(json.created_at));
			localStorage.setItem("history" , user);
		}
		//自分の時
		if (json.acct == localStorage.getItem("user")) {
			$("#his-follow-btn").hide();
			$("#his-block-btn").hide();
			$("#his-mute-btn").hide();
			$("#his-notf-btn").hide();
			$("#his-domain-btn").hide();
			$("#my-data-nav").show();
			$("#his-data-nav").hide();
			$('ul.tabs').tabs('select_tab', 'his-tl');
			showFav('', acct_id);
			showBlo('', acct_id);
			showMut('', acct_id);
			showDom('', acct_id);
			showReq('', acct_id);
			profeditShow(json);
		} else {
			relations(user, acct_id);
		}
		todc();
	});
}
//一つ前のユーザーデータ表示
function historyShow(){
	var acct_id=$('#his-data').attr("use-acct");
	var user=$('#his-data').attr("history");
	udg(user, acct_id, "true")
}
//選択アカウントのプロフ
function profShow(){
	var acct_id = $("#post-acct-sel").val();
	var user = localStorage.getItem("user-id_"+acct_id);
	console.log("user-id_"+acct_id+":"+user);
	udg(user, acct_id)
}

//FF関係取得
function relations(user, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/accounts/relationships?id=" + user;
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
		var json = json[0];
		console.log(json);
		if (json.following) {
			//自分がフォローしている
			$("#his-data").addClass("following");
			$("#his-follow-btn").text("フォロー解除");
		}else{
			$("#his-follow-btn").text("フォロー");
		}
		if (json.followed_by) {
			//フォローされてる
			$("#his-relation").text("フォローされています");
		}
		if (json.blocking) {
			$("#his-data").addClass("blocking");
			$("#his-block-btn").text("ブロック解除");
		}else{
			$("#his-block-btn").text("ブロック");
		}
		if (json.muting) {
			$("#his-data").addClass("muting");
			$("#his-mute-btn").text("ミュート解除");
		}else{
			$("#his-mute-btn").text("ミュート");
		}
		if (json.muting_notifications) {
			$("#his-data").addClass("mutingNotf");
			$("#his-notf-btn").text("通知ミュート解除");
		}else{
			$("#his-notf-btn").text("通知ミュート");
		}
		if (json.domain_blocking) {
			$("#his-data").addClass("blockingDom");
			$("#his-domain-btn").text("ドメインブロック解除");
		}else{
			$("#his-domain-btn").text("ドメインブロック");
		}

	});
}

//オールリセット
function hisclose() {
	$('#his-data').modal('close');
	$("#his-name").text("Loading");
	$("#his-acct").text("");
	$("#his-prof").attr("src", "./img/loading.svg");
	$('#his-data').css('background-image', 'url(./img/loading.svg)');
	$("#his-sta").text("");
	$("#his-follow").text("");
	$("#his-follower").text("");
	$("#his-des").html("");
	$('#his-data').css('background-size', 'cover');
	$("#his-since").text("");
	$("#his-data").removeClass("following");
	$("#his-data").removeClass("muting");
	$("#his-data").removeClass("blocking");
	$("#his-data").removeClass("mutingNotf");
	$("#his-data").removeClass("blockingDom");
	$("#his-follow-btn").show();
	$("#his-block-btn").show();
	$("#his-mute-btn").show();
	$("#his-notf-btn").show();
	$("#his-domain-btn").show();
	$("#his-follow-btn").text("フォロー");
	$("#his-mute-btn").text("ミュート");
	$("#his-block-btn").text("ブロック");
	$("#his-notf-btn").text("通知ミュート");
	$("#his-domain-btn").text("ドメインブロック");
	$("#his-relation").text("");
	$("#my-data-nav").hide();
	$("#his-data-nav").show();
	$(".cont-series").html("");
	$("#domainblock").val("");
	$('#his-data').attr("history", "");
	localStorage.removeItem("history");
}
