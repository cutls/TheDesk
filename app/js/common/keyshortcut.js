let selectedColumn = 0
let selectedToot = 0
$(function ($) {
	//キーボードショートカット
	$(window).keydown(function (e) {
		const hasFocus = isFocused('input')
		const hasFocus2 = isFocused('textarea')
		const postBox = document.querySelector('#textarea')
		let wv = false
		if (document.getElementById('webview')) {
			if (document.querySelector('#webviewsel:checked').value) {
				wv = false
			} else {
				wv = true
			}
		} else {
			wv = true
		}
		//Enter
		if (e.keyCode === 13) {
			if (isFocused('#src')) {
				src()
				return false
			}
			if (isFocused('#list-add')) {
				makeNewList()
				return false
			}
		}
		//Ctrl+Shift+Enter:Lgen
		if (event.metaKey || (event.ctrlKey && wv)) {
			if (event.shiftKey) {
				if (e.keyCode === 13) {
					post('local')
					return false
				}
			}
		}
		//Ctrl+Enter:投稿
		if (event.metaKey || (event.ctrlKey && wv)) {
			if (e.keyCode === 13) {
				post()
				return false
			}
		}
		//Alt+Enter:セカンダリー
		if (event.metaKey || (event.altKey && wv)) {
			if (e.keyCode === 13) {
				sec()
				return false
			}
		}
		//Esc:消す
		if (e.keyCode === 27 && wv) {
			hide()
			return false
		}
		//F5リロード
		if (e.keyCode === 116 && wv) {
			location.href = 'index.html'
			return false
		}
		//Ctrl+Sift+C:全消し
		if ((event.metaKey || event.ctrlKey) && event.shiftKey && wv) {
			if (e.keyCode === 67) {
				clear()
				return false
			}
		}
		//Ctrl+Sift+N:NowPlaying
		if ((event.metaKey || event.ctrlKey) && event.shiftKey && wv) {
			if (e.keyCode === 78) {
				show()
				nowplaying()
				return false
			}
		}
		//input/textareaにフォーカスなし時
		if (!hasFocus && !hasFocus2 && wv) {
			if (!wv) {
				return true
			}
			//Ctrl+V:いつもの
			if (event.metaKey || event.ctrlKey) {
				if (e.keyCode === 86) {
					show()
				}
			}
			//Ctrl+F:検索
			if (event.metaKey || event.ctrlKey) {
				if (e.keyCode === 70) {
					srcBox()
				}
			}
			//X:開閉
			if (e.keyCode === 88) {
				if (!document.querySelector('#post-box').classList.contains('appear')) {
					show()
					$('textarea').focus()
				} else {
					hide()
				}
				return false
			}
			//N:新トゥート
			if (e.keyCode === 78) {
				if (!document.querySelector('#post-box').classList.contains('appear')) {
					show()
				}
				postBox.focus()
				return false
			}
			//Ctrl+E:全ての通知未読を既読にする
			if (event.metaKey || event.ctrlKey) {
				if (e.keyCode === 69) {
					allNotfRead()
					return false
				}
			}
			//Ctrl+K:メニュー開閉
			if (event.metaKey || event.ctrlKey) {
				if (e.keyCode === 75) {
					menu()
					return false
				}
			}
			//Ctrl+Space:読み込み
			if (event.metaKey || event.ctrlKey) {
				if (e.keyCode === 32) {
					parseColumn()
					return false
				}
			}
			//Ctrl+Sift+S:設定
			if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
				if (e.keyCode === 83) {
					location.href = 'setting.html'
					return false
				}
			}
			//Ctrl+Sift+M:アカマネ
			if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
				if (e.keyCode === 77) {
					location.href = 'acct.html'
					return false
				}
			}
			//Ctrl+Sift+P:プロフ
			if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
				if (e.keyCode === 80) {
					profShow()
					return false
				}
			}
			//数字:TL
			if (event.metaKey || event.ctrlKey) {
				if (e.keyCode >= 49 && e.keyCode <= 57) {
					const kz = e.keyCode - 49
					goColumn(kz)
					return false
				}
			}
			//矢印:選択
			if (e.code == 'ArrowLeft') {
				//left
				if (document.querySelector('#imagemodal').classList.contains('open')) {
					imgCont('prev')
					return false
				}
				if (selectedColumn > 0) {
					selectedColumn--
				}
				tootSelector(selectedColumn, selectedToot)
				return false
			} else if (e.code == 'ArrowUp') {
				//up
				if (document.querySelector('#imagemodal').classList.contains('open')) {
					return false
				}
				if (selectedToot > 0) {
					selectedToot--
				}
				tootSelector(selectedColumn, selectedToot)
				return false
			} else if (e.code == 'ArrowRight') {
				//right
				if (document.querySelector('#imagemodal').classList.contains('open')) {
					imgCont('next')
					return false
				}
				if (selectedColumn < $('.tl-box').length - 1) {
					selectedColumn++
				}
				tootSelector(selectedColumn, selectedToot)
				return false
			} else if (e.code == 'ArrowDown') {
				//down
				if (document.querySelector('#imagemodal').classList.contains('open')) {
					return false
				}
				selectedToot++
				tootSelector(selectedColumn, selectedToot)
				return false
			}
			//Ctrl+U:0,0選択
			if (event.ctrlKey || event.metaKey) {
				if (e.keyCode === 85) {
					selectedToot = 0
					selectedColumn = 0
					tootSelector(0, 0)
					return false
				}
			}
			//選択時
			const selectedId = document.querySelector('.selectedToot').getAttribute('unique-id')
			const selectedAcctIds = document.querySelector(`#timeline_${selectedColumn}`).getAttribute('data-acct')
			if (e.keyCode == 70) {
				fav(selectedId, selectedAcctIds, false)
				return false
			}
			if (e.keyCode == 66) {
				rt(selectedId, selectedAcctIds, false)
				return false
			}
			if (e.keyCode == 82) {
				const target = document.querySelector('.selectedToot .rep-btn')
				const ats_cm = target.getAttribute('data-men')
				const mode = target.getAttribute('data-visen')
				re(selectedId, ats_cm, selectedAcctIds, mode)
				return false
			}
		}
		//textareaフォーカス時
		if (hasFocus2 && wv) {
			if (event.metaKey || event.ctrlKey) {
				//C+S+(No):ワンクリ
				if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
					if (e.keyCode >= 49 && e.keyCode <= 51) {
						const no = e.keyCode - 48
						const oks = localStorage.getItem('oks-' + no)
						if (oks) {
							postBox.value = postBox.value + oks
						}
						return false
					}
				}
			}
		}
	})
	//クリアボタン
	document.getElementById('clear').addEventListener('click', clear)
})
//選択する
function tootSelector(column, toot) {
	const selectedToot = document.querySelector('.selectedToot')
	let rect = {top: 0}
	if (selectedToot) {
		selectedToot.classList.remove('selectedToot')
		rect = selectedToot.getBoundingClientRect()
	}
	document.querySelectorAll(`#timeline_${column} .cvo`)[toot].classList.add('selectedToot')
	const scr = document.querySelector(`#tlBox${column}`).scrollTop
	const elem = rect.top + document.body.scrollTop
	let top = elem - getHeight('.tl-box') + scr
	if (top > 0) {
		top = top + getHeight('.selectedToot')
		if (top > scr) {
			$(`#tlBox${column}`).animate({ scrollTop: top })
		}
	} else if (elem < 0) {
		const to = scr + elem - getHeight('.selectedToot')
		if (to < scr) {
			$(`#tlBox${column}`).animate({ scrollTop: to })
		}
	}
}