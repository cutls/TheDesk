import * as ja from '../../view/ja/setting.vue'
import * as jaKS from '../../view/ja-KS/setting.vue'
import * as en from '../../view/en/setting.vue'
import * as bg from '../../view/bg/setting.vue'
import * as cs from '../../view/cs/setting.vue'
import * as de from '../../view/de/setting.vue'
import * as esAR from '../../view/es-AR/setting.vue'
import * as itIT from '../../view/it-IT/setting.vue'
import * as zhCN from '../../view/zh-CN/setting.vue'
import * as frFR from '../../view/fr-FR/setting.vue'
import * as zhTW from '../../view/zh-TW/setting.vue'
import * as noNO from '../../view/no-NO/setting.vue'
import * as ptBR from '../../view/pt-BR/setting.vue'
import * as ruRU from '../../view/ru-RU/setting.vue'
import * as esES from '../../view/es-ES/setting.vue'
import * as plPL from '../../view/pl-PL/setting.vue'
import * as siLK from '../../view/si-LK/setting.vue'
import * as ps from '../../view/ps/setting.vue'
const langs = {
    ja,
    jaKS,
    en,
    bg,
    cs,
    de,
    esAR,
    itIT,
    zhCN,
    frFR,
    zhTW,
    noNO,
    ptBR,
    ruRU,
    esES,
    plPL,
    siLK,
    ps
}
const imps = langs[globalThis.useLang]
export default {
    yesno: imps.yesno,
    sound: imps.sound,
    envConstruction: imps.envConstruction,
    tlConstruction: imps.tlConstruction,
    postConstruction: imps.postConstruction
}