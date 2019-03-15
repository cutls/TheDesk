//設定(setting.html)で読む
var envView = new Vue({
	el: '#env-view',
	data: {config:envConstruction,value:envValue},
	method: {
		settings: function (index) {
			return true
		}
	}
});

//設定ボタン押した。
function settings() {
	var dd = $("[name=time]:checked").val();
	var dt = $("[for="+dd+"]").text();
		if (dd != localStorage.getItem("datetype")) {
		Materialize.toast(lang.lang_setting_time.replace("{{set}}" ,dt), 3000);
	}
	localStorage.setItem("datetype", dd);

	var cd = $("[name=theme]:checked").val();
	var ct = $("[for="+cd+"]").html();
	if(cd=="custom" && !$("#custom-sel-sel").val()){
		var theme = localStorage.getItem("theme");
		if (!theme) {
			var theme = "white";
		}
		$("#" + theme).prop("checked", true);
	}else{
		if (cd != localStorage.getItem("theme")) {
			Materialize.toast(lang.lang_setting_theme.replace("{{set}}" ,ct), 3000);
		}
		//テーマはこの場で設定
		themes(cd);
		localStorage.setItem("theme", cd);
	}

	var nd = $("[name=nsfw]:checked").val();
	var nt = $("[for=n_"+nd+"]").text();
	if (nd != localStorage.getItem("nsfw")) {
		Materialize.toast(lang.lang_setting_nsfw.replace("{{set}}" ,nt), 3000);
	}
	localStorage.setItem("nsfw", nd);

	var cwd = $("[name=cw]:checked").val();
	var cwt = $("[for=c_"+cwd+"]").text();
	if (cwd != localStorage.getItem("cw")) {
		Materialize.toast(lang.lang_setting_cw.replace("{{set}}" ,cwt), 3000);
	}
	localStorage.setItem("cw", cwd);

	var cwtd = $("#cw-text").val();
	if (cwtd != localStorage.getItem("cw-text")) {
		Materialize.toast(lang.lang_setting_cwtext.replace("{{set}}" ,cwtd), 3000);
	}
	localStorage.setItem("cw-text", cwtd);

	var cwsd = $("[name=cws]:checked").val();
	var cwst = $("[for=cws_"+cwsd+"]").text();
	if (cwsd != localStorage.getItem("always-cw")) {
		Materialize.toast(lang.lang_setting_cws.replace("{{set}}" ,cwst), 3000);
	}
	localStorage.setItem("always-cw", cwsd);

	var rpd = $("[name=rp]:checked").val();
	var rpt = $("[for=c_"+cwd+"]").text();
	if (rpd != localStorage.getItem("replyct")) {
		Materialize.toast(lang.lang_setting_rp.replace("{{set}}" ,rpt), 3000);
	}
	localStorage.setItem("replyct", rpd);

	var visd = $("[name=vis]:checked").val();
	var vist = $("[for="+visd+"]").text();
	if (visd != localStorage.getItem("vis")) {
		Materialize.toast(lang.lang_setting_vis.replace("{{set}}" ,vist), 3000);
	}
	localStorage.setItem("vis", visd);

	var popd = $("#popup").val();
	if (popd > 0 && popd != localStorage.getItem("popup")) {
		Materialize.toast(lang.lang_setting_popup.replace("{{set}}" ,popd+lang.lang_setting_s), 3000);
	} else if (popd != localStorage.getItem("popup")) {
		Materialize.toast(lang.lang_setting_popup.replace("{{set}}" ,lang.lang_setting_off), 3000);
	}
	localStorage.setItem("popup", popd);

	var gifd = $("[name=gif]:checked").val();
	var gift = $("[for=g_"+gifd+"]").text();
	if (gifd != localStorage.getItem("gif")) {
		Materialize.toast(lang.lang_setting_gif.replace("{{set}}" ,gift), 3000);
	}
	localStorage.setItem("gif", gifd);

	var sentd = $("#sentence").val();
	var ltrd = $("#letters").val();
	if (sentd != localStorage.getItem("sentence") || ltrd != localStorage.getItem("letters")) {
		Materialize.toast(lang.lang_setting_selt.replace("{{set1}}" ,sentd).replace("{{set2}}" ,ltrd), 3000);
	}
	localStorage.setItem("sentence", sentd);
	localStorage.setItem("letters", ltrd);

	var csentd = $("#cw_sentence").val();
	var cltrd = $("#cw_letters").val();
	if (csentd != localStorage.getItem("cw_sentence") || cltrd != localStorage.getItem("cw_letters")) {
		Materialize.toast(lang.lang_setting_autocw.replace("{{set1}}" ,csentd).replace("{{set2}}" ,cltrd), 3000);
	}
	localStorage.setItem("cw_sentence", csentd);
	localStorage.setItem("cw_letters", cltrd);

	var widthd = $("#width").val();
	if (widthd != localStorage.getItem("width")) {
		Materialize.toast(lang.lang_setting_width.replace("{{set}}" ,widthd), 3000);
	}
	localStorage.setItem("width", widthd);

	var fwidthd = $("#fixwidth").val();
	if (fwidthd != localStorage.getItem("fixwidth")) {
		Materialize.toast(lang.lang_setting_fixwidth.replace("{{set}}" ,fwidthd), 3000);
	}
	localStorage.setItem("fixwidth", fwidthd);

	var imgd = $("[name=img]:checked").val();
	var imgt = $("[for=i_"+imgd+"]").text();
	if (imgd != localStorage.getItem("img")) {
		Materialize.toast(lang.lang_setting_img.replace("{{set}}" ,imgt), 3000);
	}
	localStorage.setItem("img", imgd);

	var fontd = $("#font").val();
	if(fontd){
		if (fontd != localStorage.getItem("font")) {
			Materialize.toast(lang.lang_setting_font.replace("{{set}}" ,fontd), 3000);
		}
		localStorage.setItem("font", fontd);
		themes();
	}else{
		if(localStorage.getItem("font")){
			localStorage.removeItem("font");
			Materialize.toast(lang.lang_setting_font.replace("{{set}}" ,lang.lang_setting_default), 3000);
			themes();
		}
	}
	

	var sized = $("#size").val();
	if (sized != localStorage.getItem("size")) {
		Materialize.toast(lang.lang_setting_size.replace("{{set}}" ,sized), 3000);
	}
	localStorage.setItem("size", sized);

	var heid = $("#img-height").val();
	if (heid != localStorage.getItem("img-height")) {
		Materialize.toast(lang.lang_setting_imgheight.replace("{{set}}" ,heid), 3000);
	}
	localStorage.setItem("img-height", heid);

	var tckrd = $("[name=ticker]:checked").val();
	var tckrt = $("[for=ticker_"+tckrd+"]").text();
	if (tckrd != localStorage.getItem("ticker_ok")) {
		Materialize.toast(lang.lang_setting_ticker.replace("{{set}}" ,tckrt), 3000);
	}
	localStorage.setItem("ticker_ok", tckrd);

	var animed = $("[name=anime]:checked").val();
	var animet = $("[for=anime_"+animed+"]").text();
	if (animed != localStorage.getItem("animation")) {
		Materialize.toast(lang.lang_setting_animation.replace("{{set}}" ,animet), 3000);
	}
	localStorage.setItem("animation", animed);

	var boxd = $("[name=box]:checked").val();
	var boxt = $("[for=bx_"+boxd+"]").text();
	if (boxd != localStorage.getItem("box")) {
		Materialize.toast(lang.lang_setting_boxConfirm.replace("{{set}}" ,boxt), 3000);
	}
	localStorage.setItem("box", boxd);

	var tagd = $("[name=tag]:checked").val();
	var tagt = $("[for=t_"+tagd+"]").text();
	if (tagd != localStorage.getItem("tag-range")) {
		Materialize.toast(lang.lang_setting_tag.replace("{{set}}" ,tagt), 3000);
	}
	localStorage.setItem("tag-range", tagd);

	var uld = $("[name=ul]:checked").val();
	var ult = $("[for=ul_"+uld+"]").text();
	if (uld != localStorage.getItem("locale")) {
		Materialize.toast(lang.lang_setting_ul.replace("{{set}}" ,ult), 3000);
	}
	localStorage.setItem("locale", uld);

	var ntd = $("[name=notf]:checked").val();
	var ntt = $("[for=ntf_"+ntd+"]").text();
	if (ntd != localStorage.getItem("nativenotf")) {
		Materialize.toast(lang.lang_setting_notf.replace("{{set}}" ,ntt), 3000);
	}
	localStorage.setItem("nativenotf", ntd);

	var qtd = $("[name=quote]:checked").val();
	var qtt = $("[for=q_"+qtd+"]").text();
	if (qtd != localStorage.getItem("quote")) {
		Materialize.toast(lang.lang_setting_quote.replace("{{set}}" ,qtt), 3000);
	}
	localStorage.setItem("quote", qtd);
	
	var viad = $("[name=via]:checked").val();
	var viat = $("[for=via_"+viad+"]").text();
	if (viad != localStorage.getItem("viashow")) {
		Materialize.toast(lang.lang_setting_via.replace("{{set}}" ,viat), 3000);
	}
	localStorage.setItem("viashow", viad);

	var notfmd = $("[name=notfm]:checked").val();
	var notfmt = $("[for=notfm_"+notfmd+"]").text();
	if (notfmd != localStorage.getItem("setasread")) {
		Materialize.toast(lang.lang_setting_setasread.replace("{{set}}" ,notfmt), 3000);
	}
	localStorage.setItem("setasread", notfmd);

	var movd = $("[name=mov]:checked").val();
	var movt = $("[for=mov_"+movd+"]").text();
	if (movd != localStorage.getItem("mouseover")) {
		Materialize.toast(lang.lang_setting_mov.replace("{{set}}" ,movt), 3000);
	}
	localStorage.setItem("mouseover", movd);

	var maind = $("[name=main]:checked").val();
	var maint = $("[for=mn_"+maind+"]").text();
	if (maind != localStorage.getItem("mainuse")) {
		Materialize.toast(lang.lang_setting_main.replace("{{set}}" ,maint), 3000);
	}
	localStorage.setItem("mainuse", maind);

	var secd = $("[name=sec]:checked").val();
	var sect = $("[for=sec-"+secd+"]").text();
	if (secd != localStorage.getItem("sec")) {
		Materialize.toast(lang.lang_setting_sec.replace("{{set}}" ,sect), 3000);
	}
	localStorage.setItem("sec", secd);
}

