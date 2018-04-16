//レイアウトの設定

var websocketOld = [];
var websocket = [];
var websocketHome = [];
var websocketLocal = [];
var websocketNotf = [];

//カラム追加ボックストグル
function addToggle() {
	$("#add-box").toggleClass("hide");
	addselCk()
	$("#add-box").css("top",$('#add-tgl').offset().top+"px");
	$("#add-box").css("left",$('#add-tgl').offset().left-410+"px");
	$("#add-box").toggleClass("show");
}
//最初、カラム変更時に発火
function parseColumn() {
	var size = localStorage.getItem("size");
	if (size) {
		$("#timeline-container").css("font-size", size + "px");
		$(".toot-reset").css("font-size", size + "px");
		$(".cont-series").css("font-size", size + "px");
	}
	tlCloser();
	var multi = localStorage.getItem("multi");
	if (!multi) {
		var obj = [];
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
	} else {
		var obj = JSON.parse(multi);

		var templete;
		Object.keys(obj).forEach(function(key) {
			var acct = obj[key];
			localStorage.setItem("name_" + key, acct.name);
			localStorage.setItem("user_" + key, acct.user);
			localStorage.setItem("user-id_" + key, acct.id);
			localStorage.setItem("prof_" + key, acct.prof);
			localStorage.setItem("domain_" + key, acct.domain);
			localStorage.setItem(acct.domain + "_at", acct.at);
			notf(key, 0);
			ckdb(key);
		});
	}
	var xed=localStorage.getItem("xed");
	if(xed){
		xpand();
	}
	var col = localStorage.getItem("column");
	if (!col) {
		var obj = [{
			domain: 0,
			type: 'local'
		}];
		localStorage.setItem("card_0","true");
		var json = JSON.stringify(obj);
		localStorage.setItem("column", json);
	} else {
		var obj = JSON.parse(col);
	}
	if ($("#timeline-container").length) {
		$("#timeline-container").html("");
	}
	Object.keys(obj).forEach(function(key) {
		var acct = obj[key];
		if(acct.type=="notf"){
			var notf_attr=' data-notf='+acct.domain;
		}else{
			var notf_attr='';
		}
		if(localStorage.getItem("notification_" + acct.domain)){
			var unique_notf=localStorage.getItem("notification_" + acct.domain);
		}else{
			var unique_notf="通知";
		}
		var insert="";
		var icnsert="";
		if(acct.background){
			if(acct.text=="def"){
				
			}else{
			if(acct.text=="black"){
				var txhex="000000";
				var ichex="9e9e9e"
			}else if(acct.text=="white"){
				var txhex="ffffff";
				var ichex="eeeeee"
			}
			insert=' style="background-color:#'+acct.background+'; color: #'+txhex+'" ';
			icnsert=' style="color: #'+ichex+'" ';
			}
		}
		var html = '<div class="box" id="timeline_box_' + key + '_box" tlid="' + key +
			'"><div class="notice-box z-depth-2" id="menu_'+key+'"'+insert+'>'+
			'<div class="area-notice"><i class="material-icons waves-effect red-text" id="notice_icon_' + key + '"'+notf_attr+' style="font-size:40px; padding-top:25%;" onclick="goTop(' + key + ')" title="一番上へ。アイコンが赤のときはストリーミングに接続できていません。F5等で再読込をお試し下さい。"></i></div>'+
			'<div class="area-notice_name"><span id="notice_' + key + '" class="tl-title"></span></div>'+
			'<div class="area-a1"><a onclick="notfToggle(' + acct.domain + ',' + key +
						  ')" class="setting nex" title="このアカウントの'+unique_notf+'"'+icnsert+'><i class="material-icons waves-effect nex notf-icon_' +
						  acct.domain + '">notifications</i></a></div>'+
			'<div class="area-a2"><a onclick="removeColumn(' + key +
						  ')" class="setting nex"><i class="material-icons waves-effect nex" title="このカラムを削除"'+icnsert+'>cancel</i></a></div>'+
		  '<div class="area-a3"><a onclick="setToggle(' + key +
		  ')" class="setting nex" title="このカラムの設定"'+icnsert+'><i class="material-icons waves-effect nex">settings</i></a></div></div>'+
		  '<div class="hide notf-indv-box z-depth-4" id="notf-box_' + key +
		  '"><div id="notifications_' + key +
		  '" data-notf="' + acct.domain + '"></div></div><div class="hide notf-indv-box" id="util-box_' + key +
		  '" style="padding:5px;"><a onclick="mediaToggle(' + key +
		  ')" class="setting nex"><i class="material-icons waves-effect nex" title="メディアフィルター">perm_media</i><span id="sta-media-' +
		  key + '">On</span></a>メディアフィルター<br><a onclick="cardToggle(' + key +
		  ')" class="setting nex"><i class="material-icons waves-effect nex" title="リンクの解析を切り替え(OFFで制限を回避出来る場合があります)">link</i><span id="sta-card-' +
		  key + '">On</span></a>リンク解析<br>TLヘッダーの色<br><div id="picker_'+key+'" class="color-picker"></div></div><div class="tl-box" tlid="' + key + '"><div id="timeline_' + key +
			'" class="tl" tlid="' + key + '"'+notf_attr+'><div style="text-align:center">[ここにトゥートはありません。]<br>F5で再読込できます。</div></div></div></div>';
		$("#timeline-container").append(html);
		localStorage.removeItem("pool_" + key);
		if (acct.data) {
			var data = acct.data;
		} else {
			var data = "";
		}
		tl(acct.type, data, acct.domain, key);
		cardCheck(key);
		mediaCheck(key);
	});
	var width = localStorage.getItem("width");
	if (width) {
		$(".box").css("min-width", width + "px");
	}
	var box = localStorage.getItem("box");
	if (box == "yes") {
		$("#post-box").addClass("hidenbox");
		$("#post-box").fadeOut();
		$("#menu-btn").fadeIn();
	}else if (box == "hide"){
		$("body").addClass("mini-post");
		$(".mini-btn").text("expand_less");
	}
	favTag();
}
//カラム追加
function addColumn() {
	var acct = $("#add-acct-sel").val();
	localStorage.setItem("last-use", acct);
	var type = $("#type-sel").val();
	if(acct=="noauth"){
		acct=$("#noauth-url").val();
		type="noauth"
	}
	var add = {
		domain: acct,
		type: type
	};
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	if(!obj){
		var leng=0;
		localStorage.setItem("card_" + leng,"true");
		var json = JSON.stringify([add]);
		localStorage.setItem("column", json);
	}else{
		var leng=obj.length;
		localStorage.setItem("card_" + leng,"true");
		obj.push(add);
		var json = JSON.stringify(obj);
		localStorage.setItem("column", json);
	}
	
	parseColumn();
}
function addselCk(){
	var acct = $("#add-acct-sel").val();
	if(acct=="noauth"){
		$("#auth").addClass("hide");
		$("#noauth").removeClass("hide");
	}else{
		$("#auth").removeClass("hide");
		$("#noauth").addClass("hide");
	}
}
//カラム削除
function removeColumn(tlid) {
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	//聞く
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('column-del', "");
	ipc.on('column-del-reply', function (event, arg) {
		console.log(arg);
		if(arg==1){
			localStorage.removeItem("card_" + tlid);
			obj.splice(tlid, 1);
			var json = JSON.stringify(obj);
			localStorage.setItem("column", json);
			parseColumn();
			sortload()
		}
	})
}

