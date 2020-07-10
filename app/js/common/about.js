//このソフトについて
function about() {
	postMessage(["sendSinmpleIpc", "about"], "*")
}
document.getElementById('onClickAbout').addEventListener('click', about)