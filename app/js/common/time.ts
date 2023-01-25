import $ from 'jquery'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ja'
import 'dayjs/locale/en'
dayjs.extend(relativeTime)
dayjs.locale(globalThis.useLang === 'ja' || globalThis.useLang === 'ja-KS' ? 'ja' : 'en')

const timeUpdate = () => {
	$('time.timeago').each(function (i, elem) {
		const exp = $(elem).attr('datetime') || ''
		const relative = dayjs(new Date(exp)).fromNow()
		$(elem).text(relative)
	})
}
export default timeUpdate
