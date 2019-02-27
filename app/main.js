'use strict';

// Electronのモジュール
const electron = require("electron");
const fs = require("fs");
const dialog = require('electron').dialog;
var Jimp = require("jimp");
const shell = electron.shell;
const os = require('os')
const path = require('path')
//const fm = require('font-manager');
const Menu=electron.Menu
var updatewin=null;
const join = require('path').join;
// linuxの時は定義しない
/*if (process.platform=='win32') {
  const {NowPlaying,PlayerName} = require("nowplaying-node");
}*/
// アプリケーションをコントロールするモジュール
const app = electron.app;
// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;
const {
	download
} = require('electron-dl');
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;
var info_path = join(app.getPath("userData"), "window-size.json");
var max_info_path = join(app.getPath("userData"), "max-window-size.json");
var lang_path=join(app.getPath("userData"), "language");
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
		var arg={width:window_size.width,height:window_size.height,x:window_size.x,y:window_size.y,icon: __dirname + '/desk.png'}
	}else{
		var arg={width:window_size.width,height:window_size.height,x:window_size.x,y:window_size.y,simpleFullscreen:true}
	}
	mainWindow = new BrowserWindow(arg);
	try {
		var lang = fs.readFileSync(lang_path, 'utf8');
	} catch (e) {
		var lang=app.getLocale();
		if(~lang.indexOf("ja")){
			lang="ja";
		}else{
			lang="en";
		}
		fs.writeFileSync(lang_path,lang);
	}
	electron.session.defaultSession.clearCache(() => {})
	if(process.argv){
		if(process.argv[1]){
			var m = process.argv[1].match(/([a-zA-Z0-9]+)\/\?[a-zA-Z-0-9]+=(.+)/);
			if(m){
				var mode=m[1];
				var code=m[2];
				var plus='?mode='+mode+'&code='+code;
			}else{
				var plus="";
			}
		}else{
			var plus="";
		}
	}else{
		var plus="";
	}
	mainWindow.loadURL('file://' + __dirname + '/view/'+lang+'/index.html'+plus);
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
		const notifier = require('node-notifier')
		var tmp_imge=tmp_img;
	Jimp.read(args[2], function (err, lenna) {
		if(!err && lenna){
			lenna.write(tmp_img);
			var tmp_imge=tmp_img;
		}else{
			var tmp_imge="";
		}
		notifier.notify({
			appID: "top.thedesk",
			message: args[1],
			title: args[0],
			icon : tmp_imge,
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
	fs.writeFileSync(lang_path,arg);
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
	var lang = fs.readFileSync(lang_path, 'utf8');
	updatewin.loadURL('file://' + __dirname + '/view/'+lang+'/update.html');

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
	if(args[7]==""){
		if(platform=="win32"){
			var dir=app.getPath('home')+"\\Pictures\\TheDesk\\Screenshots\\"+args[4]+"-toot.png";
			var folder=app.getPath('home')+"\\Pictures\\TheDesk\\Screenshots\\";
		}else if(platform=="linux" || platform=="darwin" ){
			var dir=app.getPath('home')+"/Pictures/TheDesk/Screenshots/"+args[4]+"-toot.png";
			var folder=app.getPath('home')+"/Pictures/TheDesk/Screenshots/";
		}
	}else{
		var folder=args[7];
		var dir=folder+args[4]+"-toot.png";
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
		if(args[1]==""){
			if(process.platform=="win32"){
				var folder=app.getPath('home')+"\\Pictures\\TheDesk\\Screenshots\\";
			}else if(process.platform=="linux" || process.platform=="darwin" ){
				var folder=app.getPath('home')+"/Pictures/TheDesk/Screenshots/";
			}
		}else{
			var folder=args[2];
		}
		
		lenna.write(folder+args[1]);
	});
})
//アプデDL
ipc.on('download-btn', (e, args) => {
	//console.log(args[1]);
	var platform=process.platform;
	var bit=process.arch;
		dialog.showSaveDialog(null, {
      title: 'Save',
			defaultPath: app.getPath('home')+"/"+args[1]
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
			//console.log(m);
			  if(isExistFile(savedFiles)){
					fs.unlinkSync(savedFiles);
			  }
              dl(args[0],args[1],m[1]);
        });
});
function isExistFile(file) {
	try {
	  fs.statSync(file);
	  return true
	} catch(err) {
	  if(err.code === 'ENOENT') return false
	}
  }
function dl(url,file,dir){
	updatewin.webContents.send('mess', "ダウンロードを開始します。");
	const opts = {
		directory:dir,
		openFolderWhenDone: true,
		onProgress: function(e) {
			updatewin.webContents.send('prog', e);
		},
		saveAs: false
	};
	download(BrowserWindow.getFocusedWindow(),
			url, opts)
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
	if(args[1]==""){
		if(platform=="win32"){
			var dir=app.getPath('home')+"\\Pictures\\TheDesk";
		}else if(platform=="linux" || platform=="darwin" ){
			var dir=app.getPath('home')+"/Pictures/TheDesk";
		}
	}else{
		var dir=args[1];
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
	if(args[0]=="set"){
		return;
		var nppath=join(app.getPath("userData"), "nowplaying");
		var npProvider;
		try {
			npProvider = args[1];
		} catch (e) {
			npProvider="AIMP";
		}
		var myAIMP = new NowPlaying({
			fetchCover: true,
			player: PlayerName[npProvider],
		});
		fs.writeFileSync(nppath, npProvider);
	}else{
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
		}else{
			return;
			var nppath=join(app.getPath("userData"), "nowplaying");
			var npProvider;
			try {
				npProvider = fs.readFileSync(nppath, 'utf8');
			} catch (e) {
				npProvider="AIMP";
			}
			var myAIMP = new NowPlaying({
				fetchCover: true,
				player: PlayerName[npProvider],
			});
			myAIMP.update();
			var path=myAIMP.getCoverPath();
			if(path){
				var bin = fs.readFileSync(path, 'base64');
			}else{
				var bin=false;
			}
			
			var value={
				name:myAIMP.getTitle(),
				artist:myAIMP.getArtist(),
				album:myAIMP.getAlbum(),
				path:bin
			}
			mainWindow.webContents.send('itunes-np', value);
		}
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
	var nanowindow = new BrowserWindow({width: 350, height: 200,
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
	if(mainWindow){
		mainWindow.webContents.send('memory', [mem,os.cpus()[0].model,os.totalmem()]);
	}
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
//フォント
function object_array_sort(data,key,order,fn){
	//デフォは降順(DESC)
	var num_a = -1;
	var num_b = 1;
   
	if(order === 'asc'){//指定があれば昇順(ASC)
	  num_a = 1;
	  num_b = -1;
	}
   
	data = data.sort(function(a, b){
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
object_array_sort(fonts, 'family', 'asc', function(fonts_sorted){
	mainWindow.webContents.send('font-list', fonts_sorted);
});
});



app.setAsDefaultProtocolClient('thedesk')
