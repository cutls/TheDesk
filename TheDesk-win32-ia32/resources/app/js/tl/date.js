//日付パーサー
function date(str, datetype) {
	if (datetype == "relative") {
		return '<time class="timeago" datetime="' + str + '"></time>';
	} else {
		var date = new Date(str);
		if (datetype == "unix") {
			var unixm = date.getTime();
			return Math.floor(unixm / 1000);
		}
		var now = new Date();
		var month = date.getMonth() + 1;
		if (date.getMinutes() < 10) {
			var min = "0" + date.getMinutes();
		} else {
			var min = date.getMinutes();
		}
		if (date.getSeconds() < 10) {
			var sec = "0" + date.getSeconds();
		} else {
			var sec = date.getSeconds();
		}
		if (datetype == "full") {
			var ret = date.getFullYear() + "年" + month + "月" + date.getDate() + "日 " +
				date.getHours() + ":" + min + ":" + sec;
		}
		if (date.getFullYear() == now.getFullYear()) {
			if (date.getMonth() == now.getMonth()) {
				if (date.getDate() == now.getDate()) {
					if (datetype == "medium") {
						var ret = '<time class="timeago" datetime="' + str + '"></time>';
					} else {
						var ret = date.getHours() + ":" + min + ":" + sec;
					}

				} else {
					var ret = month + "月" + date.getDate() + "日 " + date.getHours() + ":" +
						min + ":" + sec;
				}
			} else {
				var ret = month + "月" + date.getDate() + "日 " + date.getHours() + ":" + min +
					":" + sec;
			}
		} else {
			var ret = date.getFullYear() + "年" + month + "月" + date.getDate() + "日 " +
				date.getHours() + ":" + min + ":" + sec;
		}
		if (datetype == "double") {
			return '<time class="timeago" datetime="' + str + '"></time>/' + ret;
		} else {
			return ret;
		}
	}
}

//特殊フォーマット(インスタンス情報で利用)
function crat(str) {
	var date = new Date(str);

	format_str = 'YYYY-MM-DD hh:mm:ss';
	format_str = format_str.replace(/YYYY/g, date.getFullYear());
	format_str = format_str.replace(/MM/g, date.getMonth()+1);
	format_str = format_str.replace(/DD/g, date.getDate());
	format_str = format_str.replace(/hh/g, date.getHours());
	format_str = format_str.replace(/mm/g, date.getMinutes());
	format_str = format_str.replace(/ss/g, date.getSeconds());

	return format_str;
}
