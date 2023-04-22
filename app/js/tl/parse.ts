import { Account, Emoji, Notification, Toot } from '../../interfaces/MastodonApiReturns'
import { IColumnType } from '../../interfaces/Storage'
import lang from '../common/lang'
import { escapeHTML, stripTags, strlenMultibyte, substrMultibyte, twemojiParse } from '../platform/first'
import { date, isDateType } from './date'
import { notfParse } from './notfParse'
import punycode from 'punycode'
import { pollParse } from './pollParse'
import { parseBlur } from '../common/blurhash'
import { cardHtml } from './card'
import { v4 as uuid } from 'uuid'
import { getMeta } from '../platform/plugin'
import Swal from 'sweetalert2'
import { toast } from '../common/declareM'
import { parseColumn } from '../ui/layout'
const qt = localStorage.getItem('quote')
const bkm = localStorage.getItem('bookmark')
const datetype = localStorage.getItem('datetype') || 'absolute'
const nsfw = (localStorage.getItem('nsfw') || 'yes') === 'yes'
const sent = parseInt(localStorage.getItem('sentence') || '500', 10)
const ltr = parseInt(localStorage.getItem('letters') || '500', 10)
const gif = (localStorage.getItem('gif') || 'yes') === 'yes'
const imhOrig = localStorage.getItem('img-height') || '200'
const empCli = JSON.parse(localStorage.getItem('client_emp') || '[]')
const muteCli = JSON.parse(localStorage.getItem('client_mute') || '[]')
const useremp = JSON.parse(localStorage.getItem('user_emp') || '[]')
const wordempList = JSON.parse(localStorage.getItem('word_emp') || '[]')
const wordmuteListLocal = JSON.parse(localStorage.getItem('word_mute') || '[]')
const tickerck = localStorage.getItem('ticker_ok') || 'no'
const cw = (localStorage.getItem('cw') || 'yes') === 'yes'
const viashowSet = (localStorage.getItem('viashow') || 'no') === 'yes'
const anime = (localStorage.getItem('animation') || 'yes') === 'yes'
const mouseoverVal = localStorage.getItem('mouseover')
const replyCtView = localStorage.getItem('replyct') || 'hidden'
const tickerDataRaw = localStorage.getItem('sticker')
type IBoostBack = 'shared' | 'unshared' | 'emphasized' | 'hide' | 'hide by_filter'
export interface INotf {
	event: Notification['type']
	eventBy: Account
	createdAt: string
	id: string
	fromStreaming: boolean
}
//オブジェクトパーサー(トゥート)
export function parse<T = string | string[]>(obj: Toot[], type: IColumnType | 'pinned' | null, acctId: string, tlid: string, popup?: number, wordmuteList?: string[], notif?: INotf) {
	let templete = ''
	const me = localStorage.getItem('user-id_' + acctId)
	if (!isDateType(datetype)) return ''
	const actb = 're,rt,fav,qt,bkm'
	const disp: any = {}
	if (actb) {
		const acta = actb.split(',')
		for (let k = 0; k < acta.length; k++) {
			const tp = k < 5 ? 'type-a' : 'type-b'
			disp[acta[k]] = tp
		}
	}
	let qtClass = 'hide'
	if (qt !== 'nothing' && qt) {
		if (qt === 'apiQuote') {
			if (localStorage.getItem('quote_' + acctId)) {
				qtClass = ''
			} else {
				qtClass = 'hide'
			}
		} else {
			qtClass = ''
		}
	}
	let bkmClass = ''
	if (bkm === 'no' || !bkm) {
		bkmClass = 'hide'
	}
	let imh = imhOrig
	if (imh === 'full') {
		imh = 'auto'
	} else {
		imh = imh + 'px'
	}
	//ワードミュート
	if (wordmuteListLocal) {
		wordmuteList = wordmuteListLocal.concat(wordmuteList)
	}
	const ticker = tickerck === 'yes'
	//Animation
	const animecss = anime ? 'cvo-anime' : ''
	//Cards
	const card = localStorage.getItem('card_' + tlid)
	//認証なしTL
	const isNoAut = type === 'noauth'
	const noAuth = isNoAut ? 'hide' : ''
	const antiNoAuth = !isNoAut ? 'hide' : ''
	//DMTL
	const isDm = type === 'dm'
	const dmHide = isDm ? 'hide' : ''
	const antiDmHide = !isDm ? 'hide' : ''
	//マウスオーバーのみ
	let mouseover = ''
	if (mouseoverVal === 'yes' || mouseoverVal === 'click') mouseover = 'hide-actions'
	const local = []
	const times = []
	let content
	for (const key in obj) {
		const domain = localStorage.getItem('domain_' + acctId)
		let toot = obj[key]
		const notfParsed = notfParse(notif, acctId, tlid, popup || 0, toot.content)
		let { noticeAvatar, noticeText } = notfParsed
		const { ifNotf } = notfParsed
		const uniqueid = toot.id
		let boostback: IBoostBack = 'unshared'
		let disName = escapeHTML(toot.account.display_name || toot.account.acct)
		if (toot.reblog) {
			disName = escapeHTML(toot.account.display_name || toot.account.acct)
			//絵文字があれば
			if (toot.account.emojis) disName = customEmojiReplace(disName, toot.account, gif)
			noticeAvatar = gif ? toot.account.avatar : toot.account.avatar_static
			noticeAvatar = `<a onclick="udg('${toot.account.id}','${acctId}');" user="${toot.account.acct}" class="udg" aria-hidden="true">
						<img draggable="false" src="${noticeAvatar}" width="20" class="notf-icon prof-img" 
							user="${toot.account.acct}" onerror="this.src='../../img/loading.svg'" loading="lazy">
					</a>`
			const rticon = 'fa-retweet light-blue-text'
			noticeText = `<span onclick="udg('${toot.account.id}','${acctId}');" class="pointer"><i class="big-text fas ${rticon}"></i>${disName}(@${toot.account.acct})</span><br>`
			boostback = 'shared'
			toot = toot.reblog
		} else {
			//ユーザー強調
			if (useremp) {
				const domain = localStorage.getItem('domain_' + acctId)
				const fullName = toot.account.username !== toot.account.acct ? toot.account.acct : toot.account.acct + '@' + domain
				for (const user of useremp) {
					if (user === fullName) boostback = 'emphasized'
				}
			}
		}
		disName = escapeHTML(toot.account.display_name || toot.account.acct)
		if (toot.content === '') {
			content = '　'
		} else {
			content = toot.content
		}
		const id = toot.id
		let locked = toot.account.locked ? ' <i class="fas fa-lock red-text"></i>' : ''
		if (toot.edited_at) {
			locked = locked + ` <i class="material-icons teal-text" style="font-size: 0.8rem" title="Edited at ${date(toot.edited_at, 'absolute')}">create</i>`
		}
		let viashow = 'hide'
		let via = ''
		if (toot.application && viashowSet) {
			viashow = ''
			const isHasApp = (item: any): item is { name: string } => !!item.name
			via = isHasApp(toot.application) ? escapeHTML(toot.application.name) : ''
			if (empCli) {
				//強調チェック
				for (const empCliList of empCli) {
					if (empCliList === via) {
						boostback = 'emphasized'
						break
					}
				}
			}
			if (muteCli) {
				//ミュートチェック
				for (const muteCliList of muteCli) {
					if (muteCliList === via) {
						boostback = 'hide'
						break
					}
				}
			}
		}
		if (type === 'pinned') {
			locked = locked + ` <i class="fas fa-thumb-tack red-text"></i>`
			boostback = 'emphasized'
		}
		let spoil = ''
		let spoiler = ''
		let apiSpoil = ''
		let spoilerShow = ''
		if (toot.spoiler_text && cw) {
			spoil = escapeHTML(toot.spoiler_text)
			spoiler = 'cw cw_hide'
			apiSpoil = 'gray'
			spoilerShow = `<a href="#" onclick="cwShow(this)" class="nex parsed cw_btn">${lang.lang_parse_cwshow}<span class="voice">${lang.lang_parse_cwshow_acc}</span></a><br>`
		} else {
			const ct1 = content.split('</p>').length + content.split('<br />').length - 2
			const ct2 = content.split('</p>').length + content.split('<br>').length - 2
			const ct = Math.max(ct1, ct2)
			if ((sent < ct && strlenMultibyte(stripTags(content)) > 5) || (strlenMultibyte(stripTags(content)) > ltr && strlenMultibyte(stripTags(content)) > 5)) {
				content = `<span class="gray">${lang.lang_parse_fulltext}</span><br>` + content
				spoil = `<span class="cw_long">${`${toot.spoiler_text}<span class="gray">(CW)</span> ` || ''}${substrMultibyte(stripTags(content), 0, 100)}</span>
						<span class="gray">${lang.lang_parse_autofold}(${ct}${lang.lang_parse_br}${strlenMultibyte(stripTags(content))}${lang.lang_parse_letters})</span>`
				spoiler = 'cw cw_hide'
				spoilerShow = `<a href="#" onclick="cwShow(this)" class="nex parsed cw_btn">
							${lang.lang_parse_more}
						</a><br>`
			}
		}
		const urls = stripTags(content)
			.replace(/\n/g, ' ')
			.match(/https?:\/\/([^+_]+)\/?(?!.*((media|tags)|mentions)).*([-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)?/)
		const utlSck = content.match(/(https?):\/\/([^<>]*?)\/([^"]*)/g)
		content = content.replace(/href="([^"]+)"/g, `href="$1" data-acct="${acctId}"`)
		if (utlSck) {
			for (let urlIndv of utlSck) {
				const urlCont = urlIndv.match(/(https?):\/\/([^a-zA-Z0-9.-]*?)\.(.+?)\/([^"]*)/)
				if (urlCont) {
					urlIndv = urlIndv.replace(/[.*+?^=!:${}()|[\]/\\]/g, '\\$&')
					const encoded = encodeURI(urlCont[4])
					const punycoded = 'xn--' + punycode.encode(urlCont[2])
					const eUrl = urlCont[1] + '://' + punycoded + '.' + urlCont[3] + '/' + encoded
					const regExp = new RegExp(`href="${urlIndv}"`, 'g')
					content = content.replace(regExp, `href="${eUrl}"`)
				}
			}
		}
		let analyze = urls
			? `<a onclick="additionalIndv('${tlid}','${acctId}','${id}')" class="add-show pointer" aria-hidden="true">
						${lang.lang_parse_url}
					</a><br>`
			: ''
		let viewer = ''
		let hasmedia = 'nomedia'
		//Poll
		let poll = toot.poll ? pollParse(toot.poll, acctId, toot.emojis) : ''
		const mediaList = toot.media_attachments
		const mediack = mediaList[0]
		//メディアがあれば
		let media_ids = ''
		let sense = ''
		let nsfwmes = ''
		if (mediack) {
			hasmedia = 'hasmedia'
			const cwdt = 100 / mediaList.length
			let key2 = 0
			for (const media of mediaList) {
				let purl = media.preview_url
				media_ids = media_ids + media.id + ','
				const url = media.url
				const remote_url = media.remote_url
				if (toot.sensitive && nsfw) {
					const blur = media.blurhash
					nsfwmes = `<div class="nsfw-media">${lang.lang_parse_nsfw}</div>`
					if (blur) {
						purl = parseBlur(blur) || ''
						sense = ''
					} else {
						sense = 'sensitive'
					}
				}
				if (media.pleroma && media.pleroma.mime_type.indexOf('video') !== -1) {
					viewer =
						viewer +
						`<a onclick="imgv('${id}',${key2},'${acctId}')" id="${id}'-image-${key2}" 
								data-url="${url}" data-type="video" class="img-parsed">
									<video src="${purl}" class="${sense} toot-img pointer" style="max-width:100%;" loop="true" alt="attached media">
							</a></span>`
				} else {
					if (media.type === 'unknown') {
						const m = media.remote_url?.match(/.+(\..+)$/)
						if (!m) continue
						const mty = m[1]
						viewer =
							viewer +
							`<a href="${media.url ? media.url : media.remote_url}" title="${media.url ? media.url : media.remote_url}">[${lang.lang_parse_unknown}(${mty})]</a>${
								media.url ? `<a href="${media.remote_url}"><i class="material-icons sublink" title="${media.remote_url}">open_in_new</i></a>` : ''
							} `
					} else if (media.type === 'audio') {
						viewer = viewer + `<audio src="${url}" class="pointer" style="width:100%;" controls alt="attached media"></span>`
					} else {
						const desc = media.description || ''
						if (media.preview_url === `https://${domain}/storage/no-preview.png`) {
							purl = url
							nsfwmes = '<div class="nsfw-media">Unavailable preview</div>'
						}
						viewer =
							viewer +
							`<a onclick="imgv('${id}',${key2},'${acctId}')" 
										id="${id}-image-${key2}" data-url="${url}" data-original="${remote_url}" data-type="${media.type}" 
										class="img-parsed img-link" style="width:calc(${cwdt}% - 1px); height:${imh};">
									<img draggable="false" src="${purl}" class="${sense} toot-img pointer" 
										onerror="this.src='../../img/loading.svg'" title="${escapeHTML(desc)}" alt="${escapeHTML(desc)}" loading="lazy">
									${nsfwmes}
								</a>`
					}
				}
				key2++
			}
			media_ids = media_ids.slice(0, -1)
		}
		let mentions = ''
		const toMention: string[] = []
		//メンションであれば
		if (toot.mentions && toot.mentions.length) {
			mentions = ''
			for (const mention of toot.mentions) {
				//自分は除外
				//自インスタンスかどうかを確認し、IDの一致
				if (mention.acct !== mention.username || mention.id !== me) {
					//そのトゥの人NG
					if (toot.account.acct !== mention.acct) {
						mentions = mentions + `<a onclick="udg('${mention.id}','${acctId}')" class="pointer" aria-hidden="true">@${mention.acct}</a> `
						toMention.push(mention.acct)
					}
				}
			}
			toMention.push(toot.account.acct)
			mentions = `<div style="float:right">${mentions}</div>`
		} else {
			toMention.push(toot.account.acct)
		}
		//メンションじゃなくてもlang_parse_thread
		if (toot.in_reply_to_id) {
			mentions = `<div style="float:right">
						<a onclick="details('${toot.id}','${acctId}','${tlid}')" class="pointer waves-effect">
							${lang.lang_parse_thread}
						</a></div>`
		}
		//リプ数
		let replyct: string | number = toot.replies_count || 0
		if (toot.replies_count || toot.replies_count === 0) {
			if (replyCtView === 'hidden' && replyct > 1) {
				replyct = '1+'
			}
		}
		//公開範囲を取得
		const visEn = toot.visibility
		let useVisTxt = lang.lang_parse_public
		if (visEn === 'unlisted') useVisTxt = lang.lang_parse_unlisted
		if (visEn === 'private') useVisTxt = lang.lang_parse_private
		if (visEn === 'direct') useVisTxt = lang.lang_parse_direct
		const isRtable = visEn === 'public' || visEn === 'unlisted'
		const canRt = isRtable || me === toot.account.id ? '' : 'unvisible'
		const iconList = {
			public: 'public',
			unlisted: 'lock_open',
			private: 'lock',
			direct: 'mail',
		}
		const colorList = {
			public: 'public',
			unlisted: 'blue',
			private: 'orange',
			direct: 'red',
		}
		const iconVis = iconList[visEn] || ''
		const colorVis = colorList[visEn] || ''
		const vis = `<span onclick="staCopy('${id}')"><i class="text-darken-3 material-icons ${colorVis}-text sml vis-data pointer" 
						title="${useVisTxt}(${lang.lang_parse_clickcopy})" data-vis="${visEn}" aria-hidden="true">
						${iconVis}
					</i><span class="voice">${useVisTxt} ${lang.lang_toot}(${lang.lang_parse_clickcopy})</span></span>`
		const ifMine = toot.account.id === me ? '' : 'hide'
		const faved = toot.favourited
		const ifFav = faved ? ' yellow-text' : ''
		const favApp = faved ? 'faved' : ''
		const rted = toot.reblogged
		const ifRt = rted ? ' light-blue-text' : ''
		const rtApp = rted ? 'rted' : ''
		const pinned = toot.pinned
		const ifPin = pinned ? 'blue-text' : ''
		const pinApp = pinned ? 'pinnedToot' : ''
		const pinStr = pinned ? lang.lang_parse_pin : lang.lang_parse_unpin
		const bkmed = toot.bookmarked
		const ifBkm = bkmed ? 'red-text' : ''
		const bkmApp = bkmed ? 'bkmed' : ''
		const bkmStr = bkmed ? lang.lang_parse_unbookmark : lang.lang_parse_bookmark
		//アニメ再生
		const avatar = gif ? toot.account.avatar : toot.account.avatar_static
		//ワードミュート
		if (wordmuteList) {
			for (const worde of wordmuteList) {
				if (worde) {
					const wordList = worde
					const regExp = new RegExp(wordList.replace(/[.*+?^=!:${}()|[\]/\\]/g, '\\$&'), 'g')
					if (stripTags(content).match(regExp)) {
						boostback = 'hide by_filter'
					}
				}
			}
		}
		//ワード強調
		if (wordempList) {
			for (const wordList of wordempList) {
				if (wordList) {
					const regExp = new RegExp(wordList.replace(/[.*+?^=!:${}()|[\]/\\]/g, '\\$&'), 'g')
					content = content.replace(regExp, '<span class="emp">' + wordList + '</span>')
				}
			}
		}
		//絵文字があれば
		if (toot.emojis) {
			content = customEmojiReplace(content, toot, gif)
			spoil = customEmojiReplace(spoil, toot, gif)
			poll = customEmojiReplace(poll || '', toot, gif)
		}
		//デフォ絵文字
		const contentElement = document.createElement('div')
		contentElement.innerHTML = content
		const emojified = twemojiParse(contentElement)
		content = emojified.innerHTML
		if (disName) disName = customEmojiReplace(disName, toot.account, gif)
		if (disName) disName = twemojiParse(disName)
		if (spoil) spoil = twemojiParse(spoil)
		if (noticeText) noticeText = twemojiParse(noticeText)
		if (poll) poll = twemojiParse(poll)
		//日本語じゃない
		let trans = ''
		if (toot.language !== lang.language && toot.language) {
			trans = `<li onclick="trans('${acctId}', $(this))" style="padding:0; padding-top: 5px;" tabIndex="6">
						<i class="material-icons" aria-hidden="true">g_translate</i>${lang.lang_parse_trans}
					</li>`
		}
		let threadMute = ''
		if (toot.in_reply_to_account_id) {
			threadMute = `<li onclick="muteThread('${toot.id}', '${acctId}')" style="padding:0; padding-top: 5px;" tabIndex="7" class="threadMute ${toot.muted && 'inMute'}">
						<i class="material-icons">voice_over_off</i>
						${toot.muted ? lang.lang_status_unmuteThread : lang.lang_status_muteThread}
					</li>`
		}
		//Cards
		if (!card && toot.card) {
			const cards = toot.card
			analyze = cardHtml(cards, acctId, id)
		}
		//Ticker
		let tickerdom = ''
		if (ticker) {
			if (tickerDataRaw) {
				const tickerDataJson = JSON.parse(tickerDataRaw || '[]')
				const tickerData = tickerDataJson.data
				const thisDomains = toot.account.acct.split('@')
				let thisDomain = ''
				if (thisDomains.length > 1) thisDomain = thisDomains[1]
				for (let i = 0; i < tickerData.length; i++) {
					const value = tickerData[i]
					if (value.domain === thisDomain) {
						let bgColor = value.bgColor
						let fontColor = value.fontColor
						if (!value.bgColor || !value.fontColor) {
							if (value.type === 'mastodon') {
								if (!value.bgColor) bgColor = tickerDataJson.default.mastodon.bgColor
								if (!value.fontColor) fontColor = tickerDataJson.default.mastodon.fontColor
							} else if (value.type === 'pleroma') {
								if (!value.bgColor) bgColor = tickerDataJson.default.pleroma.bgColor
								if (!value.fontColor) fontColor = tickerDataJson.default.pleroma.fontColor
							} else if (value.type === 'misskey') {
								if (!value.bgColor) bgColor = tickerDataJson.default.misskey.bgColor
								if (!value.fontColor) fontColor = tickerDataJson.default.misskey.fontColor
							} else if (value.type === 'misskeylegacy') {
								if (!value.bgColor) bgColor = tickerDataJson.default.misskeylegacy.bgColor
								if (!value.fontColor) fontColor = tickerDataJson.default.misskeylegacy.fontColor
							} else if (value.type === 'pixelfed') {
								if (!value.bgColor) bgColor = tickerDataJson.default.pixelfed.bgColor
								if (!value.fontColor) fontColor = tickerDataJson.default.pixelfed.fontColor
							}
						} else {
							bgColor = value.bgColor
							fontColor = value.fontColor
						}
						let bgColorCSS = ''
						for (let j = 0; j < bgColor.length; j++) {
							const bg = bgColor[j]
							bgColorCSS = bgColorCSS + bg + ','
						}
						bgColorCSS = `linear-gradient(90deg, ${bgColorCSS} transparent)`
						tickerdom = `<div aria-hidden="true" style="user-select:none;cursor:default;background:${bgColorCSS} !important; color:${fontColor};width:100%; height:0.9rem; font-size:0.8rem;" class="tickers">
									<img draggable="false" src="${value.favicon}" style="height:100%;" onerror="this.src='../../img/loading.svg'" loading="lazy">
									<span style="position:relative; top:-0.2rem;">${escapeHTML(value.name)}</span>
								</div>`
						break
					}
				}
			}
		}
		//Quote
		if (toot.quote) {
			const quoteUser = toot.quote.account.display_name || toot.quote.account.acct
			if (!toot.quote.quote_muted) {
				poll =
					poll +
					`<div class="quote-renote">
						<div class="renote-icon">
							<a onclick="udg('${toot.quote.account.id}','${acctId}');" user="${toot.quote.account.acct}" class="udg">
								<img draggable="false" src="${toot.quote.account.avatar}" loading="lazy">
							</a>
						</div>
						<div class="renote-user">
							${escapeHTML(quoteUser)}
						</div>
						<div class="renote-text">
							${toot.quote.content}
						</div>
						<div class="renote-details">
							<a onclick="details('${toot.quote.id}','${acctId}','${tlid}')" class="waves-effect waves-dark btn-flat details" style="padding:0">
								<i class="text-darken-3 material-icons">more_vert</i>
							</a>
						</div>
					</div>`
			} else {
				poll = poll + `<span class="gray sml">${lang.lang_parse_hidden}</span>`
			}
		}
		//menuは何個？
		let menuct = 2
		if (viashow !== 'hide') menuct++
		if (ifMine !== 'hide') menuct = menuct + 3
		if (noAuth === 'hide') menuct = 0
		if (trans !== '') menuct++
		//このトゥート内のアクションを完了させるために、適当にIDを振る
		const rand = uuid()
		//プラグイン機構
		const pluginBOT = globalThis.plugins.buttonOnToot
		let pluginHtml = ''
		let pi = 8
		for (const target of pluginBOT) {
			const meta = getMeta(target.content).data
			pluginHtml = pluginHtml + `<li tabIndex="${pi}"><a onclick="execPlugin('${target.id}','buttonOnToot',{id: '${uniqueid}', acctId: '${acctId}'});">${escapeHTML(meta.name)}</a></li>`
			pi++
		}

		templete =
			templete +
			`<div
					id="pub_${toot.id}"
					class="cvo ${mouseover} ${boostback} ${favApp} ${rtApp} ${pinApp} ${bkmApp} ${hasmedia} ${animecss}"
					toot-id="${id}" unique-id="${uniqueid}" data-medias="${media_ids}" unixtime="${date(obj[key].created_at, 'unix')}"
					onmouseover="mov('${uniqueid}','${tlid}','mv', '${rand}', this, '${acctId}')"
					onmouseout="resetmv('mv')"
					${ifNotf}
				>
				<div class="area-notice grid"><span class="gray sharesta">${noticeText}</span></div>
				<div class="area-icon grid">
					<a onclick="udg('${toot.account.id}','${acctId}');" user="${toot.account.acct}" class="udg">
						<img draggable="false" src="${avatar}" width="40" class="prof-img"
							user="${toot.account.acct}" onerror="this.src='../../img/loading.svg'" alt="" loading="lazy" />
					</a>
					${noticeAvatar}
				</div>
				<div class="area-display_name grid">
					<div class="flex-name">
						<span class="user">${disName}</span>
						<span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis; cursor:text;"
							title="@${toot.account.acct}"
						>
							@${toot.account.acct}${locked}
						</span>
					</div>
					<div class="flex-time">
						<span class="cbadge cbadge-hover pointer waves-effect" onclick="tootUriCopy('${toot.url}');"
							title="${date(toot.created_at, 'absolute')}(${lang.lang_parse_clickcopyurl})">
							<i class="far fa-clock"></i><span class="voice">posted at </span>${date(toot.created_at, datetype)}
						</span>
					</div>
				</div>
				<div class="area-toot grid">
					${tickerdom}
					<span class="${apiSpoil} cw_text_${toot.id}">
						<span class="cw_text">${spoil}</span>
						${spoilerShow}
					</span>
					<div class="toot ${spoiler}"
						onclick="mov('${uniqueid}','${tlid}','cl', '${rand}', this, '${acctId}')"
					>${content}</div>
					${poll}${viewer}
				</div>
				<div class="area-additional grid">
					<span class="additional">${analyze}</span>
					${mentions}
				</div>
				<div class="area-bottoms">
					<div class="area-vis grid">${vis}</div>
					<div class="area-actions grid">
						<div class="action ${antiNoAuth}">
							<a onclick="detEx('${toot.url}','main')" class="waves-effect waves-dark details" style="padding:0; white-space: nowrap;">
								${lang.lang_parse_det}
							</a>
						</div>
						<div class="action ${antiDmHide}">
							<a onclick="details('${toot.id}','${acctId}','${tlid}')" 
								class="waves-effect waves-dark details" style="padding:0">
								${lang.lang_parse_thread}
							</a>
						</div>
						<div class="action ${disp.re} ${noAuth}">
							<a onclick="re('${toot.id}','${toMention}','${acctId}','${visEn}','${escapeHTML(toot.spoiler_text)}')" 
								class="waves-effect waves-dark btn-flat actct rep-btn"
								data-men="${toMention}" data-visEn="${visEn}" style="padding:0" title="${lang.lang_parse_replyto}">
									<i class="fas fa-share"></i>
									<span class="voice">${lang.lang_parse_replyto} </span>
									<span class="rep_ct">${replyct}</span>
							</a>
						</div>
						<div class="action ${canRt} ${disp.rt} ${noAuth}">
							<a onclick="rt('${toot.id}','${acctId}','${tlid}')" class="waves-effect waves-dark btn-flat actct bt-btn"
								style="padding:0" title="${lang.lang_parse_bt}">
								<i class="fas fa-retweet ${ifRt} rt_${toot.id}"></i>
								<span class="voice">${lang.lang_parse_bt} </span>
								<span class="rt_ct">${toot.reblogs_count}</span>
							</a>
						</div>
						<div class="action ${disp.qt} ${noAuth} ${qtClass}">
							<a onclick="qt('${toot.id}','${acctId}','${toot.account.acct}','${toot.url}')" 
								class="waves-effect waves-dark btn-flat actct" style="padding:0" title="${lang.lang_parse_quote}">
								<i class="text-darken-3 fas fa-quote-right"></i>
								<span class="voice">${lang.lang_parse_quote} </span>
							</a>
						</div>
						<div class="action ${disp.bkm} ${noAuth} ${bkmClass}">
							<a onclick="bkm('${toot.id}','${acctId}','${tlid}')"
								class="waves-effect waves-dark btn-flat actct bkm-btn" style="padding:0"
								title="${lang.lang_parse_bookmark}">
								<i class="fas text-darken-3 fa-bookmark bkm_${toot.id} ${ifBkm}"></i>
								<span class="voice">${lang.lang_parse_bookmark} </span>
						</a>
						</div>
						<div class="action ${disp.fav} ${noAuth}">
							<a onclick="fav('${uniqueid}','${acctId}')"
								class="waves-effect waves-dark btn-flat actct fav-btn" style="padding:0"
								title="${lang.lang_parse_fav}">
								<i class="fas text-darken-3 fa-star${ifFav} fav_${uniqueid}"></i>
								<span class="fav_ct">${toot.favourites_count}</span>
								<span class="voice">${lang.lang_parse_fav} </span>
							</a>
						</div>
					</div>
					<div class="area-side">
						<div class="action ${noAuth}">
							<a onclick="toggleAction('${rand}', this, '${tlid}')" data-target="dropdown_${rand}"
								class="ctxMenu waves-effect waves-dark btn-flat" style="padding:0" id="trigger_${rand}">
								<i class="text-darken-3 material-icons act-icon" aria-hidden="true">expand_more</i>
								<span class="voice">Other actions</span>
							</a>
						</div>
						<div class="action ${noAuth}">
							<a onclick="details('${toot.id}','${acctId}','${tlid}')"
								class="waves-effect waves-dark btn-flat details ${dmHide}" style="padding:0"
								title="${lang.lang_parse_detail}">
							<i class="text-darken-3 material-icons" aria-hidden="true">menu_open</i></a>
							<span class="voice">${lang.lang_parse_detail}</span>
						</div>
					</div>
				</div>
				<ul class="dropdown-content contextMenu" id="dropdown_${rand}" tabIndex="0">
					<li class="${viashow} via-dropdown" onclick="client('${stripTags(via)}')" title="${lang.lang_parse_clientop}" tabIndex="0">
						via ${escapeHTML(via)}</a>
					</li>
					<li onclick="bkm('${uniqueid}','${acctId}','${tlid}')" class="bkm-btn bkmStr_${uniqueid}" style="padding:0; padding-top: 5px;" tabIndex="1">
						<i class="fas text-darken-3 fa-bookmark bkm_${toot.id} ${ifBkm}"></i>${bkmStr}
					</li>
					<li class="${ifMine}" onclick="del('${uniqueid}','${acctId}')" style="padding:0; padding-top: 5px;"tabIndex="2">
						<i class="fas fa-trash"></i>${lang.lang_parse_del}
					</li>
					<li class="${ifMine}" onclick="pin('${uniqueid}','${acctId}')" style="padding:0; padding-top: 5px;" class="pinStr_${uniqueid}"tabIndex="3">
						<i class="fas fa-map-pin pin_${uniqueid} ${ifPin}"></i>${pinStr}
					</li>
					<li class="${ifMine}" onclick="redraft('${uniqueid}','${acctId}')" style="padding:0; padding-top: 5px;"tabIndex="4">
						<i class="material-icons" aria-hidden="true">redo</i>${lang.lang_parse_redraft}
					</li>
					<li class="${ifMine}"  onclick="editToot('${uniqueid}','${acctId}')" style="padding:0; padding-top: 5px;"tabIndex="5">
						<i class="material-icons" aria-hidden="true">create</i>${lang.lang_edit}(v3.5.0~)
					</li>
					${trans}
					${threadMute}
					<li onclick="postMessage(['openUrl', '${toot.url}'], '*')" style="padding:0; padding-top: 5px;"tabIndex="7">
						<i class="fas text-darken-3 fa-globe"></i>${lang.lang_parse_link}
					</li>
					${pluginHtml}
				</ul>
			</div>
			`
	}
	if (type === 'mix') {
		return [templete, local, times] as T
	} else {
		return templete as T
	}
}

//クライアントダイアログ
export async function client(name: string) {
	if (name !== 'Unknown') {
		//聞く
		const result = await Swal.fire({
			title: lang.lang_parse_clientop,
			text: name + lang.lang_parse_clienttxt,
			icon: 'info',
			showCancelButton: true,
			confirmButtonText: lang.lang_parse_clientmute,
			cancelButtonText: lang.lang_parse_clientemp,
			showCloseButton: true,
			focusConfirm: false,
		})
		if (result.dismiss) {
			//Emp
			const cli = localStorage.getItem('client_emp') || '[]'
			const obj = JSON.parse(cli)
			const newObj: string[] = []
			if (!obj) {
				newObj.push(name)
				toast({ html: escapeHTML(name) + lang.lang_status_emphas, displayLength: 2000 })
			} else {
				let can = false
				for (const cliT of obj) {
					newObj.push(cliT)
				}
				let key = 0
				for (const cliT of obj) {
					if (cliT !== name && !can) {
						can = false
					} else {
						can = true
						obj.splice(key, 1)
						toast({ html: escapeHTML(name) + lang.lang_status_unemphas, displayLength: 2000 })
					}
					key++
				}
				if (!can) {
					obj.push(name)
					toast({ html: escapeHTML(name) + lang.lang_status_emphas, displayLength: 2000 })
				}
				const json = JSON.stringify(obj)
				localStorage.setItem('client_emp', json)
				parseColumn()
			}
		} else if (result.value) {
			//Mute
			const cli = localStorage.getItem('client_mute') || '[]'
			const obj = JSON.parse(cli)
			obj.push(name)
			const json = JSON.stringify(obj)
			localStorage.setItem('client_mute', json)
			toast({ html: escapeHTML(name) + lang.lang_parse_mute, displayLength: 2000 })
			parseColumn()
		}
	}
}
interface ICustomEmojiReplace {
	emojis: Emoji[]
	[x: string]: any
}
export function customEmojiReplace(content: string, toot: ICustomEmojiReplace, gif: boolean) {
	for (const emoji of toot.emojis) {
		const shortcode = emoji.shortcode
		const emoSource = gif ? emoji.url : emoji.static_url
		const emoji_url = `
			<img draggable="false" src="${emoSource}" class="emoji-img" data-emoji="${shortcode}" 
				alt=" :${shortcode}: " title="${shortcode}" loading="lazy">
		`
		const regExp = new RegExp(':' + shortcode + ':', 'g')
		content = content.replace(regExp, (str, offset, s) => {
			const greater = s.indexOf('>', offset)
			const lesser = s.indexOf('<', offset)
			if (greater < lesser || (greater !== -1 && lesser === -1)) {
				return str
			} else {
				return emoji_url
			}
		})
	}
	return content
}
