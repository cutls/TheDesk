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