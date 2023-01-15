import lang from "../common/lang"
import { columnReload, tl } from "./tl"
import { brInsert } from "../post/emoji"
import { escapeHTML } from "../platform/first"
import { toast } from "../common/declareM"
import api from "../common/fetch"
import { getColumn, setColumn } from "../common/storage"
import { IColumnData, IColumnTag, IColumnType } from "../../interfaces/Storage"
//よく使うタグ
export const isTagData = (item: IColumnData): item is IColumnTag => typeof item !== 'string' && !item['acct']
export function tagShow(tag: string, elm: HTMLElement) {
	tag = decodeURIComponent(tag)
	const tagTL = lang.lang_parse_tagTL.replace('{{tag}}', '#' + tag)
	const tagPin = lang.lang_parse_tagpin.replace('{{tag}}', '#' + tag)
	const tagToot = lang.lang_parse_tagtoot.replace('{{tag}}', '#' + tag)
	$('#tagCMTL').text(tagTL)
	$('#tagCMPin').text(tagPin)
	$('#tagCMToot').text(tagToot)
	const acctId = $(elm).parents('.tl').attr('data-acct') || 0
	const rect = elm.getBoundingClientRect()
	$('#tagContextMenu').css('top', `calc(${rect.top}px + 1rem)`)
	$('#tagContextMenu').css('left', `${rect.left}px`)
	$('#tagContextMenu').attr('data-tag', tag)
	$('#tagContextMenu').attr('data-acct', acctId)
	$('#tagContextMenu').removeClass('hide')
	setTimeout(() => tShowBox('open'), 500)
}
export function tShowBox(mode: 'open' | 'close') {
	if (mode === 'open') {
		$('#tagContextMenu').removeClass('hide')
	} else if (mode === 'close') {
		if (!$('#tagContextMenu').hasClass('hide')) $('#tagContextMenu').addClass('hide')
		$('#tagContextMenu').removeClass('keep')
	} else {
		$('#tagContextMenu').toggleClass('hide')
	}
}
export function doTShowBox(type: 'tl' | 'toot' | 'pin' | 'f') {
	$('#tagContextMenu').addClass('hide')
	$('#tagContextMenu').removeClass('keep')
	const q = $('#tagContextMenu').attr('data-tag')
	if (!q) return
	const acctId = $('#tagContextMenu').attr('data-acct')
	if (type === 'tl') {
		tl('tag', q, acctId, 'add')
	} else if (type === 'toot') {
		brInsert(`#${q}`)
	} else if (type === 'pin') {
		tagPin(q)
	} else if (type === 'f') {
		tagFeature(q, acctId || '0')
	}
}
//タグ追加
function tagPin(tag: string) {
	const tags = localStorage.getItem('tag')
	const obj = tags ? JSON.parse(tags) : []
	let can = false
	for (const tagT of obj) {
		if (tagT === tag) can = true
		if (can) break
	}
	if (!can) obj.push(tag)
	const json = JSON.stringify(obj)
	localStorage.setItem('tag', json)
	favTag()
}
//タグ削除
export function tagRemove(key: number) {
	const tags = localStorage.getItem('tag') || '[]'
	const obj = JSON.parse(tags)
	obj.splice(key, 1)
	const json = JSON.stringify(obj)
	localStorage.setItem('tag', json)
	favTag()
}
export function favTag() {
	$('#taglist').html('')
	const tagArr = localStorage.getItem('tag') || '[]'
	const obj = JSON.parse(tagArr)
	let tags = ''
	const nowPT = localStorage.getItem('stable')

	for (const tagRaw of obj) {
		let ptt = lang.lang_tags_unrealtime
		let nowon = `(${lang.lang_tags_realtime})`
		if (nowPT !== tagRaw) {
			console.log('stable tags:' + nowPT + '/' + tagRaw)
			ptt = lang.lang_tags_realtime
			nowon = ''
		}
		const tag = escapeHTML(tagRaw)
		tags =
			tags +
			`<a onclick="tagShowHorizon('${tag}')" class="pointer">#${tag}</a>
			${nowon}<span class="hide" data-tag="${tag}" data-regTag="${tag.toLowerCase()}">　
			<a onclick=\"tagTL('tag','${tag}','add')" class="pointer" title="${lang.lang_parse_tagTL.replace('{{tag}}', '#' + tag)}">
				TL
			</a>
			<a onclick="brInsert('#${tag}')" class="pointer" title="${lang.lang_parse_tagtoot.replace('{{tag}}', '#' + tag)}">
				Toot
			</a>
			<a onclick="autoToot('${tag}');" class="pointer" title="${lang.lang_tags_always}${lang.lang_parse_tagtoot.replace('{{tag}}', '#' + tag)}">
				${ptt}
			</a>
			<a onclick="tagRemove(${key})" class="pointer" title="${lang.lang_tags_tagunpin.replace('{{tag}}', '#' + tag)}">
				${lang.lang_del}
			</a>
			</span> `
	}
	if (obj.length > 0) $('#taglist').append('My Tags: ' + tags)
}
export function tagShowHorizon(tag: string) {
	$(`[data-regTag=${decodeURI(tag).toLowerCase()}]`).toggleClass('hide')
}

export function tagTL(a: IColumnType, b: string, d: string) {
	const acctId = $('#post-acct-sel').val()
	tl(a, b, acctId, d)
}
export function autoToot(tag: string) {
	tag = escapeHTML(tag)
	const nowPT = localStorage.getItem('stable')
	if (nowPT === tag) {
		localStorage.removeItem('stable')
		toast({ html: lang.lang_tags_unrealtime, displayLength: 3000 })
	} else {
		localStorage.setItem('stable', tag)
		toast({
			html: lang.lang_tags_tagwarn.replace('{{tag}}', tag).replace('{{tag}}', tag),
			displayLength: 3000
		})
		brInsert(` #${tag} `)
	}
	favTag()
}
//タグをフィーチャー
async function tagFeature(name: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/featured_tags`
	const json = await api(start, {
		method: 'post',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at

		},
		body: { name }
	})
	toast({ html: 'Complete: ' + escapeHTML(name), displayLength: 3000 })
}
//タグのフィルタ
export function addTag(id: string) {
	const columns = getColumn()
	const column = columns[parseInt(id, 10)]
	if (!column.data || typeof column.data === 'string') return
	const name = column.data.name
	column.data = {
		'name': name,
		'all': $(`#all_tm-${id}`).val()?.toString().split(',') || [],
		'any': $(`#any_tm-${id}`).val()?.toString().split(',') || [],
		'none': $(`#none_tm-${id}`).val()?.toString().split(',') || [],
	}
	columns[id] = column
	setColumn(columns)
	columnReload(id, 'tag')
}

