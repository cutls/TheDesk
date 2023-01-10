/*投稿系*/
//投稿
import $ from 'jquery'
import Swal from 'sweetalert2'
import lang from '../common/lang'
import { addToDraft, cw, draftToggle, isIVis, IVis, schedule } from './secure'
import { todo } from '../ui/tips'
import { Status, StatusTheDeskExtend } from '../../interfaces/MastodonApiRequests'
import { formatTimeUtc, setLog } from '../platform/first'
declare var M

export function sec() {
	const modeRaw: string | null = localStorage.getItem('sec')
	if (!modeRaw) return
	let mode = modeRaw as IVis
	const acct_id = $('#post-acct-sel').val()
	const domain = localStorage.getItem('domain_' + acct_id)
	if (!domain) return
	if (~domain.indexOf('kirishima.cloud') >= 0 && mode === 'local') {
		mode = 'unlisted'
	}
	post(mode)
}
export async function post(postVis?: IVis, dry?: boolean) {
	if (!navigator.onLine && !dry) {
		draftToggle(true)
		addToDraft()
		M.toast({
			html: lang.lang_post_offline,
			displayLength: 3000
		})
		return false
	}
	if ($('#toot-post-btn').prop('disabled')) return false
	let str = $('#textarea').val() as string
	const acct_id = $('#post-acct-sel').val()?.toString()
	localStorage.setItem('last-use', acct_id || `0`)
	const domain = localStorage.getItem('domain_' + acct_id)
	let ideKey = $('#ideKey').val()
	if ($('#ideKey').val() === '') {
		const user = localStorage.getItem('user_' + acct_id)
		ideKey = Math.floor(Date.now() / 1000) + '/TheDesk/' + user + '@' + domain
		$('#ideKey').val(ideKey)
	}
	const cw_sent = localStorage.getItem('cw_sentence') || 500
	const cw_ltres = localStorage.getItem('cw_letters') || 7000
	if (!$('#cw').hasClass('cw-avail') &&
		(str.length > cw_sent || str.split('\n').length - 1 > cw_ltres)
	) {
		const plus = str.replace(/\n/g, '').slice(0, 10) + '...'
		const result = await Swal.fire({
			title: lang.lang_post_cwtitle,
			text: lang.lang_post_cwtxt + plus,
			icon: 'info',
			showCancelButton: true,
			confirmButtonText: lang.lang_post_btn2,
			denyButtonText: lang.lang_post_btn3,
			showCloseButton: true,
			focusConfirm: false
		})
		if (result.isConfirmed) {
			$('#cw-text').show()
			$('#cw').addClass('yellow-text')
			$('#cw').addClass('cw-avail')
			$('#cw-text').val(plus)
		}
	}
	$('.toot-btn-group').prop('disabled', true)
	todo('Posting')
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	let start = 'https://' + domain + '/api/v1/statuses'
	let method = 'POST'
	const editTarget = $('#tootmodal').attr('data-edit')
	if (editTarget) {
		start = start + `/${editTarget}`
		method = 'PUT'
	}
	const reply = $('#reply').val()
	const stable = localStorage.getItem('stable')
	if (stable && !str.match(stable)) str = `${str} #${stable}`
	const toot: StatusTheDeskExtend = {
		status: str
	}
	if (reply) toot.in_reply_to_id = reply.toString()
	const media = $('#media').val()?.toString()
	if (media) toot.media_ids = media.split(',')
	const quote = $('#quote').val()?.toString()
	if (quote) toot.quote_id = quote
	if ($('#nsfw').hasClass('nsfw-avail')) toot.sensitive = true
	const vis = postVis || $('#vis').text()
	if (!isIVis(vis)) return
	if (vis !== 'inherit' && vis !== 'local') {
		toot.visibility = vis
	} else if (vis === 'local') {
		toot.status = str + '👁️'
	}
	if ($('#cw').hasClass('cw-avail')) {
		const spo = $('#cw-text').val()
		cw()
		toot.spoiler_text = spo?.toString()
	}
	if ($('#sch-box').hasClass('sch-avail')) {
		const scheduled = formatTimeUtc(new Date(Date.parse($('#sch-date').val()?.toString() || '')))
		console.log('This toot will be posted at:' + scheduled)
		schedule()
		toot.scheduled_at = scheduled
		if ($('#sch-box').hasClass('expire')) {
			toot.scheduled_at = undefined
			toot.expires_at = scheduled
		}
	}
	if (!$('#poll').hasClass('hide')) {
		const options: string[] = []
		$('.mastodon-choice').map(function () {
			const choice = $(this).val()?.toString()
			if (choice && choice !== '') {
				options.push(choice)
			}
		})
		const mul = $('#poll-multiple:checked').val() === '1'
		const htt = $('#poll-until:checked').val() === '1'
		const exin = pollCalc()
		if (!exin) {
			todo('Error: Poll expires_in param')
		}
		toot.poll = {
			options: options,
			expires_in: exin,
			multiple: mul,
			hide_totals: htt
		}
	}
	console.table(toot)
	if (dry) {
		$('#ideKey').val('')
		$('.toot-btn-group').prop('disabled', false)
		todc()
		toot['TheDeskAcctId'] = acct_id
		return toot
	}
	const q = {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${at}`,
			'Idempotency-Key': ideKey?.toString() || ''
		},
		body: JSON.stringify(toot)
	}
	try {
		const promise = await fetch(start, q)
		const json = await promise.json()
		if (!promise.ok) {
			if (media && promise.status === 422) {
				$('#ideKey').val('')
				$('.toot-btn-group').prop('disabled', false)
				alertProcessUnfinished()
			} else {
				setLog(start, promise.status, json)
				const box = localStorage.getItem('box')
				if (box === 'yes' || !box) {
					$('#textarea').blur()
					hide()
				}
				$('.toot-btn-group').prop('disabled', false)
				todc()
				clear()
			}
		}
		$('#ideKey').val('')
		const box = localStorage.getItem('box')
		if (box === 'yes' || !box) {
			$('#textarea').blur()
			hide()
		}
		$('.toot-btn-group').prop('disabled', false)
		todc()
		clear()
	} catch (e: any) {
		console.error(e)
	}

}
export function expPostMode() {
	const isExpire = $('#sch-box').toggleClass('expire')
	if (isExpire) {
		Swal.fire({
			icon: 'info',
			title: 'Expiring toot On'
		})
	} else {
		Swal.fire({
			icon: 'info',
			title: 'Expireing toot Off'
		})
	}
}
//クリア(Shift+C)
function clear() {
	$('#textarea').val('')
	$('#ideKey').val('')
	if (localStorage.getItem('stable')) {
		$('#textarea').val('#' + localStorage.getItem('stable') + ' ')
	}
	$('#textarea').attr('placeholder', lang.lang_toot)
	$('#reply').val('')
	$('#quote').val('')
	$('#media').val('')
	const cwt = localStorage.getItem('cw-text')
	if (cwt) {
		$('#cw-text').val(cwt)
	} else {
		$('#cw-text').val('')
	}
	const acw = localStorage.getItem('always-cw')
	if (acw !== 'yes') {
		$('#cw').removeClass('yellow-text')
		$('#cw').removeClass('cw-avail')
		$('#cw-text').hide()
	} else {
		$('#cw').addClass('yellow-text')
		$('#cw').addClass('cw-avail')
		$('#cw-text').show()
	}
	$('#rec').text(lang.lang_no)
	$('#mec').text(lang.lang_nothing)
	loadVis()
	$('#nsfw').removeClass('yellow-text')
	$('#nsfw').html('visibility_off')
	$('#nsfw').removeClass('nsfw-avail')
	$('#stamp').html('Off')
	$('#stamp').removeClass('stamp-avail')
	$('#nsc').text(lang.lang_nothing)
	$('#drag').css('background-color', '#e0e0e0')
	$('#preview').html('')
	$('.toot-btn-group').prop('disabled', false)
	$('#post-acct-sel').prop('disabled', false)
	$('#days_poll').val(0)
	$('#hours_poll').val(0)
	$('#mins_poll').val(6)
	$('#poll').addClass('hide')
	$('#pollsta').text(lang.lang_no)
	$('.mastodon-choice').map(function () {
		$(this).val('')
	})
	localStorage.removeItem('image')
	if (localStorage.getItem('mainuse') === 'main') {
		$('#post-acct-sel').val(localStorage.getItem('main') || '0')
	}
	$('#emoji').addClass('hide')
	const elems = document.querySelectorAll('select');
	M.FormSelect.init(elems);
	$('#default-emoji').show()
	$('#unreact').show()
	$('#addreact').addClass('hide')
	$('#right-side').hide()
	$('#right-side').css('width', '300px')
	$('#left-side').css('width', '100%')
	let width = parseInt((localStorage.getItem('postbox-width') || '300px').replace('px', ''), 10)
	$('#post-box').css('width', width)
	$('#tootmodal').attr('data-edit', null)
	mdCheck()
}
