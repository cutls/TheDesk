import { getColumn } from '../common/storage'
import timeUpdate from '../common/time'
import { columnReload, moreLoad, ueLoad } from '../tl/tl'
import { sortLoad } from './sort'
import $ from 'jquery'

//スクロールで続きを読む
export function scrollEvent() {
	$('.tl-box').scroll(function () {
		scrollCk()
	})
}
scrollEvent()

export function scrollCk() {
	$('.tl-box').each(function () {
		const tlid = $(this).attr('tlid') || '0'
		const len = $(`#timeline_${tlid} .cvo`).length
		//一番上ならためていた新しいトゥートを表示ないしtealなら未読管理モード
		if ($(this).scrollTop() === 0) {
			if (!$(`#unread_${tlid} .material-icons`).hasClass('teal-text')) {
				const pool = localStorage.getItem('pool_' + tlid)
				if (pool) {
					$('#timeline_' + tlid).prepend(pool)
					timeUpdate()
					localStorage.removeItem('pool_' + tlid)
				}
			} else {
				ueLoad(tlid)
			}
			//自動リフレッシュ
			if (len > 30) {
				for (let i = 30; i < $('#timeline_' + tlid + ' .cvo').length; i++) {
					$('#timeline_' + tlid + ' .cvo')
						.eq(i)
						.remove()
				}
			}
		}
		//続きを読むトリガー
		const height = $(this).find('.tl').height() || 0
		const scrt = height - ($(window).height() || 0)
		const scr = $(this).scrollTop() || 0
		if (scr > scrt && scrt > 0) {
			console.log('kicked more loading:' + tlid)
			moreLoad(tlid)
		}
	})
}

export function goTop(id: number) {
	if ($(`#unread_${id} .material-icons`).hasClass('teal-text')) {
		$(`#unread_${id} .material-icons`).removeClass('teal-text')
		const obj = getColumn()
		const type = obj[id].type
		console.log(id, type)
		columnReload(id.toString(), type)
	}
	if (($(`#timeline_box_${id}_box .tl-box`).scrollTop() || 0) > 500) {
		$(`#timeline_box_${id}_box .tl-box`).scrollTop(500)
	}
	$(`#timeline_box_${id}_box .tl-box`).animate({ scrollTop: 0 })
}
export function goColumn(key: number) {
	if ($('[tlid=' + key + ']').length) {
		$('#timeline-container').animate({
			scrollLeft: ($('#timeline-container').scrollLeft() || 0) + ($(`[tlid=${key}]`).offset()?.left || 0),
		})
	}
	sortLoad()
}
