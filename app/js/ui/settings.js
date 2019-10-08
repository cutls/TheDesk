//設定(setting.html)で読む
var envView = new Vue({
	el: '#envView',
	data: { config: envConstruction },
	methods: {
		complete: function (i, val) {
			var ls = envView.config[i].storage;
			M.toast({ html: 'Complete', displayLength: 3000 })
			if (!val) {
				var id = envView.config[i].id;
				var val = $("#" + id).val()
			}
			localStorage.setItem(ls, val)
			if (ls == "ha") {
				hardwareAcceleration(val)
			}
			return true
		}
	}
});
var tlView = new Vue({
	el: '#tlView',
	data: { config: tlConstruction },
	methods: {
		complete: function (i, val) {
			var ls = tlView.config[i];
			if (val) {
				localStorage.setItem(ls.storage, val)
			} else {
				if (!ls.data) {
					ls = [ls]
				} else {
					ls = ls.data
				}
				for (var j = 0; j < ls.length; j++) {
					M.toast({ html: 'Complete', displayLength: 3000 })
					var id = ls[j].id;
					var val = $("#" + id).val()
					localStorage.setItem(ls[j].storage, val)
				}
			}
			return true
		}
	}
});
var postView = new Vue({
	el: '#postView',
	data: { config: postConstruction, kirishima: localStorage.getItem('kirishima'), quoters: localStorage.getItem('quoters') },
	methods: {
		complete: function (i, val) {
			var ls = postView.config[i];
			if (val) {
				localStorage.setItem(ls.storage, val)
			} else {
				if (!ls.data) {
					ls = [ls]
				} else {
					ls = ls.data
				}
				for (var j = 0; j < ls.length; j++) {
					M.toast({ html: 'Complete', displayLength: 3000 })
					var id = ls[j].id;
					var val = $("#" + id).val()
					localStorage.setItem(ls[j].storage, val)
				}
			}
			return true
		}
	}
});
//設定ボタン押した。
function settings() {
	var cd = $("[name=theme]:checked").val();
	var ct = $("[for=" + cd + "]").html();
	if (cd == "custom" && !$("#custom-sel-sel").val()) {
		var theme = localStorage.getItem("theme");
		if (!theme) {
			var theme = "white";
		}
		$("#" + theme).prop("checked", true);
	} else {
		if (cd != localStorage.getItem("theme")) {
			M.toast({ html: lang.lang_setting_theme.replace("{{set}}", ct), displayLength: 3000 })
		}
		//テーマはこの場で設定
		themes(cd);
		localStorage.setItem("theme", cd);
	}
	var fontd = $("#font").val();
	if (fontd) {
		if (fontd != localStorage.getItem("font")) {
			M.toast({ html: lang.lang_setting_font.replace("{{set}}", ct), displayLength: 3000 })
		}
		localStorage.setItem("font", fontd);
		themes();
	} else {
		if (localStorage.getItem("font")) {
			localStorage.removeItem("font");
			M.toast({ html: lang.lang_setting_font.replace("{{set}}", ct), displayLength: 3000 })
			themes();
		}
	}
}

