/*イメージビューワー*/
//postのimg.jsとは異なります。
function imgv(id, key, acct_id) {
	$('#imgmodal').attr('src', './img/loading.svg');
	var murl = $("#" + id + "-image-" + key).attr("data-url");
	var type = $("#" + id + "-image-" + key).attr("data-type");
	$("#imagemodal").attr("data-id",id);
	$("#imagemodal").attr("data-acct",acct_id);
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
			var windowH = $(window).height();
			var windowW = $(window).width();
			var aspect = width/height;
			if (aspect < 2.8 && aspect > 0.3){
				//moderate
				if(windowW > windowH){
					//画面が横長(縦幅基準)
					$("#imgmodal").css('height',windowH/1.2-70+"px");
					var imgW = (windowH/1.2-70)/height*width;
					$("#imgmodal").css('width',imgW+"px");
					$("#imagewrap").css('height',windowH/1.2-60+"px");
					$("#imagemodal").css('height',windowH/1.2+"px");
					$("#imagewrap").css('width',imgW+50+"px");
					$("#imagemodal").css('width',imgW+50+"px");
				}else{
					//画面が縦長・正方形(横幅基準)
					$("#imgmodal").css('width',windowW/1.2-30+"px");
					var imgH = (windowW/1.2-30)/width*height;
					$("#imgmodal").css('height',imgH+"px");
					$("#imagewrap").css('width',windowW/1.2+"px");
					$("#imagemodal").css('width',windowW/1.2+"px");
					$("#imagewrap").css('height',imgH+60+"px");
					$("#imagemodal").css('height',imgH+120+"px");
				}
			}else{
				//極端な画像
				if(height > width){
					//縦長
					$("#imgmodal").css('height',windowH-60+"px");
					var imgW = (windowH-50)/height*width;
					$("#imgmodal").css('width',imgW+"px");
					$("#imagewrap").css('height',windowH-50+"px");
					$("#imagemodal").css('height',windowH+"px");
					$("#imagewrap").css('width',imgW+50+"px");
					$("#imagemodal").css('width',imgW+50+"px");
				}else{
					//横長・正方形
					$("#imgmodal").css('width',windowW-30+"px");
					var imgH = (windowW-50)/width*height;
					$("#imgmodal").css('height',imgH+"px");
					$("#imagewrap").css('width',windowW+"px");
					$("#imagemodal").css('width',windowW+"px");
					$("#imagewrap").css('height',imgH+60+"px");
					$("#imagemodal").css('height',imgH+120+"px");
				}
			}
		}
		if ($("#" + id + "-image-" + (key * 1 + 1)).length == 0) {
			$("#image-next").prop("disabled", true);
		} else {
			$("#image-next").prop("disabled", false);
		}
		if ($("#" + id + "-image-" + (key * 1 - 1)).length == 0) {
			$("#image-prev").prop("disabled", true);
		} else {
			$("#image-prev").prop("disabled", false);
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
	var murl = $("#" + id + "-image-" + key).attr("data-url");
	if(murl){
	$('#imgmodal').attr('src', './img/loading.svg');
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
			var windowH = $(window).height();
			var windowW = $(window).width();
			var aspect = width/height;
			if (aspect < 2.8 && aspect > 0.3){
				//moderate
				if(windowW > windowH){
					//画面が横長(縦幅基準)
					$("#imgmodal").css('height',windowH/1.2-70+"px");
					var imgW = (windowH/1.2-70)/height*width;
					$("#imgmodal").css('width',imgW+"px");
					$("#imagewrap").css('height',windowH/1.2-60+"px");
					$("#imagemodal").css('height',windowH/1.2+"px");
					$("#imagewrap").css('width',imgW+50+"px");
					$("#imagemodal").css('width',imgW+50+"px");
				}else{
					//画面が縦長・正方形(横幅基準)
					$("#imgmodal").css('width',windowW/1.2-30+"px");
					var imgH = (windowW/1.2-30)/width*height;
					$("#imgmodal").css('height',imgH+"px");
					$("#imagewrap").css('width',windowW/1.2+"px");
					$("#imagemodal").css('width',windowW/1.2+"px");
					$("#imagewrap").css('height',imgH+60+"px");
					$("#imagemodal").css('height',imgH+120+"px");
				}
			}else{
				//極端な画像
				if(height > width){
					//縦長
					$("#imgmodal").css('height',windowH-60+"px");
					var imgW = (windowH-50)/height*width;
					$("#imgmodal").css('width',imgW+"px");
					$("#imagewrap").css('height',windowH-50+"px");
					$("#imagemodal").css('height',windowH+"px");
					$("#imagewrap").css('width',imgW+50+"px");
					$("#imagemodal").css('width',imgW+50+"px");
				}else{
					//横長・正方形
					$("#imgmodal").css('width',windowW-30+"px");
					var imgH = (windowW-50)/width*height;
					$("#imgmodal").css('height',imgH+"px");
					$("#imagewrap").css('width',windowW+"px");
					$("#imagemodal").css('width',windowW+"px");
					$("#imagewrap").css('height',imgH+60+"px");
					$("#imagemodal").css('height',imgH+120+"px");
				}
			}
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
}
//ズームボタン(z:倍率)
function zoom(z) {
	var wdth = $('#imagewrap img').width();
	var wdth = wdth * z;
	$('#imagewrap img').css("width", wdth+"px");
	var hgt = $('#imagewrap img').height();
	var hgt = hgt * z;
	$('#imagewrap img').css("height", hgt+"px");
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
//当該トゥート
function detFromImg(){
	var id=$("#imagemodal").attr("data-id");
	var acct_id=$("#imagemodal").attr("data-acct");
	$('#imagemodal').modal('close');
	details(id,acct_id);
}
//画像保存
function dlImg(){
	var url=$("#imgmodal").attr("src");
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('general-dl', url);
	ipc.on('general-dl-prog', function (event, arg) {
		console.log(arg);
	})
	ipc.on('general-dl-message', function (event, arg) {
		console.log(arg);
	})
}