//プロフ編集
//文字系
function profedit() {
	var acct_id = $('#his-data').attr("use-acct");
	todo("Updating...");
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/accounts/update_credentials";
	var name = $("#his-name-val").val();
	var des = $("#his-des-val").val();
	fetch(start, {
		method: 'PATCH',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		body: JSON.stringify({
			display_name: name,
			note: des
		})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		getdata();
		todc();
	});
}

//画像系
function imgChange(imgfile, target) {
	var acct_id = $('#his-data').attr("use-acct");
	todo("アップロードしています")
	if (!imgfile.files.length) {
		console.log("No Img");
		return;
	}
	var file = imgfile.files[0];
	var fr = new FileReader();
	fr.onload = function(evt) {
		var b64 = this.result;
		var blob = toBlob(b64, 'image/png');
		var fd = new FormData();
		fd.append(target, blob);
		var domain = localStorage.getItem("domain_" + acct_id);
		var at = localStorage.getItem(domain + "_at");
		var start = "https://" + domain + "/api/v1/accounts/update_credentials";
		fetch(start, {
			method: 'PATCH',
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
			getdata();
			todc();
		});
	}
	$("#prof-change").html($("#prof-change").html());
	$("#header-change").html($("#header-change").html());
	fr.readAsDataURL(file);
}
