//検索
//検索ボックストグル
function searchMenu() {
	$("#left-menu div").removeClass("active");
	$("#searchMenu").addClass("active");
	$(".menu-content").addClass("hide");
    $("#src-box").removeClass("hide");
	$('ul.tabs').tabs('select_tab', 'src-sta');
	$("#src-contents").html("");
}

//検索取得
function src(mode) {
	$("#src-contents").html("");
	var q = $("#src").val();
	var acct_id = $("#src-acct-sel").val();
	if(acct_id=="tootsearch"){
		tsAdd(q)
		return false;
	}
	localStorage.setItem("last-use", acct_id);
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	var m = q.match(/^#(.+)$/);
	if(m){q=m[1];}
	if (user == "--now") {
		var user = $('#his-data').attr("user-id");
	}
	if(!mode){
		var start = "https://" + domain + "/api/v2/search?q=" + q
	}else{
		var start = "https://" + domain + "/api/v1/search?q=" + q
	}
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
		src("v1")
		return false;
	}).then(function(json) {
		console.log(json);
		//ハッシュタグ
		if (json.hashtags[0]) {
			var tags = "";
			Object.keys(json.hashtags).forEach(function(key4) {
				var tag = json.hashtags[key4];
				if(mode){
					tags = tags + '<a onclick="tl(\'tag\',\'' + tag + '\',\'' + acct_id +
					'\',\'add\')" class="pointer">#' + tag + '</a><br> ';
				}else{
					tags=tags+graphDraw(tag);
				}
				
			});
			$("#src-contents").append("Tags<br>" + tags);
		}
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
		jQuery("time.timeago").timeago();
	});
}
function tsAdd(q){
		var add = {
			domain: acct_id,
			type: "tootsearch",
			data: q
		};
		var multi = localStorage.getItem("column");
		var obj = JSON.parse(multi);
		localStorage.setItem("card_" + obj.length,"true");
		obj.push(add);
		console.log(obj);
		var json = JSON.stringify(obj);
		localStorage.setItem("column", json);
		parseColumn();
}
function tootsearch(tlid,q){
	var start = "https://tootsearch.chotto.moe/api/v1/search?from=0&sort=created_at%3Adesc&q=" + q
	console.log(start)
	$("#notice_" + tlid).text("tootsearch("+q+")");
	$("#notice_icon_" + tlid).text("search");
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
			var max_id = raw["hits"].length;
			for(var i=0;i<json.length;i++){
				var toot = json[i]["_source"];
				console.log(lastid)
				if(lastid!=toot.uri){
					console.log(toot);
					if(toot && toot.account){
						templete = templete+parse([toot], "noauth", null, tlid, 0, [], "tootsearch")
					}
				}
				var lastid=toot.uri;
			}
			if(!templete){
				templete=lang.lang_details_nodata;
			}else{
				templete=templete+'<div class="hide ts-marker" data-maxid="'+max_id+'"></div>';
			}
			$("#timeline_" + tlid).html(templete);

		jQuery("time.timeago").timeago();
	});
}
function moreTs(tlid,q){
	var sid = $("#timeline_" + tlid + " .ts-marker").last().attr("data-maxid");
	moreloading=true;
	var start = "https://tootsearch.chotto.moe/api/v1/search?from="+sid+"&sort=created_at%3Adesc&q=" + q
	console.log(start)
	$("#notice_" + tlid).text("tootsearch("+q+")");
	$("#notice_icon_" + tlid).text("search");
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
			var max_id = raw["hits"].length;
			for(var i=0;i<json.length;i++){
				var toot = json[i]["_source"];
				console.log(lastid)
				if(lastid!=toot.uri){
					console.log(toot);
					if(toot && toot.account){
						templete = templete+parse([toot], "noauth", null, tlid, 0, [], "tootsearch")
					}
				}
				var lastid=toot.uri;
			}
			if(!templete){
				templete=lang.lang_details_nodata;
			}else{
				templete=templete+'<div class="hide ts-marker" data-maxid="'+max_id+'"></div>';
			}
			$("#timeline_" + tlid).append(templete);

		jQuery("time.timeago").timeago();
	});
}
function graphDraw(tag){
	var tags="";
		var his=tag.history;
		console.log(his);
		var max=Math.max.apply(null, [his[0].uses,his[1].uses,his[2].uses,his[3].uses,his[4].uses,his[5].uses,his[6].uses]);
		var six=50-(his[6].uses/max*50);
		var five=50-(his[5].uses/max*50);
		var four=50-(his[4].uses/max*50);
		var three=50-(his[3].uses/max*50);
		var two=50-(his[2].uses/max*50);
		var one=50-(his[1].uses/max*50);
		var zero=50-(his[0].uses/max*50);
		if(max===0){
			tags = '<br><br><svg version="1.1" viewbox="0 0 60 50" width="60" height="50">'+
	'</svg><span style="font-size:200%">'+his[0].uses+'</span>toots&nbsp;<a onclick="tl(\'tag\',\'' + tag.name + '\',\'' + acct_id +
			'\',\'add\')" class="pointer">#' + tag.name + '</a>&nbsp;'+his[0].accounts+lang.lang_src_people;
		}else{
			tags = '<br><br><svg version="1.1" viewbox="0 0 60 50" width="60" height="50">'+
			'<g><path d="M0,'+six+' L10,'+five+' 20,'+four+' 30,'+three+' 40,'+two+' 50,'+one+' 60,'+zero+'" style="stroke: #9e9e9e; stroke-width: 1;fill: none;"></path></g>'+
		'</svg><span style="font-size:200%">'+his[0].uses+'</span>toots&nbsp;<a onclick="tl(\'tag\',\'' + tag.name + '\',\'' + acct_id +
				'\',\'add\')" class="pointer">#' + tag.name + '</a>&nbsp;'+his[0].accounts+lang.lang_src_people;
		}
		
	return tags;
}
/*
<svg version="1.1" viewbox="0 0 50 300" width="100%" height="50">
	<path d="M0,0 L10,0 20,10 20,50" fill="#3F51B5"></path>
</svg>
*/