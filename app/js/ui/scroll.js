//スクロールで続きを読む
function scrollevent() {
	$(".tl-box").scroll(function() {
		scrollck();
	});
}
scrollevent();

function scrollck() {
	$(".tl-box").each(function(i, elem) {
		var tlid = $(this).attr('tlid');
		//一番上ならためていた新しいトゥートを表示
		if ($(this).scrollTop() == 0) {
			var pool = localStorage.getItem("pool_" + tlid);
			if (pool) {
				$("#timeline_" + tlid).prepend(pool);
				jQuery("time.timeago").timeago();
				localStorage.removeItem("pool_" + tlid);
			}
		}
		//続きを読むトリガー
		var scrt = $(this).find(".tl").height() - 1000;
		var scr = $(this).scrollTop();
		if (scr > scrt) {
			moreload('', tlid);
		}
	});
}

function goTop(id){
	$("#timeline_"+id+"_box .tl-box").scrollTop(0)
}