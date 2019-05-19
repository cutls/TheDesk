
var dir = 'file://' + __dirname;
var base = dir + '/view/';
// Electronのモジュール
const electron = require("electron");
const fs = require("fs");
const language = require('./main/language.js');
const css = require('./main/css.js');
const dl = require('./main/dl.js');
const img = require('./main/img.js');
const np = require('./main/np.js');
const systemFunc = require('./main/system.js');
const Menu = electron.Menu
const join = require('path').join;
// アプリケーションをコントロールするモジュール
const app = electron.app;
// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;
var info_path = join(app.getPath("userData"), "window-size.json");
var max_info_path = join(app.getPath("userData"), "max-window-size.json");
var lang_path = join(app.getPath("userData"), "language");
var ha_path = join(app.getPath("userData"), "hardwareAcceleration");
try {
	fs.readFileSync(ha_path, 'utf8');
	app.disableHardwareAcceleration()
	console.log("disabled: HA");
} catch{
	console.log("enabled: HA");
}
var window_size;
try {
	window_size = JSON.parse(fs.readFileSync(info_path, 'utf8'));
} catch (e) {
	window_size = {
		width: 1000,
		height: 750
	}; // デフォルトバリュー
}
var max_window_size;
try {
	max_window_size = JSON.parse(fs.readFileSync(max_info_path, 'utf8'));
} catch (e) {
	max_window_size = {
		width: "string",
		height: "string",
		x: "string",
		y: "string"

	}; // デフォルトバリュー
}
function isFile(file) {
	try {
		fs.statSync(file);
		return true
	} catch (err) {
		if (err.code === 'ENOENT') return false
	}
}
// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function () {
	if (process.platform != 'darwin') {
		electron.session.defaultSession.clearCache(() => { })
		app.quit();
	}
});
// macOSでウィンドウを閉じた後に再度開けるようにする
app.on('activate', function () {
	if (mainWindow == null) {
		createWindow();
	}
});

function createWindow() {
	if (isFile(lang_path)) {
		console.log("exist");
		var lang = fs.readFileSync(lang_path, 'utf8');
	} else {
		var langs = app.getLocale();
		console.log(langs);
		if (~langs.indexOf("ja")) {
			lang = "ja";
		} else {
			lang = "en";
		}
		fs.mkdir(app.getPath("userData"), function (err) {
			fs.writeFileSync(lang_path, lang);
		});
	}
	console.log(app.getLocale());
	console.log("launch:" + lang);
	// メイン画面の表示。ウィンドウの幅、高さを指定できる
	var platform = process.platform;
	var bit = process.arch;
	if (platform == "linux") {
		var arg = { width: window_size.width, height: window_size.height, x: window_size.x, y: window_size.y, icon: __dirname + '/desk.png' }
	} else if (platform == "win32") {
		var arg = { width: window_size.width, height: window_size.height, x: window_size.x, y: window_size.y, simpleFullscreen: true }
	} else if (platform == "darwin") {
		var arg = { width: window_size.width, height: window_size.height, x: window_size.x, y: window_size.y, simpleFullscreen: true }
	}
	mainWindow = new BrowserWindow(arg);
	electron.session.defaultSession.clearCache(() => { })
	if (process.argv) {
		if (process.argv[1]) {
			var m = process.argv[1].match(/([a-zA-Z0-9]+)\/\?[a-zA-Z-0-9]+=(.+)/);
			if (m) {
				var mode = m[1];
				var code = m[2];
				var plus = '?mode=' + mode + '&code=' + code;
			} else {
				var plus = "";
			}
		} else {
			var plus = "";
		}
	} else {
		var plus = "";
	}
	mainWindow.loadURL(base + lang + '/index.html' + plus);
	if (!window_size.x && !window_size.y) {
		mainWindow.center();
	}
	if (window_size.max) {
		mainWindow.maximize();
	}
	// ウィンドウが閉じられたらアプリも終了
	mainWindow.on('closed', function () {
		electron.ipcMain.removeAllListeners();
		mainWindow = null;
	});
	mainWindow.on('close', function () {
		if (
			max_window_size.width == mainWindow.getBounds().width &&
			max_window_size.height == mainWindow.getBounds().height &&
			max_window_size.x == mainWindow.getBounds().x &&
			max_window_size.y == mainWindow.getBounds().y
		) {
			var size = { width: mainWindow.getBounds().width, height: mainWindow.getBounds().height, x: mainWindow.getBounds().x, y: mainWindow.getBounds().y, max: true }
		} else {
			var size = { width: mainWindow.getBounds().width, height: mainWindow.getBounds().height, x: mainWindow.getBounds().x, y: mainWindow.getBounds().y }
		}
		fs.writeFileSync(info_path, JSON.stringify(size));
	});
	mainWindow.on('maximize', function () {
		fs.writeFileSync(max_info_path, JSON.stringify(mainWindow.getBounds()));
	});

	var platform = process.platform;
	var bit = process.arch;
	if (platform == "darwin") {
		Menu.setApplicationMenu(Menu.buildFromTemplate(language.template(lang, mainWindow, false, dir)));
	}
	//CSS
	css.css(mainWindow);
	//アップデータとダウンロード
	dl.dl(mainWindow, lang_path, base);
	//画像選択と画像処理
	img.img(mainWindow, dir);
	//NowPlaying
	np.TheDeskNowPlaying(mainWindow);
	//その他system
	systemFunc.system(mainWindow, dir, lang);
}
// Electronの初期化完了後に実行
app.on('ready', createWindow);
var onError = function (err, response) {
	console.error(err, response);
};

app.setAsDefaultProtocolClient('thedesk')