//読み込み時の設定ロード
function load() {
	var max = envView.config.length;
	for (var i = 0; i < max; i++) {
		var ls = envView.config[i].storage;
		if (localStorage.getItem(ls)) {
			envView.config[i].setValue = localStorage.getItem(ls)
		}
	}
	var max = tlView.config.length;
	for (var i = 0; i < max; i++) {
		var ls = tlView.config[i].storage;
		if (ls) {
			if (localStorage.getItem(ls)) {
				tlView.config[i].setValue = localStorage.getItem(ls)
			}
		} else {
			ls = tlView.config[i].data
			for (var j = 0; j < ls.length; j++) {
				if (localStorage.getItem(tlView.config[i].data[j].storage)) {
					tlView.config[i].data[j].setValue = localStorage.getItem(tlView.config[i].data[j].storage)
				}
			}
		}
	}
	var max = postView.config.length;
	for (var i = 0; i < max; i++) {
		var ls = postView.config[i].storage;
		if (ls) {
			if (localStorage.getItem(ls)) {
				postView.config[i].setValue = localStorage.getItem(ls)
			}
		} else {
			ls = postView.config[i].data
			for (var j = 0; j < ls.length; j++) {
				postView.config[i].data[j].setValue = localStorage.getItem(ls[j].storage)
			}
		}
	}
	if (localStorage.getItem("imas")) {
		$(".imas").removeClass("hide");
	}
	if (localStorage.getItem("kirishima")) {
		$(".kirishima").removeClass("hide");
	}
	var theme = localStorage.getItem("theme");
	if (!theme) {
		var theme = "white";
	}
	$("#" + theme).prop("checked", true);
	var font = localStorage.getItem("font");
	if (!font) {
		var font = "";
	}
	$("#font").val(font);
	$("#c1-file").text(localStorage.getItem("custom1"))
	$("#c2-file").text(localStorage.getItem("custom2"));
	$("#c3-file").text(localStorage.getItem("custom3"));
	$("#c4-file").text(localStorage.getItem("custom4"));
	var cvol = localStorage.getItem("customVol")
	if (cvol) {
		$("#soundvol").val(cvol * 100);
		$("#soundVolVal").text(cvol * 100)
	}
	//$("#log").val(localStorage.getItem("errors"))
}
function customVol() {
	var cvol = $("#soundvol").val()
	$("#soundVolVal").text(cvol)
	localStorage.setItem("customVol", cvol / 100)
	var sound = localStorage.getItem("favSound");
	if (sound == "default") {
		var file = "../../source/notif.wav"
	}else{
		if (sound == "c1") {
			var file = localStorage.getItem("custom1");
		} else if (sound == "c2") {
			var file = localStorage.getItem("custom2");
		} else if (sound == "c3") {
			var file = localStorage.getItem("custom3");
		} else if (sound == "c4") {
			var file = localStorage.getItem("custom4");
		}
	}
	request = new XMLHttpRequest();
	request.open("GET", file, true);
	request.responseType = "arraybuffer";
	request.onload = playSound;
	request.send();
}

function climute() {
	//クライアントミュート
	var cli = localStorage.getItem("client_mute");
	var obj = JSON.parse(cli);
	if (!obj) {
		$("#mute-cli").html(lang.lang_setting_nomuting);
	} else {
		if (!obj[0]) {
			$("#mute-cli").html(lang.lang_setting_nomuting);
			return;
		}
		var templete;
		Object.keys(obj).forEach(function (key) {
			var cli = obj[key];
			var list = key * 1 + 1;
			templete = '<div class="acct" id="acct_' + key + '">' + list +
				'.' +
				escapeHTML(cli) + '<button class="btn waves-effect red disTar" onclick="cliMuteDel(' +
				key + ')">' + lang.lang_del + '</button><br></div>';
			$("#mute-cli").append(templete);
		});
	}
}
function cliMuteDel(key) {
	var cli = localStorage.getItem("client_mute");
	var obj = JSON.parse(cli);
	obj.splice(key, 1);
	var json = JSON.stringify(obj);
	localStorage.setItem("client_mute", json);
	climute();
}

function wordmute() {
	var word = localStorage.getItem("word_mute");
	var obj = JSON.parse(word);
	if (!obj) { obj = [] }
	$('#wordmute').chips({
		data: obj,
	});
}
function wordmuteSave() {
	var word = M.Chips.getInstance($("#wordmute")).chipsData;
	var json = JSON.stringify(word);
	localStorage.setItem("word_mute", json);
}

