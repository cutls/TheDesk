import api from '../common/fetch'
import lang from '../common/lang'
import { twemojiParse } from '../platform/first'
import { pollParse } from './pollParse'
import $ from 'jquery'

//アンケートのトグル
export function pollToggle() {
	const widthStr = localStorage.getItem('postbox-width') || ''
	let width = 600
	if (widthStr) width = parseInt(widthStr.replace('px', ''), 10) + 300
	if ($('#poll').hasClass('hide')) {
		$('#right-side').show()
		$('#right-side').css('width', '300px')
		$('#left-side').css('width', 'calc(100% - 300px)')
		$('#post-box').css('width', width + 'px')
		$('#poll').removeClass('hide')
		$('#pollsta').text(lang.lang_yesno)
	} else {
		$('#right-side').hide()
		$('#left-side').css('width', '100%')
		$('#right-side').css('width', '300px')
		$('#post-box').css('width', widthStr + 'px')
		$('#emoji').addClass('hide')
		$('#draft').addClass('hide')
		$('#poll').addClass('hide')
		$('#pollsta').text(lang.lang_no)
	}
}
/*
function pollAddtime(num){
    const last=$("#expires_in").val();
    last=last*1-(num*-1);
    $("#expires_in").val(last);
    pollCalc();
}
*/
export function pollCalc() {
	const days = parseInt($('#days_poll').val()?.toString() || '0', 10)
	const hrs = parseInt($('#hours_poll').val()?.toString() || '0', 10)
	const mins = parseInt($('#mins_poll').val()?.toString() || '0', 10)
	return days * 86400 + hrs * 3600 + mins * 60
}
//Vote
export function voteSelMastodon(acctId: string, id: string, mul: boolean, elem: HTMLElement) {
	if ($(elem).hasClass('sel')) {
		$(elem).css('background-color', 'transparent')
		$(elem).removeClass('sel')
	} else {
		if (!mul) {
			$(`.vote_${acctId}_${id} div`).css('background-color', 'transparent')
			$(`.vote_${acctId}_${id} div`).removeClass('sel')
			$(elem).css('background-color', 'var(--emphasized)')
			$(elem).addClass('sel')
		} else {
			$(elem).css('background-color', 'var(--emphasized)')
			$(elem).addClass('sel')
		}
	}
}
export async function voteMastodon(acctId: string, id: string, target: string) {
	const choice: string[] = []
	$(`#vote${target} div`).each(function (i) {
		if ($(this).hasClass('sel')) {
			choice.push(i.toString())
		}
	})
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/polls/${id}/votes`
	await api(start, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
		body: { choices: choice },
	})
	voteMastodonrefresh(acctId, id, target)
}
export function showResult(acctId: string, id: string) {
	$(`.vote_${acctId}_${id}_result`).toggleClass('hide')
}
export async function voteMastodonrefresh(acctId: string, id: string, target: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/polls/${id}`
	const json = await api(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (!json) {
		return false
	}
	const pollRaw = pollParse(json, acctId, json.emojis) || ''
	const poll = twemojiParse(pollRaw)
	$(`#vote${target}`).html(poll)
}
