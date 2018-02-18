'use strict';

// Electronのモジュール
const electron = require("electron");
const fs = require("fs");
const dialog = require('electron').dialog
// アプリケーションをコントロールするモジュール
const app = electron.app;

// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;
const {
	download
} = require('electron-dl');
const openAboutWindow = require('about-window').default;
const join = require('path').join;
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;
var info_path = join(app.getPath("userData"), "window-size.json");
var window_size;
try {
	window_size = JSON.parse(fs.readFileSync(info_path, 'utf8'));
} catch (e) {
	window_size = {
		width: 1000,
		height: 750
	}; // デフォルトバリュー
}

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

function createWindow() {
	// メイン画面の表示。ウィンドウの幅、高さを指定できる
	mainWindow = new BrowserWindow(window_size);
	electron.session.defaultSession.clearCache(() => {})
	if(process.argv){
		if(process.argv[1]){
			var m = process.argv[1].match(/([a-zA-Z0-9]+)\/\?[a-zA-Z-0-9]+=([a-zA-Z-0-9]+)/);
			if(m){
				var mode=m[1];
				var code=m[2];
				mainWindow.loadURL('file://' + __dirname + '/index.html?mode='+mode+'&code='+code);
			}else{
				//mainWindow.loadURL('file://' + __dirname + '/index.html?mode=A&code=B');
				mainWindow.loadURL('file://' + __dirname + '/index.html');
			}
		}else{
			mainWindow.loadURL('file://' + __dirname + '/index.html');
		}
	
	}else{
		mainWindow.loadURL('file://' + __dirname + '/index.html');
	}
	// ウィンドウが閉じられたらアプリも終了
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
	mainWindow.on('close', function() {
		fs.writeFileSync(info_path, JSON.stringify(mainWindow.getBounds()));
	});
}
// Electronの初期化完了後に実行
app.on('ready', createWindow);
var ipc = electron.ipcMain;
ipc.on('update', function(e, x, y) {
	var window = new BrowserWindow({
		width: 600,
		height: 400,
		"transparent": false, // ウィンドウの背景を透過
		"frame": false, // 枠の無いウィンドウ
		"resizable": false
	});
	window.loadURL('file://' + __dirname + '/update.html');

	return "true"
})
ipc.on('nano', function(e, x, y) {
	var window = new BrowserWindow({
		width: 300,
		height: 100,
		"transparent": true, // ウィンドウの背景を透過
		"frame": false, // 枠の無いウィンドウ
		"resizable": false
	});
	window.loadURL('file://' + __dirname + '/nano.html');
	window.setAlwaysOnTop(true);
	window.setPosition(0, 0);
	return "true"
})
ipc.on('download-btn', (e, args) => {
	if(args=="true"){
		dialog.showSaveDialog(null, {
            title: '保存',
			properties: ['openFile', 'createDirectory'],
			defaultPath: 'TheDesk-win32-x64.zip'
        }, (savedFiles) => {
            dl(savedFiles[0]);
        });
	}else{
		dl();
	}
	
});
function dl(files){
	console.log(files);
	mainWindow.webContents.send('comp', "ダウンロードを開始します。");
	const opts = {
		directory:files,
		openFolderWhenDone: true,
		onProgress: function(e) {
			mainWindow.webContents.send('prog', e);
		},
		saveAs: false
	};
	download(BrowserWindow.getFocusedWindow(),
			'https://dl.thedesk.top/TheDesk-win32-x64.zip', opts)
		.then(dl => {
			mainWindow.webContents.send('comp', "ダウンロードが完了しました。");
			app.quit();
		})
		.catch(console.error);
}
ipc.on('general-dl', (e, args) => {
	console.log(args)
	mainWindow.webContents.send('general-dl-message', "ダウンロードを開始します。");
	const opts = {
		directory: app.getPath('home')+"\\Pictures\\TheDesk",
		openFolderWhenDone: true,
		onProgress: function(e) {
			mainWindow.webContents.send('general-dl-prog', e);
		},
		saveAs: false
	};
	download(BrowserWindow.getFocusedWindow(),
			args, opts)
		.then(dl => {
			mainWindow.webContents.send('general-dl-message', "ダウンロードが完了しました。");
		})
		.catch(console.error);
});
ipc.on('quit', (e, args) => {
	app.quit();
});
ipc.on('about', (e, args) => {
	openAboutWindow({
		icon_path: join(__dirname, 'desk.png'),
		copyright: 'Copyright (c) TheDesk on Mastodon 2018 & Cutls.com 2015 All Rights Reserved. CDN provided by AWS CloudFront.',
		license: 'This work is licensed under TheDesk LICENSE. See also GitHub.',
		description: 'ここに表示されているバージョンは内部バージョンで、一般的に使われている愛称とは異なります。',
		bug_report_url: 'https://cutls.com/report',
		css_path: join(__dirname, './css/about.css'),
		adjust_window_size: true
	});
});
ipc.on('column-del', (e, args) => {
const options = {
    type: 'info',
    title: 'カラム削除',
    message: "カラムを削除しますか？",
    buttons: ['はい', 'いいえ']
  }
  dialog.showMessageBox(options, function(index) {
    mainWindow.webContents.send('column-del-reply', index);
  })
});
app.setAsDefaultProtocolClient('thedesk')
