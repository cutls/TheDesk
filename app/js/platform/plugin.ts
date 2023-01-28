import { Parser as asParse, values as asValue, utils as asUtil } from '@syuilo/aiscript'
import { Interpreter as AiScript } from '@syuilo/aiscript/built/interpreter'
import { escapeHTML } from './first'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'
import { VArr, VBool, VNum, VObj, VReturn, VStr } from '@syuilo/aiscript/built/interpreter/value'
import { cw, isIVis, nsfw, vis } from '../post/secure'
import { clear, post } from '../post/post'
import Swal from 'sweetalert2'
import { IPlugin } from '../../interfaces/Storage'
import $ from 'jquery'
import { toast } from '../common/declareM'
import { parse } from '../tl/parse'

globalThis.plugins = getPlugin()
type SweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question'
const isSwalIcon = (item: string): item is SweetAlertIcon => ['success', 'error', 'warning', 'info', 'question'].includes(item)
interface IPlugins {
	buttonOnPostbox: IPlugin[]
	buttonOnToot: IPlugin[]
	buttonOnBottom: IPlugin[]
	init: IPlugin[]
	tips: IPlugin[]
	none: IPlugin[]
}
interface FechRequest {
	method: string
	headers: any
	body?: any
}
function getPlugin() {
	const json = localStorage.getItem('plugins')
	const ret: IPlugins = {
		buttonOnPostbox: [],
		buttonOnToot: [],
		buttonOnBottom: [],
		init: [],
		tips: [],
		none: [],
	}
	if (!json) return ret
	const plugins: IPlugin[] = JSON.parse(json)
	for (const plugin of plugins) {
		const meta = getMeta(plugin.content).data
		if (!meta) continue
		const type = meta.event
		ret[type] ? ret[type].push(plugin) : (ret[type] = [plugin])
		if (type === 'buttonOnToot') continue
		if (type === 'tips') {
			if (meta.interval) {
				const matchCID = /custom:([abcdef0-9]{8}-[abcdef0-9]{4}-4[abcdef0-9]{3}-[abcdef0-9]{4}-[abcdef0-9]{12})/
				setInterval(function () {
					const tipsName = localStorage.getItem('tips') || ''
					const mt = tipsName.match(matchCID)
					if (mt) {
						const id = mt[1]
						if (id === plugin.id) if (location.href.split('/').pop() === 'index.html') execPlugin(id, 'tips', null)
					}
				}, meta.interval)
			}
			continue
		}
		const shortcut = meta.shortcut
		$(window).keydown(function (e) {
			if (e.keyCode === shortcut && e.altKey) execPlugin(plugin.id, type)
		})
	}
	return ret
}
export function initPlugin() {
	globalThis.asCommon['TheDesk:dialog'] = asValue.FN_NATIVE((z) => {
		if (!isAssignableString(z[0])) return
		if (!isAssignableString(z[1])) return
		const z2 = isAssignableString(z[2]) ? z[2] : { value: 'info' }
		if (!isSwalIcon(z2.value)) return
		if (!isAssignableString(z[2])) return
		Swal.fire({
			title: z[0].value,
			icon: z2.value,
			text: z[1] ? z[1].value : '',
		})
	})
	globalThis.asCommon['TheDesk:confirm'] = asValue.FN_NATIVE(async (z) => {
		if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
		if (!isAssignableString(z[1])) return asUtil.jsToVal(null)
		const z2 = isAssignableString(z[2]) ? z[2] : { value: 'info' }
		if (!isSwalIcon(z2.value)) return asUtil.jsToVal(null)
		const alertSwal = await Swal.fire({
			title: z[0].value,
			text: z[1].value,
			icon: z2.value,
			showCancelButton: true,
		})
		return asUtil.jsToVal(!!(alertSwal.value && alertSwal.value === true))
	})
	globalThis.asCommon['TheDesk:css'] = asValue.FN_NATIVE((z) => {
		if (!isAssignableString(z[0])) return
		if (!isAssignableString(z[1])) return
		if (!isAssignableString(z[2])) return
		$(escapeHTML(z[0].value)).css(escapeHTML(z[1].value), escapeHTML(z[2].value))
	})
	globalThis.asCommon['TheDesk:openLink'] = asValue.FN_NATIVE((z) => {
		if (!isAssignableString(z[0])) return
		postMessage(['openUrl', z[0].value], '*')
	})

	const { buttonOnPostbox, init, buttonOnBottom, tips } = globalThis.plugins
	for (const target of buttonOnPostbox) {
		const meta = getMeta(target.content).data
		$('#dropdown2').append(`<li><a onclick="execPlugin('${target.id}','buttonOnPostbox', null);">${escapeHTML(meta.name)}</a></li>`)
	}
	for (const target of buttonOnBottom) {
		const meta = getMeta(target.content).data
		$('#group .btnsgroup').append(
			`<a onclick="execPlugin('${target.id}','buttonOnBottom', null);" class="nex waves-effect pluginNex"><span title="${escapeHTML(meta.name)}">${escapeHTML(meta.name).substr(0, 1)}</span></a>`
		)
	}
	for (const target of tips) {
		const meta = getMeta(target.content).data
		$('#tips-menu .btnsgroup').append(
			`<a onclick="tips('custom', '${target.id}')" class="nex waves-effect pluginNex"><span title="${escapeHTML(meta.name)}">${escapeHTML(meta.name).substr(0, 1)}</span></a>`
		)
	}
	for (const target of init) {
		const as = new AiScript(globalThis.asCommon)
		const meta = getMeta(target.content).data
		toast({ html: `${escapeHTML(meta.name)}を実行しました`, displayLength: 1000 })
		if (target) as.exec(asParse.parse(target.content))
	}
}
export function getMeta(plugin: string) {
	try {
		return { success: true, data: AiScript.collectMetadata(asParse.parse(plugin))?.get(null) }
	} catch (e) {
		console.error(e)
		throw e
	}
}
type ISource = 'buttonOnToot' | 'buttonOnPostbox' | 'tips' | 'none'
export async function execPlugin(id: string, source: ISource, args?: any) {
	const ps: IPlugins = globalThis.plugins
	const coh = ps[source]
	let exe: null | string = null
	for (const plugin of coh) {
		if (plugin.id === id) {
			exe = plugin.content
			break
		}
	}
	const common = _.cloneDeep(globalThis.asCommon)
	if (source === 'buttonOnToot') {
		common.DATA = args
		const domain = localStorage.getItem(`domain_${args.acctId}`)
		const at = localStorage.getItem(`acct_${args.acctId}_at`)
		const start = `https://${domain}/api/v1/statuses/${args.id}`
		const promise = await fetch(start, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${at}`,
			},
		})
		const json = await promise.json()
		common.TOOT = asUtil.jsToVal(json)
		common['TheDesk:changeText'] = asValue.FN_NATIVE((z) => {
			if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
			const v = sanitizeHtml(z[0].value, {
				allowedTags: ['p', 'br', 'a', 'span'],
				allowedAttributes: {
					a: ['href', 'class', 'rel', 'target'],
					span: [],
					p: [],
					br: [],
				},
			})
				.replace(/href="javascript:/, 'href="')
				.replace(/href='javascript:/, 'href="')
				.replace(/href=javascript:/, 'href="')
			json.content = v
			if (!exe) return asUtil.jsToVal(null)
			if (getMeta(exe).data.dangerHtml) $(`[unique-id=${args.id}] .toot`).html(parse([json], null, '0', '0'))
		})
	} else if (source === 'buttonOnPostbox') {
		const postDt = await post(undefined, true)
		common.POST = asUtil.jsToVal(postDt)
		if (!postDt) return
		common.ACCT_ID = asUtil.jsToVal(postDt.TheDeskAcctId)
		common['TheDesk:postText'] = asValue.FN_NATIVE((z) => {
			if (!isAssignableString(z[0])) return
			$('#textarea').val(z[0].value)
		})
		common['TheDesk:postCW'] = asValue.FN_NATIVE((z) => {
			if (!isAssignableString(z[1])) return
			if (z[1]) $('#cw-text').val(z[1].value)
			if (!isAssignable(z[0])) return
			if (typeof z[0].value !== 'boolean') return
			cw(z[0] ? z[0].value : false)
		})
		common['TheDesk:postNSFW'] = asValue.FN_NATIVE((z) => {
			if (!isAssignable(z[0])) return asUtil.jsToVal(null)
			if (typeof z[0].value !== 'boolean') return
			nsfw(z[0] ? z[0].value : false)
		})
		common['TheDesk:postVis'] = asValue.FN_NATIVE((z) => {
			if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
			if (!isIVis(z[0].value)) return asUtil.jsToVal(null)
			vis(z[0].value)
		})
		common['TheDesk:postClearbox'] = asValue.FN_NATIVE(() => {
			clear()
		})
		common['TheDesk:postExec'] = asValue.FN_NATIVE(() => {
			if (!exe) return asUtil.jsToVal(null)
			if (getMeta(exe).data.apiPost) post()
		})
	} else if (source === 'tips') {
		common['TheDesk:refreshTipsView'] = asValue.FN_NATIVE((z) => {
			if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
			const v = sanitizeHtml(z[0].value, {
				allowedTags: ['p', 'br', 'a', 'span', 'img'],
				allowedAttributes: {
					a: ['href', 'class', 'rel', 'target', 'style'],
					span: ['style'],
					p: ['style'],
					br: [],
					img: ['src', 'style'],
				},
			})
				.replace(/href="javascript:/, 'href="')
				.replace(/href='javascript:/, 'href="')
				.replace(/href=javascript:/, 'href="')
			if (!exe) return asUtil.jsToVal(null)
			if (getMeta(exe).data.dangerHtml) $('#tips-text').html(v)
		})
	}
	common['TheDesk:console'] = asValue.FN_NATIVE((z) => {
		if (!isAssignable(z[0])) return asUtil.jsToVal(null)
		console.log(z[0].value)
	})
	common['TheDesk:api'] = asValue.FN_NATIVE(async (z) => {
		try {
			if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
			if (!isAssignable(z[1])) return asUtil.jsToVal(null)
			if (!isAssignableStringObj(z[2])) return asUtil.jsToVal(null)
			if (!isAssignable(z[3])) return asUtil.jsToVal(null)
			if (!exe) return asUtil.jsToVal(null)
			if (!getMeta(exe).data.apiGet && z[0].value === 'GET') return asUtil.jsToVal(null)
			if (!getMeta(exe).data.apiPost && (z[0].value === 'POST' || z[0].value === 'DELETE' || z[0].value === 'PUT')) return asUtil.jsToVal(null)

			const domain = localStorage.getItem(`domain_${z[3].value}`)
			const at = localStorage.getItem(`acct_${z[3].value}_at`)
			const start = `https://${domain}/api/${z[1].value}`
			const q: FechRequest = {
				method: z[0].value,
				headers: {
					'content-type': 'application/json',
					Authorization: `Bearer ${at}`,
				},
			}
			if (z[2]) q.body = z[2].value as any
			const promise = await fetch(start, q)
			const json = await promise.json()
			return asUtil.jsToVal(json)
		} catch (e) {
			return asUtil.jsToVal(null)
		}
	})
	common['TheDesk:getRequest'] = asValue.FN_NATIVE(async (z) => {
		try {
			if (!exe) return asUtil.jsToVal(null)
			if (!getMeta(exe).data.apiGet) return asUtil.jsToVal(null)
			if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
			const start = `https://${z[0].value}`
			const promise = await fetch(start)
			let json: null | string = null
			if (z[1]?.type !== 'null') {
				json = await promise.json()
			} else {
				json = await promise.text()
			}
			return asUtil.jsToVal(json)
		} catch (e) {
			return asUtil.jsToVal(null)
		}
	})
	const as = new AiScript(common)
	if (exe) as.exec(asParse.parse(exe))
}
export async function testExec(exe: string) {
	globalThis.asCommon.TOOT = null
	globalThis.asCommon.ACCT_ID = 0
	globalThis.asCommon['TheDesk:dialog'] = asValue.FN_NATIVE((z) => {
		if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
		const z2 = isAssignableString(z[2]) ? z[2] : { value: 'info' }
		if (!isSwalIcon(z2.value)) return asUtil.jsToVal(null)
		Swal.fire({
			title: z[0].value,
			icon: z2.value,
			text: isAssignableString(z[1]) ? z[1].value : '',
		})
	})
	globalThis.asCommon['TheDesk:confirm'] = asValue.FN_NATIVE(async (z) => {
		if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
		const z2 = isAssignableString(z[2]) ? z[2] : { value: 'info' }
		if (!isSwalIcon(z2.value)) return asUtil.jsToVal(null)
		const alertSwal = await Swal.fire({
			title: z[0].value,
			text: isAssignableString(z[1]) ? z[1].value : '',
			icon: z2.value,
			showCancelButton: true,
		})
		return asUtil.jsToVal(!!(alertSwal.value && alertSwal.value === true))
	})
	globalThis.asCommon['TheDesk:css'] = asValue.FN_NATIVE((z) => {
		if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
		if (!isAssignableString(z[1])) return asUtil.jsToVal(null)
		if (!isAssignableString(z[2])) return asUtil.jsToVal(null)
		$(escapeHTML(z[0].value)).css(escapeHTML(z[1].value), escapeHTML(z[2].value))
	})
	globalThis.asCommon['TheDesk:openLink'] = asValue.FN_NATIVE((z) => {
		if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
		postMessage(['openUrl', z[0].value], '*')
	})
	globalThis.asCommon['TheDesk:changeText'] = asValue.FN_NATIVE(() => {
		Swal.fire({
			icon: 'info',
			title: 'changeText is cannot use on try exec.',
			text: '',
		})
		return asUtil.jsToVal(true)
	})
	globalThis.asCommon['TheDesk:refreshTipsView'] = asValue.FN_NATIVE(() => {
		Swal.fire({
			icon: 'info',
			title: 'refreshTipsView is cannot use on try exec.',
			text: '',
		})
		return asUtil.jsToVal(true)
	})
	globalThis.asCommon['TheDesk:postText'] = asValue.FN_NATIVE(() => {
		Swal.fire({
			icon: 'info',
			title: 'postText is cannot use on try exec.',
			text: '',
		})
		return asUtil.jsToVal(true)
	})
	globalThis.asCommon['TheDesk:postCW'] = asValue.FN_NATIVE(() => {
		Swal.fire({
			icon: 'info',
			title: 'postCW is cannot use on try exec.',
			text: '',
		})
		return asUtil.jsToVal(true)
	})
	globalThis.asCommon['TheDesk:postNSFW'] = asValue.FN_NATIVE(() => {
		Swal.fire({
			icon: 'info',
			title: 'postNSFW is cannot use on try exec.',
			text: '',
		})
		return asUtil.jsToVal(true)
	})
	globalThis.asCommon['TheDesk:postVis'] = asValue.FN_NATIVE(() => {
		Swal.fire({
			icon: 'info',
			title: 'postVis is cannot use on try exec.',
			text: '',
		})
		return asUtil.jsToVal(true)
	})
	globalThis.asCommon['TheDesk:postClearbox'] = asValue.FN_NATIVE(() => {
		Swal.fire({
			icon: 'info',
			title: 'postClearbox is cannot use on try exec.',
			text: '',
		})
		return asUtil.jsToVal(true)
	})
	globalThis.asCommon['TheDesk:postExec'] = asValue.FN_NATIVE(() => {
		Swal.fire({
			icon: 'info',
			title: 'postExec is cannot use on try exec. It only returns {}',
			text: '',
		})
		return asUtil.jsToVal(true)
	})
	globalThis.asCommon['TheDesk:api'] = asValue.FN_NATIVE(async (z) => {
		try {
			if (!isAssignableString(z[0])) return asUtil.jsToVal(null)
			if (!isAssignableString(z[1])) return asUtil.jsToVal(null)
			if (!isAssignable(z[3])) return asUtil.jsToVal(null)
			if (!isAssignableStringObj(z[2])) return asUtil.jsToVal(null)
			if (!getMeta(exe).data.apiGet && z[0].value === 'GET') return asUtil.jsToVal(null)
			if (!getMeta(exe).data.apiPost && (z[0].value === 'POST' || z[0].value === 'DELETE' || z[0].value === 'PUT')) return asUtil.jsToVal(null)
			const domain = localStorage.getItem(`domain_${z[3].value}`)
			const at = localStorage.getItem(`acct_${z[3].value}_at`)
			const start = `https://${domain}/api/${z[1].value}`
			const q: FechRequest = {
				method: z[0].value,
				headers: {
					'content-type': 'application/json',
					Authorization: `Bearer ${at}`,
				},
			}
			if (z[2]) q.body = z[2].value as any
			const promise = await fetch(start, q)
			const json = await promise.json()
			return asUtil.jsToVal(json)
		} catch (e) {
			return asUtil.jsToVal(null)
		}
	})
	globalThis.asCommon['TheDesk:getRequest'] = asValue.FN_NATIVE(async () => {
		Swal.fire({
			icon: 'info',
			title: 'getRequest is cannot use on try exec. It only returns {}',
			text: '',
		})
		return asUtil.jsToVal({})
	})
	try {
		const as = new AiScript(globalThis.asCommon)
		if (exe) as.exec(asParse.parse(exe))
	} catch (e: any) {
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: e.toString(),
		})
	}
}
function isAssignable(val: asValue.Value | undefined): val is VBool | VNum | VStr | VArr | VObj | VReturn {
	if (!val) return false
	if (val.type === 'null' || val.type === 'fn') return false
	return true
}
function isAssignableString(val: asValue.Value | undefined): val is VStr {
	if (!val) return false
	return val.type === 'str'
}
function isAssignableStringObj(val: asValue.Value | undefined): val is VStr | VObj | VArr {
	if (!val) return false
	return val.type === 'str' || val.type === 'arr' || val.type === 'obj'
}
