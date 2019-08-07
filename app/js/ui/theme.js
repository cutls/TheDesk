//テーマ適用
function themes(theme) {
	if (!theme) {
		var theme = localStorage.getItem("theme");
		if (!theme) {
			var theme = "black";
			localStorage.setItem("theme", "black");
		}
	}
	$("html").removeClass("indigotheme");
	$("html").removeClass("greentheme");
	$("html").removeClass("browntheme");
	$("html").removeClass("blacktheme");
	$("html").removeClass("bluetheme");
	$("html").removeClass("customtheme");
	$("html").addClass(theme + "theme");
	var font = localStorage.getItem("font");
	if (font) {
		$("html").css("font-family", font);
	} else {
		$("html").css("font-family", "");
	}
	if (theme == "custom") {
		if (localStorage.getItem("customtheme-id")) {
			postMessage(["themeCSSRequest", localStorage.getItem("customtheme-id")], "*")
		}
	}
}
themes();