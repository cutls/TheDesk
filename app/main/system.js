function system(mainWindow, dir, lang) {
    const electron = require("electron");
    const app = electron.app;
	const join = require('path').join;
	var Jimp = require("jimp");
	const fs = require("fs");
	var ipc = electron.ipcMain;
	var tmp_img = join(app.getPath("userData"), "tmp.png");
	var ha_path = join(app.getPath("userData"), "hardwareAcceleration");
	var lang_path = join(app.getPath("userData"), "language");
	const BrowserWindow = electron.BrowserWindow;
	const dialog = electron.dialog;
	const os = require('os')
    const fm = require('font-manager');
    const language=require("../main/language.js");
	ipc.on('native-notf', function(e, args) {
        
		var platform = process.platform;
		var bit = process.arch;
		if (platform == "win32") {
			const notifier = require('node-notifier')
			var tmp_imge = tmp_img;
			Jimp.read(args[2], function(err, lenna) {
				if (!err && lenna) {
					lenna.write(tmp_img);
					var tmp_imge = tmp_img;
				} else {
					var tmp_imge = "";
				}
				notifier.notify({
						appID: "top.thedesk",
						message: args[1],
						title: args[0],
						icon: tmp_imge,
						sound: false,
						wait: true,
					},
					function(err, response) {
						console.log(err, response)
					});
			});
		}
	});
	//言語
	ipc.on('lang', function(e, arg) {
            
			console.log("set:" + arg);
			fs.writeFileSync(lang_path, arg);
			mainWindow.webContents.send('langres', "");
		})
		//ハードウェアアクセラレーションの無効化
	ipc.on('ha', function(e, arg) {
        
		if (arg == "true") {
			fs.writeFileSync(ha_path, arg);
		} else {
			fs.unlink(ha_path, function(err) {});
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
			width: 300,
			height: 460,
			"transparent": false, // ウィンドウの背景を透過
			"frame": false, // 枠の無いウィンドウ
			"resizable": false
		});
		window.loadURL(dir + '/about.html?ver=' + ver);
		return "true"
	}
	ipc.on('column-del', (e, args) => {
         
		console.log(lang);
		var options = language.delsel(lang)
		dialog.showMessageBox(options, function(index) {
			mainWindow.webContents.send('column-del-reply', index);
		})
	});
	ipc.on('nano', function(e, x, y) {
        
		var nano_info_path = join(app.getPath("userData"),
			"nano-window-position.json");
		var window_pos;
		try {
			window_pos = JSON.parse(fs.readFileSync(nano_info_path, 'utf8'));
		} catch (e) {
			window_pos = [0, 0]; // デフォルトバリュー
		}
		var nanowindow = new BrowserWindow({
			width: 350,
			height: 200,
			"transparent": false, // ウィンドウの背景を透過
			"frame": false, // 枠の無いウィンドウ
			"resizable": false
		});
		nanowindow.loadURL(dir + '/nano.html');
		nanowindow.setAlwaysOnTop(true);

		nanowindow.setPosition(window_pos[0], window_pos[1]);
		nanowindow.on('close', function() {
			fs.writeFileSync(nano_info_path, JSON.stringify(nanowindow.getPosition()));
		});
		return true;
	})

	var cbTimer1;
	ipc.on('startmem', (e, arg) => {
		cbTimer1 = setInterval(mems, 1000);
	});
	ipc.on('endmem', (e, arg) => {
		if (cbTimer1) {
			clearInterval(cbTimer1);
		}
	});

	function mems() {
		var mem = os.totalmem() - os.freemem();
		if (mainWindow) {
			mainWindow.webContents.send('memory', [mem, os.cpus()[0].model, os.totalmem()]);
		}
	}
	ipc.on('export', (e, args) => {
		fs.writeFileSync(args[0], args[1]);
	});
	ipc.on('import', (e, arg) => {
		mainWindow.webContents.send('config', fs.readFileSync(arg, 'utf8'));
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

		data = data.sort(function(a, b) {
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
		var fonts = fm.getAvailableFontsSync();
		object_array_sort(fonts, 'family', 'asc', function(fonts_sorted) {
			mainWindow.webContents.send('font-list', fonts_sorted);
		});
	});
}
exports.system = system;