'use strict'
//このソフトについて
function about() {
	postMessage(["sendSinmpleIpc", "about"], "*")
}