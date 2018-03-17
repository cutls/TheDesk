//ドラッグ・アンド・ドロップからアップロードまで。uiのimg.jsとは異なります。
var obj = $("body");
var system;
//ドラッグスタート
obj.on('dragstart', function(e) {
	system = "locked"
});
//何もなくファイルが通過
obj.on('dragend', function(e) {
	system = "";
});
//ドラッグファイルが画面上に
obj.on('dragenter', function(e) {
	if (system != "locked") {
		$("#drag").css('display', 'flex');
	}

});
$("body").on('dragover', function(e) {
	e.stopPropagation();
	e.preventDefault();
});
//ドロップした
$("body").on('drop', function(e) {
	if (system != "locked") {
		$("#drag").css('display', 'none');
		e.preventDefault();
		var files = e.originalEvent.dataTransfer.files;
		pimg(files);
	}
});
//何もなくファイルが通過
$("#drag").on('dragleave', function(e) {
	$("#drag").css('display', 'none');
});

//複数アップ
function pimg(files) {
	console.log(files);
	for (i = 0; i < files.length; i++) {
		var dot=files[i].path.match(/\.(.+)$/)[1];
		if(dot=="bmp" || dot=="BMP"){
			var electron = require("electron");
		  	var ipc = electron.ipcRenderer;
			  ipc.send('bmp-image', files[i].path);
			  todo("変換中...");
			  
		}else{
			handleFileUpload(files[i], obj);
		}
	}
}
var electron = require("electron");
var ipc = electron.ipcRenderer;
ipc.on('bmp-img-comp', function (event, b64) {
	beforeMedia(b64,"image/png");
  });
//ドラッグ・アンド・ドロップを終了
function closedrop() {
	$("#drag").css('display', 'none');
}
//ファイル選択
function fileselect() {
	ipc.send('file-select', "");
}

//ファイル読み込み
function handleFileUpload(files, obj) {
	var fr = new FileReader();
	fr.onload = function(evt) {
		var b64 = evt.target.result;
		$('#b64-box').val(b64);
		var ret = beforeMedia(b64, files["type"])
	}
	fr.readAsDataURL(files);
	$("#mec").append(files["name"] + "/");
}

//順番意識
function beforeMedia(b64,type){
	var busy = localStorage.getItem("image");
	if(busy=="busy"){
		timerID = setInterval(function(){
			var busy = localStorage.getItem("image");
			console.log("busy... please wait."+type)
			if(!busy){
				clearInterval(timerID);
                timerID = null;
				media(b64,type);
			}
		 }, 20);
	}else{
		localStorage.removeItem("image");
		media(b64,type);
	}
}
//ファイルアップロード
function media(b64, type) {
	$("#toot-post-btn").prop("disabled", true);
	localStorage.setItem("image","busy");
	todo("Image Upload...");
	var media = toBlob(b64, type);
	console.log(media);
	var fd = new FormData();
	fd.append('file', media);
	var acct_id = $("#post-acct-sel").val();
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/media";
	fetch(start, {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + at
		},
		body: fd
	}).then(function(response) {
		console.log(response)
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		var img = localStorage.getItem("img");
		if (json.type=="image") {
			var html = '<img src="' + json.preview_url + '" style="width:50px; max-height:100px;">';
			$('#preview').append(html);
		} else {
			$('#preview').append("プレビューできません");
		}
		if (!img) {
			var img = "no-act";
		}
		if (img != "inline") {
			if ($("#media").val()) {
				$("#media").val($("#media").val() + ',' + json["id"]);
			} else {
				$("#media").val(json["id"]);
			}
		}
		if (img == "url") {
			$("#textarea").val($("#textarea").val() + " " + json["text_url"])
		}
		todc();
		$("#toot-post-btn").prop("disabled", false);
		$("#post-acct-sel").prop("disabled", true);
		$('select').material_select();
		Materialize.toast("ファイルアップロード後はアカウントを切り替えられません。", 1000);
		localStorage.removeItem("image");
	});
}

//Base64からBlobへ
function toBlob(base64, type) {
	var bin = atob(base64.replace(/^.*,/, ''));
	var buffer = new Uint8Array(bin.length);
	for (var i = 0; i < bin.length; i++) {
		buffer[i] = bin.charCodeAt(i);
	}
	// Blobを作成
	try {
		var blob = new Blob([new Uint8Array(buffer)], {
			type: type
		});
	} catch (e) {
		return false;
	}

	return blob;
}