//読み込み時の設定ロード
function load() {
	if(localStorage.getItem("imas")){
		$(".imas").removeClass("hide");
	}
	if(localStorage.getItem("kirishima")){
		$(".kirishima").removeClass("hide");
	}
	var prof = localStorage.getItem("prof");
	$("#my-prof").attr("src", prof);
	var datetype = localStorage.getItem("datetype");
	if (!datetype) {
		var datetype = "absolute";
	}
	$("#" + datetype).prop("checked", true);

	var theme = localStorage.getItem("theme");
	if (!theme) {
		var theme = "white";
	}
	$("#" + theme).prop("checked", true);

	var ha = localStorage.getItem("ha");
	if (!ha) {
		var ha = "false";
	}
	$("#ha_" + ha).prop("checked", true);

	var nsfw = localStorage.getItem("nsfw");
	if (!nsfw) {
		var nsfw = "yes";
	}
	$("#n_" + nsfw).prop("checked", true);

	var cw = localStorage.getItem("cw");
	if (!cw) {
		var cw = "yes";
	}
	$("#c_" + cw).prop("checked", true);

	var cws = localStorage.getItem("always-cw");
	if (!cws) {
		var cws = "no";
	}
	$("#cws_" + cws).prop("checked", true);

	var popup = localStorage.getItem("popup");
	if (!popup) {
		var popup = "0";
	}
	$("#popup").val(popup);

	var box = localStorage.getItem("box");
	if (!box) {
		var box = "no";
	}
	if(box=="absolute"){
		var box = "abs";
	}
	$("#bx_" + box).prop("checked", true);

	var gif = localStorage.getItem("gif");
	if (!gif) {
		var gif = "yes";
	}
	$("#g_" + gif).prop("checked", true);

	var sent = localStorage.getItem("sentence");
	if (!sent) {
		var sent = "500";
	}
	$("#sentence").val(sent);
	var ltrs = localStorage.getItem("letters");
	if (!ltrs) {
		var ltrs = "500";
	}
	$("#letters").val(ltrs);

	var csent = localStorage.getItem("cw_sentence");
	if (!csent) {
		var csent = "500";
	}
	$("#cw_sentence").val(csent);
	var cltrs = localStorage.getItem("cw_letters");
	if (!cltrs) {
		var cltrs = "500";
	}
	$("#cw_letters").val(cltrs);

	var width = localStorage.getItem("width");
	if (!width) {
		var width = "300";
	}
	$("#width").val(width);

	var fwidth = localStorage.getItem("fixwidth");
	if (!fwidth) {
		var fwidth = "300";
	}
	$("#fixwidth").val(fwidth);

	var cwt = localStorage.getItem("cw-text");
	if (!cwt) {
		var cwt = "";
	}
	$("#cw-text").val(cwt);

	var cws = localStorage.getItem("always-cw");
	if (!cws) {
		var cws = "no";
	}
	$("#cws_" + cws).prop("checked", true);

	var rps = localStorage.getItem("replyct");
	if (!rps) {
		var rps = "hidden";
	}
	$("#rp_" + rps).prop("checked", true);

	var vis = localStorage.getItem("vis");
	if (!vis) {
		var vis = "public";
	}
	$("#" + vis).prop("checked", true);

	var img = localStorage.getItem("img");
	if (!img) {
		var img = "no-act";
	}
	$("#i_" + img).prop("checked", true);
	
	var font = localStorage.getItem("font");
	if (!font) {
		var font = "";
	}
	$("#font").val(font);

	var size = localStorage.getItem("size");
	if (!size) {
		var size = "13";
	}
	$("#size").val(size);

	var imh = localStorage.getItem("img-height");
	if (!imh) {
		var imh = "200";
	}
	$("#img-height").val(imh);

	var ticker = localStorage.getItem("ticker_ok");
	if (!ticker) {
		var ticker = "no";
	}
	$("#ticker_" + ticker).prop("checked", true);

	var animation = localStorage.getItem("animation");
	if (!animation) {
		var animation = "yes";
	}
	$("#anime_" + animation).prop("checked", true);

	var tag = localStorage.getItem("tag-range");
	if (!tag) {
		var tag = "all";
	}
	$("#t_" + tag).prop("checked", true);

	var box = localStorage.getItem("box");
	if (!box) {
		var box = "yes";
	}
	$("#bx_" + box).prop("checked", true);

	var uld = localStorage.getItem("locale");
	if (!uld) {
		var uld = "yes";
	}
	$("#ul_" + uld).prop("checked", true);

	var nnd = localStorage.getItem("nativenotf");
	if (!nnd) {
		var nnd = "yes";
	}
	$("#ntf_" + nnd).prop("checked", true);

	var qt = localStorage.getItem("quote");
	if (!qt) {
		var qt = "simple";
	}
	$("#q_" + qt).prop("checked", true);

	var viat = localStorage.getItem("viashow");
	if (!viat) {
		var viat = "hide";
	}
	$("#via_" + viat).prop("checked", true);

	var movt = localStorage.getItem("mouseover");
	if (!movt) {
		var movt = "no";
	}
	$("#mov_" + movt).prop("checked", true);

	var notfmt = localStorage.getItem("setasread");
	if (!notfmt) {
		var notfmt = "yes";
	}
	$("#notfm_" + notfmt).prop("checked", true);

	var maint = localStorage.getItem("mainuse");
	if (!maint) {
		var maint = "remain";
	}
	$("#mn_" + maint).prop("checked", true);

	var sect = localStorage.getItem("sec");
	if (!sect) {
		var sect = "nothing";
	}
	$("#sec-" + sect).prop("checked", true);
	
}

