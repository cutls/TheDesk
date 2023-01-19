//ユーザーデータ表示
import $ from 'jquery'
import Swal from 'sweetalert2'
import { Account, Relationship } from '../../interfaces/MastodonApiReturns'
import { dropdownInit, dropdownInitGetInstance, modalInitGetInstance, toast } from '../common/declareM'
import api from '../common/fetch'
import lang from '../common/lang'
import { multiSelector } from '../login/login'
import { escapeHTML, stripTags, twemojiParse } from '../platform/first'
import { acctResolve } from '../post/status'
import { crat } from '../tl/date'
import { hisList } from '../tl/list'
import { customEmojiReplace } from '../tl/parse'
import { hide } from '../ui/postBox'
import { todc, todo } from '../ui/tips'
import { fer, flw, showBlo, showDom, showFav, showFrl, showMut, showReq, udAdd, utlShow } from './hisData'
const gif = (localStorage.getItem('gif') || 'yes') === 'yes'
localStorage.removeItem('history')
//コード受信
if (location.search) {
	const m = location.search.match(/\?mode=([a-zA-Z-0-9]+)&code=(.+)/)
	if (m) {
		const mode = m[1]
		const codex = m[2]
		if (mode === 'user') udgEx(codex, 'main')
	}
}

export async function udgEx(user, acctId) {
	if (user === 'selector') user = $('#his-acct').attr('fullname')
	if (acctId === 'selector') acctId = $('#user-acct-sel').val()
	if (acctId === 'main') acctId = localStorage.getItem('main')
	console.log('Get user data of ' + user)
	const data = await acctResolve(acctId, user)
	if (data && data.id) {
		const { id } = data
		udg(id, acctId, true)
	} else {
		Swal.close()
		postMessage(['openUrl', user], '*')
	}
}

