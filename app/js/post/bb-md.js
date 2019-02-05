//BBCodeとMarkdownの入力・パーサー
//アカウント変えた時にBBとかMDとか
function mdCheck(){
	var acct_id = $("#post-acct-sel").val();
	var profimg=localStorage.getItem("prof_"+acct_id);
	if(!profimg){
		profimg="../../img/missing.svg";
	}
	$("#acct-sel-prof").attr("src",profimg);
		if(localStorage.getItem("post_" + acct_id)){
			$("#toot-post-btn").text(localStorage.getItem("post_" + acct_id)+"("+localStorage.getItem("domain_"+acct_id)+")");
		}else{
			$("#toot-post-btn").text(lang.lang_toot+"("+localStorage.getItem("domain_"+acct_id)+")");
		}
	  if(!localStorage.getItem("bb_"+acct_id) && !localStorage.getItem("md_"+acct_id)){
		 $(".markdown").addClass("hide");
		$(".anti-markdown").addClass("hide");
	  }else{
		$(".anti-markdown").removeClass("hide");
	  }
	  if($(".markdown").hasClass("hide")){
		localStorage.setItem("md","hide");
	}else{
		localStorage.removeItem("md");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	if(domain=="itabashi.0j0.jp"){
		$("#limited-button").removeClass("hide");
	}else{
		$("#limited-button").addClass("hide");
	}
	if(domain=="kirishima.cloud"){
		$("#faicon-btn").show();
	}else{
		$("#faicon-btn").hide();
	}
	if(domain=="imastodon.net"){
		trendTag();
	}else{
		$("#trendtag").html("");
	}
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		Materialize.toast(lang.lang_bbmd_misskey, 5000);
	}
	if(idata[domain+"_letters"]){
		$("#textarea").attr("data-length", idata[domain+"_letters"])
	}else{
		$("#textarea").attr("data-length", 500)
	}
	if(idata[domain+"_glitch"]==="true"){
		$("#local-button").removeClass("hide");
	}else{
		$("#local-button").addClass("hide");
	}
	var multi = localStorage.getItem("multi");
	if (multi) {
		var obj = JSON.parse(multi);
		if(obj[acct_id].background && obj[acct_id].background!="def" && obj[acct_id].text && obj[acct_id].text!="def"){
			$("#toot-post-btn").removeClass("indigo");
			$("#toot-post-btn").css("background-color","#"+obj[acct_id].background);
			$("#toot-post-btn").css("color",obj[acct_id].text);
		}else{
			$("#toot-post-btn").css("background-color","");
			$("#toot-post-btn").css("color","");
			$("#toot-post-btn").addClass("indigo");

		}
	}
	loadVis();
}
//BOXのトグルボタン
function mdToggle(){
	$(".markdown").toggleClass("hide");
	$(".anti-markdown").toggleClass("hide");
	if($(".markdown").hasClass("hide")){
		localStorage.setItem("md","hide");
	}else{
		localStorage.removeItem("md");
	}
	
}
//最初に読み込みます(MD対応インスタンスかチェック)
if(localStorage.getItem("md")=="hide"){
	$(".markdown").addClass("hide");
	$(".anti-markdown").removeClass("hide");
}
//タグを選んだ時に(BB版)
  function tagsel(tag){
	  var acct_id = $("#post-acct-sel").val();
	  if(!localStorage.getItem("bb_"+acct_id)){
		  return false;
	  }
		if(tag=="large" || tag=="size" || tag=="color" || tag=="colorhex"){
			var sub=$("#"+tag).val();
			var sub = sub.replace( /#/g , "" ) ;
			surroundHTML(tag+"="+sub,tag);
		}else if(tag=="flip=vertical" || tag=="flip=horizontal"){
			surroundHTML(tag,"flip");
		}else{
			surroundHTML(tag,tag);
		}
		$("#textarea").focus();
  }
  //HTMLをエスケープしてXSSを防ぐ
  function escape_html (string) {
  if(typeof string !== 'string') {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function(match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match]
  });
}
//テキストボックスで選択したやつをタグで囲む(BB版)
function surroundHTML(tagS,tagE) {
	var acct_id = $("#post-acct-sel").val();
	  if(!localStorage.getItem("bb_"+acct_id)){
		  return false;
	  }
	var target = document.getElementById("textarea");
	var pos = getAreaRange(target);

	var val = target.value;
	var range = val.slice(pos.start, pos.end);
    var beforeNode = val.slice(0, pos.start);
    var afterNode  = val.slice(pos.end);
	var insertNode;
    if (range || pos.start != pos.end) {
       	insertNode = '[' + tagS + ']' + range + '[/' + tagE + ']';
       	target.value = beforeNode + insertNode + afterNode;
    }
    
    else if (pos.start == pos.end) {
       	insertNode = '[' + tagS + ']' + '[/' + tagE + ']';
       	target.value = beforeNode + insertNode + afterNode;
    }
}
  function markdown(tag,ck,br,space){
			if(space=="before"){
				tagE=tag;
				tag=" "+tag;
			}else{
				tagE=tag;
			}
			surroundMD(tag,tagE,ck,br);
			$("#textarea").focus();
  }
function surroundMD(tagS,tagE,ck,br) {
	var acct_id = $("#post-acct-sel").val();
	  if(!localStorage.getItem("md_"+acct_id)){
		  return false;
	  }
	var target = document.getElementById("textarea");
	var pos = getAreaRange(target);

	var val = target.value;
	var range = val.slice(pos.start, pos.end);
    var beforeNode = val.slice(0, pos.start);
    var afterNode  = val.slice(pos.end);
	var insertNode;
	if(br=="yes"){
		var br="\n";
	}else{
		var br="";
	}
	
    if ((range || pos.start != pos.end )&& ck=="yes") {
       	insertNode = tagS + range  + tagE ;
       	target.value = beforeNode + insertNode + br + afterNode;
    }
    
    else if (pos.start == pos.end || ck=="no") {
       	insertNode = tagS + range;
       	target.value = beforeNode + insertNode + br + afterNode;
    }
}

