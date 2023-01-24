//レイアウトの設定
import $ from 'jquery'
import 'jquery-ui'
import Swal from 'sweetalert2'
import { IColumnData, IColumnType, IColumnUTL } from '../../interfaces/Storage'
import lang from '../common/lang'
import { getColumn, getMulti, initColumn, setColumn, setMulti } from '../common/storage'
import { ckdb } from '../login/login'
import { initWebviewEvent } from '../platform/first'
import { isIVis, IVis } from '../post/secure'
import { mastodonBaseStreaming } from '../tl/baseStreaming'
import { cardCheck } from '../tl/card'
import { checkNotfFilter, ebtCheck, excludeCk, getFilter, mediaCheck } from '../tl/filter'
import { voiceCheck } from '../tl/speech'
import { favTag, isTagData } from '../tl/tag'
import { tlCloser, tlDiff, tl, isColumnType } from '../tl/tl'
import { show } from './postBox'
import { goTop } from './scroll'
import { sortLoad } from './sort'
declare let jQuery

const isSetAsRead = localStorage.getItem('setasread') === 'yes'
const anime = (localStorage.getItem('animation') || 'yes') === 'yes'
const markers = localStorage.getItem('markers') === 'yes'
const smallHeader = localStorage.getItem('smallHeader') === 'yes'

globalThis.wsHome = []
globalThis.wsLocal = []
globalThis.websocketNotf = []