export async function udg(user: string | undefined, acctId: string, isSwal?: boolean) {
	reset()
	if (!user) user = localStorage.getItem('user-id_' + acctId) || ''
	todo('User Data Loading...')
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/${user}`
	const json = await api<Account>(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (isSwal) Swal.close()
	//一つ前のユーザーデータ
	if (!localStorage.getItem('history')) {
		$('#his-history-btn').prop('disabled', true)
	} else {
		$('#his-history-btn').prop('disabled', false)
		$('#his-data').attr('history', localStorage.getItem('history'))
	}
	//moved設定時
	if (json.moved) {
		toast({
			html: `${lang.lang_showontl_movetxt}<button class="btn-flat toast-action" onclick="udg('${json.moved.id}','${acctId}')">${lang.lang_showontl_movebtn}</button>`,
			displayLength: 4000,
		})
	}
	if (json.limited) {
		const limitedCheck = await Swal.fire({
			title: lang.lang_showontl_limited_title,
			text: lang.lang_showontl_limited,
			icon: 'info',
			showCancelButton: true,
		})
		if (!limitedCheck.isConfirmed) return false
	}
	const instance = modalInitGetInstance($('#his-data'))
	instance.open()
	$('#his-data').attr('user-id', user)
	$('#his-data').attr('use-acct', acctId)
	const isRemote = json.username !== json.acct
	$('#his-data').attr('remote', isRemote ? 'true' : 'false')
	const fullname = `${json.acct}${!isRemote ? `@${domain}` : ''}`
	utlShow(json.id, '', acctId)
	flw(json.id, '', acctId)
	fer(json.id, '', acctId)
	let disName = twemojiParse(escapeHTML(json.display_name || json.acct))
	disName = customEmojiReplace(disName, json, gif)
	let note = json.note
	note = customEmojiReplace(note, json, gif)
	$('#his-name').html(disName)
	$('#his-acct').text(json.acct)
	$('#his-acct').attr('fullname', fullname)
	$('#his-prof').attr('src', json.avatar)
	$('#util-add').removeClass('hide')
	const title = $('.column-first').html()
	$('#my-data-nav .anc-link').removeClass('active-back')
	$('.column-first').addClass('active-back')
	$('#his-data-title').html(title)
	$('#his-data').css('background-image', `url(${json.header})`)
	$('#his-sta').text(json.statuses_count)
	$('#his-follow').text(json.following_count)
	const flerc = json.followers_count < 0 ? '-' : json.followers_count
	$('#his-follower').text(flerc)
	$('#his-since').text(crat(json.created_at))
	$('#his-openin').attr('data-href', json.url)
	if (json.fields) {
		let table = ''
		if (json.fields.length > 0) {
			$('#his-des').css('max-height', '115px')
			table = '<table id="his-field">'
			for (const field of json.fields) {
				const fname = field.name
				const fval = field.value
				const isVerified = field.verified_at
				const when = isVerified ? `${lang.lang_showontl_verified}:${crat(field.verified_at)}` : ''
				const color = isVerified ? 'rgba(121,189,154,.25);' : 'inherit'
				table =
					table +
					`<tr>
                        <td class="his-field-title">${escapeHTML(fname)}</td>
                        <td class="his-field-content" title="${when}" style="background-color:${color}">${fval}</td>
                    </tr>`
			}
			table = table + '</table>'
			$('#his-des').html(twemojiParse(note))
		} else {
			$('#his-des').css('max-height', '400px')
		}
		$('#his-table').html(twemojiParse(table))
	} else {
		$('#his-des').css('max-height', '400px')
	}
	$('#his-des').html(twemojiParse(note))
	if (json.bot) {
		$('#his-bot').html(lang.lang_showontl_botacct)
		$('#his-bot').removeClass('hide')
	}
	$('#his-des').attr('data-acct', acctId)
	$('#his-data').css('background-size', 'cover')
	$('#his-float-timeline').css('height', $('#his-data-show').height() + 'px')
	localStorage.setItem('history', user)
	//自分の時
	if (json.acct === localStorage.getItem('user_' + acctId)) {
		showFav('', acctId)
		showBlo('', acctId)
		showMut('', acctId)
		showDom('', acctId)
		showReq('', acctId)
		showFrl('', acctId)
		$('#his-name-val').val(json.display_name || json.acct)
		if (json.fields.length > 0) {
			let i = 0
			for (const field of json.fileds || []) {
				$(`#his-f${i}-name`).val(field.name)
				$(`#his-f${i}-val`).val(stripTags(field.value))
				i++
			}
		}
		let des = json.note
		des = des.replace(/<br \/>/g, '\n')
		des = stripTags(des)
		$('#his-des-val').val(des)
		$('#his-follow-btn').hide()
		$('#his-block-btn').hide()
		$('#his-mute-btn').hide()
		$('#his-notf-btn').hide()
		$('#his-domain-btn').hide()
		$('#his-emp-btn').hide()
		$('.only-my-data').show()
		$('.only-his-data').hide()
		if (localStorage.getItem('main') === acctId) $('#his-main-acct').hide()
	} else {
		relations(user, acctId)
		$('.only-my-data').hide()
		$('.only-his-data').show()
	}
	todc()
	if (json.locked) {
		$('#his-data').addClass('locked')
	} else {
		$('#his-data').removeClass('locked')
	}
	const ddI = dropdownInitGetInstance($(`[data-target="actiondropdown"]`))
	ddI.recalculateDimensions()
	//外部データ取得(死かもしれないので)
	udAdd(acctId, user, json.url)
}
//一つ前のユーザーデータ表示
export function historyShow() {
	const acctId = $('#his-data').attr('use-acct') || ''
	const user = $('#his-data').attr('history')
	udg(user, acctId, true)
}
//選択アカウントのプロフ
export function profShow() {
	const acctId = $('#post-acct-sel').val()?.toString() || '0'
	const user = localStorage.getItem('user-id_' + acctId) || ''
	udg(user, acctId)
	hide()
}