//テキストボックスの前後チェック
function getAreaRange(obj) {
	var pos = new Object();
	if(window.getSelection()) {
		pos.start = obj.selectionStart;
		pos.end   = obj.selectionEnd;
	}

	return pos;
}

//Markdownのリンク挿入
function markdownLink(){
	var acct_id = $("#post-acct-sel").val();
	  if(!localStorage.getItem("md_"+acct_id)){
		  return false;
	  }
	var linkIns="["+$("#linkt").val()+"]"+"("+$("#link2").val()+")";
	if(linkIns!="[]()"){
	$("#textarea").val($("#textarea").val()+linkIns);
	$("#linkt").val("");
	$("#link2").val("");
	$("#textarea").focus();
	}
}
//Markdownのimg挿入
function markdownImage(){
	var acct_id = $("#post-acct-sel").val();
	  if(!localStorage.getItem("md_"+acct_id)){
		  return false;
	  }
	var imgIns="!["+$("#image").val()+"]"+"("+$("#image2").val()+")";
	if(imgIns!="![]()"){
	$("#textarea").val($("#textarea").val()+imgIns);
	$("#image").val("");
	$("#image2").val("");
	$("#textarea").focus();
	}
}
//文字数をチェック(hタグ用)
function str_count(all, part) {
    return (all.match(new RegExp(part, "g")) || []).length;
}

//プレビュー
function preview(){
	  $("#preview-field").show();
	  $("#toot-field").hide();
	  $("#preview-btn").hide();
	var bb=escape_html($("#textarea").val());
	//quote
	var bb=bb.replace(/>(.+)$/g,'<blockquote>$1<\/blockquote>');
	//spin
	var bb=bb.replace(/\[spin\](.+)\[\/spin\]/g,'<span class="fa fa-spin">$1<\/span>');
	//pulse
	var bb=bb.replace(/\[pulse\](.+)\[\/pulse\]/g,'<span class="bbcode-pulse-loading">$1<\/span>');
	//large
	var bb=bb.replace(/\[large=([0-9]{1,2})x\](.+)\[\/large\]/g,'<span class="fa fa-$1x">$2<\/span>');
	//vertical
	var bb=bb.replace(/\[flip=vertical\](.+)\[\/flip\]/g,'<span class="fa fa-flip-vertical">$1<\/span>');
	//horizontal
	var bb=bb.replace(/\[flip=horizontal\](.+)\[\/flip\]/g,'<span class="fa fa-flip-horizontal">$1<\/span>');
	//b
	var bb=bb.replace(/\[b\](.+)\[\/b\]/g,'<b>$1<\/b>');
	//i
	var bb=bb.replace(/\[i\](.+)\[\/i\]/g,'<i>$1<\/i>');
	//u
	var bb=bb.replace(/\[u\](.+)\[\/u\]/g,'<u>$1<\/u>');
	//s
	var bb=bb.replace(/\[s\](.+)\[\/s\]/g,'<s>$1<\/s>');
	//size
	var bb=bb.replace(/\[size=([0-9]{1,2})\](.+)\[\/size\]/g,'<span style="font-size:$1px">$2<\/span>');
	//colorhex
	var bb=bb.replace(/\[colorhex=([A-Fa-f0-9]+)\](.+)\[\/colorhex\]/g,'<span style="color:#$1">$2<\/span>');
	//code
	var bb=bb.replace(/`(.+)`/g,'<code>$1<\/code>');
	//head
	var m;
	m=bb.match(/^#{1,6}(.+)$/gm);
	if(m){
	for(let i = 0; i < m.length; i++) {
		var t=m[i].match(/^#{1,6}(.+)$/);
		var indexct='<h'+str_count(m[i],"#")+'>'+t[1]+'</h'+str_count(m[i],"#")+'>';
		var bb=bb.replace(new RegExp(m[i], ""),indexct);
	}
	}
	//list(ul)
	var li;
	li=bb.match(/^\- (.+)$/gm);
	if(li){
	for(let l = 0; l < li.length; l++) {
		var u=li[l].match(/^\- (.+)$/);
		var listUl='<li>'+u[1]+'</li>';
		if(l == 0){
			listUl='<ul>'+listUl;
		}
		if(l==li.length-1){
			listUl=listUl+'</ul>';
		}
		var bb=bb.replace(new RegExp(li[l], ""),listUl);
	}
	}
	//list(ol)
	var li;
	li=bb.match(/^1\. (.+)$/gm);
	if(li){
	for(let l = 0; l < li.length; l++) {
		var u=li[l].match(/^1\. (.+)$/);
		var listUl='<li>'+u[1]+'</li>';
		if(l == 0){
			listUl='<ol>'+listUl;
		}
		if(l==li.length-1){
			listUl=listUl+'</ol>';
		}
		var bb=bb.replace(new RegExp(li[l], ""),listUl);
	}
	}
	//img
	var bb=bb.replace(/!\[(.+)\]\((https:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)\)/g,'<img src="$2" text="$1" style="width:100%">');
	//link
	var bb=bb.replace(/\[(.+)\]\((https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)\)/g,'<a href="$2" target="_blank">$1<\/a>');
	bb=nl2br(bb);
	bb=bb.replace(new RegExp("</li><br />", "g"),"");
	$("#md-preview").html(bb);
  }
  //Editで戻る
  function previewEdit(){
	   $("#preview-field").hide();
	  $("#toot-field").show();
	  $("#preview-btn").show();
	  $("#md-preview").html("");
  }