//カラム追加ボックストグル
export function addColumnMenu() {
	$('#left-menu a').removeClass('active')
	$('#addColumnMenu').addClass('active')
	$('.menu-content').addClass('hide')
	$('#add-box').removeClass('hide')
	addselCk()
}
$('.type').click(function () {
	$('.type').removeClass('active')
	$(this).addClass('active')
	$('#type-sel').val($(this).attr('data-type') || '')
})
//最初、カラム変更時に発火
export function parseColumn(targetStr?: string | 'add', dontClose?: boolean) {
	if (localStorage.getItem('menu-done')) {
		$('#fukidashi').addClass('hide')
	}
	if (!dontClose && !targetStr) tlCloser()
	const acctList = getMulti()
	if (acctList) {
		let key = 0
		for (const acct of acctList) {
			localStorage.setItem('name_' + key, acct.name)
			localStorage.setItem('user_' + key, acct.user)
			localStorage.setItem('user-id_' + key, acct.id)
			localStorage.setItem('prof_' + key, acct.prof)
			localStorage.setItem('domain_' + key, acct.domain)
			localStorage.setItem('acct_' + key + '_at', acct.at)
			localStorage.setItem('acct_' + key + '_rt', acct.rt || '')
			if (!targetStr) mastodonBaseStreaming(key.toString())
			ckdb(key.toString())
			//フィルターデータ読もう
			getFilter(key.toString())
			localStorage.removeItem('emoji_' + key) //カスタム絵文字カテゴリ分け用旧データ削除
			key++
		}
	}
	let columns = initColumn()
	let numTarget = false
	let tlidTar: null | number = null
	if (targetStr === 'add') {
		tlidTar = columns.length - 1
		columns = [columns[tlidTar]]
	} else if (targetStr) {
		const target = parseInt(targetStr, 10)
		columns = [columns[target]]
		numTarget = true
	} else {
		if ($('#timeline-container').length) {
			$('#timeline-container').html('')
			jQuery('.box, .boxIn').resizable('destroy')
		}
	}
	let basekey = 0
	for (let key = 0; key < columns.length; key++) {
		//acctって言いながらタイムライン
		const column = columns[key]
		const { domain, type } = column
		if (tlidTar || tlidTar === 0) {
			key = tlidTar
		}
		const isNotf = column.type === 'notf'
		const notfAttr = isNotf ? ' data-notf=' + column.domain : ''
		let ifNotf = isNotf ? 'hide' : ''
		const notfLocale = lang.lang_showontl_notf
		const uniqueNotf = lang.lang_layout_thisacct.replace('{{notf}}', notfLocale)
		let insert = ''
		let insertColor = ''
		if (column.background) {
			if (column.text !== 'def') {
				const isBlack = column.text === 'black'
				const txhex = isBlack ? '000000' : 'ffffff'
				const ichex = isBlack ? '9e9e9e' : 'eeeeee'
				insert = `background-color:#${column.background}; color: #${txhex}; `
				insertColor = ` style="color: #${ichex}" `
			}
		}
		if (acctList[domain]) insert = `${insert} border-bottom:medium solid #${acctList[domain].background};`
		if (type === 'notf' && !isSetAsRead) {
			localStorage.setItem('hasNotfC_' + domain, 'true')
		} else {
			localStorage.removeItem('hasNotfC_' + domain)
		}
		let css = ''
		const width = localStorage.getItem('width')
		if (width) css = ' min-width:' + width + 'px;'
		const maxWidth = localStorage.getItem('max-width')
		if (maxWidth) css = css + 'max-width:' + maxWidth + 'px;'
		const margin = localStorage.getItem('margin')
		if (margin) css = css + 'margin-right:' + margin + 'px;'
		if (column.width) css = css + ' min-width:' + column.width + 'px !important;max-width:' + column.width + 'px !important;'
		const animeCss = anime ? 'box-anime' : ''
		if (!column.left_fold) basekey = key
		let notfDomain = domain.toString()
		if (type === 'webview') {
			const fixWidth = localStorage.getItem('fixwidth')
			css = ` min-width:${fixWidth}px;`
			const html = webviewParse('https://tweetdeck.twitter.com', key, insert, insertColor, css)
			$('#timeline-container').append(html)
			initWebviewEvent()
		} else if (type === 'bookmark' || type === 'fav') {
			unstreamingTL(type, key, basekey, insert, insertColor, column.left_fold || false, css, animeCss, domain.toString())
		} else if (column.type === 'utl') {
			const data = column.data
			if (!data) return
			unstreamingTL(column.type, key, basekey, insert, insertColor, column.left_fold || false, css, animeCss, domain.toString(), data)
		} else {
			let unread = `<a id="unread_${key}" onclick="showUnread(${key},'${type}','${domain}')"
					 class="setting nex waves-effect" title="${lang.lang_layout_unread}">
					<i class="material-icons waves-effect nex">more</i><span>${lang.lang_layout_unread}</span>
				</a>`
			let notfKey = key.toString()
			let ifTag = ''
			let ifTagBtn = ''
			let excludeNotf = ''
			let excludeHome = ''
			if (column.type === 'notf') {
				excludeNotf = `<div style="border: 1px solid; padding: 5px; margin-top: 5px; margin-bottom: 5px;">${lang.lang_layout_excluded}:<br>
					<label>
						<input type="checkbox" class="filled-in" id="exc-reply-${key}" ${excludeCk(key.toString(), 'mention')} />
						<span>
							${lang.lang_layout_mention}
						</span>
					</label>
					<label>
						<input type="checkbox" class="filled-in" id="exc-fav-${key}" ${excludeCk(key.toString(), 'favourite')} />
						<span>
						${lang.lang_layout_fav}
						</span>
					</label> 
					<label>
						<input type="checkbox" class="filled-in" id="exc-bt-${key}" ${excludeCk(key.toString(), 'reblog')} />
						<span>
						${lang.lang_layout_bt}
						</span>
					</label>
					<label>
						<input type="checkbox" class="filled-in" id="exc-follow-${key}" ${excludeCk(key.toString(), 'follow')} />
						<span>
						${lang.lang_status_follow}
						</span>
					</label> 
					<label>
						<input type="checkbox" class="filled-in" id="exc-poll-${key}" ${excludeCk(key.toString(), 'poll')} />
						<span>
						${lang.lang_layout_poll}
						</span>
					</label>
					<label>
						<input type="checkbox" class="filled-in" id="exc-status-${key}" ${excludeCk(key.toString(), 'status')} />
						<span>
						${lang.lang_layout_status}
						</span>
					</label>
					<label>
						<input type="checkbox" class="filled-in" id="exc-update-${key}" ${excludeCk(key.toString(), 'update')} />
						<span>
						${lang.lang_layout_update}
						</span>
					</label>
					<label>
						<input type="checkbox" class="filled-in" id="exc-follow_request-${key}" ${excludeCk(key.toString(), 'follow_request')} />
						<span>
						${lang.lang_layout_follow_request}
						</span>
					</label>
					<br />
					<button class="btn btn-flat waves-effect notf-exclude-btn waves-light" style="width:calc(50% - 11px); padding:0;" onclick="exclude('${key}')">Filter</button>`
				if (checkNotfFilter(key.toString())) {
					excludeNotf =
						excludeNotf +
						`<button class="btn btn-flat red-text waves-effect notf-exclude-btn waves-light" style="width:calc(50% - 11px); padding:0;" onclick="resetNotfFilter('${key}')">
							Clear all
						</button>`
				}
				excludeNotf = excludeNotf + '</div>'
				notfDomain = 'dummy'
				notfKey = 'dummy'
			} else if (column.type === 'home') {
				excludeHome = `<a onclick="ebtToggle('${key}')" class="setting nex waves-effect">
						<i class="fas fa-retweet nex" title="${lang.lang_layout_excludingbt}" style="font-size: 24px"></i>
						<span>${lang.lang_layout_excludingbt}</span><span id="sta-bt-${key}">Off</span>
					</a>`
			} else if (column.type === 'tag') {
				const cData = column.data
				if (!cData || !isTagData(cData)) continue
				const name = cData.name
				const all = cData.all
				const any = cData.any
				const none = cData.none
				ifTag = `<div class="column-hide notf-indv-box" id="tag-box_${key}" style="padding:5px;">
					Base: ${name}<br>
					<div id="tagManager-${key}">
						all: <input type="text" id="all_tm-${key}"" value="${all}">
						any: <input type="text" id="any_tm-${key}" value="${any}">
						none: <input type="text" id="none_tm-${key}"" value="${none}">
					</div>
					<button onclick="addTag('${key}')" class="btn waves-effect" style="width: 100%">Refresh</button>
				</div>`
				ifTagBtn = `<a onclick="setToggleTag('${key}')" class="setting nex" title="${lang.lang_layout_tagManager}" style="width:30px">
					<i class="material-icons waves-effect nex">note_add</i>
				</a>`
				unread = ''
				ifNotf = 'hide'
			} else {
				ifNotf = ''
				unread = ''
			}
			if (!markers) {
				unread = ''
			}
			let left_hold = ''
			if (!column.left_fold) {
				basekey = key
				if (!numTarget) {
					const basehtml = `<div style="${css}" class="box ${animeCss}" id="timeline_box_${basekey}_parentBox"></div>`
					$('#timeline-container').append(basehtml)
				}
				left_hold = `<a onclick="leftFoldSet(${key})" class="setting nex waves-effect">
						<i class="material-icons waves-effect nex" title="${lang.lang_layout_leftFold}">view_agenda</i>
					<span>${lang.lang_layout_leftFold}</span></a>`
			} else {
				left_hold = `<a onclick="leftFoldRemove(${key})" class="setting nex waves-effect">
						<i class="material-icons waves-effect nex" title="${lang.lang_layout_leftUnfold}">view_column</i>
					<span>${lang.lang_layout_leftUnfold}</span></a>`
			}
			const addHeight = column.height ? ' min-height:' + column.height + 'px;max-height:' + column.height + 'px;' : ''
			let mediaFil = `<a onclick="remoteOnly('${key}','${column.type}')" class="setting nex waves-effect">
					<i class="material-icons nex" title="${lang.lang_layout_remoteOnly}">perm_media</i><br />
					<span id="sta-remote-${key}">Off</span>
				${lang.lang_layout_remoteOnly}</a>`
			if (type !== 'pub' && type !== 'pub-media') {
				mediaFil = `<a onclick="mediaToggle('${key}')" class="setting nex waves-effect">
					<i class="material-icons nex" title="${lang.lang_layout_mediafil}">perm_media</i>
				<span>${lang.lang_layout_mediafil}</span/><span id="sta-media-${key}">On</span></a>`
			}
			const html = `
				<div class="boxIn" id="timeline_box_${key}_box" tlid="${key}" data-acct="${column.domain}" style="${addHeight}">
					<div class="notice-box ${smallHeader ? 'small-header' : ''} z-depth-2" id="menu_${key}" style="${insert}">
						<div class="area-notice">
							<i class="material-icons waves-effect notice_icon_acct_${column.domain} top-icon" id="notice_icon_${key}" ${notfAttr} 
								 onclick="checkStr(${key})"
							 	 title="${lang.lang_layout_gotop}" aria-hidden="true">
							</i>
						</div>
					<div class="area-notice_name">
						<span id="notice_${key}" class="tl-title"></span>
					</div>
					<div class="area-a1">
						<a onclick="notfToggle('${column.domain}','${key}')" class="setting nex ${ifNotf}" 
							title="${uniqueNotf}" ${insertColor}>
							<i class="material-icons waves-effect nex notf-icon_${column.domain}" aria-hidden="true">notifications</i>
							<span class="voice">${uniqueNotf}</span>
						</a>
						<span class="cbadge hide notf-announ_${column.domain}" style="margin-right:0" 
							onclick="notfToggle('${column.domain}','${key}')" title="${lang.lang_layout_announ}">
							<i class="fas fa-bullhorn"></i>
							<span class="notf-announ_${column.domain}_ct"></span>
							<span class="voice">${lang.lang_layout_announ}</span>
						</span>
						${ifTagBtn}
					</div>
					<div class="area-sta">
						<span class="new badge teal notf-reply_${column.domain} hide" data-badge-caption="Rp" aria-hidden="true">0</span>
						<span class="new badge yellow black-text notf-fav_${column.domain} hide" data-badge-caption="Fv" aria-hidden="true">0</span>
						<span class="new badge blue notf-bt_${column.domain} hide" data-badge-caption="BT" aria-hidden="true">0</span>
						<span class="new badge orange notf-follow_${column.domain} hide" data-badge-caption="Fw" aria-hidden="true">0</span>
					</div>
					<div class="area-a2">
						<a onclick="removeColumn('${key}')" class="setting nex">
							<i class="material-icons waves-effect nex" title="${lang.lang_layout_delthis}" ${insertColor} aria-hidden="true">cancel</i>
							<span class="voice">${lang.lang_layout_delthis}</span>
						</a>
					</div>
					<div class="area-a3">
						<a onclick="setToggle('${key}')" class="setting nex" title="${lang.lang_layout_setthis}" ${insertColor}>
							<i class="material-icons waves-effect nex" aria-hidden="true">settings</i>
							<span class="voice">${lang.lang_layout_setthis}</span>
						</a>
					</div>
				</div>
				<div class="column-hide notf-indv-box z-depth-4" id="notf-box_${notfKey}">
					<div class="announce_${column.domain}" style="border: 1px solid"></div>
					<div id="notifications_${notfKey}" data-notf="${notfDomain}" data-type="notf" class="notf-timeline">
					</div>
				</div>
				<div class="column-hide notf-indv-box" id="util-box_${key}" style="padding:5px;">
					${excludeNotf}
					<div class="columnSettings">
					${excludeHome}
					${unread}
					${left_hold}
					${mediaFil}
					<a onclick="cardToggle('${key}')" class="setting nex waves-effect">
						<i class="material-icons nex" title="${lang.lang_layout_linkanades}">link</i>
					<span>${lang.lang_layout_linkana}</span><span id="sta-card-${key}">On</span>
					</a>
					<a onclick="voiceToggle('${key}')" class="setting nex waves-effect">
						<i class="material-icons nex" title="${lang.lang_layout_tts}">hearing</i>
					<span>${lang.lang_layout_tts}TL</span/><span id="sta-voice-${key}">On</span>
					</a>
					<a onclick="columnReload('${key}','${column.type}')" class="setting nex waves-effect">
						<i class="material-icons nex" title="${lang.lang_layout_reconnect}">refresh</i>
						<span>${lang.lang_layout_reconnect}</span>
					</a>
					<a onclick="resetWidth(${key})" class="setting nex waves-effect">
						<i class="material-icons nex rotate-90" title="${lang.lang_layout_resetWidth}">height</i>
						<span>${lang.lang_layout_resetWidth}</span>
					</a></div>
					<p>${lang.lang_layout_headercolor}</p>
					<div id="picker_${key}" class="color-picker"></div>
				</div>${ifTag}
				<div class="tl-box" tlid="${key}">
					<div id="timeline_${key}" class="tl ${column.type}-timeline " tlid="${key}" 
						data-type="${column.type}" data-acct="${column.domain}" data-const="${column.type}_${column.domain}">
						<div id="landing_${key}" class="landing">
						<div class="preloader-wrapper small active " style="margin-top: calc(50vh - 15px)">
							<div class="spinner-layer spinner-blue-only">
								<div class="circle-clipper left">
									<div class="circle"></div>
								</div>
								<div class="gap-patch">
									<div class="circle"></div>
								</div>
								<div class="circle-clipper right">
									<div class="circle"></div>
								</div>
							</div>
					  </div>
					</div>
				</div>
			</div>`
			if (numTarget) {
				$('timeline_box_' + key + '_box').html(html)
			} else {
				$('#timeline_box_' + basekey + '_parentBox').append(html)
			}
			localStorage.removeItem('pool_' + key)
			const data = column.data
			const voice = localStorage.getItem('voice_' + key) === 'yes'
			tl(column.type, data, column.domain.toString(), key.toString(), voice)
			cardCheck(key)
			ebtCheck(key)
			mediaCheck(key)
			voiceCheck(key)
			css = ''
		}
	}
	const box = localStorage.getItem('box')
	if (box === 'absolute') setTimeout(() => show(), 1000)
	if (localStorage.getItem('reverse')) {
		$('#bottom').removeClass('reverse')
		$('.leftside').removeClass('reverse')
	}
	$('#bottom').removeClass('hide')
	const sec = localStorage.getItem('sec')
	if (sec && sec !== 'nothing') {
		if (isIVis(sec)) secvis(sec)
	}
	favTag()
	const cw = localStorage.getItem('always-cw')
	if (cw === 'yes') {
		if (!$('#cw').hasClass('cw-avail')) {
			$('#cw-text').show()
			$('#cw').addClass('yellow-text')
			$('#cw').addClass('cw-avail')
			const cwt = localStorage.getItem('cw-text')
			if (cwt) {
				$('#cw-text').val(cwt)
			}
		}
	}
	jQuery('.box, .boxIn').resizable({
		minHeight: 50,
		minWidth: 50,
		grid: 50,
		resize: function (event, ui) {
			$(this).css('min-width', ui.size.width + 'px')
			$(this).css('max-width', ui.size.width + 'px')
			$(this).css('min-height', ui.size.height + 'px')
			$(this).css('max-height', ui.size.height + 'px')
		},
		stop: function (event, ui) {
			const width = ui.size.width
			const height = ui.size.height
			if ($(this).hasClass('boxIn')) {
				//縦幅。その縦幅を持つカラムのidは
				if (!$(this).attr('tlid')) return
				const key = parseInt($(this).attr('tlid') || '0', 10)
				const column = columns[key]
				column.height = height
				columns[key] = column
			} else {
				//横幅。その縦幅を持つカラムのidは
				if (!$(this).attr('tlid')) return
				const key = parseInt($(this).find('.boxIn').attr('tlid') || '0', 10)
				const column = columns[key]
				column.width = width
				columns[key] = column
			}
			setColumn(columns)
		},
	})
}
export function checkStr(key: number) {
	const column = getColumn()[key]
	const { type, data, domain } = column
	if ($('#notice_icon_' + key).hasClass('red-text') && type !== 'notf' && type !== 'mix') {
		goTop(key)
		tlDiff(type, data, domain.toString(), key.toString())
	} else {
		goTop(key)
	}
}
//セカンダリートゥートボタン
function secvis(set: IVis) {
	if (set === 'public') {
		$('#toot-sec-icon').text('public')
		$('#toot-sec-btn').addClass('purple')
	} else if (set === 'unlisted') {
		$('#toot-sec-icon').text('lock_open')
		$('#toot-sec-btn').addClass('blue')
	} else if (set === 'private') {
		$('#toot-sec-icon').text('lock')
		$('#toot-sec-btn').addClass('orange')
	} else if (set === 'direct') {
		$('#toot-sec-icon').text('mail')
		$('#toot-sec-btn').addClass('red')
	} else if (set === 'limited') {
		$('#toot-sec-icon').text('group')
		$('#toot-sec-btn').addClass('teal')
	} else if (set === 'local') {
		$('#toot-sec-icon').text('visibility')
		$('#toot-sec-btn').addClass('light-blue')
	}
	$('#toot-sec-btn').removeClass('hide')
}
//カラム追加
export function addColumn() {
	let acct = $('#add-acct-sel').val()?.toString() || '0'
	if (acct !== 'webview' && acct !== 'noauth') localStorage.setItem('last-use', acct)
	let type = $('#type-sel').val()?.toString() || 'home'
	let data: IColumnData | undefined = undefined
	if (acct === 'noauth') {
		const domainVal = $('#noauth-url').val()?.toString()
		if (!domainVal) return Swal.fire(`no domain value`)
		acct = '0'
		data = domainVal
		type = 'noauth'
	} else if (acct === 'webview') {
		acct = '0'
		type = 'webview'
	}
	if (!isColumnType(type)) return Swal.fire('Not valid TL type')
	const add = {
		domain: parseInt(acct, 10),
		type: type,
		data,
	}
	const obj = getColumn()
	if (!obj) {
		setColumn([add])
	} else {
		obj.push(add)
		setColumn(obj)
	}
	parseColumn('add')
}
export function addselCk() {
	const acct = $('#add-acct-sel').val()
	if (acct === 'webview') {
		$('#auth').addClass('hide')
		$('#noauth').addClass('hide')
		$('#webview-add').removeClass('hide')
	} else if (acct === 'noauth') {
		$('#auth').addClass('hide')
		$('#noauth').removeClass('hide')
		$('#webview-add').addClass('hide')
	} else {
		$('#auth').removeClass('hide')
		$('#noauth').addClass('hide')
		$('#webview-add').addClass('hide')
	}
	$('#direct-add').remove()
}
//カラム削除
export async function removeColumn(tlidStr: string) {
	const tlid = parseInt(tlidStr, 10)
	const result = await Swal.fire({
		title: lang.lang_layout_deleteColumn,
		text: lang.lang_layout_deleteColumnDesc,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
	})
	if (result.value) {
		const obj = getColumn()
		const data = obj[tlid]
		obj.splice(tlid, 1)
		setColumn(obj)
		sortLoad()
		$('#timeline_box_' + tlid + '_box').remove()
		if (!data.left_fold) $('#timeline_box_' + tlid + '_parentBox').remove()
	}
}