function wordemp() {
	var word = localStorage.getItem("word_emp");
	var obj = JSON.parse(word);
	if (!obj) { obj = [] }
	$('#wordemp').chips({
		data: obj,
	});
}
function wordempSave() {
	var word = M.Chips.getInstance($("#wordemp")).chipsData;
	var json = JSON.stringify(word);
	localStorage.setItem("word_emp", json);
}
function notftest() {
	var os = localStorage.getItem("platform");
	var options = {
		body: lang.lang_setting_notftest + '(' + lang.lang_setting_notftestprof + ')',
		icon: localStorage.getItem("prof_0")
	};
	var n = new Notification('TheDesk' + lang.lang_setting_notftest, options);

}
function oks(no) {
	var txt = $("#oks-" + no).val();
	localStorage.setItem("oks-" + no, txt);
	M.toast({ html: lang.lang_setting_ksref, displayLength: 3000 })
}
function oksload() {
	if (localStorage.getItem("oks-1")) { $("#oks-1").val(localStorage.getItem("oks-1")) }
	if (localStorage.getItem("oks-2")) { $("#oks-2").val(localStorage.getItem("oks-2")) }
	if (localStorage.getItem("oks-3")) { $("#oks-3").val(localStorage.getItem("oks-3")) }
}
function changelang(lang) {
	postMessage(["lang", lang], "*")
}
function exportSettings() {
	Swal.fire({
		title: lang.lang_setting_exportwarn,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no
	}).then((result) => {
		if (result.value) {
			postMessage(["exportSettings", ""], "*")
		}
	})
}
function exportSettingsCore() {
	var exp = {};
	//Accounts
	var multi = localStorage.getItem("multi");
	var acct = JSON.parse(multi);
	exp.accts = acct;
	//Columns
	var multi = localStorage.getItem("column");
	var column = JSON.parse(multi);
	exp.columns = column;
	//Themes
	var config = {};
	config.theme = localStorage.getItem("theme");
	//Other configs
	var max = envView.config.length;
	for (var i = 0; i < max; i++) {
		var ls = envView.config[i].storage;
		config[ls] = localStorage.getItem(ls)
	}
	var max = tlView.config.length;
	for (var i = 0; i < max; i++) {
		var ls = tlView.config[i].storage;
		config[ls] = localStorage.getItem(ls)
	}
	var max = postView.config.length;
	for (var i = 0; i < max; i++) {
		var ls = postView.config[i].storage;
		config[ls] = localStorage.getItem(ls)
	}
	//Font
	config.font = localStorage.getItem("font");
	exp.config = config;
	//keysc
	exp.ksc = [
		localStorage.getItem("oks-1"),
		localStorage.getItem("oks-2"),
		localStorage.getItem("oks-3")
	];
	//climu
	var cli = localStorage.getItem("client_mute");
	var climu = JSON.parse(cli);
	exp.clientMute = climu;
	//wordmu
	var wdm = localStorage.getItem("word_mute");
	var wordmu = JSON.parse(wdm);
	exp.wordMute = wordmu;
	//spotify
	exp.spotifyArtwork = localStorage.getItem("artwork")
	var content = localStorage.getItem("np-temp");
	if (content || content == "" || content == "null") {
		exp.spotifyTemplete = content;
	} else {
		exp.spotifyTemplete = null;
	}
	//tags
	var tagarr = localStorage.getItem("tag");
	var favtag = JSON.parse(tagarr);
	exp.favoriteTags = favtag;
	exp.revisons = 2.1
	exp.meta = {}
	exp.meta.date = new Date()
	exp.meta.thedesk = localStorage.getItem("ver")
	exp.meta.platform = localStorage.getItem("platform")
	return exp;
}
function importSettings() {
	Swal.fire({
		title: lang.lang_setting_importwarn,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no
	}).then((result) => {
		if (result.value) {
			postMessage(["importSettings", ""], "*")
		}
	})
}
function importSettingsCore(obj) {
	if (obj) {
		localStorage.clear();
		localStorage.setItem("multi", JSON.stringify(obj.accts));
		for (var key = 0; key < obj.accts.length; key++) {
			var acct = obj.accts[key];
			localStorage.setItem("name_" + key, acct.name);
			localStorage.setItem("user_" + key, acct.user);
			localStorage.setItem("user-id_" + key, acct.id);
			localStorage.setItem("prof_" + key, acct.prof);
			localStorage.setItem("domain_" + key, acct.domain);
			localStorage.setItem("acct_" + key + "_at", acct.at);
		}
		localStorage.setItem("column", JSON.stringify(obj.columns));
		if (obj.config) {
			//Version 2~
			var max = envView.config.length;
			for (var i = 0; i < max; i++) {
				var ls = envView.config[i].storage;
				if (obj.config[ls]) {
					localStorage.setItem(ls, obj.config[ls])
				}
			}
			var max = tlView.config.length;
			for (var i = 0; i < max; i++) {
				var ls = tlView.config[i].storage;
				if (obj.config[ls]) {
					localStorage.setItem(ls, obj.config[ls])
				}
			}
			var max = postView.config.length;
			for (var i = 0; i < max; i++) {
				var ls = postView.config[i].storage;
				if (obj.config[ls]) {
					localStorage.setItem(ls, obj.config[ls])
				}
			}
		} else {
			//Version 1
			localStorage.setItem("theme", obj.theme);
			if (obj.width) {
				localStorage.setItem("width", obj.width);
			}
			if (obj.font) {
				localStorage.setItem("font", obj.font);
			}
			if (obj.size) {
				localStorage.setItem("size", obj.size);
			}
			themes(obj.theme);
			if (obj.imgheight) {
				localStorage.setItem("img-height", obj.imgheight);
			}
			localStorage.setItem("mainuse", obj.mainuse);
			if (obj.cw) {
				localStorage.setItem("cwtext", obj.cw);
			}
			localStorage.setItem("vis", obj.vis);
			//End
		}
		if (obj.ksc[0]) {
			localStorage.setItem("oks-1", obj.ksc[0]);
		}
		if (obj.ksc[1]) {
			localStorage.setItem("oks-2", obj.ksc[1]);
		}
		if (obj.ksc[2]) {
			localStorage.setItem("oks-3", obj.ksc[2]);
		}
		if (obj.clientMute) {
			localStorage.setItem("client_mute", JSON.stringify(obj.clientMute));
		}
		if (obj.wordMute) {
			localStorage.setItem("word_mute", JSON.stringify(obj.wordMute));
		}
		if (obj.favoriteTags) {
			localStorage.setItem("tag", JSON.stringify(obj.favoriteTags));
		}

		localStorage.setItem("np-temp", obj.spotifyTemplete);
		for (var i = 0; i < obj.columns.length; i++) {
			localStorage.setItem("card_" + i, "true");
			localStorage.removeItem("catch_" + i);
		}
		location.href = "index.html";
	} else {
		Swal.fire({
			type: 'error',
			title: 'Error'
		})
	}
}
function savefolder() {
	postMessage(["sendSinmpleIpc", "savefolder"], "*")
}

