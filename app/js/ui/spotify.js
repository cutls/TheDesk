function spotifyConnect(){
    var auth = "https://accounts.spotify.com/authorize?client_id=0f18e54abe0b4aedb4591e353d3aff69&redirect_uri=https://thedesk.top/spotify-connect&response_type=code&scope=user-read-currently-playing";
		const {
  			shell
  		} = require('electron');

		  shell.openExternal(auth);
		  var electron = require("electron");
		  var ipc = electron.ipcRenderer;
				ipc.send('quit', 'go');
		  
}
function spotifyDisconnect(){
    localStorage.removeItem("spotify");
    localStorage.removeItem("spotify-refresh");
    checkSpotify();
}
function checkSpotify(){
    if(localStorage.getItem("spotify")){
        $("#spotify-enable").addClass("disabled");
        $("#spotify-disable").removeClass("disabled");
    }else{
        $("#spotify-enable").removeClass("disabled");
        $("#spotify-disable").addClass("disabled");
    }
    var content=localStorage.getItem("np-temp");
    $("#np-temp").val(content);
}
function nowplaying(){
    var start = "https://thedesk.top/now-playing?at="+localStorage.getItem("spotify")+"&rt="+localStorage.getItem("spotify-refresh");
    var at = localStorage.getItem("spotify");
    if(at){
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
        console.log(json);
        var item=json.item;
        var content=localStorage.getItem("np-temp");
        if(!content){
            var content="#NowPlaying {song} / {album} / {artist}\n{url} #SpotifyWithTheDesk";
        }
        var regExp = new RegExp("{song}", "g");
        content = content.replace(regExp, item.name);
        var regExp = new RegExp("{album}", "g");
        content = content.replace(regExp, item.album.name);
        var regExp = new RegExp("{artist}", "g");
        content = content.replace(regExp, item.artists[0].name);
        var regExp = new RegExp("{url}", "g");
        content = content.replace(regExp, item.external_urls.spotify);
        $("#textarea").val(content);
    });
    }else{
        alert("アカウント連携設定をして下さい。");
    }
}
function spotifySave(){
    var temp=$("#np-temp").val();
    localStorage.setItem("np-temp", temp);
    Materialize.toast("NowPlaying文章を更新しました。", 3000);
}
if(location.search){
    var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/);
    var mode=m[1];
    var codex=m[2];
    if(mode=="spotify"){
        var coder=codex.split(":");
        localStorage.setItem("spotify", coder[0]);
        localStorage.setItem("spotify-refresh", coder[1]);
    }else{
        
    }
    
}