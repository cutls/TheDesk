//バージョンチェッカー
function verck(ver) {
	if(localStorage.getItem("ver")!=ver){
		localStorage.setItem("ver", ver);
		console.log("Thank you for your update");
		$(document).ready(function(){
			$('#releasenote').modal('open');
			verp=ver.replace( '(', '');
			verp=verp.replace( '.', '-');
			verp=verp.replace( '.', '-');
			verp=verp.replace( '[', '-');
			verp=verp.replace( ']', '');
			verp=verp.replace( ')', '');
			verp=verp.replace( ' ', '_');
			console.log(verp);
			$("#release-"+verp).show();
		  });
	}
	
	var l = 5;

	// 生成する文字列に含める文字セット
	var c = "abcdefghijklmnopqrstuvwxyz0123456789";
	
	var cl = c.length;
	var r = "";
	for(var i=0; i<l; i++){
  		r += c[Math.floor(Math.random()*cl)];
	}
	var start = "https://thedesk.top/ver.json";
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
			var electron = require("electron");
			var remote=electron.remote;
			var platform=remote.process.platform;
			if(platform=="darwin"){
				var newest=mess.desk_mac;
			}else{
				var newest=mess.desk;
			}
			if (newest == ver) {
				todo(lang_version_usever[lang].replace("{{ver}}" ,mess.desk));
				//betaならアプデチェックしない
			} else if (ver.indexOf("beta")==-1) {
				localStorage.removeItem("instance")
				if(localStorage.getItem("new-ver-skip")){
					if(localStorage.getItem("next-ver")!=newest){
						var ipc = electron.ipcRenderer;
						ipc.send('update', "true");
					}else{
						todo(lang_version_skipver[lang]);
					}
				}else{
					var ipc = electron.ipcRenderer;
					ipc.send('update', "true");
				}
			}
		}
	});
}
