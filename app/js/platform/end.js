//プラットフォーム別　最後に読むやつ
//リンクを外部で開くか内部で出すか 
 $(document).on('click', 'a', e => {
  	var $a = $(e.target);
  	var url = $a.attr('href');
  	if (!url) {
  		var url = $a.parent().attr('href');
	  }
	  var urls=[];
	  if(url){
		urls = url.match(/https?:\/\/(.+)/);
		//トゥートのURLぽかったら
		toot = url.match(/https:\/\/([a-zA-Z0-9.-]+)\/@([a-zA-Z0-9_]+)\/([0-9]+)/);
		//タグのURLぽかったら
			var tags=[];
			tags = url.match(
				/https:\/\/([-a-zA-Z0-9@.]+)\/tags\/([-_.!~*\'()a-zA-Z0-9;\/?:\&=+\$,%#]+)/
			);
		//メンションっぽかったら
		var ats=[];
			ats = url.match(
				/https:\/\/([-a-zA-Z0-9@.]+)\/@([-_.!~*\'()a-zA-Z0-9;\/?:\&=+\$,%#]+)/
			);
		console.log(toot);
		if(toot){
			if(toot[1]){
				var acct_id=$a.parent().attr("data-acct");
				if(!acct_id){
					acct_id=0;
				}
				$a.parent().addClass("loadp")
				$a.parent().text("Loading...")
				detEx(url,acct_id);
			}
			
		}else if(tags){
			if(tags[2]){
				tagShow(tags[2]);
				Materialize.toast('<a class="btn-flat toast-action" href="detEx(\''+url+'\')">Open in browser</a>', 86400);
			}
		}else if(ats){
			console.log(ats);
			if(ats[2]){
				if(ats[1]!="quesdon.rinsuki.net"){
					udgEx(ats[2]+"@"+ats[1],"main");
					return false
				}else{
					const {
						shell
					} = require('electron');
		  
					shell.openExternal(url);
				}
				
				
			}
		}else{
		//hrefがhttp/httpsならブラウザで
		if(urls){
		if (urls[0]) {
			const {shell} = require('electron');
			if(~url.indexOf("thedeks.top")){
				//alert("If you recieve this alert, let the developer(Cutls@kirishima.cloud) know it with a screenshot.");
				url="https://thedesk.top";
			}
			shell.openExternal(url);
		} else {
  
			location.href = url;
		}
	}else{
		location.href = url;
	}
	  }
	}
  	return false;
  });
  
  //よく使うライブラリ
  /*マルチバイト用切り出し*/
  $.isSurrogatePear = function(upper, lower) {
  	return 0xD800 <= upper && upper <= 0xDBFF && 0xDC00 <= lower && lower <= 0xDFFF;
  };
  $.mb_strlen = function(str) {
  	var ret = 0;
  	for (var i = 0; i < str.length; i++, ret++) {
  		var upper = str.charCodeAt(i);
  		var lower = str.length > (i + 1) ? str.charCodeAt(i + 1) : 0;
  		if ($.isSurrogatePear(upper, lower)) {
  			i++;
  		}
  	}
  	return ret;
  };
  $.mb_substr = function(str, begin, end) {
  	var ret = '';
  	for (var i = 0, len = 0; i < str.length; i++, len++) {
  		var upper = str.charCodeAt(i);
  		var lower = str.length > (i + 1) ? str.charCodeAt(i + 1) : 0;
  		var s = '';
  		if ($.isSurrogatePear(upper, lower)) {
  			i++;
  			s = String.fromCharCode(upper, lower);
  		} else {
  			s = String.fromCharCode(upper);
  		}
  		if (begin <= len && len < end) {
  			ret += s;
  		}
  	}
  	return ret;
  };

  //コピー
  function execCopy(string){
	var temp = $("#copy");
	temp.val(string);
	temp.select();
	var result = document.execCommand('copy');
	return result;
  }
  //Nano
function nano(){
    var electron = require("electron");
    var ipc = electron.ipcRenderer;
    ipc.send('nano', "");
}
function progshow(e) {
	if (e.lengthComputable) {
	  var percent = e.loaded / e.total;
	  console.log(percent * 100);
	  $("#imgsel").hide();
	  if(percent<1){
		 $("#imgup").text(Math.floor(percent*100)+"%");
	  }else{
		$("#imgup").text(lang.lang_progress);
	  }
	}
  }

  var electron = require("electron");
  var ipc = electron.ipcRenderer;
  ipc.on('reload', function (event, arg) {
	location.reload();
})
ipc.on('mess', function (event, arg) {
    if(arg=="unzip"){
		if(lang=="ja"){
			$("body").text("アップデートを展開中です。");
		}else{
			$("body").text("Unzipping...");
		}
        
    }
})
//Native Notf
ipc.on('shownotf', function (event, args) {
    if(args["type"]=="toot"){
		details(id, acct_id)
	}else  if(args["type"]=="userdata"){
		udg(user, acct_id)
	}
})
function opendev(){
	var webview = document.getElementById("webview");
	webview.openDevTools();
	/*webview.sendInputEvent({
		type: "keyDown",
		keyCode: '2'
	  });
	  */
}

var webviewDom = document.getElementById('webview');
const {
	shell
} = require('electron');
webviewDom.addEventListener('new-window', function(e) {
    shell.openExternal(e.url);
});