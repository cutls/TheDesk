//ディレクトリ
//ディレクトリトグル
function dirMenu() {
	$("#dir-contents").html("");
	directory();
	$("#left-menu div").removeClass("active");
	$("#dirMenu").addClass("active");
	$(".menu-content").addClass("hide");
	$("#dir-box").removeClass("hide");
}
function dirselCk() {
	var acct = $("#dir-acct-sel").val();
	if (acct == "noauth") {
		$("#dirNoAuth").removeClass("hide");
	} else {
		$("#dirNoAuth").addClass("hide");
		directory();
	}
}
function directory(isMore) {
	var order = $("[name=sort]:checked").val();
	if (!order) {
		order = "active";
	}
	var local_only = $("#local_only:checked").val();
	if (local_only) {
		local_only = "true";
	} else {
		local_only = "false";
	}
	var acct_id = $("#dir-acct-sel").val();
	if (acct_id == "noauth") {
		var domain = $("#dirNoAuth-url").val();
		var at = "";
	} else {
		var domain = localStorage.getItem("domain_" + acct_id);
		var at = localStorage.getItem("acct_" + acct_id + "_at");
	}
	if (isMore) {
		var addOffset = $("#dir-contents .cvo").length;
	} else {
		var addOffset = 0;
		$("#dir-contents").html("");
	}
	var start = "https://" + domain + "/api/v1/directory?order=" + order + "&local=" + local_only + "&offset=" + addOffset;
	console.log(start);
	fetch(start, {
		method: "GET",
		headers: {
			"content-type": "application/json",
			Authorization: "Bearer " + at
		}
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			if (json) {
				$("#moreDir").removeClass("disabled");
				var html = userparse(json, null, acct_id, "dir", null);
				$("#dir-contents").append(html);
				jQuery("time.timeago").timeago();
			} else {
				$("#moreDir").addClass("disabled");
			}
		});
}