function climute(){
	//クライアントミュート
	var cli = localStorage.getItem("client_mute");
	var obj = JSON.parse(cli);
	if(!obj){
		$("#mute-cli").html(lang.lang_setting_nomuting);
	}else{
		if(!obj[0]){
			$("#mute-cli").html(lang.lang_setting_nomuting);
			return;
		}
	var templete;
	Object.keys(obj).forEach(function(key) {
		var cli = obj[key];
		var list = key * 1 + 1;
		templete = '<div class="acct" id="acct_' + key + '">' + list +
			'.' +
			cli + '<button class="btn waves-effect red disTar" onclick="cliMuteDel(' +
			key + ')">'+lang.lang_del+'</button><br></div>';
		$("#mute-cli").append(templete);
	});
}
}
function cliMuteDel(key){
	var cli = localStorage.getItem("client_mute");
	var obj = JSON.parse(cli);
	obj.splice(key, 1);
	var json = JSON.stringify(obj);
	localStorage.setItem("client_mute", json);
	mute();
}

function wordmute(){
	var word = localStorage.getItem("word_mute");
	var obj = JSON.parse(word);
	$('#wordmute').material_chip({
		data: obj,
	  });
}
function wordmuteSave(){
	var word=$('#wordmute').material_chip('data');
	var json = JSON.stringify(word);
	localStorage.setItem("word_mute", json);
}

