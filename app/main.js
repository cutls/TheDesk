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
// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;
const {
	download
} = require('electron-dl');
const join = require('path').join;
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;
var info_path = join(app.getPath("userData"), "window-size.json");
var max_info_path = join(app.getPath("userData"), "max-window-size.json");
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
		var arg={width:window_size.width,height:window_size.height,x:window_size.x,y:window_size.y,icon: __dirname + '/thedesk.png'}
	}else{
		var arg={width:window_size.width,height:window_size.height,x:window_size.x,y:window_size.y,simpleFullscreen:true}
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
	if(!window_size.x && !window_size.y){
		mainWindow.center();
	}
	if(window_size.max){
		mainWindow.maximize();
	}
	// ウィンドウが閉じられたらアプリも終了
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
	mainWindow.on('close', function() {
		if(
			max_window_size.width==mainWindow.getBounds().width && 
			max_window_size.height==mainWindow.getBounds().height &&
			max_window_size.x==mainWindow.getBounds().x &&
		  	max_window_size.y==mainWindow.getBounds().y
		){
			var size={width:mainWindow.getBounds().width,height:mainWindow.getBounds().height,x:mainWindow.getBounds().x,y:mainWindow.getBounds().y,max:true}
		}else{
			var size={width:mainWindow.getBounds().width,height:mainWindow.getBounds().height,x:mainWindow.getBounds().x,y:mainWindow.getBounds().y}
		}
		fs.writeFileSync(info_path, JSON.stringify(size));
	});
	mainWindow.on('maximize', function() {
		fs.writeFileSync(max_info_path, JSON.stringify(mainWindow.getBounds()));
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
		]},{
		label: "表示",
		submenu: [
			{
				label: 'Toggle Developer Tools',
				accelerator: 'Alt+Command+I',
				click: function() { mainWindow.toggleDevTools(); }
			  },
          {
            label: '再読み込み',
            accelerator: 'CmdOrCtrl+R',
            click: function() { mainWindow.webContents.send('reload', " "); }
          }
		]
		},
		{
		label: 'ウィンドウ',
		role: 'window',
		submenu: [
			  {
				label: '最小化',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			  },
			  {
				label: '閉じる',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			  },
			]
		  }
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
		const notifier = require('node-notifier');
	// String
	Jimp.read(args[2], function (err, lenna) {
		if(!err && lenna){
			lenna.write(tmp_img);
			var tmp_imge=tmp_img;
		}else{
			var tmp_imge="";
		}
		notifier.notify({
			appName: "top.thedesk.thedesk",
			message: args[1],
			title: args[0],
			icon : tmp_imge,
			sound: false,
			wait: false
		});
		
	});
	}
});
//言語
ipc.on('lang', function(e, arg) {
	//index.html
	var indextemp=fs.readFileSync(__dirname + '/index.sample.html', 'utf8');
	var indexjson=JSON.parse(fs.readFileSync(__dirname + '/language/index.'+arg+'.json', 'utf8'));
	Object.keys(indexjson).forEach(function(indexkey) {
		var regExp = new RegExp("{{" + indexkey + "}}", "g");
		indextemp = indextemp.replace(regExp, indexjson[indexkey]);
	});
	var regExp = new RegExp("{{lang}}", "g");
	indextemp = indextemp.replace(regExp, arg);
	fs.writeFileSync(__dirname + '/index.html',indextemp);

	//acct.html
	var accttemp=fs.readFileSync(__dirname + '/acct.sample.html', 'utf8');
	var acctjson=JSON.parse(fs.readFileSync(__dirname + '/language/acct.'+arg+'.json', 'utf8'));
	Object.keys(acctjson).forEach(function(acctkey) {
		var regExp = new RegExp("{{" + acctkey + "}}", "g");
		accttemp = accttemp.replace(regExp, acctjson[acctkey]);
	});
	var regExp = new RegExp("{{lang}}", "g");
	accttemp = accttemp.replace(regExp, arg);
	fs.writeFileSync(__dirname + '/acct.html',accttemp);

	//setting.html
	var settingtemp=fs.readFileSync(__dirname + '/setting.sample.html', 'utf8');
	var settingjson=JSON.parse(fs.readFileSync(__dirname + '/language/setting.'+arg+'.json', 'utf8'));
	Object.keys(settingjson).forEach(function(settingkey) {
		var regExp = new RegExp("{{" + settingkey + "}}", "g");
		settingtemp = settingtemp.replace(regExp, settingjson[settingkey]);
	});
	var regExp = new RegExp("{{lang}}", "g");
	settingtemp = settingtemp.replace(regExp, arg);
	fs.writeFileSync(__dirname + '/setting.html',settingtemp);

	//update.html
	var updatetemp=fs.readFileSync(__dirname + '/update.sample.html', 'utf8');
	var updatejson=JSON.parse(fs.readFileSync(__dirname + '/language/update.'+arg+'.json', 'utf8'));
	Object.keys(updatejson).forEach(function(updatekey) {
		var regExp = new RegExp("{{" + updatekey + "}}", "g");
		updatetemp = updatetemp.replace(regExp, updatejson[updatekey]);
	});
	var regExp = new RegExp("{{lang}}", "g");
	updatetemp = updatetemp.replace(regExp, arg);
	fs.writeFileSync(__dirname + '/update.html',updatetemp);
	console.log("done");
	mainWindow.webContents.send('langres', "");
})

