/*イメージビューワー*/
//postのimg.jsとは異なります。
function imgv(id, key) {
	$('#imgmodal').attr('src', './img/loading.svg');
	var murl = $("#" + id + "-image-" + key).attr("data-url");
	var type = $("#" + id + "-image-" + key).attr("data-type");
	$(document).ready(function() {
		if (type == "image") {
			$('#imgmodal').attr('src', murl);
			$('#imagewrap').dragScroll(); // ドラッグスクロール設定
			$('#imagemodal').modal('open');
			$('#imagemodal').attr('data-key', key);
			$('#imagemodal').attr('data-id', id);
		} else if (type == "video" || type == "gifv") {
			$('#video').attr('src', murl);
			$('#videomodal').modal('open');
		}
		var element = new Image();
		var width;
		element.onload = function() {
			var width = element.naturalWidth;
			var height = element.naturalHeight;
			$("#imgmodal").attr('width', width);
			$("#imagemodal").css('height', "calc(100vh - 20px)");
		}
		if ($("#" + id + "-image-" + (key * 1 + 1)).length == 0) {
			$("#image-next").prop("disabled", true);
		}
		if ($("#" + id + "-image-" + (key * 1 - 1)).length == 0) {
			$("#image-prev").prop("disabled", true);
		}
		element.src = murl;
	});
}
//イメージビューワーの送り
function imgCont(type) {
	var key = $('#imagemodal').attr('data-key');
	var id = $('#imagemodal').attr('data-id');

	if (type == "next") {
		key++;
	} else if (type == "prev") {
		key = key * 1 - 1;
	}
	$('#imgmodal').attr('src', './img/loading.svg');
	var murl = $("#" + id + "-image-" + key).attr("data-url");
	var type = $("#" + id + "-image-" + key).attr("data-type");
	$(document).ready(function() {
		if (type == "image") {
			$('#imgmodal').attr('src', murl);
			$('#imagewrap').dragScroll(); // ドラッグスクロール設定
			$('#imagemodal').attr('data-key', key);
			$('#imagemodal').attr('data-id', id);
		} else if (type == "video" || type == "gifv") {
			$('#video').attr('src', murl);
			$('#videomodal').modal('open');
		}
		var element = new Image();
		var width;
		element.onload = function() {
			var width = element.naturalWidth;
			var height = element.naturalHeight;
			$("#imgmodal").attr('width', width);
			$("#imagemodal").css('height', "calc(100vh - 20px)");
		}
		if ($("#" + id + "-image-" + (key * 1 + 1)).length == 0) {
			$("#image-next").prop("disabled", true);
		} else {
			$("#image-next").prop("disabled", false);
		}
		console.log("#" + id + "-image-" + (key * 1 - 1));
		if ($("#" + id + "-image-" + (key * 1 - 1)).length == 0) {
			$("#image-prev").prop("disabled", true);
		} else {
			$("#image-prev").prop("disabled", false);
		}
		element.src = murl;
	});
}
//ズームボタン(z:倍率)
function zoom(z) {
	var wdth = $('#imagewrap img').width();
	var wdth = wdth * z;
	$('#imagewrap img').attr("width", wdth);
}
//スマホ対応ドラッグ移動システム
(function() {
	$.fn.dragScroll = function() {
		var target = this;
		$(this).mousedown(function(event) {
			$(this)
				.data('down', true)
				.data('x', event.clientX)
				.data('y', event.clientY)
				.data('scrollLeft', this.scrollLeft)
				.data('scrollTop', this.scrollTop);
			return false;
		}).css({
			'overflow': 'hidden', // スクロールバー非表示
			'cursor': 'move'
		});
		// ウィンドウから外れてもイベント実行
		$(document).mousemove(function(event) {
			if ($(target).data('down') == true) {
				// スクロール
				target.scrollLeft($(target).data('scrollLeft') + $(target).data('x') -
					event.clientX);
				target.scrollTop($(target).data('scrollTop') + $(target).data('y') -
					event.clientY);
				return false; // 文字列選択を抑止
			}
		}).mouseup(function(event) {
			$(target).data('down', false);
		});
		$(this).on('touchstart', function(event) {
			$(this)
				.data('down', true)
				.data('x', getX(event))
				.data('y', getY(event))
				.data('scrollLeft', this.scrollLeft)
				.data('scrollTop', this.scrollTop);
			return false;
		}).css({
			'overflow': 'hidden', // スクロールバー非表示
			'cursor': 'move'
		}); //指が触れたか検知
		$(this).on('touchmove', function(event) {
			if ($(target).data('down') == true) {
				// スクロール
				console.log($(target).data('x'));
				target.scrollLeft($(target).data('scrollLeft') + $(target).data('x') -
					getX(event));
				target.scrollTop($(target).data('scrollTop') + $(target).data('y') -
					getY(event));
				return false; // 文字列選択を抑止
			} else {}
		}); //指が動いたか検知
		$(this).on('touchend', function(event) {
			$(target).data('down', false);
		});

		return this;
	}
})(jQuery);

function getX(event) {
	return event.originalEvent.touches[0].pageX;
}

function getY(event) {
	return event.originalEvent.touches[0].pageY;
}
//マウスホイールで拡大
var element = document.getElementById("imagemodal");
element.onmousewheel = function(e) {
	var delta = e.wheelDelta;
	if (delta > 0) {
		zoom(1.1)
	} else {
		zoom(0.9)
	}
}
