//左下のメッセージ
function todo(mes){
	$('#message').text(mes);
	$('#message').fadeIn();
}
function todc(){
	$('#message').fadeOut();
}
function tips(mode){
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('endmem', "");
	clearInterval(clockint);
	if(mode=="ver"){
		tipsToggle()
		$("#tips-text").html('<img src="./img/desk.png" width="20"><span style="font-size:20px">TheDesk</span> '+localStorage.getItem("ver"))
		localStorage.setItem("tips","ver")
	}else if(mode=="clock"){
		tipsToggle()
		localStorage.setItem("tips","clock")
		clock()
	}else if(mode=="memory"){
		tipsToggle()
		localStorage.setItem("tips","memory")
		startmem();
	}else if(mode=="trend"){
		tipsToggle()
		localStorage.setItem("tips","trend")
		trendTagonTip()
	}
}
//メモリ
function startmem(){
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('startmem', "");
	ipc.on('memory', function (event, arg) {
		var use=arg[0];
		var cpu=arg[1];
		var total=arg[2]
		$("#tips-text").html(cpu+"<br>Memory:"+Math.floor(use/1024/1024/102.4)/10+"/"+Math.floor(total/1024/1024/102.4)/10+"GB("+Math.floor(use/total*100)+"%)")
	})
}
//トレンドタグ
function trendTagonTip(){
    $(".trendtag").remove();
    var domain="imastodon.net"
    var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/v1/trend_tags"
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
            var tags="";
            json=json.score;
            Object.keys(json).forEach(function(tag) {
                tags = tags + '<a onclick="tagShow(\'' + tag + '\')" class="pointer">#' + tag + '</a><span class="hide" data-tag="' + tag + '">　<a onclick="tagTL(\'tag\',\'' + tag + '\',false,\'add\')" class="pointer" title="#' + tag + 'のタイムライン">TL</a>　<a onclick="show();brInsert(\'#' + tag + '\')" class="pointer" title="#' + tag + 'でトゥート">Toot</a></span><br>';
             });
             $("#tips-text").html('<div class="trendtag">トレンドタグ<i class="material-icons pointer" onclick="trendTagonTip()" style="font-size:12px">refresh</i>:<br>' + tags+'</div>');
             trendTagonTipInterval()
        }else{
            $("#tips-text").html("");
        }
    });
    
}

function trendTagonTipInterval(){
    setTimeout(trendTagonTip, 6000000);
}
//時計
var clockint;
function clock(){
	var now=new Date();
	var last=1000-now.getTime()%1000;
	sleep(last);
	clockint=setInterval(clockStart, 1000);
}
function clockStart(){
	var nowTime = new Date(); //  現在日時を得る
	var nowHour = nowTime.getHours(); // 時を抜き出す
	if(nowHour<10){nowHour="0"+nowHour }
	var nowMin  = nowTime.getMinutes(); // 分を抜き出す
	if(nowMin<10){nowMin="0"+nowMin }
	var nowSec  = nowTime.getSeconds(); // 秒を抜き出す
	if(nowSec<10){nowSec="0"+nowSec }
	var msg =  nowTime.getFullYear()+"年"+(nowTime.getMonth()+1)+"月"+nowTime.getDate()+'日<span style="font-size:20px; font-family:Open Sans">'+nowHour + ":" + nowMin + ":" + nowSec+"</span>";
	$("#tips-text").html(msg);
}
function sleep(waitMsec) {
	var startMsec = new Date();
	while (new Date() - startMsec < waitMsec);
}
function tipsToggle(){
	$("#tips").toggleClass("hide");
	$("#tips-menu").toggleClass("hide");
}
if(localStorage.getItem("tips")){
	tips(localStorage.getItem("tips"));
}
	