//FF関係取得
async function relations(user: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/relationships?id=${user}`
	const jsons = await api<Relationship[]>(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	const json = jsons[0]
	if (json.requested) {
		//フォロリク中
		$('#his-data').addClass('following')
		$('#his-follow-btn-text').text(lang.lang_status_requesting)
	}
	if (json.following) {
		//自分がフォローしている
		$('#his-data').addClass('following')
		$('#his-follow-btn-text').text(lang.lang_status_unfollow)
		hisList(user, acctId)
	} else {
		$('#his-follow-btn-text').text(lang.lang_status_follow)
	}
	if (json.followed_by) {
		//フォローされてる
		$('#his-relation').text(lang.lang_showontl_followed)
	}
	if (json.blocking) {
		$('#his-data').addClass('blocking')
		$('#his-block-btn-text').text(lang.lang_status_unblock)
	} else {
		$('#his-block-btn-text').text(lang.lang_status_block)
	}
	if (json.muting) {
		$('#his-data').addClass('muting')
		$('#his-mute-btn-text').text(lang.lang_status_unmute)
	} else {
		$('#his-mute-btn-text').text(lang.lang_status_mute)
	}
	if (json.muting_notifications) {
		$('#his-data').addClass('mutingNotf')
		$('#his-notf-btn-text').text(lang.lang_showontl_notf + lang.lang_status_unmute)
	} else {
		$('#his-notf-btn-text').text(lang.lang_showontl_notf + lang.lang_status_mute)
	}
	if (json.domain_blocking) {
		$('#his-data').addClass('blockingDom')
		$('#his-domain-btn-text').text(lang.lang_showontl_domain + lang.lang_status_unblock)
	} else {
		$('#his-domain-btn-text').text(lang.lang_showontl_domain + lang.lang_status_block)
	}
	//Endorsed
	if (json.endorsed) {
		$('#his-end-btn').addClass('endorsed')
		$('#his-end-btn-text').text(lang.lang_status_unendorse)
	} else {
		$('#his-end-btn').removeClass('endorsed')
		$('#his-end-btn-text').text(lang.lang_status_endorse)
	}
	//Blocked
	if (json.blocked_by) {
		$('#my-data-nav .btn').addClass('disabled')
		$('.his-var-content').hide()
		$('#his-float-blocked').show()
		$('#his-follow-btn').hide()
	}
}

export function profbrws() {
	const url = $('#his-openin').attr('data-href')
	postMessage(['openUrl', url], '*')
}

export function setMain() {
	const acctId = $('#his-data').attr('use-acct') || ''
	localStorage.setItem('main', acctId)
	multiSelector(true)
	toast({ html: lang.lang_manager_mainAcct, displayLength: 3000 })
}
//オールリセット
export function hisclose() {
	const instance = modalInitGetInstance($('#his-data'))
	instance.close()
	reset()
	$('#his-data').attr('history', '')
	localStorage.removeItem('history')
}

function reset() {
	$('.his-var-content:eq(0)').show()
	$('.his-var-content:gt(0)').hide()
	$('#my-data-nav .btn').removeClass('disabled')
	$('.active-back').removeClass('active-back')
	$('.column-first').addClass('active-back')
	$('#his-name').text('Loading')
	$('#his-acct').text('')
	$('#his-prof').attr('src', '../../img/loading.svg')
	$('#his-data').css('background-image', 'url(../../img/loading.svg)')
	$('#his-sta').text('')
	$('#his-follow').text('')
	$('#his-follower').text('')
	$('#his-des').html('')
	$('#his-data').css('background-size', 'cover')
	$('#his-since').text('')
	$('#his-data').removeClass('following')
	$('#his-data').removeClass('muting')
	$('#his-data').removeClass('blocking')
	$('#his-data').removeClass('mutingNotf')
	$('#his-data').removeClass('blockingDom')
	$('#his-end-btn').removeClass('endorsed')
	$('#his-des').css('max-height', '250px')
	$('#his-bot').html('')
	$('#his-bot').addClass('hide')
	$('#his-follow-btn').show()
	$('#his-block-btn').show()
	$('#his-mute-btn').show()
	$('#his-notf-btn').show()
	$('#his-domain-btn').show()
	$('#his-emp-btn').show()
	$('#his-follow-btn-text').text(lang.lang_status_follow)
	$('#his-mute-btn-text').text(lang.lang_status_mute)
	$('#his-block-btn-text').text(lang.lang_status_block)
	$('#his-notf-btn').text(lang.lang_showontl_notf + lang.lang_status_mute)
	$('#his-domain-btn').text(lang.lang_showontl_domain + lang.lang_status_block)
	$('#his-relation').text('')
	$('.cont-series').html('')
	$('#domainblock').val('')
	$('#his-lists-a').html(lang.lang_showontl_listwarn)
	$('#his-lists-b').html('')
	$('#his-name-val').val('')
	$('#his-des-val').val('')
	$('#his-f1-name').val('')
	$('#his-f1-val').val('')
	$('#his-f2-name').val('')
	$('#his-f2-val').val('')
	$('#his-f3-name').val('')
	$('#his-f3-val').val('')
	$('#his-f4-name').val('')
	$('#his-f4-val').val('')
	$('#his-endorse').html('')
	$('#his-openin').attr('data-href', '')
	$('#his-float-timeline').show()
	$('#his-float-blocked').hide()
	$('#his-main-acct').show()
	$('#his-proof-prof').html('')
	$('#his-data').removeClass('locked')
	$('#his-data').removeClass('requesting')
}
$('#my-data-nav .anc-link').on('click', function () {
	const target = $(this).attr('go')
	if (target) {
		const title = $(this).html()
		if (target === '#his-tl') $('#util-add').removeClass('hide')
		if (target !== '#his-tl') $('#util-add').addClass('hide')
		$('#his-data-title').html(title)
		$('#my-data-nav .anc-link').removeClass('active-back')
		$(this).addClass('active-back')
		$(target).show()
		$('.his-var-content:not(' + target + ')').hide()
	}
})
