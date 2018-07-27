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
			var html='<li class="drag-content" data-id="'+key+'" data-flag="'+flag+'"'+insert+'><a onclick="goColumn(' + key +
			')" class="setting nex"><i class="material-icons waves-effect nex" title="このカラムへ">forward</i></a> <a onclick="removeColumn(' + key +
			')" class="setting nex"><i class="material-icons waves-effect nex" title="このカラムを削除">cancel</i></a><br>'+localStorage.getItem("user_" + acct.domain)+"@"+localStorage.getItem("domain_" + acct.domain)+" "+cap(acct.type, acct.data)+'</li>';
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
	Materialize.toast("並べ替え完了。", 3000);
	sortload();
	parseColumn();
	sortToggle()
}
//ソートボタントグル
function sortToggle(){
	$("#sort").html("");
	if ($("#sort-box").hasClass("hide")) {
		$("#sort-box").removeClass("hide");
		$("#sort-box").addClass("show");
		//並べ替え
		sortload();
	} else {
		$("#sort-box").addClass("hide");
		$("#sort-box").removeClass("show");
	}
}