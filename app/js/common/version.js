//バージョンチェッカー
function verck(ver) {
	localStorage.setItem("ver", ver);
	var start = "https://desk.cutls.com/ver.json";
	fetch(start, {
		method: 'GET'
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(mess) {
		console.log(mess);
		if (mess) {
			if (mess.desk == ver) {
				todo("お使いのバージョン" + mess.desk + "は最新です。");
				//betaならアプデチェックしない
			} else if (ver != "beta") {
				var electron = require("electron");
				var ipc = electron.ipcRenderer;
				ipc.send('update', "true");
			}
		}
	});
}
