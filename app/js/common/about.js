//このソフトについて
function about() {
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('about', 'go');
}