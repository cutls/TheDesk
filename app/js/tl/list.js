function listToggle(){
    if ($("#list-box").hasClass("hide")) {
        $("#list-box").removeClass("hide");
        $("#list-box").addClass("show");
		$("#list-box").css("top",$('#list-tgl').offset().top+"px");
		$("#list-box").css("left",$('#list-tgl').offset().left-410+"px");
		//リストロード
	} else {
        $("#list-box").removeClass("show");
		$("#list-box").addClass("hide")
	}
} 

function list(){
    $("#lists-user").html("");
    var acct_id = $("#list-acct-sel").val();
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem(domain + "_at");
    var start = "https://" + domain + "/api/v1/lists"
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
		if (json) {
			var lists = "";
			Object.keys(json).forEach(function(key) {
                var list = json[key];
				lists = lists + list.title+':<a onclick="listShow(' + list.id + ',\'' + list.title + '\',\'' + acct_id +
					'\')" class="pointer">表示</a>/<a onclick="listUser(' + list.id + ',' + acct_id +
					')" class="pointer">ユーザー一覧</a><br> ';
			});
			$("#lists").html(lists);
		}else{
            $("#lists").html("リストはありません");
        }
	});
}
function makeNewList(){
    var acct_id = $("#list-acct-sel").val();
    var text=$("#list-add").val();
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem(domain + "_at");
    var start = "https://" + domain + "/api/v1/lists"
	console.log(start)
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send(JSON.stringify({
		title: text
	}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			list();
			$("#list-add").val("")
		}
	}
}
function listShow(id,title,acct_id){
    localStorage.setItem("list_"+id+"_"+acct_id,title);
    tl('list',id,acct_id,'add');
}
function listUser(id,acct_id){
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem(domain + "_at");
    var start = "https://" + domain + "/api/v1/lists/"+id+"/accounts"
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
		if (json) {
			var lists = "";
            var templete = userparse(json,'',acct_id);
            if(!json[0]){
                templete="ユーザーはいません";
            }
			$("#lists-user").html(templete);
		}else{
            $("#lists-user").html("ユーザーはいません");
        }
	});
}
function hisList(user,acct_id){
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem(domain + "_at");
    var start = "https://" + domain + "/api/v1/lists"
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
		if (json) {
			var lists = "リストに追加<br>";
			Object.keys(json).forEach(function(key) {
                var list = json[key];
				lists = lists + '<a onclick="listAdd(' + list.id + ',\'' + user + '\',\'' + acct_id +
					'\')" class="pointer">'+list.title+'</a><br> ';
			});
			$("#his-lists-a").html(lists);
		}else{
            $("#his-lists-a").html('リストはありません');
        }
    });
    var start = "https://" + domain + "/api/v1/accounts/"+user+"/lists"
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
		if (json) {
			var lists = "リストから削除<br>";
			Object.keys(json).forEach(function(key) {
                var list = json[key];
				lists = lists + '<a onclick="listRemove(' + list.id + ',\'' + user + '\',\'' + acct_id +
					'\')" class="pointer">'+list.title+'</a><br> ';
			});
			$("#his-lists-b").html(lists);
		}else{
            $("#his-lists-b").html('リストはありません');
        }
    });
}
function listAdd(id,user,acct_id){
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem(domain + "_at");
    var start = "https://" + domain + "/api/v1/lists/"+id+"/accounts"
	console.log(start)
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send(JSON.stringify({
		account_ids: [user]
	}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			hisList(user,acct_id)
		}
	}
}
function listRemove(id,user,acct_id){
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem(domain + "_at");
    var start = "https://" + domain + "/api/v1/lists/"+id+"/accounts"
	console.log(start)
	var httpreq = new XMLHttpRequest();
	httpreq.open('DELETE', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send(JSON.stringify({
		account_ids: [user]
	}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			hisList(user,acct_id)
		}
	}
}