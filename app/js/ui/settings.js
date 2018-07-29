//設定(setting.html)で読む
//設定ボタン押した。
function settings() {
	var dd = $("[name=time]:checked").val();
	var dt = $("[for="+dd+"]").text();
		if (dd != localStorage.getItem("datetype")) {
		Materialize.toast(lang_setting_time[lang].replace("{{set}}" ,dt), 3000);
	}
	localStorage.setItem("datetype", dd);

	var cd = $("[name=theme]:checked").val();
	var ct = $("[for="+cd+"]").html();
	if (cd != localStorage.getItem("theme")) {
		Materialize.toast(lang_setting_theme[lang].replace("{{set}}" ,ct), 3000);
	}
	//テーマはこの場で設定
	themes(cd);
	localStorage.setItem("theme", cd);

	var nd = $("[name=nsfw]:checked").val();
	var nt = $("[for=n_"+nd+"]").text();
	if (nd != localStorage.getItem("nsfw")) {
		Materialize.toast(lang_setting_nsfw[lang].replace("{{set}}" ,nt), 3000);
	}
	localStorage.setItem("nsfw", nd);

	var cwd = $("[name=cw]:checked").val();
	var cwt = $("[for=c_"+cwd+"]").text();
	if (cwd != localStorage.getItem("cw")) {
		Materialize.toast(lang_setting_cw[lang].replace("{{set}}" ,cwt), 3000);
	}
	localStorage.setItem("cw", cwd);

	var cwtd = $("#cw-text").val();
	if (cwtd != localStorage.getItem("cw-text")) {
		Materialize.toast(lang_setting_cwtext[lang].replace("{{set}}" ,cwtd), 3000);
	}
	localStorage.setItem("cw-text", cwtd);

	var visd = $("[name=vis]:checked").val();
	var vist = $("[for="+visd+"]").text();
	if (visd != localStorage.getItem("vis")) {
		Materialize.toast(lang_setting_vis[lang].replace("{{set}}" ,vist), 3000);
	}
	localStorage.setItem("vis", visd);

	var popd = $("#popup").val();
	if (popd > 0 && popd != localStorage.getItem("popup")) {
		Materialize.toast(lang_setting_popup[lang].replace("{{set}}" ,popd+lang_setting_s[lang]), 3000);
	} else if (popd != localStorage.getItem("popup")) {
		Materialize.toast(lang_setting_popup[lang].replace("{{set}}" ,lang_setting_off[lang]), 3000);
	}
	localStorage.setItem("popup", popd);

	var gifd = $("[name=gif]:checked").val();
	var gift = $("[for=g_"+gifd+"]").text();
	if (gifd != localStorage.getItem("gif")) {
		Materialize.toast(lang_setting_gif[lang].replace("{{set}}" ,gift), 3000);
	}
	localStorage.setItem("gif", gifd);

	var sentd = $("#sentence").val();
	var ltrd = $("#letters").val();
	if (sentd != localStorage.getItem("sentence") || ltrd != localStorage.getItem("letters")) {
		Materialize.toast(lang_setting_selt[lang].replace("{{set1}}" ,sentd).replace("{{set1}}" ,ltrd), 3000);
	}
	localStorage.setItem("sentence", sentd);
	localStorage.setItem("letters", ltrd);

	var widthd = $("#width").val();
	if (widthd != localStorage.getItem("width")) {
		Materialize.toast(lang_setting_width[lang].replace("{{set}}" ,widthd), 3000);
	}
	localStorage.setItem("width", widthd);

	var imgd = $("[name=img]:checked").val();
	var imgt = $("[for=i_"+imgd+"]").text();
	if (imgd != localStorage.getItem("img")) {
		Materialize.toast(lang_setting_img[lang].replace("{{set}}" ,imgt), 3000);
	}
	localStorage.setItem("img", imgd);

	var fontd = $("#font").val();
	if(fontd){
		if (fontd != localStorage.getItem("font")) {
			Materialize.toast(lang_setting_font[lang].replace("{{set}}" ,fontd), 3000);
		}
		localStorage.setItem("font", fontd);
		themes();
	}else{
		if(localStorage.getItem("font")){
			localStorage.removeItem("font");
			Materialize.toast(lang_setting_font[lang].replace("{{set}}" ,lang_setting_default[lang]), 3000);
			themes();
		}
	}
	

	var sized = $("#size").val();
	if (sized != localStorage.getItem("size")) {
		Materialize.toast(lang_setting_size[lang].replace("{{set}}" ,sized), 3000);
	}
	localStorage.setItem("size", sized);

	var heid = $("#img-height").val();
	if (heid != localStorage.getItem("img-height")) {
		Materialize.toast(lang_setting_imgheight[lang].replace("{{set}}" ,heid), 3000);
	}
	localStorage.setItem("img-height", heid);

	var tagd = $("[name=tag]:checked").val();
	var tagt = $("[for=t_"+tagd+"]").text();
	if (tagd != localStorage.getItem("tag-range")) {
		Materialize.toast(lang_setting_tag[lang].replace("{{set}}" ,tagt), 3000);
	}
	localStorage.setItem("tag-range", tagd);

	var uld = $("[name=ul]:checked").val();
	var ult = $("[for=ul_"+uld+"]").text();
	if (uld != localStorage.getItem("locale")) {
		Materialize.toast(lang_setting_ul[lang].replace("{{set}}" ,ult), 3000);
	}
	localStorage.setItem("locale", uld);

	var ntd = $("[name=notf]:checked").val();
	var ntt = $("[for=ntf_"+ntd+"]").text();
	if (ntd != localStorage.getItem("nativenotf")) {
		Materialize.toast(lang_setting_notf[lang].replace("{{set}}" ,ntt), 3000);
	}
	localStorage.setItem("nativenotf", ntd);

	var qtd = $("[name=quote]:checked").val();
	var qtt = $("[for=q_"+qtd+"]").text();
	if (qtd != localStorage.getItem("quote")) {
		Materialize.toast(lang_setting_quote[lang].replace("{{set}}" ,qtt), 3000);
	}
	localStorage.setItem("quote", qtd);
	
	var viad = $("[name=via]:checked").val();
	var viat = $("[for=via_"+viad+"]").text();
	if (viad != localStorage.getItem("viashow")) {
		Materialize.toast(lang_setting_via[lang].replace("{{set}}" ,viat), 3000);
	}
	localStorage.setItem("viashow", viad);

	var movd = $("[name=mov]:checked").val();
	var movt = $("[for=mov_"+movd+"]").text();
	if (movd != localStorage.getItem("mouseover")) {
		Materialize.toast(lang_setting_mov[lang].replace("{{set}}" ,movt), 3000);
	}
	localStorage.setItem("mouseover", movd);

	var maind = $("[name=main]:checked").val();
	var maint = $("[for=mn_"+maind+"]").text();
	if (maind != localStorage.getItem("mainuse")) {
		Materialize.toast(lang_setting_main[lang].replace("{{set}}" ,maint), 3000);
	}
	localStorage.setItem("mainuse", maind);
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

	var popup = localStorage.getItem("popup");
	if (!popup) {
		var popup = "0";
	}
	$("#popup").val(popup);

	var box = localStorage.getItem("box");
	if (!box) {
		var box = "no";
	}
	$("#b_" + box).prop("checked", true);

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

	var width = localStorage.getItem("width");
	if (!width) {
		var width = "300";
	}
	$("#width").val(width);

	var cwt = localStorage.getItem("cw-text");
	if (!cwt) {
		var cwt = "";
	}
	$("#cw-text").val(cwt);

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

	var tag = localStorage.getItem("tag-range");
	if (!tag) {
		var tag = "all";
	}
	$("#t_" + tag).prop("checked", true);

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

	var maint = localStorage.getItem("mainuse");
	if (!maint) {
		var maint = "remain";
	}
	$("#mn_" + maint).prop("checked", true);
}
//最初に読む
load();
climute();
wordmute();
wordemp();
checkSpotify();
voiceSettingLoad();
oksload();
function climute(){
	//クライアントミュート
	var cli = localStorage.getItem("client_mute");
	var obj = JSON.parse(cli);
	if(!obj){
		$("#mute-cli").html("ミュートしているクライアントはありません。");
	}else{
		if(!obj[0]){
			$("#mute-cli").html("ミュートしているクライアントはありません。");
			return;
		}
	var templete;
	Object.keys(obj).forEach(function(key) {
		var cli = obj[key];
		var list = key * 1 + 1;
		templete = '<div class="acct" id="acct_' + key + '">' + list +
			'.' +
			cli + '<button class="btn waves-effect red disTar" onclick="cliMuteDel(' +
			key + ')">削除</button><br></div>';
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
				body: '通知テスト(画像はあなたのアカウントのアイコンです)',
				icon: localStorage.getItem("prof_0")
		  };
		if(os=="darwin"){
			var n = new Notification('TheDesk通知テスト', options);
		}else{
			ipc.send('native-notf', ['TheDesk通知テスト','通知テスト(画像はあなたのアカウントのアイコンです)',localStorage.getItem('prof_0')]);
		}
	
}
function oks(no){
	var txt=$("#oks-"+no).val();
	localStorage.setItem("oks-"+no, txt);
	Materialize.toast("キーボードショートカットを更新しました。", 3000);
}
function oksload(){
	if(localStorage.getItem("oks-1")){$("#oks-1").val(localStorage.getItem("oks-1"))}
	if(localStorage.getItem("oks-2")){$("#oks-2").val(localStorage.getItem("oks-2"))}
	if(localStorage.getItem("oks-3")){$("#oks-3").val(localStorage.getItem("oks-3"))}
}