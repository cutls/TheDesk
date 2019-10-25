var dirname = __dirname;
var dir = "file://" + __dirname;
var base = dir + "/view/";
// Electronのモジュール
const electron = require("electron");
const fs = require("fs");
const language = require("./main/language.js");
const css = require("./main/css.js");
const dl = require("./main/dl.js");
const img = require("./main/img.js");
const np = require("./main/np.js");
const systemFunc = require("./main/system.js");
const Menu = electron.Menu;
const join = require("path").join;

// アプリケーションをコントロールするモジュール
const app = electron.app;
// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

// アプリが多重起動しないようにする
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
} else {
	app.on("second-instance", () => {
		// 多重起動を試みた場合、既に存在するウィンドウにフォーカスを移す
		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});
}

if (process.argv.indexOf("--dev") === -1) {
	var packaged = true;
} else {
	var packaged = false;
	console.log("||\\\\\\ \n" + "||||  \\\\\\\\ \n" + "||||     \\\\\\\\ \n" + "|||| Am I a \\\\\\\\ \n" + "|||| cat? ^ ^   \\\\\\\\\\       _____ _          ____            _    \n" + "||||     (.-.)   \\\\\\\\\\      |_   _| |__   ___|  _ \\  ___  ___| | __\n" + "||||  ___>   )    |||||       | | | '_ \\ / _ \\ | | |/ _ \\/ __| |/ /\n" + "|||| <   _  _)   //////       | | | | | |  __/ |_| |  __/__ \\   < \n" + "||||  |_||_|   /////          |_| |_| |_|\\___|____/ \\___||___/_|\\_\\ \n" + "||||          /////         \n" + "||||       /////\n" + "||||     /////\n" + "||||//////");
	console.log("Welcome!");
}
var info_path = join(app.getPath("userData"), "window-size.json");
var max_info_path = join(app.getPath("userData"), "max-window-size.json");
var lang_path = join(app.getPath("userData"), "language");
var ha_path = join(app.getPath("userData"), "hardwareAcceleration");
var ua_path = join(app.getPath("userData"), "useragent");
try {
	fs.readFileSync(ha_path, "utf8");
	app.disableHardwareAcceleration();
	if (!packaged) console.log("disabled: Hardware Acceleration");
} catch {
	if (!packaged) console.log("enabled: Hardware Acceleration");
}
var window_size;
try {
	window_size = JSON.parse(fs.readFileSync(info_path, "utf8"));
} catch (e) {
	window_size = {
		width: 1000,
		height: 750
	}; // デフォルトバリュー
}
var max_window_size;
try {
	max_window_size = JSON.parse(fs.readFileSync(max_info_path, "utf8"));
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
		return true;
	} catch (err) {
		if (err.code === "ENOENT") return false;
	}
}
// 全てのウィンドウが閉じたら終了
app.on("window-all-closed", function() {
	electron.session.defaultSession.clearCache(() => {});
	app.quit();
});