ipc.on('update', function(e, x, y) {
	var platform=process.platform;
	var bit=process.arch;
	if(platform!="others"){
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
//Web魚拓
ipc.on('shot', function(e, args) {
	console.log("link:"+args[0]+" width:"+args[1]+" height:"+args[2]+" title:"+args[4]+" top:"+args[5]+" left:"+args[6]);
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
		lenna.crop( args[6], args[5], args[1], args[2] ).write(dir);
	});
	shell.showItemInFolder(folder);
})
ipc.on('shot-img-dl', (e, args) => {
	Jimp.read(args[0], function (err, lenna) {
		if (err) throw err;
		if(process.platform=="win32"){
			var folder=app.getPath('home')+"\\Pictures\\TheDesk\\Screenshots\\";
		}else if(process.platform=="linux" || process.platform=="darwin" ){
			var folder=app.getPath('home')+"/Pictures/TheDesk/Screenshots/";
		}
		lenna.write(folder+args[1]);
	});
})
//アプデDL
ipc.on('download-btn', (e, args) => {
	var platform=process.platform;
	var bit=process.arch;
	if(platform=="win32" || platform=="linux" || platform=="darwin" ){
		if(platform=="win32" && bit=="x64"){
			var zip="TheDesk-win32-x64.zip";
		}else if(platform=="win32" && bit=="ia32"){
			var zip="TheDesk-win32-ia32.zip";
		}else if(platform=="linux" && bit=="x64"){
			var zip="TheDesk-linux-x64.zip";
		}else if(platform=="linux" && bit=="ia32"){
			var zip="TheDesk-linux-ia32.zip";
		}else if(platform=="darwin"){
			var zip="TheDesk-darwin-x64.zip";
		}else{
			retrun;
		}
	}else{
		const options = {
			type: 'info',
			title: 'Other OS Supporting System',
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
	console.log(zip);
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
			if(platform=="win32"){
				var m = savedFiles.match(/(.+)\\(.+)$/);
			}else{
				var m = savedFiles.match(/(.+)\/(.+)$/);
			}
			
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
	}else if(platform=="darwin"){
			var zip="TheDesk-darwin-x64.zip";
	}
	//zip=zip+"?"+ver;
	var l = 8;

	// 生成する文字列に含める文字セット
	var c = "abcdefghijklmnopqrstuvwxyz0123456789";

	var cl = c.length;
	var r = "";
	for(var i=0; i<l; i++){
	  r += c[Math.floor(Math.random()*cl)];
	}

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
			if(platform=="win32"){
				mainWindow.webContents.send('mess', "unzip");
				console.log(files+"/"+zip);
				fs.rename(files+"/"+zip, app.getPath("userData")+"/TheDesk-temp.zip", function (err) {
					var AdmZip = require('adm-zip');
					var zipp = new AdmZip(app.getPath("userData")+"/TheDesk-temp.zip");
					zipp.extractAllTo(app.getPath("userData")+"/",true);
					var bat='@echo off\nrmdir  /s /q "'+files+'\\TheDesk-win32-'+bit+'" /Q\nmove /Y "'+app.getPath("userData")+'\\TheDesk-win32-'+bit+'" "'+files+'\\"\nstart '+files+'\\TheDesk-win32-'+bit+'\\TheDesk.exe\nexit';
					fs.writeFile(app.getPath("userData")+"/update.bat",bat,function(err){
						const exec = require('child_process').exec;
					exec('start '+app.getPath("userData")+"\\update.bat", (err, stdout, stderr) => {
						app.quit();
						  if (err) { console.log(err); }
						  console.log(stdout);
						});
					 });
			})
			}else{
				app.quit();
			}
			
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
ipc.on('itunes', (e, args) => {
	var platform=process.platform;
	var bit=process.arch;
	if(platform=="darwin"){
	const nowplaying = require("itunes-nowplaying-mac")

nowplaying.getRawData().then(function (value) {
    mainWindow.webContents.send('itunes-np', value);
}).catch(function (error) {
    // 非同期処理失敗。呼ばれない
    console.log(error);
});
}
});
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
    message: "カラムを削除しますか？(すべてのカラムのリンク解析がOFFになります。)",
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
	var nano_info_path = join(app.getPath("userData"), "nano-window-position.json");
	var window_pos;
	try {
		window_pos = JSON.parse(fs.readFileSync(nano_info_path, 'utf8'));
	} catch (e) {
	window_pos = [0,0]; // デフォルトバリュー
	}
	var nanowindow = new BrowserWindow({width: 300, height: 200,
	"transparent": false,    // ウィンドウの背景を透過
		 "frame": false,     // 枠の無いウィンドウ
		 "resizable": false });
	nanowindow.loadURL('file://' + __dirname + '/nano.html');
	nanowindow.setAlwaysOnTop(true);

	nanowindow.setPosition(window_pos[0], window_pos[1]);
   nanowindow.on('close', function() {
		fs.writeFileSync(nano_info_path, JSON.stringify(nanowindow.getPosition()));
	});
	return true;
 })
 ipc.on('adobe', (e, arg) => {
	 if(!arg){
		const options = {
			type: 'info',
			title: 'Adobeフォトエディタ',
			message: "「許可」または「永続的に許可」をクリックするとTheDeskとAdobeで情報を共有します。\n次のウィンドウを開いている時以外は一切提供しません。",
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
var cbTimer1;
ipc.on('startmem', (e, arg) => {
	cbTimer1 = setInterval(mems, 1000);
});
ipc.on('endmem', (e, arg) => {
	if(cbTimer1){
		clearInterval(cbTimer1);
	}
});
function mems(){
	var mem=os.totalmem()-os.freemem();
	mainWindow.webContents.send('memory', [mem,os.cpus()[0].model,os.totalmem()]);
}
ipc.on('mkc', (e, arg) => {
	var platform=process.platform;
	if(platform=="linux" || platform=="win32" ){
		var mkc = fs.readFileSync(__dirname + '/.tkn', 'utf8');
		
	}else{
		var mkc = "";
	}
	mainWindow.webContents.send('mkcr', mkc);
});
ipc.on('export', (e, args) => {
	fs.writeFileSync(args[0], args[1]);
});
ipc.on('import', (e, arg) => {
	mainWindow.webContents.send('config', fs.readFileSync(arg, 'utf8'));
});

app.setAsDefaultProtocolClient('thedesk')