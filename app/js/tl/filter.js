/*メディアフィルター機能*/
//各TL上方のMedia[On/Off]
function mediaToggle(tlid) {
	var media = localStorage.getItem("media_" + tlid);
	if (media) {
		localStorage.removeItem("media_" + tlid);
		$("#sta-media-" + tlid).text("Off");
		$("#sta-media-" + tlid).css("color", 'red');
		$("#timeline_" + tlid).removeClass("media-filter")
	} else {
		localStorage.setItem("media_" + tlid, "true");
		$("#sta-media-" + tlid).text("On");
		$("#sta-media-" + tlid).css("color", '#009688');
		$("#timeline_" + tlid).addClass("media-filter")
	}
}
//各TL上方のBT[BTOnly/BTExc/Off]
function ebtToggle(tlid) {
	var ebt = localStorage.getItem("ebt_" + tlid);
	if (ebt == "true") {
		localStorage.setItem("ebt_" + tlid, "but");
		$("#sta-bt-" + tlid).text("BT Only");
		$("#sta-bt-" + tlid).css("color", '#ff9800');
		$("#timeline_" + tlid).addClass("except-bt-filter")
		$("#timeline_" + tlid).removeClass("bt-filter")
	} else if (ebt == "but") {
		localStorage.removeItem("ebt_" + tlid);
		$("#sta-bt-" + tlid).text("Off");
		$("#sta-bt-" + tlid).css("color", 'red');
		$("#timeline_" + tlid).removeClass("bt-filter")
		$("#timeline_" + tlid).removeClass("except-bt-filter")
	} else {
		localStorage.setItem("ebt_" + tlid, "true");
		$("#sta-bt-" + tlid).text("BT Ex");
		$("#sta-bt-" + tlid).css("color", '#009688');
		$("#timeline_" + tlid).addClass("bt-filter")
		$("#timeline_" + tlid).removeClass("except-bt-filter")
	}
}
//各TL上方のMedia[On/Off]をチェック
function mediaCheck(tlid) {
	var media = localStorage.getItem("media_" + tlid);
	if (media) {
		$("#sta-media-" + tlid).text("On");
		$("#sta-media-" + tlid).css("color", '#009688');
		$("#timeline_" + tlid).addClass("media-filter")
	} else {
		$("#sta-media-" + tlid).text("Off");
		$("#sta-media-" + tlid).css("color", 'red');
		$("#timeline_" + tlid).removeClass("media-filter")
	}
}
//各TL上方のBT[On/Off]をチェック
function ebtCheck(tlid) {
	var ebt = localStorage.getItem("ebt_" + tlid);
	if (ebt == "true") {
		$("#sta-bt-" + tlid).text("BT Ex");
		$("#sta-bt-" + tlid).css("color", '#009688');
		$("#timeline_" + tlid).addClass("bt-filter")
		$("#timeline_" + tlid).removeClass("except-bt-filter")
	} else if (ebt == "but") {
		$("#sta-bt-" + tlid).text("BT Only");
		$("#sta-bt-" + tlid).css("color", '#ff9800');
		$("#timeline_" + tlid).addClass("except-bt-filter")
		$("#timeline_" + tlid).removeClass("bt-filter")
	} else {
		$("#sta-bt-" + tlid).text("Off");
		$("#sta-bt-" + tlid).css("color", 'red');
		$("#timeline_" + tlid).removeClass("bt-filter")
		$("#timeline_" + tlid).removeClass("except-bt-filter")
	}
}
/* 削除追跡*/
function catchToggle(tlid) {
	var catchck = localStorage.getItem("catch_" + tlid);
	if (catchck) {
		localStorage.removeItem("catch_" + tlid);
		$("#sta-del-" + tlid).text("Off");
		$("#sta-del-" + tlid).css("color", 'red');
		parseColumn(tlid);
	} else {
		localStorage.setItem("catch_" + tlid, "true");
		$("#sta-del-" + tlid).text("On");
		$("#sta-del-" + tlid).css("color", '#009688');
		parseColumn(tlid);
	}
}
function catchCheck(tlid) {
	var catchck = localStorage.getItem("catch_" + tlid);
	if (catchck) {
		$("#sta-del-" + tlid).text("On");
		$("#sta-del-" + tlid).css("color", '#009688');
	} else {
		$("#sta-del-" + tlid).text("Off");
		$("#sta-del-" + tlid).css("color", 'red');
	}
}
function delreset(tlid) {
	$("[tlid=" + tlid + "] .by_delcatch").hide();
	$("[tlid=" + tlid + "] .by_delcatch").remove();

}
/*ワードフィルター機能*/
function filterMenu() {
	$("#left-menu div").removeClass("active");
	$("#filterMenu").addClass("active");
	$(".menu-content").addClass("hide");
	$("#filter-box").removeClass("hide");
}
function filter() {
	$("#filtered-words").html("");
	$("#filter-edit-id").val("")
	var acct_id = $("#filter-acct-sel").val();
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/filters"
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function (response) {
		return response.json();
	}).catch(function (error) {
		todo(error);
		console.error(error);
	}).then(function (json) {
		if (json) {
			var filters = "";
			Object.keys(json).forEach(function (key) {
				var filterword = json[key];
				var context = filterword.context.join(',');
				filters = filters + escapeHTML(filterword.phrase) + '<span class="sml">(for ' + context + ')</span>:<a onclick="filterEdit(\'' + filterword.id + '\',\'' + acct_id +
					'\')" class="pointer">' + lang.lang_edit + '</a>/<a onclick="filterDel(' + filterword.id + ',' + acct_id +
					')" class="pointer">' + lang.lang_del + '</a><br> ';
			});
			if (filters == "") {
				filters = lang.lang_filter_nodata + "<br>";
			}
			$("#filtered-words").html(filters);
		} else {
			$("#filtered-words").html(lang_filter_nodata);
		}
	});
}
function filterTime(day, hour, min) {
	$("#days_filter").val(day)
	$("#hours_filter").val(hour)
	$("#mins_filter").val(min)
}
function makeNewFilter() {
	var acct_id = $("#filter-acct-sel").val();
	var phr = $("#filter-add-word").val();
	var cont = [];
	if ($("#home_filter:checked").val()) {
		cont.push("home");
	}
	if ($("#local_filter:checked").val()) {
		cont.push("public");
	}
	if ($("#notf_filter:checked").val()) {
		cont.push("notifications");
	}
	if ($("#conv_filter:checked").val()) {
		cont.push("thread");
	}
	if (!cont.length) {
		$("#filtered-words").html('Error:' + lang.lang_filter_errordegree);
	}
	var exc = $("#except_filter:checked").val();
	var who = $("#wholeword_filter:checked").val();
	if (!who) {
		who = false;
	}
	var time = $("#days_filter").val() * 24 * 60 * 60 + $("#hours_filter").val() * 60 * 60 + $("#mins_filter").val() * 60;
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if ($("#filter-edit-id").val()) {
		var start = "https://" + domain + "/api/v1/filters/" + $("#filter-edit-id").val();
		var method = "PUT"
	} else {
		var start = "https://" + domain + "/api/v1/filters"
		var method = "POST"
	}

	var httpreq = new XMLHttpRequest();
	httpreq.open(method, start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send(JSON.stringify({
		phrase: phr,
		context: cont,
		irreversible: exc,
		whole_word: who,
		expires_in: time
	}));
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			filter();
			filterUpdate(acct_id)
			$("#filter-add-word").val("");
			$("#home_filter").prop("checked", false);
			$("#local_filter").prop("checked", false);
			$("#notf_filter").prop("checked", false);
			$("#conv_filter").prop("checked", false);
			$("#except_filter").prop("checked", false);
			$("#wholeword_filter").prop("checked", false);
			$("#days_filter").val("0");
			$("#hours_filter").val("0");
			$("#mins_filter").val("0");
			$("#add-filter-btn").text(lang.lang_add);
			$("#filter-edit-id").val("")
		}
	}
}
function filterEdit(id, acct_id) {
	$("#filter-add-word").val("");
	$("#home_filter").prop("checked", false);
	$("#local_filter").prop("checked", false);
	$("#notf_filter").prop("checked", false);
	$("#conv_filter").prop("checked", false);
	$("#except_filter").prop("checked", false);
	$("#wholeword_filter").prop("checked", false);
	$("#days_filter").val("0");
	$("#hours_filter").val("0");
	$("#mins_filter").val("0");
	$("#add-filter-btn").text(lang.lang_edit);
	$("#filter-edit-id").val(id);
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/filters/" + id
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function (response) {
		return response.json();
	}).catch(function (error) {
		todo(error);
		console.error(error);
	}).then(function (json) {
		if (json) {
			var now = new Date();
			now = now.getTime();
			var now = Math.floor(now / 1000);
			$("#filter-add-word").val(json.phrase);
			Object.keys(json.context).forEach(function (key) {
				var context = json.context[key];
				$("[value=" + context + "]").prop("checked", true);
			});
			if (json.irreversible) {
				$("#except_filter").prop("checked", true);
			}
			if (json.whole_word) {
				$("#wholeword_filter").prop("checked", true);
			}
			var expires = date(json.expires_at, 'unix') - now;
			var mins = Math.floor(expires / 60) % 60;
			var hours = Math.floor(expires / 3600) % 24;
			var days = Math.floor(expires / 3600 / 24);
			$("#days_filter").val(days);
			$("#hours_filter").val(hours);
			$("#mins_filter").val(mins);
		}
	});
}
function filterDel(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/filters/" + id;
	var httpreq = new XMLHttpRequest();
	httpreq.open("DELETE", start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send();
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			filter();
			filterUpdate(acct_id)
		}
	}
}
function getFilter(acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (localStorage.getItem("mode_" + domain) != "misskey") {
		var start = "https://" + domain + "/api/v1/filters"
		fetch(start, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + at
			},
		}).then(function (response) {
			return response.json();
		}).catch(function (error) {
			todo(error);
			console.error(error);
		}).then(function (json) {
			localStorage.setItem("filter_" + acct_id, JSON.stringify(json));
		});
	} else {
		localStorage.setItem("filter_" + acct_id, JSON.stringify({}));
	}
}
function getFilterType(json, type) {
	if (!json) {
		return [];
	}
	if (type == "local") {
		type = "public";
	} else if (type == "list") {
		type = "home";
	} else if (type == "notf") {
		type = "notifi";
	}
	var mutedfilters = [];
	Object.keys(json).forEach(function (key) {
		var filterword = json[key];
		var phrases = filterword.phrase;
		if (filterword.context.join(",").indexOf(type) !== -1) {
			mutedfilters.push(phrases);
		}
	});
	return mutedfilters;
}
function filterUpdate(acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/filters"
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function (response) {
		return response.json();
	}).catch(function (error) {
		todo(error);
		console.error(error);
	}).then(function (json) {
		localStorage.setItem("filter_" + acct_id, JSON.stringify(json));
		filterUpdateInternal(json, "home");
		filterUpdateInternal(json, "local");
		filterUpdateInternal(json, "notf");
		filterUpdateInternal(json, "pub");
	});


}
function filterUpdateInternal(json, type) {
	var home = getFilterType(json, type);
	var wordmute = localStorage.getItem("word_mute");
	if (wordmute) {
		var wordmute = JSON.parse(wordmute);
		home = home.concat(wordmute);
	}
	if (home) {
		$("[data-acct=" + acct_id + "] [data-type=" + type + "] .cvo").each(function (i, elem) {
			var id = $(elem).attr("toot-id");
			$("[toot-id=" + id + "]").removeClass("hide");
			var text = $(elem).find('.toot').html();
			Object.keys(home).forEach(function (key8) {
				var word = home[key8];
				var regExp = new RegExp(word.replace(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&"), "g");
				if ($.strip_tags(text).match(regExp)) {
					$("[toot-id=" + id + "]").addClass("hide");
				}
			});
		});
	}
}
/*
<a onclick="catchToggle(' + key +
		  ')" class="setting nex"><i class="material-icons waves-effect nex" title="削除捕捉(削除されても残ります。背景色が変化します。)">delete</i><span id="sta-del-' +
		  key + '">On</span></a>削除捕捉<a onclick="delreset(' + key +
		  ')" class="pointer">リセット</a><br>
*/
//通知フィルター
function exclude(key) {
	localStorage.setItem("exclude-" + key, "")
	var excludetxt = localStorage.getItem("exclude-" + key);
	if ($('#exc-reply-' + key + ':checked').val()) {
		excludetxt = "?exclude_types[]=mention"
	}
	if ($('#exc-fav-' + key + ':checked').val()) {
		if (excludetxt || excludetxt !="") {
			excludetxt = excludetxt + "&exclude_types[]=favourite"
		} else {
			excludetxt = "?exclude_types[]=favourite"
		}
	}
	if ($('#exc-bt-' + key + ':checked').val()) {
		if (excludetxt || excludetxt !="") {
			excludetxt = excludetxt + "&exclude_types[]=reblog"
		} else {
			excludetxt = "?exclude_types[]=reblog"
		}
	}
	if ($('#exc-follow-' + key + ':checked').val()) {
		if (excludetxt || excludetxt !="") {
			excludetxt = excludetxt + "&exclude_types[]=follow"
		} else {
			excludetxt = "?exclude_types[]=follow"
		}
	}
	if ($('#exc-poll-' + key + ':checked').val()) {
		if (excludetxt || excludetxt !="") {
			excludetxt = excludetxt + "&exclude_types[]=poll"
		} else {
			excludetxt = "?exclude_types[]=poll"
		}
	} else {
	}
	localStorage.setItem("exclude-" + key, excludetxt)
	parseColumn(key);
}
function excludeCk(key, target) {
	var exc = localStorage.getItem("exclude-" + key);
	if (!exc) {
		return "";
	}
	if (~exc.indexOf(target)) {
		return "checked"
	} else {
		return "";
	}
}
function checkNotfFilter(tlid){
	var excludetxt = localStorage.getItem("exclude-" + tlid);
	if(!excludetxt || excludetxt != ""){
		return true;
	}else{
		return false;
	}
}
function resetNotfFilter(tlid){
	localStorage.setItem("exclude-" + tlid, "")
	parseColumn(tlid);
}
function notfFilter(id,tlid,acct_id){
	var excludetxt = localStorage.getItem("exclude-" + tlid);
	if (excludetxt || excludetxt !="") {
		excludetxt = excludetxt + "&account_id="+id
	} else {
		excludetxt = "?account_id="+id
	}
	localStorage.setItem("exclude-" + tlid, excludetxt)
	parseColumn(tlid);
}