function font() {
	postMessage(["sendSinmpleIpc", "fonts"], "*")
}
function fontList(arg) {
	$("#fonts").removeClass("hide");
	for (var i = 0; i < arg.length; i++) {
		var font = arg[i];
		$("#fonts").append('<div class="font pointer" style="font-family:' + font.family + '" onclick="insertFont(\'' + font.family + '\')">' + font.family + "</div>")
	}
}
function insertFont(name) {
	$("#font").val(name);
}
$(".color-picker").each(function (i, elem) {
	pickerDefine(i, "fff");
});
function pickerDefine(i, color) {
	var pickr = new Pickr({
		el: '#color-picker' + i,
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
		var rgb = 'rgb(' + args[0].toRGBA()[0] + ',' + args[0].toRGBA()[1] + ',' + args[0].toRGBA()[2] + ')';
		$("#color-picker" + i + "_value").val(rgb)
	});
}
function customComp() {
	var nameC = $("#custom_name").val();
	if (!nameC) { return false; }
	var descC = $("#custom_desc").val();
	var primaryC = $("#color-picker0_value").val();
	if (!primaryC) { primaryC = "rgb(255,255,255)" }
	var secondaryC = $("#color-picker1_value").val();
	if (!secondaryC) { secondaryC = "rgb(255,255,255)" }
	var textC = $("#color-picker2_value").val();
	if (!textC) { textC = "rgb(255,255,255)" }
	var multi = localStorage.getItem("multi");
	if($("#pickers").hasClass("advanceTheme")){
		var accentC = $("#color-picker3_value").val();
		if (!accentC) { accentC = null }
		var activeC = $("#color-picker4_value").val();
		if (!activeC) { activeC = null }
		var modalC = $("#color-picker5_value").val();
		if (!modalC) { modalC = null }
		var bottomC = $("#color-picker6_value").val();
		if (!bottomC) { bottomC = null }
		var postboxC = $("#color-picker7_value").val();
		if (!postboxC) { postboxC = null }
		var subcolorC = $("#color-picker8_value").val();
		if (!subcolorC) { subcolorC = null }
		var advanceTheme = {
			"TheDeskAccent": accentC,
			"TheDeskActive": activeC,
			"TheDeskModal": modalC,
			"TheDeskBottom": bottomC,
			"TheDeskPostbox": postboxC,
			"TheDeskSubcolor": subcolorC
		}
	}else{
		var advanceTheme = {}
	}
	
	var my = JSON.parse(multi)[0].name;
	var id = $("#custom-edit-sel").val();
	if (id == "add_new") {
		id = makeCID();
	}
	localStorage.setItem("customtheme-id", id)
	var json = {
		"name": nameC,
		"author": my,
		"desc": descC,
		"base": $("[name=direction]:checked").val(),
		"vars": {
			"primary": primaryC,
			"secondary": secondaryC,
			"text": textC
		},
		"props": advanceTheme,
		"id": id
	}
	$("#custom_json").val(JSON.stringify(json));
	themes("custom");
	$("#custom").prop("checked", true);
	$("#custom_name").val("");
	$("#custom_desc").val("");
	$("#dark").prop("checked", true);
	$("#custom_json").val("");
	for(var i =0;i <= 8; i++){
		$("#color-picker" + i + "-wrap").html('<div class="color-picker" id="color-picker' + i + '"></div>')
		$("#color-picker" + i + "_value").val("");
		pickerDefine(i, "fff");
	}
	postMessage(["themeJsonCreate", JSON.stringify(json)], "*")
}
function deleteIt() {
	var id = $("#custom-sel-sel").val();
	$("#custom_name").val("");
	$("#custom_desc").val("");
	$("#dark").prop("checked", true);
	$("#custom_json").val("");
	for(var i =0;i <= 8; i++){
		$("#color-picker" + i + "-wrap").html('<div class="color-picker" id="color-picker' + i + '"></div>')
		$("#color-picker" + i + "_value").val("");
		pickerDefine(i, "fff");
	}
	postMessage(["themeJsonDelete", id], "*")
}
function ctLoad() {
	postMessage(["sendSinmpleIpc", "theme-json-list"], "*")
}
function ctLoadCore(args) {
	var templete = "";
	Object.keys(args).forEach(function (key) {
		var theme = args[key];
		var themeid = theme.id
		templete = templete + '<option value="' + themeid + '">' + theme.name + '</option>';
	});
	if (args[0]) {
		localStorage.setItem("customtheme-id", args[0].id)
	}
	$("#custom-sel-sel").html(templete);
	templete = '<option value="add_new">' + $("#edit-selector").attr("data-add") + '</option>' + templete;
	$("#custom-edit-sel").html(templete);
	$('select').formSelect();
}
function customSel() {
	var id = $("#custom-sel-sel").val();
	localStorage.setItem("customtheme-id", id)
}
function custom() {
	var id = $("#custom-edit-sel").val();
	if (id == "add_new") {
		$("#custom_name").val("");
		$("#custom_desc").val("");
		$("#dark").prop("checked", true);
		$("#custom_json").val("");
		for(var i =0;i <= 8; i++){
			$("#color-picker" + i + "-wrap").html('<div class="color-picker" id="color-picker' + i + '"></div>')
			$("#color-picker" + i + "_value").val("");
			pickerDefine(i, "fff");
		}
		$("#delTheme").addClass("disabled")
	} else {
		$("#delTheme").removeClass("disabled")
		postMessage(["themeJsonRequest", id], "*")
	}
}
function customConnect(args) {
	$("#custom_name").val(args.name);
	$("#custom_desc").val(args.desc);
	$("#" + args.base).prop("checked", true);
	//Primary
	$("#color-picker0-wrap").html('<div class="color-picker" id="color-picker0"></div>')
	pickerDefine(0, rgbToHex(args.vars.primary))
	$("#color-picker0_value").val(args.vars.primary);
	//Secondary
	$("#color-picker1-wrap").html('<div class="color-picker" id="color-picker1"></div>')
	pickerDefine(1, rgbToHex(args.vars.secondary))
	$("#color-picker1_value").val(args.vars.secondary);
	//Text
	$("#color-picker2-wrap").html('<div class="color-picker" id="color-picker2"></div>')
	$("#color-picker2_value").val(args.vars.text);
	pickerDefine(2, rgbToHex(args.vars.text))
	//TheDesk Only
	advancedConncet(args, "TheDeskAccent", "secondary", 3)
	advancedConncet(args, "TheDeskActive", "primary", 4)
	advancedConncet(args, "TheDeskModal", "secondary", 5)
	advancedConncet(args, "TheDeskBottom", "primary", 6)
	advancedConncet(args, "TheDeskPostbox", "primary", 7)
	advancedConncet(args, "TheDeskSubcolor", "primary", 8)
	$("#custom_json").val(JSON.stringify(args));
}
function advancedConncet(args, tar, sub, i){
	if (args.props) {
		if (args.props[tar]) {
			var color = args.props[tar];
			$("#pickers").addClass("advanceTheme")
			$(".advanced").removeClass("hide")
		} else {
			var color = args.vars[sub];
		}
	} else {
		var color = args.vars[sub];
	}
	$("#color-picker"+i+"-wrap").html('<div class="color-picker" id="color-picker'+i+'"></div>')
	$("#color-picker"+i+"_value").val(color);
	pickerDefine(i, rgbToHex(color))
}
function customImp() {
	var json = $("#custom_import").val();
	if (JSON5.parse(json)) {
		postMessage(["themeJsonCreate", json], "*")
	} else {
		Swal.fire({
			type: 'error',
			title: 'Error'
		})
	}
}
function advanced(){
	$(".advanced").toggleClass("hide")
	$("#pickers").toggleClass("advanceTheme")
}
function clearCustomImport() {
	$("#custom_import").val("");
}
function hardwareAcceleration(had) {
	postMessage(["ha", had], "*")
}
function customSound(key) {
	postMessage(["customSound", key], "*")
}
function customSoundSave(key, file) {
	localStorage.setItem("custom" + key, file);
	$("#c1-file").text(file)
}
window.onload = function () {
	//最初に読む
	load();
	climute();
	wordmute();
	wordemp();
	checkSpotify();
	voiceSettingLoad();
	oksload();
	ctLoad()
};
//設定画面で未読マーカーは要らない
function asReadEnd() {
	postMessage(["asReadComp", ""], "*")
}
