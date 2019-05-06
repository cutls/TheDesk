//ソートデータ読み込み
function sortload(){
	var col = localStorage.getItem("column");
		if (col) {
			var obj = JSON.parse(col);
		}
		Object.keys(obj).forEach(function(key) {
			var acct = obj[key];
			var flag="false";
			if(localStorage.getItem("card_" + key)=="true"){
				flag="true"
			}
			var insert="";

			if(acct.background){
			if(acct.text=="def"){
				
			}else{
			if(acct.text=="black"){
				var txhex="000000";
			}else if(acct.text=="white"){
				var txhex="ffffff";
			}
				insert=' style="background-color:#'+acct.background+'; color: #'+txhex+'" ';
			}
		}
			var user=localStorage.getItem("user_" + acct.domain);
			var domain=localStorage.getItem("domain_" + acct.domain);
			if(!user || !domain){
				var acctdata="";
			}else{
				var acctdata=user+"@"+domain;
			}
			
			var html='<li class="drag-content" data-id="'+key+'" data-flag="'+flag+'"'+insert+'><div class="sorticon"><i class="material-icons">'+icon(acct.type)+'</i></div><div class="sorttitle">'+cap(acct.type, escapeHTML(acct.data),acct.domain)+'</div><div class="sortaction"><a onclick="goColumn(' + key +
			')" class="setting nex"><i class="material-icons waves-effect nex" title="'+lang.lang_sort_gothis+'">forward</i></a> <a onclick="removeColumn(' + key +
			')" class="setting nex"><i class="material-icons waves-effect nex" title="このカラムを削除">cancel</i></a></div><div class="sortacct">'+acctdata+'</div></li>';
			$("#sort").append(html);
		});
		drag();
}

//TLのタイトル
function Scap(type, data) {
	if (type == "home") {
		return "Home"
	} else if (type == "local") {
		return "Local"
	} else if (type == "pub") {
		return "Public"
	} else if (type == "tag") {
		return "#" + data
	} else if (type == "list") {
		return "List(id:" + data + ")"
	} else if (type == "notf") {
		return "Notification"
	} else if (type == "mix") {
		return "Integrated"
	}else if (type == "webview") {
		return "Twitter"
	}else if (type == "tootsearch") {
		return "tootsearch(" + data + ")"
	}else{
		console.log(type);
	}
}

//jquery-ui依存
function drag(){
	$('#sort').sortable();
	$('#sort').disableSelection();
}

//ソート指定
function sort(){
	var arr=[];
	var flags=[];
	$(".drag-content").each(function(i, elem) {
		var id=$(this).attr("data-id");
		var flag=$(this).attr("data-flag");
		arr.push(id)
		flags.push(flag);
	});
	var col = localStorage.getItem("column");
	var obj = JSON.parse(col);
	var newobj=[];
	for(i=0;i<arr.length;i++){
		var data=obj[arr[i]];
		var add = {
			domain: data.domain,
			type: data.type,
			data:data.data,
			background:data.background,
			text:data.text
		};
		newobj.push(add);
		if(flags[i]=="true"){
			localStorage.setItem("card_" + i, "true");
		}else{
			localStorage.removeItem("card_" + i);
		}
	}
	var json = JSON.stringify(newobj);
	localStorage.setItem("column", json);
	$("#sort").html("");
	Materialize.toast("Sorted", 3000);
	sortload();
	parseColumn();
	sortMenu()
}
//ソートボタントグル
function sortMenu(){
	$("#left-menu div").removeClass("active");
	$("#sortMenu").addClass("active");
	$(".menu-content").addClass("hide");
    $("#sort-box").removeClass("hide");
	$("#sort").html("");
	sortload();
}