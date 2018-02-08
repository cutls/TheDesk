//レイアウトの設定

	var websocketOld = [];
	var websocket = [];
	var websocketHome = [];
	var websocketLocal = [];
	var websocketNotf = [];

	//カラム追加ボックストグル
	function addToggle() {
		$("#add-box").toggleClass("hide");
	}
//最初、カラム変更時に発火
	function parseColumn() {
		var multi = localStorage.getItem("multi");
		if (!multi) {
			var obj = [{
				at: localStorage.getItem(localStorage.getItem("domain_0") + "_at"),
				name: localStorage.getItem("name_0"),
				domain: localStorage.getItem("domain_0"),
				user: localStorage.getItem("user_0"),
				prof: localStorage.getItem("prof_0")
			}];
			var json = JSON.stringify(obj);
			localStorage.setItem("multi", json);
		} else {
			var obj = JSON.parse(multi);

			var templete;
			Object.keys(obj).forEach(function(key) {
				var acct = obj[key];
				localStorage.setItem("name_" + key, acct.name);
				localStorage.setItem("user_" + key, acct.user);
				localStorage.setItem("user-id_" + key, acct.user);
				localStorage.setItem("prof_" + key, acct.prof);
				localStorage.setItem("domain_" + key, acct.domain);
				localStorage.setItem(acct.domain + "_at", acct.at);
				ckdb(key);
			});
		}
		var col = localStorage.getItem("column");
		if (!col) {
			var obj = [{
				domain: 0,
				type: 'local'
			}];
			var json = JSON.stringify(obj);
			localStorage.setItem("column", json);
		} else {
			var obj = JSON.parse(col);
		}
		if ($("#timeline-container").length) {
			$("#timeline-container").html("");
		}
		tlCloser();
		Object.keys(obj).forEach(function(key) {
			var acct = obj[key];
			var html = '<div class="box" id="timeline_box_' + key + '_box" tlid="' + key +
				'"><div class="notice-box"><span id="notice_' + key + '"></span><br>' +
				'<a onclick="notfToggle(' + acct.domain + ',' + key +
				')" class="setting nex" title="このアカウントの通知"><i class="material-icons nex notf-icon_' +
				key + '">notifications</i></a>' +
				'<a onclick="removeColumn(' + key +
				')" class="setting nex"><i class="material-icons nex" title="このカラムを削除">remove_circle</i></a>' +
				'<a onclick="cardToggle(' + key +
				')" class="setting nex"><i class="material-icons nex" title="リンクの解析を切り替え(OFFで制限を回避出来る場合があります)">link</i><span id="sta-card-' +
				key + '">On</span></a><a onclick="goTop(' + key + ')" class="setting nex"><i class="material-icons nex" title="一番上へ">vertical_align_top</i></a>' +
				'<div class="hide notf-indv-box" id="notf-box_' + key +
				'"><div id="notifications_' + key +
				'"></div></div></div><div class="tl-box" tlid="' + key + '"><div id="timeline_' + key +
				'" class="tl" tlid="' + key + '"></div></div></div>';
			$("#timeline-container").append(html);
			if (acct.data) {
				var data = acct.data;
			} else {
				var data = "";
			}
			tl(acct.type, data, acct.domain, key);

			cardCheck(key);
		});
		var width = localStorage.getItem("width");
		if (width) {
			$(".box").css("min-width", width + "px");
		}
		var box = localStorage.getItem("box");
		if (box == "yes") {
			$("#post-box").addClass("hidenbox");
			$("#post-box").fadeOut();
			$("#menu-btn").fadeIn();
		}
		var vis = localStorage.getItem("vis");
		if (!vis) {
			$("#vis").text("public");
		} else {
			if (vis == "memory") {
				var memory = localStorage.getItem("vis-memory");
				if (!memory) {
					memory = "public";
				}
				$("#vis").text(memory);
			} else {
				$("#vis").text(vis);
			}
		}
	}
//カラム追加
	function addColumn() {
		var acct = $("#add-acct-sel").val();
		localStorage.setItem("last-use", acct);
		var type = $("#type-sel").val();
		var add = {
			domain: acct,
			type: type
		};
		var multi = localStorage.getItem("column");
		var obj = JSON.parse(multi);
		localStorage.setItem("card_" + obj.length,"true");
		obj.push(add);
		var json = JSON.stringify(obj);
		localStorage.setItem("column", json);
		parseColumn();
	}
//カラム削除
	function removeColumn(tlid) {
		var multi = localStorage.getItem("column");
		var obj = JSON.parse(multi);
		//聞く
		if (confirm("このコラムを削除します")) {
			localStorage.removeItem("card_" + tlid);
			obj.splice(tlid, 1);
			var json = JSON.stringify(obj);
			localStorage.setItem("column", json);
			parseColumn();
		}
	}
