//カード処理やメンション、ハッシュタグの別途表示
//全てのTL処理で呼び出し
function additional(acct_id, tlid) {
	//メンション系
	$(".mention").attr("href", "#");
	//トゥートサムネ
	$("#timeline_" + tlid + " .toot a:not(.parsed)").each(function(i, elem) {
		var domain = localStorage.getItem("domain_" + acct_id);
		var at = localStorage.getItem(domain + "_at");
		var card = localStorage.getItem("card_" + tlid);
		var text = $(this).attr('href');
		var urls = text.match(
			/https?:\/\/([-a-zA-Z0-9@.]+)\/media\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/
		);
		if (urls) {
			$(this).remove();
		} else if (!card) {

			var id = $(this).parents('.cvo').attr("toot-id");
			var start = "https://" + domain + "/api/v1/statuses/" + id + "/card";
			fetch(start, {
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					'Authorization': 'Bearer ' + at
				},
				//body: JSON.stringify({})
			}).then(function(response) {
				return response.json();
			}).catch(function(error) {
				todo(error);
				console.error(error);
			}).then(function(json) {
				console.log(json);
				if (json.title) {
					$("[toot-id=" + id + "] .additional").html(
						"<span class=\"gray\">URLチェック:<br>Title:" + json.title + "<br>" +
						json.description + "</span>");
				}
				if (json.html) {
					$("[toot-id=" + id + "] .additional").html(json.html);

				}
				if (json.title) {
					$("[toot-id=" + id + "] a:not(.parsed)").addClass("parsed");
					$("[toot-id=" + id + "]").addClass("parsed");
				}
			});
		}else{
			$(this).attr("title",text);
		}
	});
	$("#timeline_" + tlid + " .toot:not(:has(a:not(.add-show)))").each(function(i, elem) {
		$(this).parent().find(".add-show").hide();
	});
	//Markdownイメージビューワー
	$("#timeline_" + tlid + " .toot a:not(.img-parsed):has(img)").each(function(i, elem) {
			var ilink=$(this).attr("href");
			var id = $(this).parents('.cvo').attr("toot-id");
			$(this).attr("href","#");
			$(this).attr("onclick","imgv('"+id+"','"+i+"')");
			$(this).attr("data-type","image");
			$(this).attr("id",id+"-image-"+i);
			$(this).attr("data-url",ilink);
			$(this).addClass("img-parsed");
	});
}

function additionalIndv(tlid, acct_id, id) {
		var domain = localStorage.getItem("domain_" + acct_id);
		var at = localStorage.getItem(domain + "_at");
		var text = $("[toot-id="+id+"] .toot a").attr('href');
		var urls = text.match(
			/https?:\/\/([-a-zA-Z0-9@.]+)\/media\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/
		);
		if (urls) {
			$("[toot-id="+id+"] .toot a").remove();
		} else {

			var id = $("[toot-id="+id+"] .toot a").parents('.cvo').attr("toot-id");
			var start = "https://" + domain + "/api/v1/statuses/" + id + "/card";
			fetch(start, {
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					'Authorization': 'Bearer ' + at
				},
				//body: JSON.stringify({})
			}).then(function(response) {
				return response.json();
			}).catch(function(error) {
				todo(error);
				console.error(error);
			}).then(function(json) {
				console.log(json);
				if (json.title) {
					$("[toot-id=" + id + "] .additional").html(
						"<span class=\"gray\">URLチェック:<br>Title:" + json.title + "<br>" +
						json.description + "</span>");
				}
				if (json.html) {
					$("[toot-id=" + id + "] .additional").html(json.html);

				}
				if (json.title) {
					$("[toot-id=" + id + "] a:not(.parsed)").addClass("parsed");
					$("[toot-id=" + id + "]").addClass("parsed");
				}
			});
		}
}

//各TL上方のLink[On/Off]
function cardToggle(tlid) {
	var card = localStorage.getItem("card_" + tlid);
	if (!card) {
		localStorage.setItem("card_" + tlid, "true");
		$("#sta-card-" + tlid).text("Off");
	} else {
		localStorage.removeItem("card_" + tlid);
		$("#sta-card-" + tlid).text("On");
	}
}
//各TL上方のLink[On/Off]をチェック
function cardCheck(tlid) {
	var card = localStorage.getItem("card_" + tlid);
	if (!card) {
		$("#sta-card-" + tlid).text("On");
	} else {
		$("#sta-card-" + tlid).text("Off");
	}
}
