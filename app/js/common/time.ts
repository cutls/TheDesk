import $ from 'jquery'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ja'
dayjs.extend(relativeTime)
dayjs.locale('ja')

const timeUpdate = () => {
  $('time.timeago').each(function (i, elem) {
    const exp = $(elem).attr('datetime') || ''
    const relative = dayjs(new Date(exp)).fromNow()
    $(elem).text(relative)
  })
}
export default timeUpdate