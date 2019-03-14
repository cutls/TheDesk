//バージョンチェッカー
function verck(ver,winstore) {
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
	var electron = require("electron");
	var remote=electron.remote;
	var dialog=remote.dialog;
	  var platform=remote.process.platform;
	  if(platform=="win32"){
		const options = {
			type: 'info',
			title: "Select your platform",
			message: lang.lang_version_platform,
			buttons: [lang.lang_no,lang.lang_yesno]
		  }
		  console.log(localStorage.getItem("winstore"))
		  if(!localStorage.getItem("winstore")){
			  
				dialog.showMessageBox(options, function(arg) {
				  if(arg==1){
					  localStorage.setItem("winstore","winstore")
					}else{
					  localStorage.setItem("winstore","localinstall")
					}
			  });
		  }
	  }else if(platform=="linux"){
		if(localStorage.getItem("winstore")=="unix"){
			localStorage.removeItem("winstore")
		}
		console.log(localStorage.getItem("winstore"))
		if(!localStorage.getItem("winstore")){
			const options = {
				type: 'info',
				title: "Select your platform",
				message: lang.lang_version_platform_linux,
				buttons: [lang.lang_no,lang.lang_yesno]
			  }
			  dialog.showMessageBox(options, function(arg) {
				if(arg==1){
					localStorage.setItem("winstore","snapcraft")
				  }else{
					localStorage.setItem("winstore","localinstall")
				  }
			});
		}
	}else{
		  localStorage.setItem("winstore","unix")
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
				todo(lang.lang_version_usever.replace("{{ver}}" ,mess.desk));
				//betaかWInstoreならアプデチェックしない
			} else if (ver.indexOf("beta")!=-1 || winstore) {
				
			}else{
				localStorage.removeItem("instance")
				if(localStorage.getItem("new-ver-skip")){
					if(localStorage.getItem("next-ver")!=newest){
						var ipc = electron.ipcRenderer;
						ipc.send('update', "true");
					}else{
						todo(lang.lang_version_skipver);
					}
				}else{
					var ipc = electron.ipcRenderer;
					ipc.send('update', "true");
				}
			}
		}
	});
	if(!localStorage.getItem("last-notice-id")){
		localStorage.setItem("last-notice-id",0)
	}
	console.log(localStorage.getItem("last-notice-id"))
	var start = "https://thedesk.top/notice?since_id="+localStorage.getItem("last-notice-id");
	console.log(start);
	fetch(start, {
		method: 'GET'
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(mess) {
		console.log(mess.length);
		if(mess.length<1){
			return false;
		}else{
			var last=localStorage.getItem("last-notice-id")
			localStorage.setItem("last-notice-id",mess[0].ID)
		for(i=0;i<mess.length;i++){
			var obj=mess[i];
			if(obj.ID*1<=last){
				break;
			}else{
				var show=true;
				if(obj.Toot!=""){
					var toot='<button class="btn-flat toast-action" onclick="detEx(\''+obj.Toot+'\',\'main\')">Show</button>';
				}else{
					var toot="";
				}
				if(obj.Ver!=""){
					if(obj.Ver==ver){
						show=true;
					}else{
						show=false;
					}
				}
				if(obj.Domain!=""){
					var multi = localStorage.getItem("multi");
					if (multi) {
						show=false;
						var accts = JSON.parse(multi);
						Object.keys(accts).forEach(function(key) {
							var acct = accts[key];
							if(acct.domain==obj.Domain){
								show=true;
							}
						});
					}
				}
				if(show){
					Materialize.toast(obj.Text+toot+'<span class="sml grey-text">(スライドして消去)</span>', 86400);
				}
			}
			
		}
	}
	});
	infows = new WebSocket("wss://thedesk.top/ws/");
	infows.onopen = function(mess) {
		console.log(tlid + ":Connect Streaming Info:");
		console.log(mess);
	}
	infows.onmessage = function(mess) {
		console.log(":Receive Streaming:");
		console.log(JSON.parse(mess.data));
		var obj=JSON.parse(mess.data);
		if(obj.type!="counter"){
		if(obj.id*1<=localStorage.getItem("last-notice-id")){
			
		}else{
			localStorage.setItem("last-notice-id",obj.id)
			var show=true;
			if(obj.toot!=""){
				var toot='<button class="btn-flat toast-action" onclick="detEx(\''+obj.toot+'\',\'main\')">Show</button>';
			}else{
				var toot="";
			}
			if(obj.ver!=""){
				if(obj.ver==ver){
					show=true;
				}else{
					show=false;
				}
			}
			if(obj.domain!=""){
				var multi = localStorage.getItem("multi");
				if (multi) {
					show=false;
					var accts = JSON.parse(multi);
					Object.keys(accts).forEach(function(key) {
						var acct = accts[key];
						if(acct.domain==obj.domain){
							show=true;
						}
					});
				}
			}
			if(show){
				Materialize.toast(obj.text+toot+'<span class="sml grey-text">(スライドして消去)</span>', 86400);
			}
		}
	}else{
		$("#persons").text(obj.text);
	}
	}
	infows.onerror = function(error) {
		console.error("Error closing:info");
		console.error(error);
		return false;
	};
	infows.onclose = function() {
		console.error("Closing:info");
	};
}