function createWindow() {
	if (isFile(lang_path)) {
		var lang = fs.readFileSync(lang_path, "utf8");
	} else {
		var langs = app.getLocale();
		console.log(langs);
		if (~langs.indexOf("ja")) {
			lang = "ja";
		} else if (~langs.indexOf("de")) {
			lang = "de";
		} else if (~langs.indexOf("cs")) {
			lang = "cs";
		} else if (~langs.indexOf("bg")) {
			lang = "bg";
		} else {
			lang = "en";
		}
		fs.mkdir(app.getPath("userData"), function(err) {
			fs.writeFileSync(lang_path, lang);
		});
	}
	if (!packaged) console.log("your lang:" + app.getLocale());
	if (!packaged) console.log("launch:" + lang);
	// メイン画面の表示。ウィンドウの幅、高さを指定できる
	var platform = process.platform;
	var bit = process.arch;
	if (platform == "linux") {
		var arg = {
			webPreferences: {
				webviewTag: true,
				nodeIntegration: false,
				contextIsolation: true,
				preload: join(__dirname, "js", "platform", "preload.js")
			},
			width: window_size.width,
			height: window_size.height,
			x: window_size.x,
			y: window_size.y,
			icon: __dirname + "/desk.png",
			show: false
		};
	} else if (platform == "win32") {
		var arg = {
			webPreferences: {
				webviewTag: true,
				nodeIntegration: false,
				contextIsolation: true,
				preload: join(__dirname, "js", "platform", "preload.js")
			},
			width: window_size.width,
			height: window_size.height,
			x: window_size.x,
			y: window_size.y,
			simpleFullscreen: true,
			show: false
		};
	} else if (platform == "darwin") {
		var arg = {
			webPreferences: {
				webviewTag: true,
				nodeIntegration: false,
				contextIsolation: true,
				preload: join(__dirname, "js", "platform", "preload.js")
			},
			width: window_size.width,
			height: window_size.height,
			x: window_size.x,
			y: window_size.y,
			simpleFullscreen: true,
			show: false
		};
	}
	mainWindow = new BrowserWindow(arg);
	mainWindow.once("page-title-updated", () => {
		mainWindow.show();
		if (window_size.max) {
			mainWindow.maximize();
		}
	});
	if (!packaged) mainWindow.toggleDevTools();
	electron.session.defaultSession.clearCache(() => {});
	if (process.argv) {
		if (process.argv[1]) {
			var m = process.argv[1].match(/([a-zA-Z0-9]+)\/\?[a-zA-Z-0-9]+=(.+)/);
			if (m) {
				var mode = m[1];
				var code = m[2];
				var plus = "?mode=" + mode + "&code=" + code;
			} else {
				var plus = "";
			}
		} else {
			var plus = "";
		}
	} else {
		var plus = "";
	}
	var ua;
	try {
		ua = fs.readFileSync(ua_path, "utf8");
	} catch (e) {
		//default UA Example:
		// Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) thedesk/18.11.3 Chrome/76.0.3809.146 Electron/6.0.12 Safari/537.36
		const crypto = require("crypto");
		const N = 100;
		var ua = "Mastodon client: "+crypto
			.randomBytes(N)
			.toString("base64")
			.substring(0, N);
	}
	mainWindow.loadURL(base + lang + "/index.html" + plus, { userAgent: ua });
	if (!window_size.x && !window_size.y) {
		mainWindow.center();
	}
	// ウィンドウが閉じられたらアプリも終了
	mainWindow.on("closed", function() {
		electron.ipcMain.removeAllListeners();
		mainWindow = null;
	});
	closeArg = false;
	mainWindow.on("close", function(e, arg) {
		writePos(mainWindow);
		if (!closeArg) {
			e.preventDefault();
		}
		const promise = new Promise(function(resolve) {
			mainWindow.webContents.send("asReadEnd", "");
			setTimeout(function() {
				resolve();
			}, 3000);
		});
		promise.then(function(response) {
			closeArg = true;
			mainWindow.close();
		});
	});
	electron.ipcMain.on("sendMarkersComplete", function(e, arg) {
		closeArg = true;
		mainWindow.close();
	});
	function writePos(mainWindow) {
		if (max_window_size.width == mainWindow.getBounds().width && max_window_size.height == mainWindow.getBounds().height && max_window_size.x == mainWindow.getBounds().x && max_window_size.y == mainWindow.getBounds().y) {
			var size = { width: mainWindow.getBounds().width, height: mainWindow.getBounds().height, x: mainWindow.getBounds().x, y: mainWindow.getBounds().y, max: true };
		} else {
			var size = { width: mainWindow.getBounds().width, height: mainWindow.getBounds().height, x: mainWindow.getBounds().x, y: mainWindow.getBounds().y };
		}
		fs.writeFileSync(info_path, JSON.stringify(size));
	}
	mainWindow.on("maximize", function() {
		writePos(mainWindow);
		fs.writeFileSync(max_info_path, JSON.stringify(mainWindow.getBounds()));
	});
	mainWindow.on("minimize", function() {
		writePos(mainWindow);
		mainWindow.webContents.send("asRead", "");
	});

	var platform = process.platform;
	var bit = process.arch;
	Menu.setApplicationMenu(Menu.buildFromTemplate(language.template(lang, mainWindow, packaged, dir, dirname)));
	//CSS
	css.css(mainWindow);
	//アップデータとダウンロード
	dl.dl(mainWindow, lang_path, base, dirname);
	//画像選択と画像処理
	img.img(mainWindow, dir);
	//NowPlaying
	np.TheDeskNowPlaying(mainWindow);
	//その他system
	systemFunc.system(mainWindow, dir, lang, dirname);
	setInterval(function() {
		mouseTrack(mainWindow);
	}, 1000);
}
var x = 0;
var y = 0;
var unchanged = 0;
var locked = false;
function mouseTrack(mainWindow) {
	let mousePos = electron.screen.getCursorScreenPoint();
	let xNow = mousePos.x;
	let yNow = mousePos.x;
	if (x != xNow || y != yNow) {
		unchanged = 0;
		locked = false;
	} else {
		unchanged++;
		if (unchanged > 60 && !locked) {
			unchanged = 0;
			locked = true;
			mainWindow.webContents.send("asRead", "");
		}
	}
	x = xNow;
	y = yNow;
}
// Electronの初期化完了後に実行
app.on("ready", createWindow);
var onError = function(err, response) {
	console.error(err, response);
};

app.setAsDefaultProtocolClient("thedesk");
