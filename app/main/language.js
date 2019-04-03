// Create the Application's main menu
function templete(lang,mainWindow,packaged){
    const electron = require("electron");
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const dict={
        "application":{
            "ja":"アプリケーション",
            "en":"Application"
        },
        "about":{
            "ja":"TheDeskについて",
            "en":"About TheDesk"
        },
        "quit":{
            "ja":"終了",
            "en":"Quit"
        },
        "edit":{
            "ja":"編集",
            "en":"Edit"
        },
        "undo":{
            "ja":"元に戻す",
            "en":"Undo"
        },
        "redo":{
            "ja":"やり直す",
            "en":"Redo"
        },
        "cut":{
            "ja":"切り取り",
            "en":"Cut"
        },
        "copy":{
            "ja":"コピー",
            "en":"Copy"
        },
        "paste":{
            "ja":"貼り付け",
            "en":"Paste"
        },
        "selall":{
            "ja":"すべて選択",
            "en":"Select All"
        },
        "view":{
            "ja":"表示",
            "en":"View"
        },
        "reload":{
            "ja":"再読み込み",
            "en":"Reload"
        },
        "window":{
            "ja":"ウィンドウ",
            "en":"Window"
        },
        "minimun":{
            "ja":"最小化",
            "en":"Minimarize"
        },
        "close":{
            "ja":"閉じる",
            "en":"Close"
        }
    }
    const menu = [{
        label: dict.application[lang],
        submenu: [
            { label: dict.about[lang], click: function() {
                var ver=app.getVersion()
	            var window = new BrowserWindow({width: 300, height: 460,
			        "transparent": false,    // ウィンドウの背景を透過
			        "frame": false,     // 枠の無いウィンドウ
			        "resizable": false });
	             window.loadURL('file://' + __dirname + '/about.html?ver='+ver);
             } },
            { type: "separator" },
            { label: dict.quit[lang], accelerator: "Command+Q", click: function() { app.quit(); }}
            
        ]}, {
        label: dict.edit[lang],
        submenu: [
            { label: dict.undo[lang], accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: dict.redo[lang], accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: dict.cut[lang], accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: dict.copy[lang], accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: dict.paste[lang], accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: dict.selall[lang], accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]},{
        label: dict.view[lang],
        submenu: [
            {
                label: 'Toggle Developer Tools',
                accelerator: 'Alt+Command+I',
                click: function() { if(!packaged){mainWindow.toggleDevTools();} }
              },
          {
            label: dict.reload[lang],
            accelerator: 'CmdOrCtrl+R',
            click: function() { mainWindow.webContents.send('reload', " "); }
          }
        ]
        },
        {
        label: dict.window[lang],
        role: 'window',
        submenu: [
              {
                label: dict.minimun[lang],
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
              },
              {
                label: dict.close[lang],
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
              },
            ]
          }
    ];
    return menu;
}
function delsel(lang){
    const dict={
        "delete":{
            "ja":"カラム削除",
            "en":"Delete this column"
        },
        "mess":{
            "ja":"カラムを削除しますか？(すべてのカラムのリンク解析がOFFになります。)",
            "en":"Delete this column(URL analyzes of all windows will be disabled.)"
        },
        "yes":{
            "ja":"はい",
            "en":"Yes"
        },
        "no":{
            "ja":"いいえ",
            "en":"No"
        }
    }
    const options = {
        type: 'info',
        title: dict.delete[lang],
        message: dict.mess[lang],
        buttons: [dict.no[lang], dict.yes[lang]]
      }
      return options;
}

exports.template = templete;
exports.delsel = delsel;