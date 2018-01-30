$(function($) {
	//キーボードショートカット
	$(window).keydown(function(e) {
		var hasFocus = $('input').is(':focus');
		var hasFocus2 = $('textarea').is(':focus');
		//Ctrl+Enter:投稿
		if (event.ctrlKey) {
			if (e.keyCode === 13) {
				post();
				return false;
			}
		}
		//Esc:消す
		if (e.keyCode === 27) {
			hide();
			return false;
		}
		//Esc:消す
		if (e.keyCode === 116) {
			location.href = "index.html";
			return false;
		}
		//input/textareaにフォーカスなし時
		if (!hasFocus && !hasFocus2) {
			//X:開閉
			if (e.keyCode === 88) {
				if ($("#post-box").hasClass("hidenbox")) {
					show();
					$('textarea').focus();
				} else {
					hide();
				}
				return false;
			}
			//N:新トゥート
			if (e.keyCode === 78) {
				if ($("#post-box").hasClass("hidenbox")) {
					show();
				}
				$('textarea').focus();
				return false;
			}
			//E:拡張On/Off
			if (e.keyCode === 69) {
				zoomBox();
				return false;
			}
			//Ctrl+Space:読み込み
			if (event.ctrlKey) {
				if (e.keyCode === 32) {
					parseColumn();
					return false;
				}
			}
			//Sift+C:全消し
			if (event.shiftKey) {
				if (e.keyCode === 67) {
					clear();
					return false;
				}
			}
		}
		//textareaフォーカス時
		if (hasFocus2) {
			if (event.ctrlKey) {
				//Ctrl+B:太字
				if (e.keyCode === 66) {
					tagsel('b');
					return false;
				}
				//Ctrl+I:斜字
				if (e.keyCode === 73) {
					tagsel('i');
					return false;
				}
				//Ctrl+U:下線
				if (e.keyCode === 85) {
					tagsel('u');
					return false;
				}
				//Ctrl+S:取り消し線
				if (e.keyCode === 83) {
					tagsel('s');
					return false;
				}
			}
		}
		//37,39
		if (e.keyCode === 37) {
			if ($("#imagemodal").hasClass("open")) {
				imgCont('prev');
				return false;
			}
		}
		if (e.keyCode === 39) {
			if ($("#imagemodal").hasClass("open")) {
				imgCont('next');
				return false;
			}
		}
	});
	//クリアボタン
	$("#clear").click(function() {
		clear();
	});
});
