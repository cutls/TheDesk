//プロフ編集
//文字系
function profedit() {
	var acct_id = $('#his-data').attr("use-acct");
	todo("Updating...");
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/accounts/update_credentials";
	var name = $("#his-name-val").val();
	var des = $("#his-des-val").val();
	var httpreq = new XMLHttpRequest();
	httpreq.open('PATCH', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send(JSON.stringify({
		display_name: name,
		note: des,
	}));
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			$('#his-data').modal('close');
			todc();
		}
	}
}

//画像系
function imgChange(imgfile, target) {
	var acct_id = $('#his-data').attr("use-acct");
	todo("アップロードしています")
	if (!imgfile.files.length) {
		console.warn("No Image to upload");
		return;
	}
	var file = imgfile.files[0];
	var fr = new FileReader();
	fr.onload = function (evt) {
		var b64 = this.result;
		var blob = toBlob(b64, 'image/png');
		var fd = new FormData();
		fd.append(target, blob);
		var domain = localStorage.getItem("domain_" + acct_id);
		var at = localStorage.getItem("acct_" + acct_id + "_at");
		var start = "https://" + domain + "/api/v1/accounts/update_credentials";
		var httpreq = new XMLHttpRequest();
		httpreq.open('PATCH', start, true);
		httpreq.upload.addEventListener("progress", progshow, false);
		httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
		httpreq.responseType = "json";
		httpreq.send(fd);
		httpreq.onreadystatechange = function () {
			if (httpreq.readyState === 4) {
				var json = httpreq.response;
				if(this.status!==200){ setLog(start, this.status, this.response); }
				$('#his-data').modal('close');
				todc();
				localStorage.removeItem("image");
			}
		}
	}
	$("#prof-change").html($("#prof-change").html());
	$("#header-change").html($("#header-change").html());
	fr.readAsDataURL(file);
}
