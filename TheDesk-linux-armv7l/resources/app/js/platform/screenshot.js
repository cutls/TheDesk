var electron = require("electron");
const fs = require("fs");
const os = require('os')
const shell = electron.shell;
const path = require('path')
function shot(){
    //screenshotMsg.textContent = 'Gathering screens...'
    $(window).height
	let options = {
        types: ['screen'],
        thumbnailSize: {
            width: window.parent.screen.width,
            height: window.parent.screen.height
          }
	}
	const desktopCapturer = electron.desktopCapturer;
	desktopCapturer.getSources(options, function(error, sources) {
		if (error) return console.log(error)

		sources.forEach(function(source) {
			if(location.search){
                var m = location.search.match(/\?id=([a-zA-Z-0-9]+)/);
                var title=m[1];
            }else{
                var title="screenshot";
            }
			if (source.name === 'Screen 1' || source.name === 'TheDesk') {
                var durl=source.thumbnail.toDataURL();
                var b64 = durl.match(
                    /data:image\/png;base64,(.+)/
                );
                const screenshotPath = path.join(os.tmpdir(), 'screenshot.png');
                const savePath = path.join(os.tmpdir(), 'screenshot.png');
                    var ipc = electron.ipcRenderer;
                    var h = $(window).height()-150;
                    var w = $(window).width();
                    ipc.send('shot', ['file://' + screenshotPath,w,h,b64[1],title]);
                    if($(".img-parsed").length>0){
                        for(i=0;i<$(".img-parsed").length;i++){
                            var url=$(".img-parsed").eq(i).attr("data-url");
                            ipc.send('shot-img-dl', [url,title+"_img"+i+".png"]);
                        }
                    }
                    window.close();
                    return;
					const message = `Saved screenshot to: ${screenshotPath}`
					//screenshotMsg.textContent = message
			}
		})
	})
      }
      $(window).load(function(){
        setTimeout(function(){
            shot();
       },2000);
      });