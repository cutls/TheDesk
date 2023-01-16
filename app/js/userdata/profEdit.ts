//プロフ編集

import { modalInitGetInstance } from '../common/declareM'
import api from '../common/fetch'
import { toBlob } from '../post/img'
import { todc, todo } from '../ui/tips'
import $ from 'jquery'

//文字系
export async function profEdit() {
	const acctId = $('#his-data').attr('use-acct')
	todo('Updating...')
	const name = $('#his-name-val').val()?.toString() || ''
	const des = $('#his-des-val').val()?.toString() || ''
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/update_credentials`
	await api(start, {
		method: 'patch',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
		body: {
			display_name: name,
			note: des,
		},
	})
	const instance = modalInitGetInstance($('#his-data'))
	instance.close()
	todc()
}

//画像系
export function imgChange(imgfile: HTMLInputElement, target: string) {
	const acctId = $('#his-data').attr('use-acct')
	todo('アップロードしています')
	if (!imgfile.files?.length) {
		console.warn('No Image to upload')
		return
	}
	const file = imgfile.files[0]
	const fr = new FileReader()
	fr.onload = async function () {
		const b64 = this.result?.toString()
		if (!b64) return
		const blob = toBlob(b64, 'image/png')
		const fd = new FormData()
		if (blob) fd.append(target, blob)
		const domain = localStorage.getItem(`domain_${acctId}`)
		const at = localStorage.getItem(`acct_${acctId}_at`)
		const start = `https://${domain}/api/v1/accounts/update_credentials`
		await api(start, {
			method: 'patch',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + at,
			},
			body: fd,
		})
		const instance = modalInitGetInstance($('#his-data'))
		instance.close()
		todc()
	}
	$('#prof-change').html($('#prof-change').html())
	$('#header-change').html($('#header-change').html())
	fr.readAsDataURL(file)
}
