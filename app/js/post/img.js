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
			  ipc.send('bmp-image', [files[i].path,i]);
			  todo(lang.lang_progress);
			  
		}else{
			handleFileUpload(files[i], obj,i);
		}
	}
}
var electron = require("electron");
var ipc = electron.ipcRenderer;
ipc.on('bmp-img-comp', function (event, b64) {
	media(b64[0],"image/png",b64[1]);
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
function handleFileUpload(files, obj, no) {
	var fr = new FileReader();
	fr.onload = function(evt) {
		var b64 = evt.target.result;
		$('#b64-box').val(b64);
		var ret = media(b64, files["type"], no)
	}
	fr.readAsDataURL(files);
	$("#mec").append(files["name"] + "/");
}

//ファイルアップロード
function media(b64, type, no) {
	var l = 4;
	var c = "abcdefghijklmnopqrstuvwxyz0123456789";
	var cl = c.length;
	var r = "";
	for(var i=0; i<l; i++){
  		r += c[Math.floor(Math.random()*cl)];
	}
	if ($("#media").val()) {
		$("#media").val($("#media").val() + ',' + "tmp_"+r);
	} else {
		$("#media").val("tmp_"+r);
	}
	$(".toot-btn-group").prop("disabled", true);
	$("#post-acct-sel").prop("disabled", true);
	localStorage.setItem("image","busy");
	todo("Image Upload...");
	var media = toBlob(b64, type);
	console.log(media);
	var fd = new FormData();
	fd.append('file', media);
	var acct_id = $("#post-acct-sel").val();
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	var httpreq = new XMLHttpRequest();
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var start = "https://" + domain + "/api/drive/files/create";
		httpreq.open('POST', start, true);
		httpreq.upload.addEventListener("progress", progshow, false);
		httpreq.responseType = 'json';
		if ($("#nsfw").hasClass("nsfw-avail")) {
			var nsfw = true;
		} else {
			var nsfw = false;
		}
		var previewer="url"
		fd.append('i', at);
		//fd.append('isSensitive', nsfw);
		httpreq.send(fd);
	}else{
		var previewer="preview_url"
		var start = "https://" + domain + "/api/v1/media";
		httpreq.open('POST', start, true);
		httpreq.upload.addEventListener("progress", progshow, false);
		httpreq.responseType = 'json';
		httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
		httpreq.send(fd);
	}
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			console.log(json);
			var img = localStorage.getItem("img");
			if (json.type.indexOf("image")!=-1) {
				var html = '<img src="' + json[previewer] + '" style="width:50px; max-height:100px;">';
				$('#preview').append(html);
			} else {
				$('#preview').append(lang.lang_postimg_previewdis);
			}
			if (!img) {
				var img = "no-act";
			}
			if (img != "inline") {
				var mediav=$("#media").val();
				var regExp = new RegExp("tmp_"+r, "g");
				mediav = mediav.replace(regExp, json["id"]);
				$("#media").val(mediav);
				
			}
			if (img == "url") {
				$("#textarea").val($("#textarea").val() + " " + json["text_url"])
			}
			todc();
			$(".toot-btn-group").prop("disabled", false);
			$('select').material_select();
			$("#mec").text(lang.lang_there);
			Materialize.toast(lang.lang_postimg_aftupload, 1000);
			$("#imgup").text("");
			$("#imgsel").show();
			localStorage.removeItem("image");
		}
	}
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
//画像を貼り付けたら…
var element =  document.querySelector("#textarea");
element.addEventListener("paste", function(e){
	console.log(e)
    // 画像の場合
    // e.clipboardData.types.length == 0
    // かつ
    // e.clipboardData.types[0] == "Files"
    // となっているので、それ以外を弾く
    if (!e.clipboardData 
            || !e.clipboardData.types
            || (e.clipboardData.types.length != 1)
            || (e.clipboardData.types[0] != "Files")) {
				console.log("not image")
            return true;
    }

    // ファイルとして得る
    // (なぜかgetAsStringでは上手くいかなかった)
    var imageFile = e.clipboardData.items[0].getAsFile();

    // FileReaderで読み込む
    var fr = new FileReader();
    fr.onload = function(e) {
        // onload内ではe.target.resultにbase64が入っているのであとは煮るなり焼くなり
		var base64 = e.target.result;
		var mediav = $("#media").val();
		if(mediav){
			var i=mediav.split(",").length;
		}
		media(base64, "image/png", i)
    };
    fr.readAsDataURL(imageFile);

    // 画像以外がペーストされたときのために、元に戻しておく
});
//Adobeフォトエディタ
function adobe(){
	var agree = localStorage.getItem("adobeagree");
	ipc.send('adobe', agree);
}
ipc.on('adobeagree', function (event, arg) {
	localStorage.setItem("adobeagree",arg);
  });