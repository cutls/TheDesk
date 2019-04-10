function listMenu(){
    $("#left-menu div").removeClass("active");
	$("#listMenu").addClass("active");
	$(".menu-content").addClass("hide");
    $("#list-box").removeClass("hide");
	$('ul.tabs').tabs('select_tab', 'src-sta');
	$("#src-contents").html("");
}


function list(){
    $("#lists-user").html("");
    var acct_id = $("#list-acct-sel").val();
    var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var start = "https://" + domain + "/api/users/lists/list"
		fetch(start, {
			method: 'POST',
			body: JSON.stringify({
				i:at
			}),
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
					lists = lists + list.title+':<a onclick="listShow(\'' + list.id + '\',\'' + list.title + '\',\'' + acct_id +
						'\')" class="pointer">'+lang.lang_list_show+'</a><br>';
				});
				$("#lists").html(lists);
			}else{
				$("#lists").html(lang.lang_list_nodata);
			}
		});
    }else{
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
					lists = lists + list.title+':<a onclick="listShow(\'' + list.id + '\',\'' + list.title + '\',\'' + acct_id +
						'\')" class="pointer">'+lang.lang_list_show+'</a>/<a onclick="listUser(\'' + list.id + '\',' + acct_id +
						')" class="pointer">'+lang.lang_list_users+'</a><br>';
				});
				$("#lists").html(lists);
			}else{
				$("#lists").html(lang.lang_list_nodata);
			}
		});
	}
}
function makeNewList(){
    var acct_id = $("#list-acct-sel").val();
    var text=$("#list-add").val();
    var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(localStorage.getItem("mode_" + domain)!="misskey"){
    var start = "https://" + domain + "/api/v1/lists"
	console.log(start)
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send(JSON.stringify({
		title: text
	}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			list();
			$("#list-add").val("")
		}
	}
}else{
	var start = "https://" + domain + "/api/users/lists/create"
	console.log(start)
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.responseType = "json";
	httpreq.send(JSON.stringify({
		i:at,
		title: text
	}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			list();
			$("#list-add").val("")
		}
	}
}
}
function listShow(id,title,acct_id){
    localStorage.setItem("list_"+id+"_"+acct_id,title);
    tl('list',id,acct_id,'add');
}
function listUser(id,acct_id){
    var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
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
                templete=lang.lang_list_nouser;
            }
			$("#lists-user").html(templete);
		}else{
            $("#lists-user").html(lang.lang_list_nouser);
        }
	});
}
function hisList(user,acct_id){
    var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(localStorage.getItem("mode_" + domain)!="misskey"){
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
			var lists = lang.lang_list_add+"<br>";
			Object.keys(json).forEach(function(key) {
                var list = json[key];
				lists = lists + '<a onclick="listAdd(\'' + list.id + '\',\'' + user + '\',\'' + acct_id +
					'\')" class="pointer">'+escapeHTML(list.title)+'</a><br> ';
			});
			$("#his-lists-a").html(lists);
		}else{
            $("#his-lists-a").html(lang.lang_list_nodata);
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
			var lists = lang.lang_list_remove+"<br>";
			Object.keys(json).forEach(function(key) {
                var list = json[key];
				lists = lists + '<a onclick="listRemove(\'' + list.id + '\',\'' + user + '\',\'' + acct_id +
					'\')" class="pointer">'+list.title+'</a><br> ';
			});
			$("#his-lists-b").html(lists);
		}else{
            $("#his-lists-b").html(lang.lang_list_nodata);
        }
	});
}else{
	var start = "https://" + domain + "/api/users/lists/list"
		fetch(start, {
			method: 'POST',
			body: JSON.stringify({
				i:at
			}),
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
					lists = lists + list.title+':<a onclick="listShow(\'' + list.id + '\',\'' + list.title + '\',\'' + acct_id +
						'\')" class="pointer">'+lang.lang_list_show+'</a>/<a onclick="listAdd(\'' + list.id + '\',\'' + user + '\',\'' + acct_id +
						'\')" class="pointer">'+lang.lang_list_add+lang.lang_list_add_misskey+'</a><br>';
				});
				$("#his-lists-a").html(lists);
			}else{
				$("#his-lists-a").html(lang.lang_list_nodata);
			}
		});
		$("#his-lists-b").html("");
}
}
function listAdd(id,user,acct_id){
    var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var start = "https://" + domain + "/api/users/lists/push"
		var i={
			i:at,
			listId:id,
			userId:user
		}
	}else{
		var start = "https://" + domain + "/api/v1/lists/"+id+"/accounts"
		var i={
			account_ids: [user]
		}
	}
	console.log(start)
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send(JSON.stringify(i));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			hisList(user,acct_id)
		}
	}
}
function listRemove(id,user,acct_id){
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem("acct_"+ acct_id + "_at");
    if(localStorage.getItem("mode_" + domain)=="misskey"){
		var start = "https://" + domain + "/api/users/lists/push"
		var method='POST'
		var i={
			i:at,
			listId:id,
			userId:user
		}
	}else{
		var start = "https://" + domain + "/api/v1/lists/"+id+"/accounts"
		var method='DELETE'
		var i={
			account_ids: [user]
		}
	}
	console.log(start)
	var httpreq = new XMLHttpRequest();
	httpreq.open(method, start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send(JSON.stringify(i));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			hisList(user,acct_id)
		}
	}
}