//設定トグル
export function setToggle(tlid: string) {
	colorPicker(tlid)
	if ($(`#util-box_${tlid}`).hasClass('column-hide')) {
		$(`#util-box_${tlid}`).css('display', 'block')
		$(`#util-box_${tlid}`).animate(
			{ height: '200px' },
			{
				duration: 300,
				complete: function () {
					$(`#util-box_${tlid}`).css('overflow-y', 'scroll')
					$(`#util-box_${tlid}`).removeClass('column-hide')
				},
			}
		)
	} else {
		$(`#util-box_${tlid}`).css('overflow-y', 'hidden')
		$(`#util-box_${tlid}`).animate(
			{ height: '0' },
			{
				duration: 300,
				complete: function () {
					$(`#util-box_${tlid}`).addClass('column-hide')
					$(`#util-box_${tlid}`).css('display', 'none')
				},
			}
		)
	}
}
//タグトグル
//設定トグル
export function setToggleTag(tlid: string) {
	if ($('#tag-box_' + tlid).hasClass('column-hide')) {
		$('#tag-box_' + tlid).css('display', 'block')
		$('#tag-box_' + tlid).animate(
			{ height: '200px' },
			{
				duration: 300,
				complete: function () {
					$('#tag-box_' + tlid).css('overflow-y', 'scroll')
					$('#tag-box_' + tlid).removeClass('column-hide')
				},
			}
		)
	} else {
		$('#tag-box_' + tlid).css('overflow-y', 'hidden')
		$('#tag-box_' + tlid).animate(
			{ height: '0' },
			{
				duration: 300,
				complete: function () {
					$('#tag-box_' + tlid).addClass('column-hide')
					$('#tag-box_' + tlid).css('display', 'none')
				},
			}
		)
	}
}
export function colorPicker(key: string) {
	const temp = `<div onclick="colorAdd('${key}','def','def')" class="pointer">Default</div>
		<div onclick="colorAdd('${key}','f44336','white')" class="red white-text pointer">Red</div>
		<div onclick="colorAdd('${key}','e91e63','white')" class="pink white-text pointer">Pink</div>
		<div onclick="colorAdd('${key}','9c27b0','white')" class="purple white-text pointer">Purple</div>
		<div onclick="colorAdd('${key}','673ab7','white')" class="deep-purple white-text pointer">Deep-purple</div>
		<div onclick="colorAdd('${key}','3f51b5','white')" class="indigo white-text pointer">Indigo</div>
		<div onclick="colorAdd('${key}','2196f3','white')" class="blue white-text pointer">Blue</div>
		<div onclick="colorAdd('${key}','03a9f4','black')" class="light-blue black-text pointer">Light-blue</div>
		<div onclick="colorAdd('${key}','00bcd4','black')" class="cyan black-text pointer">Cyan</div>
		<div onclick="colorAdd('${key}','009688','white')" class="teal white-text pointer">Teal</div>
		<div onclick="colorAdd('${key}','4caf50','black')" class="green black-text pointer">Green</div>
		<div onclick="colorAdd('${key}','8bc34a','black')" class="light-green black-text pointer">Light-green</div>
		<div onclick="colorAdd('${key}','cddc39','black')" class="lime black-text pointer">Lime</div>
		<div onclick="colorAdd('${key}','ffeb3b','black')" class="yellow black-text pointer">Yellow</div>
		<div onclick="colorAdd('${key}','ffc107','black')" class="amber black-text pointer">Amber</div>
		<div onclick="colorAdd('${key}','ff9800','black')" class="orange black-text pointer">Orange</div>
		<div onclick="colorAdd('${key}','ff5722','white')" class="deep-orange white-text pointer">Deep-orange</div>
		<div onclick="colorAdd('${key}','795548','white')" class="brown white-text pointer">Brown</div>
		<div onclick="colorAdd('${key}','9e9e9e','white')" class="grey white-text pointer">Grey</div>
		<div onclick="colorAdd('${key}','607d8b','white')" class="blue-grey white-text pointer">Blue-grey</div>
		<div onclick="colorAdd('${key}','000000','white')" class="black white-text pointer">Black</div>
		<div onclick="colorAdd('${key}','ffffff','black')" class="white black-text pointer">White</div>`
	$('#picker_' + key).html(temp)
}
export function colorAdd(key: number, bg: string, txt: 'black' | 'white' | 'def') {
	const o = getColumn()
	const obj = o[key]
	obj.background = bg
	obj.text = txt
	o[key] = obj
	setColumn(o)
	if (txt === 'def') {
		$(`#menu_${key}`).css('background-color', '')
		$(`#menu_${key}`).css('color', '')
		$(`#menu_${key} .nex`).css('color', '')
	} else {
		$(`#menu_${key}`).css('background-color', `#${bg}`)
		const isBlack = txt === 'black'
		const bghex = isBlack ? '000000' : 'ffffff'
		const ichex = isBlack ? '9e9e9e' : 'eeeeee'
		$('#menu_' + key + ' .nex').css('color', `#${ichex}`)
		$('#menu_' + key).css('color', `#${bghex}`)
	}
}
export function colorAddMulti(key: number, bg: string, txt: 'black' | 'white' | 'def') {
	const o = getMulti()
	const obj = o[key]
	obj.background = bg
	obj.text = txt
	o[key] = obj
	setMulti(o)
	if (txt === 'def') {
		$(`#acct_${key}`).css('background-color', '')
		$(`#acct_${key}`).css('color', '')
		$(`#acct_${key} .nex`).css('color', '')
	} else {
		const isBlack = txt === 'black'
		const bghex = isBlack ? '000000' : 'ffffff'
		const ichex = isBlack ? '9e9e9e' : 'eeeeee'
		$(`#acct_${key}`).css('background-color', `#${bg}`)
		$('#acct_' + key + ' .nex').css('color', `#${ichex}`)
		$('#acct_' + key).css('color', `#${bghex}`)
	}
}
//禁断のTwitter
function webviewParse(url: string, key: number, insert: string, insertColor: string, css) {
	const html = `<div class="box" id="timeline_box_${key}_box" tlid="${key}" style="${css}">
			<div class="notice-box z-depth-2" id="menu_${key}" style="${insert}">
				<div class="area-notice">
					<i class="fab fa-twitter waves-effect" id="notice_icon_${key}" style="font-size:40px; padding-top:25%;"></i>
				</div>
				<div class="area-notice_name tl-title">WebView('${url}')</div>
				<div class="area-sta">
				</div>
				<div class="area-a2">
					<a onclick="removeColumn('${key}')" class="setting nex">
						<i class="material-icons waves-effect nex" title="${lang.lang_layout_delthis}" ${insertColor}>cancel</i>
					</a>
				</div>
				<div class="area-a3">
					<a onclick="setToggle('${key}')" class="setting nex" title="${lang.lang_layout_setthis}" ${insertColor}>
						<i class="material-icons waves-effect nex">settings</i>
					</a>
				</div>
			</div>
			<div class="column-hide notf-indv-box z-depth-4" id="notf-box_${key}"></div>
			<div class="column-hide notf-indv-box" id="util-box_${key}" style="padding:5px;">
				${lang.lang_layout_headercolor}
				<br>
				<div id="picker_${key}" class="color-picker"></div>
			</div>
			<div class="tl-box" tlid="${key}" style="width:100%;height:100%;">
				<div id="timeline_${key}" class="tl" tlid="${key}" data-type="webview" style="width:100%;height:100%;">
					<webview src="${url}" style="width:100%;height:100%;" id="webview" preload="./js/platform/twitter.js"></webview>
				</div>
			</div>
		</div>`
	return html
}
function unstreamingTL(type: IColumnType, key: number, basekey: number, insert: string, insertColor: string, leftFold: boolean, css: string, animecss: string, acctId: string, data?: IColumnData) {
	//type名が関数名
	let leftHold = `<a onclick="leftFoldRemove(${key})" class="setting nex">
			<i class="material-icons waves-effect nex" title="${lang.lang_layout_leftUnfold}">view_column</i>
		</a>
		${lang.lang_layout_leftUnfold}
		</span><br>`
	if (!leftFold) {
		const baseHtml = `<div style="${css}" class="box ${animecss}" id="timeline_box_${basekey}_parentBox"></div>`
		$('#timeline-container').append(baseHtml)
		leftHold = `<a onclick="leftFoldSet(${key})" class="setting nex">
				<i class="material-icons waves-effect nex" title="${lang.lang_layout_leftFold}">view_agenda</i>
			</a>
			${lang.lang_layout_leftFold}
			</span><br>`
	}
	const dataHtml = type === 'utl' ? false : (data || acctId)
	let typeFunc: string = type
	if (type === 'fav') typeFunc = 'favTl'
	const html = `<div class="boxIn" id="timeline_box_${key}_box" tlid="${key}">
			<div class="notice-box z-depth-2" id="menu_${key}" style="${insert} ">
				<div class="area-notice">
					<i class="material-icons waves-effect" id="notice_icon_${key}" style="font-size:40px; padding-top:25%;" 
						onclick="goTop(${key}); ${typeFunc}('${key}','${dataHtml}');" title="${lang.lang_layout_gotop}"></i>
				</div>
				<div class="area-notice_name">
					<span id="notice_${key}" class="tl-title"></span>
				</div>
				<div class="area-a1"></div>
				<div class="area-sta"></div>
				<div class="area-a2">
					<a onclick="removeColumn('${key}')" class="setting nex">
						<i class="material-icons waves-effect nex" title="${lang.lang_layout_delthis}"${insertColor}>cancel</i>
					</a>
				</div>
				<div class="area-a3">
					<a onclick="setToggle('${key}')" class="setting nex" title="${lang.lang_layout_setthis}" ${insertColor}>
						<i class="material-icons waves-effect nex">settings</i>
					</a>
				</div>
			</div>
		<div class="column-hide notf-indv-box" id="util-box_${key}" style="padding:5px;">
			${leftHold}
			<a onclick="mediaToggle('${key}')" class="setting nex">
				<i class="material-icons waves-effect nex" title="${lang.lang_layout_mediafil}">perm_media</i>
				<span id="sta-media-${key}">On</span>
			</a>
			${lang.lang_layout_mediafil}<br>
			${lang.lang_layout_headercolor}<br>
			<div id="picker_${key}" class="color-picker"></div>
		</div>
		<div class="tl-box" tlid="${key}">
			<div id="timeline_${key}" class="tl ${type}-timeline" tlid="${key}" data-type="${type}" data-acct="${data}">
				<div id="landing_${key}" style="text-align:center">
					${lang.lang_layout_nodata}
				</div>
			</div>
		</div>`
	$('#timeline_box_' + basekey + '_parentBox').append(html)
	if (type === 'bookmark') {
		bookmark(key, acctId)
	} else if (type === 'fav') {
		favTl(key, acctId)
	} else if (type === 'utl') {
		const isUtlData = (item: IColumnData): item is IColumnUTL => typeof item !== 'string' && item['acct']
		if (!data || !isUtlData(data)) return
		utl(key, acctId, data)
	}
	cardCheck(key)
	ebtCheck(key)
	mediaCheck(key)
	voiceCheck(key)
	return true
}
export function bookmark(key: number, acctId: string) {
	const voice = localStorage.getItem(`voice_${key}`) === 'yes'
	tl('bookmark', undefined, acctId, key.toString(), voice)
}
export function favTl(key: number, acctId: string) {
	const voice = localStorage.getItem(`voice_${key}`) === 'yes'
	tl('fav', undefined, acctId, key.toString(), voice)
}
export function utl(key: number, acctId: string, data: IColumnData) {
	if (!data) {
		const obj = getColumn()
		const dataObj = obj[key].data
		if (!dataObj) return
		data = dataObj
		acctId = obj[key].domain.toString()
	}

	const voice = localStorage.getItem(`voice_${key}`) === 'yes'
	tl('utl', data, acctId, key.toString(), voice)
}
export function leftFoldSet(key: number) {
	const obj = getColumn()
	obj[key].left_fold = true
	setColumn(obj)
	parseColumn()
}
export function leftFoldRemove(key: number) {
	const obj = getColumn()
	obj[key].left_fold = false
	setColumn(obj)
	parseColumn()
}
export function resetWidth(key: number) {
	const obj = getColumn()
	obj[key].width = undefined
	if (obj[key].height) $(`#timeline_box_${key}_parentBox .boxIn`).attr('style', '')
	obj[key].height = undefined
	setColumn(obj)
	$(`#timeline_box_${key}_parentBox`).attr('style', '')
}
