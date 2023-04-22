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
import ukUA from '../../view/uk-UA/main'
import ps from '../../view/ps/main'
const langs = {
	ja,
	'ja-KS': jaKS,
	en,
	bg,
	cs,
	de,
	'es-AR': esAR,
	'it-IT': itIT,
	'zh-CN': zhCN,
	'fr-FR': frFR,
	'zh-TW': zhTW,
	'no-NO': noNO,
	'pt-BR': ptBR,
	'ru-RU': ruRU,
	'es-ES': esES,
	'pl-PL': plPL,
	'si-LK': siLK,
	'uk-UA': ukUA,
	ps,
}
export default langs[globalThis.useLang] as typeof ja
