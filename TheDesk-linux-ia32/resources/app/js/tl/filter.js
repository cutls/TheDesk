//各TL上方のMedia[On/Off]
function mediaToggle(tlid) {
	var media = localStorage.getItem("media_" + tlid);
	if (media) {
        localStorage.removeItem("media_" + tlid);
		$("#sta-media-" + tlid).text("Off");
        $("#sta-media-" + tlid).css("color",'red');
        $("#timeline_"+tlid).removeClass("media-filter")
	} else {
		localStorage.setItem("media_" + tlid, "true");
		$("#sta-media-" + tlid).text("On");
        $("#sta-media-" + tlid).css("color",'#009688');
        $("#timeline_"+tlid).addClass("media-filter")
	}
}
//各TL上方のMedia[On/Off]をチェック
function mediaCheck(tlid) {
	var media = localStorage.getItem("media_" + tlid);
	if (media) {
		$("#sta-media-" + tlid).text("On");
        $("#sta-media-" + tlid).css("color",'#009688');
        $("#timeline_"+tlid).addClass("media-filter")
	} else {
		$("#sta-media-" + tlid).text("Off");
        $("#sta-media-" + tlid).css("color",'red');
        $("#timeline_"+tlid).removeClass("media-filter")
	}
}
