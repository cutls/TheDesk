'use strict';

// Electronのモジュール
const electron = require("electron");
const fs = require("fs");
const dialog = require('electron').dialog;
var Jimp = require("jimp");
const shell = electron.shell;
const os = require('os')
const path = require('path')
const Menu=electron.Menu
var updatewin=null;
// アプリケーションをコントロールするモジュール
const app = electron.app;
	var platform=process.platform;
	var bit=process.arch;
	if(platform=="win32"){
	const WindowsToaster = require('node-notifier').WindowsToaster;
	var notifier = new WindowsToaster({
    	withFallback: false, // Fallback to Growl or Balloons? 
    	customPath: void 0 // Relative path if you want to use your fork of toast.exe 
	});
	}
// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;
const {
	download
} = require('electron-dl');
const join = require('path').join;
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;
var info_path = join(app.getPath("userData"), "window-size.json");
var tmp_img = join(app.getPath("userData"), "tmp.png");
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
		electron.session.defaultSession.clearCache(() => {})
		app.quit();
	}
});

function createWindow() {
	// メイン画面の表示。ウィンドウの幅、高さを指定できる
	var platform=process.platform;
	var bit=process.arch;
	if(platform=="linux"){
		var arg={width:window_size.width,height:window_size.height,icon: __dirname + '/thedesk.ico'}
	}else{
		var arg=window_size
	}
	mainWindow = new BrowserWindow(arg);
	electron.session.defaultSession.clearCache(() => {})
	if(process.argv){
		if(process.argv[1]){
			var m = process.argv[1].match(/([a-zA-Z0-9]+)\/\?[a-zA-Z-0-9]+=(.+)/);
			if(m){
				var mode=m[1];
				var code=m[2];
				mainWindow.loadURL('file://' + __dirname + '/index.html?mode='+mode+'&code='+code);
			}else{
				//mainWindow.loadURL('file://' + __dirname + '/index.html?mode=share&code=日本語');
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
	  // Create the Application's main menu
	  var template = [{
        label: "アプリケーション",
        submenu: [
			{ label: "TheDeskについて", click: function() { about(); } },
            { type: "separator" },
            { label: "終了", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "編集",
        submenu: [
            { label: "元に戻す", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "やり直し", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "切り取り", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "コピー", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "貼り付け", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "すべて選択", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];
	var platform=process.platform;
	var bit=process.arch;
	if(platform=="darwin"){
		Menu.setApplicationMenu(Menu.buildFromTemplate(template));
	}
}
// Electronの初期化完了後に実行
app.on('ready', createWindow);
var onError = function(err,response){
    console.error(err,response);
};

var ipc = electron.ipcMain;
ipc.on('native-notf', function(e, args) {
	var platform=process.platform;
	var bit=process.arch;
	if(platform=="win32"){
	Jimp.read(args[2], function (err, lenna) {
		if (err) throw err;
		lenna.write(tmp_img);
		notifier.notify({
			message: args[1],
			title: args[0],
			sound: false,//"Bottle",
			icon : tmp_img,
			wait:false
		}, function(error, response) {
		});
	});
	}
});

ipc.on('update', function(e, x, y) {
	var platform=process.platform;
	var bit=process.arch;
	if(platform!="darwin"){
	updatewin = new BrowserWindow({
		width: 600,
		height: 400,
		"transparent": false, // ウィンドウの背景を透過
		"frame": false, // 枠の無いウィンドウ
		"resizable": false
	});
	updatewin.loadURL('file://' + __dirname + '/update.html');

	return "true"
	}else{
		return false;
	}
})

ipc.on('screen', function(e, args) {
	var window = new BrowserWindow({
		width: args[0],
		height: args[1],
		"transparent": false, // ウィンドウの背景を透過
		"frame": false, // 枠の無いウィンドウ
		"resizable": true
	});
	window.loadURL('file://' + __dirname + '/screenshot.html?id='+args[2]);
	window.setAlwaysOnTop(true);
	window.setPosition(0, 0);
	return "true"
})
//Web魚拓
ipc.on('shot', function(e, args) {
	console.log(args[0]);
	var platform=process.platform;
	var bit=process.arch;
	if(platform=="win32"){
		var dir=app.getPath('home')+"\\Pictures\\TheDesk\\Screenshots\\"+args[4]+"-toot.png";
		var folder=app.getPath('home')+"\\Pictures\\TheDesk\\Screenshots\\";
	}else if(platform=="linux" || platform=="darwin" ){
		var dir=app.getPath('home')+"/Pictures/TheDesk/Screenshots/"+args[4]+"-toot.png";
		var folder=app.getPath('home')+"/Pictures/TheDesk/Screenshots/";
	}
	Jimp.read(Buffer.from( args[3],'base64'), function (err, lenna) {
		if (err) throw err;
		lenna.crop( 0, 0, args[1], args[2] ).write(dir);
	});
	shell.showItemInFolder(folder);
})
ipc.on('shot-img-dl', (e, args) => {
	Jimp.read(args[0], function (err, lenna) {
		if (err) throw err;
		lenna.write(folder+args[1]);
	});
	
});
//アプデDL
ipc.on('download-btn', (e, args) => {
	var platform=process.platform;
	var bit=process.arch;
	if(platform=="win32"){
		if(bit=="x64"){
			var zip="TheDesk-win32-x64.zip";
		}else if(bit=="ia32"){
			var zip="TheDesk-win32-ia32.zip";
		}
	}else if(platform=="linux" || platform=="darwin" ){
		const options = {
			type: 'info',
			title: 'Linux Supporting System',
			message: "thedesk.topをブラウザで開きます。",
			buttons: ['OK']
		  }
		  dialog.showMessageBox(options, function(index) {
			shell.openExternal("https://thedesk.top");
		  })
		  return;
		if(bit=="x64"){
			var zip="TheDesk-linux-x64.zip";
		}else if(bit=="ia32"){
			var zip="TheDesk-linux-ia32.zip";
		}
	}
	var ver=args[1];
	if(args[0]=="true"){
		dialog.showSaveDialog(null, {
            title: '保存',
			properties: ['openFile', 'createDirectory'],
			defaultPath: zip
        }, (savedFiles) => {
			console.log(savedFiles);
			if(!savedFiles){
				return false;
			}
			var m = savedFiles.match(/(.+)\\(.+)$/);
			  if(isExistFile(savedFiles)){
				fs.statSync(savedFiles);
				fs.unlink(savedFiles);
			  }
			  console.log(m[1]+":"+savedFiles)
            dl(ver,m[1],savedFiles);
        });
	}else{
		dl(ver);
	}
	
});
function isExistFile(file) {
	try {
	  fs.statSync(file);
	  return true
	} catch(err) {
	  if(err.code === 'ENOENT') return false
	}
  }
function dl(ver,files,fullname){
	console.log(files);
	var platform=process.platform;
	var bit=process.arch;
	if(platform=="win32"){
		if(bit=="x64"){
			var zip="TheDesk-win32-x64.zip";
		}else if(bit=="ia32"){
			var zip="TheDesk-win32-ia32.zip";
		}
	}else if(platform=="linux"){
		if(bit=="x64"){
			var zip="TheDesk-linux-x64.zip";
		}else if(bit=="ia32"){
			var zip="TheDesk-linux-ia32.zip";
		}
	}
	zip=zip+"?"+ver;
	var l = 8;

	// 生成する文字列に含める文字セット
	var c = "abcdefghijklmnopqrstuvwxyz0123456789";

	var cl = c.length;
	var r = "";
	for(var i=0; i<l; i++){
	  r += c[Math.floor(Math.random()*cl)];
	}
	zip=zip+r;
	updatewin.webContents.send('mess', "ダウンロードを開始します。");
	const opts = {
		directory:files,
		openFolderWhenDone: true,
		onProgress: function(e) {
			updatewin.webContents.send('prog', e);
		},
		saveAs: false
	};
	download(BrowserWindow.getFocusedWindow(),
			'https://dl.thedesk.top/'+zip, opts)
		.then(dl => {
			updatewin.webContents.send('mess', "ダウンロードが完了しました。");
			app.quit();
		})
		.catch(console.error);
}
ipc.on('general-dl', (e, args) => {
	var name="";
	var platform=process.platform;
	var bit=process.arch;
	if(platform=="win32"){
		var dir=app.getPath('home')+"\\Pictures\\TheDesk";
	}else if(platform=="linux" || platform=="darwin" ){
		var dir=app.getPath('home')+"/Pictures/TheDesk";
	}
	
	mainWindow.webContents.send('general-dl-message', "ダウンロードを開始します。");
	const opts = {
		directory: dir,
		filename:name,
		openFolderWhenDone: true,
		onProgress: function(e) {
			mainWindow.webContents.send('general-dl-prog', e);
		},
		saveAs: false
	};
	download(BrowserWindow.getFocusedWindow(),
			args[0], opts)
		.then(dl => {
			mainWindow.webContents.send('general-dl-message', "ダウンロードが完了しました。");
		})
		.catch(console.error);
});
ipc.on('quit', (e, args) => {
	app.quit();
});
ipc.on('about', (e, args) => {
	about();
});
function about(){
	var ver=app.getVersion()
	var window = new BrowserWindow({width: 300, height: 460,
		"transparent": false,    // ウィンドウの背景を透過
			 "frame": false,     // 枠の無いウィンドウ
			 "resizable": false });
	   window.loadURL('file://' + __dirname + '/about.html?ver='+ver);
	   return "true"
}
//
ipc.on('file-select', (e, args) => {
	dialog.showOpenDialog(null, {
		properties: ['openFile', 'multiSelections'],
		title: '添付ファイルを選択',
		defaultPath: '.',
		filters: [
			{name: 'メディアファイル', extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg','mp4','webm']},
			{name: '画像', extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg']},
      		{name: '動画', extensions: ['mp4','webm']},
      		{name: '全てのファイル', extensions: ['*']}
		]
	}, (fileNames) => {
		if(!fileNames){
			return false;
		}
		for(var i=0;i<fileNames.length;i++){
			var path=fileNames[i];
			var bin = fs.readFileSync(path, 'base64');
			mainWindow.webContents.send('bmp-img-comp', [bin,'new']);
		}
	});
});

ipc.on('column-del', (e, args) => {
const options = {
    type: 'info',
    title: 'カラム削除',
    message: "カラムを削除しますか？",
    buttons: ['いいえ', 'はい']
  }
  dialog.showMessageBox(options, function(index) {
    mainWindow.webContents.send('column-del-reply', index);
  })
});
ipc.on('bmp-image', (e, args) => {
	var m = args[0].match(/(.+)\\(.+)\.(.+)$/);
	Jimp.read(args[0], function (err, lenna) {
		if (err) throw err;
		lenna.getBase64(Jimp.MIME_PNG, function (err, src) {
			mainWindow.webContents.send('bmp-img-comp', [src,args[1]]);
	   });
	});
	
});
ipc.on('nano', function (e, x, y) {
	var window = new BrowserWindow({width: 300, height: 200,
	"transparent": false,    // ウィンドウの背景を透過
		 "frame": false,     // 枠の無いウィンドウ
		 "resizable": false });
   window.loadURL('file://' + __dirname + '/nano.html');
   window.setAlwaysOnTop(true);
   window.setPosition(0, 0);
   return "true"
 })
 ipc.on('adobe', (e, arg) => {
	 if(!arg){
		const options = {
			type: 'info',
			title: 'Adobeフォトエディタ',
			message: "「許可」または「永続的に許可」をクリックするとTheDeskとAdobeで情報を共有します。",
			buttons: ['拒否', '許可','永続的に許可']
		  }
		  dialog.showMessageBox(options, function(index) {
			if(index==2){
				mainWindow.webContents.send('adobeagree', "true");
			}
			if(index>0){
				adobeWindow();
			}
		  })
	 }else{
		adobeWindow();
	 }
});
function adobeWindow(){
	var window = new BrowserWindow({
		width: 1000,
		height: 750
	});
	window.loadURL('file://' + __dirname + '/adobe.html');
}


app.setAsDefaultProtocolClient('thedesk')