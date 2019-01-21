//jQuery読む
window.jQuery = window.$ = require('../../js/common/jquery.js');
var Hammer = require('../../js/common/hammer.min.js');
$.strip_tags = function(str, allowed) {
	if(!str){
		return "";
	}
  	allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || [])
  		.join('');
  	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi,
  		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  	return str.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
  		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  	});
  };
  function escapeHTML(str) {
	  if(!str){
		  return "";
	  }
	return str.replace(/&/g, '&amp;')
			  .replace(/</g, '&lt;')
			  .replace(/>/g, '&gt;')
			  .replace(/"/g, '&quot;')
			  .replace(/'/g, '&#039;');
  }
  //PHPのnl2brと同様
function nl2br(str) {
	if(!str){
		return "";
	}
    str = str.replace(/\r\n/g, "<br />");
	str = str.replace(/(\n|\r)/g, "<br />");
    return str;
}
function formattime(date){
	var str=date.getFullYear()+"-";
	if(date.getMonth()+1<10){
		str=str+"0"+(date.getMonth()+1)+"-";
	}else{
		str=str+(date.getMonth()+1)+"-";
	}
	if(date.getDate()<10){
		str=str+"0"+date.getDate()
	}else{
		str=str+date.getDate()
	}
	str=str+"T";
	if(date.getHours()<10){
		str=str+"0"+date.getHours()+":"
	}else{
		str=str+date.getHours()+":"
	}
	if(date.getMinutes()<10){
		str=str+"0"+date.getMinutes()
	}else{
		str=str+date.getMinutes()
	}
	return str;
}
function formattimeutc(date){
	var str=date.getUTCFullYear()+"-";
	if(date.getUTCMonth()+1<10){
		str=str+"0"+(date.getUTCMonth()+1)+"-";
	}else{
		str=str+(date.getUTCMonth()+1)+"-";
	}
	if(date.getUTCDate()<10){
		str=str+"0"+date.getUTCDate()
	}else{
		str=str+date.getUTCDate()
	}
	str=str+"T";
	if(date.getUTCHours()<10){
		str=str+"0"+date.getUTCHours()+":"
	}else{
		str=str+date.getUTCHours()+":"
	}
	if(date.getUTCMinutes()<10){
		str=str+"0"+date.getUTCMinutes()
	}else{
		str=str+date.getUTCMinutes()
	}
	return str;
}