function wordemp(){
	var word = localStorage.getItem("word_emp");
	var obj = JSON.parse(word);
	$('#wordemp').material_chip({
		data: obj,
	});
}
function wordempSave(){
	var word=$('#wordemp').material_chip('data');
	var json = JSON.stringify(word);
	localStorage.setItem("word_emp", json);
}
function notftest(){
		var electron = require("electron");
		var ipc = electron.ipcRenderer;
		var os = electron.remote.process.platform;
		var options = {
				body: lang.lang_setting_notftest+'('+lang.lang_setting_notftestprof+')',
				icon: localStorage.getItem("prof_0")
		  };
		if(os=="darwin"){
			var n = new Notification('TheDesk'+lang.lang_setting_notftest, options);
		}else{
			ipc.send('native-notf', ['TheDesk'+lang.lang_setting_notftest,lang.lang_setting_notftest+'('+lang.lang_setting_notftestprof+')',localStorage.getItem('prof_0'),"",""]);
		}
	
}
function oks(no){
	var txt=$("#oks-"+no).val();
	localStorage.setItem("oks-"+no, txt);
	Materialize.toast(lang.lang_setting_ksref, 3000);
}
function oksload(){
	if(localStorage.getItem("oks-1")){$("#oks-1").val(localStorage.getItem("oks-1"))}
	if(localStorage.getItem("oks-2")){$("#oks-2").val(localStorage.getItem("oks-2"))}
	if(localStorage.getItem("oks-3")){$("#oks-3").val(localStorage.getItem("oks-3"))}
}
function changelang(lang){
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('lang',lang);
	ipc.on('langres', function (event, arg) {
		location.href="../"+lang+"/setting.html"
	});
}
function exportSettings(){
	if(!confirm(lang.lang_setting_exportwarn)){
		return false;
	}
	var electron = require("electron");
	var remote=electron.remote;
	var dialog=remote.dialog;
	var ipc = electron.ipcRenderer;
	dialog.showSaveDialog(null, {
		title: 'Export',
		properties: ['openFile', 'createDirectory'],
		defaultPath: "export.thedeskconfig"
	}, (savedFiles) => {
		console.log(savedFiles);
		if(!savedFiles){
			return false;
		}
		var exp={};
		//Accounts
		var multi = localStorage.getItem("multi");
		var acct = JSON.parse(multi);
		exp.accts=acct;
		//Columns
		var multi = localStorage.getItem("column");
		var column = JSON.parse(multi);
		exp.columns=column;
		//Themes
		exp.theme=localStorage.getItem("theme");
		//Min width
		exp.minwidth=localStorage.getItem("width");
		//Font
		exp.font=localStorage.getItem("font");
		exp.size=localStorage.getItem("size");
		//Img height
		exp.imgheight=localStorage.getItem("img-height");
		//Main
		exp.mainuse=localStorage.getItem("mainuse");
		//CW text
		exp.cw=localStorage.getItem("cw-text");
		//vis
		exp.vis=localStorage.getItem("vis");
		//keysc
		exp.ksc=[
			localStorage.getItem("oks-1"),
			localStorage.getItem("oks-2"),
			localStorage.getItem("oks-3")
		];
		//climu
		var cli = localStorage.getItem("client_mute");
		var climu = JSON.parse(cli);
		exp.clientMute=climu;
		//wordmu
		var wdm = localStorage.getItem("word_mute");
		var wordmu = JSON.parse(wdm);
		exp.wordMute=wordmu;
		//spotify
		exp.spotifyArtwork=localStorage.getItem("artwork")
		var content=localStorage.getItem("np-temp");
		if(content || content=="" || content=="null"){
			exp.spotifyTemplete=content;
		}else{
			exp.spotifyTemplete=null;
		}
		//tags
		var tagarr = localStorage.getItem("tag");
		var favtag = JSON.parse(tagarr);
		exp.favoriteTags=favtag;
		console.log(exp);
		ipc.send('export', [savedFiles,JSON.stringify(exp)]);
		alert("Done.")
		//cards
		//lang
	});
}
function importSettings(){
	if(!confirm(lang.lang_setting_importwarn)){
		return false;
	}
	var electron = require("electron");
	var remote=electron.remote;
	var dialog=remote.dialog;
	var ipc = electron.ipcRenderer;
	dialog.showOpenDialog(null, {
		title: 'Import',
		properties: ['openFile'],
		filters: [
			{name: 'TheDesk Config', extensions: ['thedeskconfig']},
		]
	}, (fileNames) => {
		console.log(fileNames);
		if(!fileNames){
			return false;
		}
		ipc.send('import', fileNames[0]);
		ipc.on('config', function (event, arg) {
			var obj = JSON.parse(arg);
			if(obj){
				localStorage.clear();
				localStorage.setItem("multi",JSON.stringify(obj.accts));
				for(var key=0;key<obj.accts.length;key++){
					var acct=obj.accts[key];
					localStorage.setItem("name_" + key, acct.name);
					localStorage.setItem("user_" + key, acct.user);
					localStorage.setItem("user-id_" + key, acct.id);
					localStorage.setItem("prof_" + key, acct.prof);
					localStorage.setItem("domain_" + key, acct.domain);
					localStorage.setItem("acct_"+ key + "_at", acct.at);
				}
				localStorage.setItem("column",JSON.stringify(obj.columns));
				localStorage.setItem("theme",obj.theme);
				if(obj.width){
					console.log(obj.width)
					localStorage.setItem("width",obj.width);
				}
				if(obj.font){
					localStorage.setItem("font",obj.font);
				}
				if(obj.size){
					localStorage.setItem("size",obj.size);
				}
				themes(obj.theme);
				if(obj.imgheight){
					localStorage.setItem("img-height",obj.imgheight);
				}
				localStorage.setItem("mainuse",obj.mainuse);
				if(obj.cw){
					localStorage.setItem("cwtext",obj.cw);
				}
				localStorage.setItem("vis",obj.vis);
				if(obj.ksc[0]){
					localStorage.setItem("oks-1",obj.ksc[0]);
				}
				if(obj.ksc[1]){
					localStorage.setItem("oks-2",obj.ksc[1]);
				}
				if(obj.ksc[2]){
					localStorage.setItem("oks-3",obj.ksc[2]);
				}
				if(obj.clientMute){
					localStorage.setItem("client_mute",JSON.stringify(obj.clientMute));
				}
				if(obj.wordMute){
					localStorage.setItem("word_mute",JSON.stringify(obj.wordMute));
				}
				if(obj.favoriteTags){
					localStorage.setItem("tag",JSON.stringify(obj.favoriteTags));
				}
				
				localStorage.setItem("np-temp",obj.spotifyTemplete);
				for(var i=0;i<obj.columns.length;i++){
					localStorage.setItem("card_" + i,"true");
					localStorage.removeItem("catch_" + i);
				}
				location.href="language.html";
			}else{
				alert("Error.")
			}
		})
		//cards
		//lang
	});
}
function savefolder(){
	var electron = require("electron");
	var remote=electron.remote;
	var dialog=remote.dialog;
	dialog.showOpenDialog(null, {
		title: 'Save folder',
		properties: ['openDirectory'],
	}, (fileNames) => {
		localStorage.setItem("savefolder",fileNames[0]);
	});
}

