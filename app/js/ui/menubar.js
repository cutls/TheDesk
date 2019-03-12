function quit(){
    console.log("quit")
    var electron = require("electron");
    var ipc = electron.ipcRenderer;
    ipc.send('quit', 'go');
}
function minimize(){
    console.log("mini")
    var electron = require("electron");
    var ipc = electron.ipcRenderer;
    ipc.send('minimize', 'go');
}
function maxToggle(){
    console.log("max")
    var electron = require("electron");
    var ipc = electron.ipcRenderer;
    ipc.send('maximize', 'go');
}