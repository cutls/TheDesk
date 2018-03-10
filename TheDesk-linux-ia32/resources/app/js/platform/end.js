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
		urls = url.match(/https?:\/\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/);
		//hrefがhttp/httpsならブラウザで
		if(urls){
		if (urls[0]) {
			const {
				shell
			} = require('electron');
  
			shell.openExternal(url);
		} else {
  
			location.href = url;
		}
	}else{
		location.href = url;
	}
	  }
  	return false;
  });
  
  //よく使うライブラリ
  /*マルチバイト用切り出し*/
  $.isSurrogatePear = function(upper, lower) {
  	return 0xD800 <= upper && upper <= 0xDBFF && 0xDC00 <= lower && lower <=
  		0xDFFF;
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
  $.strip_tags = function(str, allowed) {
  	allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || [])
  		.join('');
  	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi,
  		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  	return str.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
  		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  	});
  };
  function escapeHTML(str) {
	return str.replace(/&/g, '&amp;')
			  .replace(/</g, '&lt;')
			  .replace(/>/g, '&gt;')
			  .replace(/"/g, '&quot;')
			  .replace(/'/g, '&#039;');
  }
  //コピー
  function execCopy(string){
	var temp = $("#copy");
	temp.val(string);
	temp.select();
	var result = document.execCommand('copy');
	return result;
  }
  //Nano
  //Nano
function nano(){
    var electron = require("electron");
    var ipc = electron.ipcRenderer;
    ipc.send('nano', "");
}
