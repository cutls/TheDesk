selectedColumn = 0
selectedToot = 0
$(function ($) {
	//キーボードショートカット
	$(window).keydown(function (e) {
		var hasFocus = $('input').is(':focus');
		var hasFocus2 = $('textarea').is(':focus');
		if (document.getElementById("webview")) {
			if ($("#webviewsel:checked").val()) {
				var wv = false;
			} else {
				var wv = true;
			}
		} else {
			var wv = true;
		}
		//Ctrl+Shift+Enter:Lgen
		if (event.metaKey || event.ctrlKey && wv) {
			if (event.shiftKey) {
				if (e.keyCode === 13) {
					post('local');
					return false;
				}
			}
		}
		//Ctrl+Enter:投稿
		if (event.metaKey || event.ctrlKey && wv) {
			if (e.keyCode === 13) {
				post();
				return false;
			}
		}
		//Alt+Enter:セカンダリー
		if (event.metaKey || event.altKey && wv) {
			if (e.keyCode === 13) {
				sec();
				return false;
			}
		}
		//Esc:消す
		if (e.keyCode === 27 && wv) {
			hide();
			return false;
		}
		//F5リロード
		if (e.keyCode === 116 && wv) {
			location.href = "index.html";
			return false;
		}
		//Ctrl+Sift+C:全消し
		if (((event.metaKey || event.ctrlKey) && event.shiftKey) && wv) {
			if (e.keyCode === 67) {
				clear();
				return false;
			}
		}
		//Ctrl+Sift+N:NowPlaying
		if (((event.metaKey || event.ctrlKey) && event.shiftKey) && wv) {
			if (e.keyCode === 78) {
				show();
				nowplaying()
				return false;
			}
		}
		//input/textareaにフォーカスなし時
		if ((!hasFocus && !hasFocus2) && wv) {
			if (!wv) {
				return true;
			}
			//Ctrl+V:いつもの
			if (event.metaKey || event.ctrlKey) {
				if (e.keyCode === 86) {
					show();
				}
			}
			//X:開閉
			if (e.keyCode === 88) {
				if (!$("#post-box").hasClass("appear")) {
					show();
					$('textarea').focus();
				} else {
					hide();
				}
				return false;
			}
			//N:新トゥート
			if (e.keyCode === 78) {
				if (!$("#post-box").hasClass("appear")) {
					show();
				}
				$('textarea').focus();
				return false;
			}
			//Ctrl+E:全ての通知未読を既読にする
			if (event.metaKey || event.ctrlKey) {
				if (e.keyCode === 69) {
					allNotfRead();
					return false;
				}
			}
			//Ctrl+Space:読み込み
			if (event.metaKey || event.ctrlKey) {
				if (e.keyCode === 32) {
					parseColumn();
					return false;
				}
			}
			//Ctrl+Sift+S:設定
			if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
				if (e.keyCode === 83) {
					location.href = "setting.html";
					return false;
				}
			}
			//Ctrl+Sift+M:アカマネ
			if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
				if (e.keyCode === 77) {
					location.href = "acct.html";
					return false;
				}
			}
			//Ctrl+Sift+P:プロフ
			if ((event.ctrlKey) && event.shiftKey) {
				if (e.keyCode === 80) {
					profShow()
					return false;
				}
			}
			//数字:TL
			if (event.metaKey || event.ctrlKey) {
				if (e.keyCode >= 49 && e.keyCode <= 57) {
					var kz = e.keyCode - 49;
					goColumn(kz);
					return false;
				}
			}
			//矢印:選択
			if (e.code == "ArrowLeft") {
				//left
				if (selectedColumn > 0) {
					selectedColumn--
				}
				tootSelector(selectedColumn, selectedToot)
				return false;
			} else if (e.code == "ArrowUp") {
				//up
				if (selectedToot > 0) {
					selectedToot--
				}
				tootSelector(selectedColumn, selectedToot)
				return false;
			} else if (e.code == "ArrowRight") {
				//right
				if (selectedColumn < $(".tl-box").length - 1) {
					selectedColumn++
				}
				tootSelector(selectedColumn, selectedToot)
				return false;
			} else if (e.code == "ArrowDown") {
				//down
				selectedToot++
				tootSelector(selectedColumn, selectedToot)
				return false;
			}
			//選択時
			if (e.keyCode == 70) {
				var id = $(".selectedToot").attr('unique-id')
				var acct_id = $('#timeline_' + selectedColumn).attr("data-acct")
				fav(id, acct_id, false)
				return false;
			}
			if (e.keyCode == 66) {
				var id = $(".selectedToot").attr('unique-id')
				var acct_id = $('#timeline_' + selectedColumn).attr("data-acct")
				rt(id, acct_id, false)
				return false;
			}
			if (e.keyCode == 82) {
				var id = $(".selectedToot").attr('unique-id')
				var acct_id = $('#timeline_' + selectedColumn).attr("data-acct")
				var ats_cm = $('.selectedToot .rep-btn').attr("data-men")
				var mode = $('.selectedToot .rep-btn').attr("data-visen")
				re(id, ats_cm, acct_id, mode)
				return false;
			}
		}
		//textareaフォーカス時
		if (hasFocus2 && wv) {
			if (event.metaKey || event.ctrlKey) {
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
				//C+S+(No):ワンクリ
				if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
					if (e.keyCode >= 49 && e.keyCode <= 51) {
						var no = e.keyCode - 48;
						if (localStorage.getItem("oks-" + no)) { $("#textarea").val($("#textarea").val() + localStorage.getItem("oks-" + no)) }
						return false;
					}
				}
			}
		}
		//イメージビューワー切り替え
		if (e.keyCode === 37 && wv) {
			if ($("#imagemodal").hasClass("open")) {
				imgCont('prev');
				return false;
			}
		}
		if (e.keyCode === 39 && wv) {
			if ($("#imagemodal").hasClass("open")) {
				imgCont('next');
				return false;
			}
		}
	});
	//クリアボタン
	$("#clear").click(function () {
		clear();
	});
});
//選択する
function tootSelector(column, toot) {
	$('.cvo').removeClass("selectedToot")
	$('#timeline_' + column + ' .cvo').eq(toot).addClass("selectedToot")
	var scr = $('.tl-box[tlid=' + column + ']').scrollTop()
	var elem = $('.selectedToot').offset().top
	var top = elem - $('.tl-box').height() + scr
	if (top > 0) {
		top = top + $('.selectedToot').height()
		if(top > scr){
			$('.tl-box[tlid=' + column + ']').animate({ scrollTop: top})
		}
	} else if (elem < 0) {
		var to = scr + elem - $('.selectedToot').height()
		if (to < scr) {
			$('.tl-box[tlid=' + column + ']').animate({ scrollTop: to })
		}
	}
}