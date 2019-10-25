function system(mainWindow, dir, lang, dirname) {
	const electron = require("electron");
	const app = electron.app;
	const join = require('path').join;
	var Jimp = require("jimp");
	const fs = require("fs");
	var JSON5 = require('json5');
	var ipc = electron.ipcMain;
	const clipboard = electron.clipboard;
	var tmp_img = join(app.getPath("userData"), "tmp.png");
	var ha_path = join(app.getPath("userData"), "hardwareAcceleration");
	var ua_path = join(app.getPath("userData"), "useragent");
	var lang_path = join(app.getPath("userData"), "language");
	const BrowserWindow = electron.BrowserWindow;
	const dialog = electron.dialog;
	const os = require('os')
	const language = require("../main/language.js");
	//プラットフォーム
	ipc.on('getPlatform', function (e, arg) {
		try {
			var gitHash = fs.readFileSync("git", 'utf8')
		} catch{
			var gitHash = null
		}
		e.sender.webContents.send('platform', [process.platform, process.arch, process.version, process.versions.chrome, process.versions.electron, gitHash]);
	})
	//言語
	ipc.on('lang', function (e, arg) {

		console.log("set:" + arg);
		fs.writeFileSync(lang_path, arg);
		e.sender.webContents.send('langres', arg);
	})
	//エクスポートのダイアログ
	ipc.on('exportSettings', function (e, args) {
		dialog.showSaveDialog(null, {
			title: 'Export',
			properties: ['openFile', 'createDirectory'],
			defaultPath: "export.thedeskconfig.json5"
		}, (savedFiles) => {
			if (!savedFiles) {
				return false;
			}
			e.sender.webContents.send('exportSettingsFile', savedFiles);
		})
	})
	//インポートのダイアログ
	ipc.on('importSettings', function (e, args) {
		dialog.showOpenDialog(null, {
			title: 'Import',
			properties: ['openFile'],
			filters: [
				{ name: 'TheDesk Config', extensions: ['thedeskconfig', 'thedeskconfigv2', 'json5'] },
			]
		}, (fileNames) => {
			if (!fileNames) {
				return false;
			}
			e.sender.webContents.send('config', JSON5.parse(fs.readFileSync(fileNames[0], 'utf8')));
		})
	})
	//保存フォルダのダイアログ
	ipc.on('savefolder', function (e, args) {
		dialog.showOpenDialog(null, {
			title: 'Save folder',
			properties: ['openDirectory'],
		}, (fileNames) => {
			e.sender.webContents.send('savefolder', fileNames[0]);
		});
	})
	//カスタムサウンドのダイアログ
	ipc.on('customSound', function (e, arg) {
		dialog.showOpenDialog(null, {
			title: 'Custom sound',
			properties: ['openFile'],
			filters: [
				{ name: 'Audio', extensions: ['mp3', 'aac', 'wav', 'flac', 'm4a'] },
				{ name: 'All', extensions: ['*'] },
			]
		}, (fileNames) => {
			e.sender.webContents.send('customSoundRender', [arg, fileNames[0]]);
		});
	})

	//ハードウェアアクセラレーションの無効化
	ipc.on('ha', function (e, arg) {

		if (arg == "true") {
			fs.writeFileSync(ha_path, arg);
		} else {
			fs.unlink(ha_path, function (err) { });
		}
		app.relaunch()
		app.exit()
	})
	ipc.on('ua', function (e, arg) {
		if (arg == "") {
			fs.unlink(ua_path, function (err) { });
		} else {
			fs.writeFileSync(ua_path, arg);
		}
		app.relaunch()
		app.exit()
	})

	ipc.on('quit', (e, args) => {
		app.quit();
	});
	ipc.on('about', (e, args) => {
		about();
	});
	function about() {
		var ver = app.getVersion()
		var window = new BrowserWindow({
			webPreferences: {
				webviewTag: false,
				nodeIntegration: false,
				contextIsolation: true,
				preload: join(dirname, "js", "platform", "preload.js")
			},
			width: 300,
			height: 500,
			"transparent": false, // ウィンドウの背景を透過
			"frame": false, // 枠の無いウィンドウ
			"resizable": false
		});
		window.loadURL(dir + '/about.html?ver=' + ver);
		return "true"
	}
	ipc.on('nano', function (e, x, y) {

		var nano_info_path = join(app.getPath("userData"),
			"nano-window-position.json");
		var window_pos;
		try {
			window_pos = JSON.parse(fs.readFileSync(nano_info_path, 'utf8'));
		} catch (e) {
			window_pos = [0, 0]; // デフォルトバリュー
		}
		var nanowindow = new BrowserWindow({
			webPreferences: {
				webviewTag: false,
				nodeIntegration: false,
				contextIsolation: true,
				preload: join(dirname, "js", "platform", "preload.js")
			},
			width: 350,
			height: 140,
			"transparent": false, // ウィンドウの背景を透過
			"frame": false, // 枠の無いウィンドウ
			"resizable": false
		});
		nanowindow.loadURL(dir + '/nano.html');
		nanowindow.setAlwaysOnTop(true);
		//nanowindow.toggleDevTools()
		nanowindow.setPosition(window_pos[0], window_pos[1]);
		nanowindow.on('close', function () {
			fs.writeFileSync(nano_info_path, JSON.stringify(nanowindow.getPosition()));
		});
		return true;
	})
	var cbTimer1;
	ipc.on('startmem', (e, arg) => {
		event = e.sender
		cbTimer1 = setInterval(mems, 1000);
	});
	function mems() {
		var mem = os.totalmem() - os.freemem();
		if (mainWindow) {
			event.webContents.send('memory', [mem, os.cpus()[0].model, os.totalmem()]);
		}
	}
	ipc.on('endmem', (e, arg) => {
		if (cbTimer1) {
			clearInterval(cbTimer1);
		}
	});


	ipc.on('export', (e, args) => {
		fs.writeFileSync(args[0], JSON5.stringify(args[1]));
		e.sender.webContents.send('exportAllComplete', "");
	});
	//フォント
	function object_array_sort(data, key, order, fn) {
		//デフォは降順(DESC)
		var num_a = -1;
		var num_b = 1;

		if (order === 'asc') { //指定があれば昇順(ASC)
			num_a = 1;
			num_b = -1;
		}

		data = data.sort(function (a, b) {
			var x = a[key];
			var y = b[key];
			if (x > y) return num_a;
			if (x < y) return num_b;
			return 0;
		});

		//重複排除
		var arrObj = {};
		for (var i = 0; i < data.length; i++) {
			arrObj[data[i]['family']] = data[i];
		}

		data = [];
		for (var key in arrObj) {
			data.push(arrObj[key]);
		}

		fn(data); // ソート後の配列を返す
	}
	ipc.on('fonts', (e, arg) => {
		const fm = require('font-manager');
		var fonts = fm.getAvailableFontsSync();
		object_array_sort(fonts, 'family', 'asc', function (fonts_sorted) {
			e.sender.webContents.send('font-list', fonts_sorted);
		});
	});
	//コピー
	ipc.on('copy', (e, arg) => {
		clipboard.writeText(arg)
	});
}
exports.system = system;