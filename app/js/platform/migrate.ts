import Swal from "sweetalert2"
import { getColumn, setColumn } from "../common/storage"
import { IColumn } from '../../interfaces/Storage'
import { isTagData } from "../tl/tag"

const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec))
export const migrate = async (skipWait?: boolean) => {
    Swal.fire({
        title: 'Warp to v24...',
        html: `migrating`,
        showConfirmButton: false,
        showCloseButton: false,
        didOpen: () => {
            Swal.showLoading()
        },
        willClose: () => {
            return
        },
    })
    if (!skipWait) await sleep(2000)
    const timelines: (IColumn | any)[] = getColumn()
    const newTl: (IColumn | any)[] = []
    for (const tl of timelines) {
        if (tl.type === 'tootsearch') continue
        if (tl.type === 'tag') {
            if (typeof tl.data === 'string') {
                tl.data = {
                    name: tl.data.toString(),
                    any: [],
                    all: [],
                    none: []
                }
            } else {
                const d = tl.data
                if (!d || !isTagData(d)) continue
                tl.data = {
                    name: d.name,
                    any: d.any || [],
                    all: d.all || [],
                    none: d.none || []
                }
                if (typeof tl.data.any === 'string') tl.data.any = (tl.data.any as string).split(',')
                if (typeof tl.data.all === 'string') tl.data.any = (tl.data.all as string).split(',')
                if (typeof tl.data.none === 'string') tl.data.any = (tl.data.none as string).split(',')
            }
        }
        if (tl.type === 'noauth' && typeof tl.domain !== 'number') {
            tl.data = tl.domain.toString()
            tl.domain = 0
        }
        if (tl.type === 'webview' && typeof tl.domain !== 'number') {
            tl.domain = 0
        }
        if (typeof tl.domain === 'string') tl.domain = parseInt(tl.domain, 10)
        newTl.push(tl)
    }
    const wm = JSON.parse(localStorage.getItem('word_mute') || '[]').map((i) => i.tag || i)
    const we = JSON.parse(localStorage.getItem('word_emp') || '[]').map((i) => i.tag || i)
    localStorage.setItem('word_mute', JSON.stringify(wm))
    localStorage.setItem('word_emp', JSON.stringify(we))
    localStorage.removeItem('popup')
    localStorage.setItem('v24Accepted', 'v2')
    setColumn(newTl)
    location.reload()
    Swal.close()
}