function font(){
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('fonts', []);
	ipc.on('font-list', function (event, arg) {
		$("#fonts").removeClass("hide");
		for( var i=0; i<arg.length; i++) {
			var font=arg[i];
			$("#fonts").append('<div class="font pointer" style="font-family:'+font.family+'" onclick="insertFont(\''+font.family+'\')">'+font.family+"</div>")
		}
	});
}
function insertFont(name){
	$("#font").val(name);
}
$(".color-picker").each(function(i, elem) {
	pickerDefine(i,"fff");
});
function pickerDefine(i,color){
	var pickr = new Pickr({
		el: '#color-picker'+i,
		default: color,
		showAlways: true,
		appendToBody: true,
		closeWithKey: 'Escape',
		comparison: false,
		components: {
			preview: true, // Left side color comparison
			opacity: false, // Opacity slider
			hue: true,     // Hue slider
			interaction: {
				rgba: false, // rgba option (red green blue and alpha)
				input: true, // input / output element
			}
		},
		strings: {
		   save: 'Save',  // Default for save button
		   clear: 'Clear' // Default for clear button
		}
	   });
		   pickr.on('change', (...args) => {
			 	var rgb='rgb('+args[0].toRGBA()[0]+','+args[0].toRGBA()[1]+','+args[0].toRGBA()[2]+')';
				$("#color-picker"+i+"_value").val(rgb)
			});
}
function customComp(){
	var nameC=$("#custom_name").val();
	if(!nameC){return false;}
	var descC=$("#custom_desc").val();
	var primaryC=$("#color-picker0_value").val();
	if(!primaryC){primaryC="rgb(255,255,255)"}
	var secondaryC=$("#color-picker1_value").val();
	if(!secondaryC){secondaryC="rgb(255,255,255)"}
	var textC=$("#color-picker2_value").val();
	if(!textC){textC="rgb(255,255,255)"}
	var accentC=$("#color-picker3_value").val();
	if(!accentC){accentC="rgb(255,255,255)"}
	var multi = localStorage.getItem("multi");
	var my=JSON.parse(multi)[0].name;
	var id=$("#custom-edit-sel").val();
	if(id=="add_new"){
		id=makeCID();
	}
	var json={
		"name": nameC,
		"author": my,
		"desc": descC,
		"base": $("[name=direction]:checked").val(),
		"vars": {
		  "primary": primaryC,
		  "secondary": secondaryC,
		  "text": textC
		},
		"props": {
			"TheDeskAccent": accentC
		},
		"id": id
	  }
	  $("#custom_json").val(JSON.stringify(json));
	  themes();
	  $("#custom_name").val("");
	  $("#custom_desc").val("");
	  $("#dark").prop("checked", true);
	  $("#custom_json").val("");
	  $("#color-picker0-wrap").html('<div class="color-picker" id="color-picker0"></div>')
	  $("#color-picker1-wrap").html('<div class="color-picker" id="color-picker1"></div>')
	  $("#color-picker2-wrap").html('<div class="color-picker" id="color-picker2"></div>')
	  $("#color-picker3-wrap").html('<div class="color-picker" id="color-picker3"></div>')
	  $("#color-picker0_value").val("");
	  $("#color-picker1_value").val("");
	  $("#color-picker2_value").val("");
	  $("#color-picker3_value").val("");
	  pickerDefine(0,"fff");
	  pickerDefine(1,"fff");
	  pickerDefine(2,"fff");
	  pickerDefine(3,"fff");
	  ipc.send('theme-json-create', JSON.stringify(json));
}
function deleteIt(){
	var id=$("#custom-sel-sel").val();
	$("#custom_name").val("");
	$("#custom_desc").val("");
	$("#dark").prop("checked", true);
	$("#custom_json").val("");
	$("#color-picker0-wrap").html('<div class="color-picker" id="color-picker0"></div>')
	$("#color-picker1-wrap").html('<div class="color-picker" id="color-picker1"></div>')
	$("#color-picker2-wrap").html('<div class="color-picker" id="color-picker2"></div>')
	$("#color-picker3-wrap").html('<div class="color-picker" id="color-picker3"></div>')
	$("#color-picker0_value").val("");
	$("#color-picker1_value").val("");
	$("#color-picker2_value").val("");
	$("#color-picker3_value").val("");
	pickerDefine(0,"fff");
	pickerDefine(1,"fff");
	pickerDefine(2,"fff");
	pickerDefine(3,"fff");
	ipc.on('theme-json-delete-complete', function (event, args) {
		ctLoad()
	});
	ipc.send('theme-json-delete', id);
}
function ctLoad(){
	ipc.send('theme-json-list', "");
	ipc.on('theme-json-list-response', function (event, args) {
		console.log(args);
		var templete="";
		Object.keys(args).forEach(function(key) {
			var theme = args[key];
			var themeid=theme.id
			templete = templete+'<option value="'+themeid+'">' + theme.name +'</option>';
		});
		if(args[0]){
			localStorage.setItem("customtheme-id",args[0].id)
		}
		$("#custom-sel-sel").html(templete);
		templete='<option value="add_new">'+$("#edit-selector").attr("data-add")+'</option>'+templete;
		$("#custom-edit-sel").html(templete);
		$('select').material_select('update');
	});
}
function customSel(){
	var id=$("#custom-sel-sel").val();
	localStorage.setItem("customtheme-id",id)
}
function custom(){
	var id=$("#custom-edit-sel").val();
	if(id=="add_new"){
		$("#custom_name").val("");
		$("#custom_desc").val("");
		$("#dark").prop("checked", true);
		$("#custom_json").val("");
		$("#color-picker0-wrap").html('<div class="color-picker" id="color-picker0"></div>')
		$("#color-picker1-wrap").html('<div class="color-picker" id="color-picker1"></div>')
		$("#color-picker2-wrap").html('<div class="color-picker" id="color-picker2"></div>')
		$("#color-picker3-wrap").html('<div class="color-picker" id="color-picker3"></div>')
		$("#color-picker0_value").val("");
		$("#color-picker1_value").val("");
		$("#color-picker2_value").val("");
		$("#color-picker3_value").val("");
		pickerDefine(0,"fff");
		pickerDefine(1,"fff");
		pickerDefine(2,"fff");
		pickerDefine(3,"fff");
		$("#delTheme").addClass("disabled")
	}else{
		$("#delTheme").removeClass("disabled")
		ipc.send('theme-json-request', id);
		ipc.on('theme-json-response', function (event, args) {
			console.log(args);
			$("#custom_name").val(args.name);
			$("#custom_desc").val(args.desc);
			$("#"+args.base).prop("checked", true);
			$("#color-picker0-wrap").html('<div class="color-picker" id="color-picker0"></div>')
			pickerDefine(0,rgbToHex(args.vars.primary))
			$("#color-picker0_value").val(args.vars.primary);
			$("#color-picker1-wrap").html('<div class="color-picker" id="color-picker1"></div>')
			pickerDefine(1,rgbToHex(args.vars.secondary))
			$("#color-picker1_value").val(args.vars.secondary);
			$("#color-picker2-wrap").html('<div class="color-picker" id="color-picker2"></div>')
			$("#color-picker2_value").val(args.vars.text);
			pickerDefine(2,rgbToHex(args.vars.text))
			if(args.props){
				if(args.props.TheDeskAccent){
					var accent=args.props.TheDeskAccent;
				}else{
					var accent=args.vars.secondary;
				}
			}else{
				var accent=args.vars.secondary;
			}
			$("#color-picker3-wrap").html('<div class="color-picker" id="color-picker3"></div>')
			pickerDefine(3,rgbToHex(accent))
			$("#custom_json").val(JSON.stringify(args));
		});
	}
}
function customImp(){
	var json=$("#custom_import").val();
	if(JSON5.parse(json)){
		ipc.send('theme-json-create', json);
	}else{
		alert("Error")
	}
}
function hardwareAcceleration(){
	var had = $("[name=ha]:checked").val();
	localStorage.setItem("ha", had);
	console.log("ha");
	ipc.send('ha', had);
}

ipc.on('theme-json-create-complete', function (event, args) {
	$("#custom_import").val("");
	ctLoad()
});
//最初に読む
load();
climute();
wordmute();
wordemp();
checkSpotify();
voiceSettingLoad();
oksload();
npprovider();
ctLoad()