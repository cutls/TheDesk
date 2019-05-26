//設定(setting.html)で読む
var envView = new Vue({
	el: '#envView',
	data: { config: envConstruction },
	methods: {
		complete: function (i, val) {
			var ls = envView.config[i].storage;
			Materialize.toast("Complete", 3000);
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
			var ls = tlView.config[i].storage;
			if (!val) {
				var id = tlView.config[i].id;
				var val = $("#" + id).val()
			}
			Materialize.toast("Complete", 3000);
			localStorage.setItem(ls, val)
			return true
		}
	}
});
var postView = new Vue({
	el: '#postView',
	data: { config: postConstruction, kirishima: localStorage.getItem('kirishima') },
	methods: {
		complete: function (i, val) {
			var ls = postView.config[i].storage;
			Materialize.toast("Complete", 3000);
			if (!val) {
				var id = postView.config[i].id;
				var val = $("#" + id).val()
			}
			localStorage.setItem(ls, val)
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
			Materialize.toast(lang.lang_setting_theme.replace("{{set}}", ct), 3000);
		}
		//テーマはこの場で設定
		themes(cd);
		localStorage.setItem("theme", cd);
	}
	var fontd = $("#font").val();
	if (fontd) {
		if (fontd != localStorage.getItem("font")) {
			Materialize.toast(lang.lang_setting_font.replace("{{set}}", fontd), 3000);
		}
		localStorage.setItem("font", fontd);
		themes();
	} else {
		if (localStorage.getItem("font")) {
			localStorage.removeItem("font");
			Materialize.toast(lang.lang_setting_font.replace("{{set}}", lang.lang_setting_default), 3000);
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
		if (localStorage.getItem(ls)) {
			tlView.config[i].setValue = localStorage.getItem(ls)
		}
	}
	var max = postView.config.length;
	for (var i = 0; i < max; i++) {
		var ls = postView.config[i].storage;
		if (localStorage.getItem(ls)) {
			postView.config[i].setValue = localStorage.getItem(ls)
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
	//$("#log").val(localStorage.getItem("errors"))
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
	$('#wordmute').material_chip({
		data: obj,
	});
}
function wordmuteSave() {
	var word = $('#wordmute').material_chip('data');
	var json = JSON.stringify(word);
	localStorage.setItem("word_mute", json);
}

function wordemp() {
	var word = localStorage.getItem("word_emp");
	var obj = JSON.parse(word);
	$('#wordemp').material_chip({
		data: obj,
	});
}
function wordempSave() {
	var word = $('#wordemp').material_chip('data');
	var json = JSON.stringify(word);
	localStorage.setItem("word_emp", json);
}
function notftest() {
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	var os = electron.remote.process.platform;
	var options = {
		body: lang.lang_setting_notftest + '(' + lang.lang_setting_notftestprof + ')',
		icon: localStorage.getItem("prof_0")
	};
	if (os == "darwin") {
		var n = new Notification('TheDesk' + lang.lang_setting_notftest, options);
	} else {
		ipc.send('native-notf', ['TheDesk' + lang.lang_setting_notftest, lang.lang_setting_notftest + '(' + lang.lang_setting_notftestprof + ')', localStorage.getItem('prof_0'), "", ""]);
	}

}
function oks(no) {
	var txt = $("#oks-" + no).val();
	localStorage.setItem("oks-" + no, txt);
	Materialize.toast(lang.lang_setting_ksref, 3000);
}
function oksload() {
	if (localStorage.getItem("oks-1")) { $("#oks-1").val(localStorage.getItem("oks-1")) }
	if (localStorage.getItem("oks-2")) { $("#oks-2").val(localStorage.getItem("oks-2")) }
	if (localStorage.getItem("oks-3")) { $("#oks-3").val(localStorage.getItem("oks-3")) }
}
function changelang(lang) {
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('lang', lang);
	ipc.on('langres', function (event, arg) {
		location.href = "../" + lang + "/setting.html"
	});
}
function exportSettings() {
	if (!confirm(lang.lang_setting_exportwarn)) {
		return false;
	}
	var electron = require("electron");
	var remote = electron.remote;
	var dialog = remote.dialog;
	var ipc = electron.ipcRenderer;
	dialog.showSaveDialog(null, {
		title: 'Export',
		properties: ['openFile', 'createDirectory'],
		defaultPath: "export.thedeskconfigv2"
	}, (savedFiles) => {
		if (!savedFiles) {
			return false;
		}
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
		ipc.send('export', [savedFiles, JSON.stringify(exp)]);
		alert("Done.")
		//cards
		//lang
	});
}
function importSettings() {
	if (!confirm(lang.lang_setting_importwarn)) {
		return false;
	}
	var electron = require("electron");
	var remote = electron.remote;
	var dialog = remote.dialog;
	var ipc = electron.ipcRenderer;
	dialog.showOpenDialog(null, {
		title: 'Import',
		properties: ['openFile'],
		filters: [
			{ name: 'TheDesk Config', extensions: ['thedeskconfig', 'thedeskconfigv2'] },
		]
	}, (fileNames) => {
		if (!fileNames) {
			return false;
		}
		ipc.send('import', fileNames[0]);
		ipc.on('config', function (event, arg) {
			var obj = JSON.parse(arg);
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
					//Version 2
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
				alert("Error.")
			}
		})
		//cards
		//lang
	});
}
function savefolder() {
	var electron = require("electron");
	var remote = electron.remote;
	var dialog = remote.dialog;
	dialog.showOpenDialog(null, {
		title: 'Save folder',
		properties: ['openDirectory'],
	}, (fileNames) => {
		localStorage.setItem("savefolder", fileNames[0]);
	});
}

function font() {
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('fonts', []);
	ipc.on('font-list', function (event, arg) {
		$("#fonts").removeClass("hide");
		for (var i = 0; i < arg.length; i++) {
			var font = arg[i];
			$("#fonts").append('<div class="font pointer" style="font-family:' + font.family + '" onclick="insertFont(\'' + font.family + '\')">' + font.family + "</div>")
		}
	});
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
	var accentC = $("#color-picker3_value").val();
	if (!accentC) { accentC = "rgb(255,255,255)" }
	var multi = localStorage.getItem("multi");
	var my = JSON.parse(multi)[0].name;
	var id = $("#custom-edit-sel").val();
	if (id == "add_new") {
		id = makeCID();
	}
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
	pickerDefine(0, "fff");
	pickerDefine(1, "fff");
	pickerDefine(2, "fff");
	pickerDefine(3, "fff");
	ipc.send('theme-json-create', JSON.stringify(json));
}
function deleteIt() {
	var id = $("#custom-sel-sel").val();
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
	pickerDefine(0, "fff");
	pickerDefine(1, "fff");
	pickerDefine(2, "fff");
	pickerDefine(3, "fff");
	ipc.on('theme-json-delete-complete', function (event, args) {
		ctLoad()
	});
	ipc.send('theme-json-delete', id);
}
function ctLoad() {
	ipc.send('theme-json-list', "");
	ipc.on('theme-json-list-response', function (event, args) {
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
		$('select').material_select('update');
	});
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
		$("#color-picker0-wrap").html('<div class="color-picker" id="color-picker0"></div>')
		$("#color-picker1-wrap").html('<div class="color-picker" id="color-picker1"></div>')
		$("#color-picker2-wrap").html('<div class="color-picker" id="color-picker2"></div>')
		$("#color-picker3-wrap").html('<div class="color-picker" id="color-picker3"></div>')
		$("#color-picker0_value").val("");
		$("#color-picker1_value").val("");
		$("#color-picker2_value").val("");
		$("#color-picker3_value").val("");
		pickerDefine(0, "fff");
		pickerDefine(1, "fff");
		pickerDefine(2, "fff");
		pickerDefine(3, "fff");
		$("#delTheme").addClass("disabled")
	} else {
		$("#delTheme").removeClass("disabled")
		ipc.send('theme-json-request', id);
		ipc.on('theme-json-response', function (event, args) {
			$("#custom_name").val(args.name);
			$("#custom_desc").val(args.desc);
			$("#" + args.base).prop("checked", true);
			$("#color-picker0-wrap").html('<div class="color-picker" id="color-picker0"></div>')
			pickerDefine(0, rgbToHex(args.vars.primary))
			$("#color-picker0_value").val(args.vars.primary);
			$("#color-picker1-wrap").html('<div class="color-picker" id="color-picker1"></div>')
			pickerDefine(1, rgbToHex(args.vars.secondary))
			$("#color-picker1_value").val(args.vars.secondary);
			$("#color-picker2-wrap").html('<div class="color-picker" id="color-picker2"></div>')
			$("#color-picker2_value").val(args.vars.text);
			pickerDefine(2, rgbToHex(args.vars.text))
			if (args.props) {
				if (args.props.TheDeskAccent) {
					var accent = args.props.TheDeskAccent;
				} else {
					var accent = args.vars.secondary;
				}
			} else {
				var accent = args.vars.secondary;
			}
			$("#color-picker3-wrap").html('<div class="color-picker" id="color-picker3"></div>')
			pickerDefine(3, rgbToHex(accent))
			$("#custom_json").val(JSON.stringify(args));
		});
	}
}
function customImp() {
	var json = $("#custom_import").val();
	if (JSON5.parse(json)) {
		ipc.send('theme-json-create', json);
	} else {
		alert("Error")
	}
}
function hardwareAcceleration(had) {
	ipc.send('ha', had);
}

ipc.on('theme-json-create-complete', function (event, args) {
	$("#custom_import").val("");
	ctLoad()
});
function customSound(key) {
	var electron = require("electron");
	var remote = electron.remote;
	var dialog = remote.dialog;
	dialog.showOpenDialog(null, {
		title: 'Custom sound',
		properties: ['openFile'],
		filters: [
			{ name: 'Audio', extensions: ['mp3', 'aac', 'wav', 'flac', 'm4a'] },
			{ name: 'All', extensions: ['*'] },
		]
	}, (fileNames) => {
		localStorage.setItem("custom" + key, fileNames[0]);
		$("#c1-file").text(fileNames[0])
	});
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
	npprovider();
	ctLoad()
};

