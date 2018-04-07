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
			//自動リフレッシュ
			if( $("#timeline_" + tlid+" .cvo").length > 100 ){
				for(var i=100;i<$("#timeline_" + tlid +" .cvo").length;i++){
					$("#timeline_" + tlid +" .cvo").eq(i).remove();
				}
			}
		}
		//続きを読むトリガー
		var scrt = $(this).find(".tl").height() - $(window).height();
		var scr = $(this).scrollTop();
		if (scr > scrt) {
			moreload('', tlid);
		}
	});
}

function goTop(id){
	if ($("#timeline_box_"+id+"_box .tl-box").scrollTop() > 500){
		$("#timeline_box_"+id+"_box .tl-box").scrollTop(500)
	}
	$("#timeline_box_"+id+"_box .tl-box").animate({scrollTop:0});
}
function goColumn(key){
	if($('[tlid='+key+']').length){
		console.log($('[tlid='+key+']').offset().left);
		$("#timeline-container").animate({scrollLeft:$("#timeline-container").scrollLeft()+$('[tlid='+key+']').offset().left});
	}
}