//設定トグル
function setToggle(tlid) {
	colorpicker(tlid);
	$("#util-box_" + tlid).toggleClass("hide");
	$("#util-box_" + tlid).toggleClass("show");
}
function colorpicker(key){
	temp=
		'<div onclick="coloradd('+key+',\'def\',\'def\')" class="pointer">Default</div>'+
		'<div onclick="coloradd('+key+',\'f44336\',\'white\')" class="red white-text pointer">Red</div>'+
		'<div onclick="coloradd('+key+',\'e91e63\',\'white\')" class="pink white-text pointer">Pink</div>'+
		'<div onclick="coloradd('+key+',\'9c27b0\',\'white\')" class="purple white-text pointer">Purple</div>'+
		'<div onclick="coloradd('+key+',\'673ab7\',\'white\')" class="deep-purple white-text pointer">Deep-purple</div>'+
		'<div onclick="coloradd('+key+',\'3f51b5\',\'white\')" class="indigo white-text pointer">Indigo</div>'+
		'<div onclick="coloradd('+key+',\'2196f3\',\'white\')" class="blue white-text pointer">Blue</div>'+
		'<div onclick="coloradd('+key+',\'03a9f4\',\'black\')" class="light-blue black-text pointer">Light-blue</div>'+
		'<div onclick="coloradd('+key+',\'00bcd4\',\'black\')" class="cyan black-text pointer">Cyan</div>'+
		'<div onclick="coloradd('+key+',\'009688\',\'white\')" class="teal white-text pointer">Teal</div>'+
		'<div onclick="coloradd('+key+',\'4caf50\',\'black\')" class="green black-text pointer">Green</div>'+
		'<div onclick="coloradd('+key+',\'8bc34a\',\'black\')" class="light-green black-text pointer">Light-green</div>'+
		'<div onclick="coloradd('+key+',\'cddc39\',\'black\')" class="lime black-text pointer">Lime</div>'+
		'<div onclick="coloradd('+key+',\'ffeb3b\',\'black\')" class="yellow black-text pointer">Yellow</div>'+
		'<div onclick="coloradd('+key+',\'ffc107\',\'black\')" class="amber black-text pointer">Amber</div>'+
		'<div onclick="coloradd('+key+',\'ff9800\',\'black\')" class="orange black-text pointer">Orange</div>'+
		'<div onclick="coloradd('+key+',\'ff5722\',\'white\')" class="deep-orange white-text pointer">Deep-orange</div>'+
		'<div onclick="coloradd('+key+',\'795548\',\'white\')" class="brown white-text pointer">Brown</div>'+
		'<div onclick="coloradd('+key+',\'9e9e9e\',\'white\')" class="grey white-text pointer">Grey</div>'+
		'<div onclick="coloradd('+key+',\'607d8b\',\'white\')" class="blue-grey white-text pointer">Blue-grey</div>'+
		'<div onclick="coloradd('+key+',\'000000\',\'white\')" class="black white-text pointer">Black</div>'+
		'<div onclick="coloradd('+key+',\'ffffff\',\'black\')" class="white black-text pointer">White</div>';
	$("#picker_"+key).html(temp);
}
function coloradd(key,bg,txt){
	var col = localStorage.getItem("column");
	var o = JSON.parse(col);
	var obj=o[key];
	obj.background=bg;
	obj.text=txt;
	o[key]=obj;
	var json = JSON.stringify(o);
	localStorage.setItem("column", json);
	if(txt=="def"){
		$("#menu_"+key).attr("style","")
	}else{
	$("#menu_"+key).css('background-color','#'+bg);
	if(txt=="black"){
		var bghex="000000";
		var ichex="9e9e9e"
	}else if(txt=="white"){
		var bghex="ffffff";
		var ichex="eeeeee"
	}
	$("#menu_"+key+" .nex").css('color','#'+ichex);
	$("#menu_"+key).css('color','#'+bghex);
	}
}