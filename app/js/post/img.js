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
		more();
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
		handleFileUpload(files[i], obj);
	}
}

//ドラッグ・アンド・ドロップを終了
function closedrop() {
	$("#drag").css('display', 'none');
}

//ファイルプレビュー
function handleFileUpload(files, obj) {
	var fr = new FileReader();
	fr.onload = function(evt) {
		var b64 = evt.target.result;
		if (files["type"] == "image/png" || files["type"] == "image/jpeg" || files[
				"type"] == "image/gif") {
			var html = '<img src="' + b64 + '" style="width:50px; max-height:100px;">';
			$('#preview').append(html);
		} else {
			$('#preview').append(files["name"] + "はプレビューできません");
		}
		$('#b64-box').val(b64);
		var ret = media(b64, files["type"])
	}
	fr.readAsDataURL(files);
	$("#mec").append(files["name"] + "/");
}

//ファイルアップロード
function media(b64, type) {
	$("#toot-post-btn").prop("disabled", true);
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
