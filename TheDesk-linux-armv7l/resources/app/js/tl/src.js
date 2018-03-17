//検索
//検索ボックストグル
function srcToggle() {
	$("#src-box").toggleClass("hide");
	$("#src-box").toggleClass("show");
	$("#src-box").css("top",$('#src-tgl').offset().top+"px");
	$("#src-box").css("left",$('#src-tgl').offset().left-410+"px");
	$('ul.tabs').tabs('select_tab', 'src-sta');
	$("#src-contents").html("");
}

//検索取得
function src() {
	var q = $("#src").val();
	var acct_id = $("#src-acct-sel").val();
	if(acct_id=="tootsearch"){
		tootsearch(q);
		return false;
	}
	localStorage.setItem("last-use", acct_id);
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if (user == "--now") {
		var user = $('#his-data').attr("user-id");
	}
	var start = "https://" + domain + "/api/v1/search?q=" + q
	console.log(start)
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
		//トゥート
		if (json.statuses[0]) {
			var templete = parse(json.statuses,'',acct_id);
			$("#src-contents").append("Mentions<br>" + templete);
		}
		//アカウント
		if (json.accounts[0]) {
			var templete = userparse(json.accounts,'',acct_id);
			$("#src-contents").append("Accounts<br>" + templete);
		}
		//ハッシュタグ
		if (json.hashtags[0]) {
			var tags = "";
			Object.keys(json.hashtags).forEach(function(key4) {
				var tag = json.hashtags[key4];
				tags = tags + '<a onclick="tl(\'tag\',\'' + tag + '\',\'' + acct_id +
					'\',\'add\')" class="pointer">#' + tag + '</a><br> ';
			});
			$("#src-contents").append("Tags<br>" + tags);
		}
		jQuery("time.timeago").timeago();
	});
}
function tootsearch(q){
	var start = "https://tootsearch.chotto.moe/api/v1/search?from=0&sort=created_at%3Adesc&q=" + q
	console.log(start)
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
	}).then(function(raw) {
			var templete="";
			var json=raw.hits.hits;
			console.log(json);
			Object.keys(json).forEach(function(key5) {
				var toot = json[key5]["_source"];
				console.log(toot);
				if(toot && toot.account){
					templete = templete+parse([toot],'');
				}
			});
			if(!templete){
				templete="データはありません。";
			}
			$("#src-contents").html("Tootsearch(時系列)<br>" + templete);
		jQuery("time.timeago").timeago();
	});
}