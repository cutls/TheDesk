//日付パーサー
function date(str, datetype) {
	if (datetype == "relative") {
		return '<time class="timeago" datetime="' + str + '"></time>'
	} else {
		var date = new Date(str)
		if (datetype == "unix") {
			var unixm = date.getTime()
			return Math.floor(unixm / 1000)
		}
		var now = new Date()
		var month = date.getMonth() + 1
		if (date.getMinutes() < 10) {
			var min = "0" + date.getMinutes()
		} else {
			var min = date.getMinutes()
		}
		var sec = null
		if (date.getSeconds() < 10) {
			sec = "0" + date.getSeconds()
		} else {
			sec = date.getSeconds()
		}
		if (datetype == "full") {
			var ret = date.getFullYear() + "/" + month + "/" + date.getDate() + "/ " +
				date.getHours() + ":" + min + ":" + sec
		}
		if (date.getFullYear() == now.getFullYear()) {
			if (date.getMonth() == now.getMonth()) {
				if (date.getDate() == now.getDate()) {
					if (datetype == "medium") {
						var ret = '<time class="timeago" datetime="' + str + '"></time>'
					} else {
						var ret = date.getHours() + ":" + min + ":" + sec
					}

				} else {
					var ret = month + "/" + date.getDate() + " " + date.getHours() + ":" +
						min + ":" + sec
				}
			} else {
				var ret = month + "/" + date.getDate() + " " + date.getHours() + ":" + min +
					":" + sec
			}
		} else {
			var ret = date.getFullYear() + "/" + month + "/" + date.getDate() + " " +
				date.getHours() + ":" + min + ":" + sec
		}
		if (datetype == "double") {
			return '<time class="timeago" datetime="' + str + '"></time>/' + ret
		} else {
			return ret
		}
	}
}

//特殊フォーマット(インスタンス情報で利用)
function crat(str) {
	var date = new Date(str)
	var mnt = null
	if (date.getMonth() < 9) {
		mnt = "0" + (date.getMonth() + 1)
	} else {
		mnt = date.getMonth() + 1
	}
	if (date.getDate() < 10) {
		var dat = "0" + date.getDate()
	} else {
		var dat = date.getDate()
	}
	if (date.getHours() < 10) {
		var hrs = "0" + date.getHours()
	} else {
		var hrs = date.getHours()
	}
	if (date.getMinutes() < 10) {
		var mns = "0" + date.getMinutes()
	} else {
		var mns = date.getMinutes()
	}
	if (date.getSeconds() < 10) {
		var sec = "0" + date.getSeconds()
	} else {
		var sec = date.getSeconds()
	}
	format_str = 'YYYY-MM-DD hh:mm:ss'
	format_str = format_str.replace(/YYYY/g, date.getFullYear())
	format_str = format_str.replace(/MM/g, mnt)
	format_str = format_str.replace(/DD/g, dat)
	format_str = format_str.replace(/hh/g, hrs)
	format_str = format_str.replace(/mm/g, mns)
	format_str = format_str.replace(/ss/g, sec)

	return format_str
}
