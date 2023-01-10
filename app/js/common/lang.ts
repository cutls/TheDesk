 import ja from '../../view/ja/main'
import jaKS from '../../view/ja-KS/main'
import en from '../../view/en/main'
import bg from '../../view/bg/main'
import cs from '../../view/cs/main'
import de from '../../view/de/main'
import esAR from '../../view/es-AR/main'
import itIT from '../../view/it-IT/main'
import zhCN from '../../view/zh-CN/main'
import frFR from '../../view/fr-FR/main'
import zhTW from '../../view/zh-TW/main'
import noNO from '../../view/no-NO/main'
import ptBR from '../../view/pt-BR/main'
import ruRU from '../../view/ru-RU/main'
import esES from '../../view/es-ES/main'
import plPL from '../../view/pl-PL/main'
import siLK from '../../view/si-LK/main'
import ps from '../../view/ps/main'
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
export default langs[global.useLang] as typeof ja