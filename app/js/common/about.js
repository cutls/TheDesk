//@ts-check
//このソフトについて
function about() {
	postMessage(["sendSinmpleIpc", "about"], "*")
}