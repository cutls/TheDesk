import { IColumn, IColumnData, IColumnType } from "../../interfaces/Storage"
import { toast } from "../common/declareM"
import lang from "../common/lang"
import { getColumn } from "../common/storage"
import { isTagData } from "../tl/tag"
import { cap, icon } from "../tl/tl"
import { parseColumn } from "./layout"
import $ from 'jquery'
declare var jQuery

//ソートデータ読み込み
export function sortLoad() {
	$('#sort').html('')
	const obj = getColumn()
	let key = 0
	for (const acct of obj) {
		const flag = localStorage.getItem('card_' + key) === 'true'
		let insert = ''

		if (acct.background) {
			if (acct.text !== 'def') {
				const txhex = acct.text === 'black' ? '000000' : 'ffffff'
				insert = ' style="background-color:#' + acct.background + '; color: #' + txhex + '" '
			}
		}
		const user = localStorage.getItem('user_' + acct.domain)
		const domain = localStorage.getItem('domain_' + acct.domain)
		let acctdata = ''
		if (user && domain) {
			acctdata = `${user}@${domain}`
		}

		const html = `<li class="drag-content" data-id="${key}" data-flag="${flag}" ${insert}>
			<div class="sorticon">
				<i class="material-icons">${icon(acct.type)}</i>
			</div>
			<div class="sorttitle">
				${cap(acct.type, acct.data, acct.domain.toString())}
			</div>
			<div class="sortaction">
				<a onclick="goColumn(${key})" class="setting nex">
					<i class="material-icons waves-effect nex" title="${lang.lang_sort_gothis}">forward</i>
				</a>
				<a onclick="removeColumn(${key})" class="setting nex">
					<i class="material-icons waves-effect nex" title="このカラムを削除">cancel</i>
				</a>
			</div>
			<div class="sortacct">${acctdata}</div>
			</li>`
		$('#sort').append(html)
		key++
	}
	drag()
}

//jquery-ui依存
function drag() {
	jQuery('#sort').sortable()
}

//ソート指定
export function sort() {
	const arr: number[] = []
	const flags: boolean[] = []
	$('.drag-content').each(function (i, elem) {
		const id = parseInt($(this).attr('data-id') || '0', 10)
		const flag = $(this).attr('data-flag') === 'true'
		arr.push(id)
		flags.push(flag)
	})
	const obj = getColumn()
	const newobj: IColumn[] = []
	for (let i = 0; i < arr.length; i++) {
		const data = obj[arr[i]]
		const add = {
			domain: data.domain,
			type: data.type,
			data: data.data,
			background: data.background,
			text: data.text
		}
		newobj.push(add)
		if (flags[i]) {
			localStorage.setItem('card_' + i, 'true')
		} else {
			localStorage.removeItem('card_' + i)
		}
	}
	const json = JSON.stringify(newobj)
	localStorage.setItem('column', json)
	$('#sort').html('')
	toast({ html: 'Sorted', displayLength: 3000 })
	sortLoad()
	parseColumn()
	sortMenu()
}
//ソートボタントグル
export function sortMenu() {
	$('#left-menu a').removeClass('active')
	$('#sortMenu').addClass('active')
	$('.menu-content').addClass('hide')
	$('#sort-box').removeClass('hide')
	$('#sort').html('')
	sortLoad()
}