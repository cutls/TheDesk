//テーマ適用
function themes(theme) {
	if (!theme) {
		var theme = localStorage.getItem("theme");
	}
	if (theme == "black") {
		$("html").addClass("blacktheme");
	} else {
		$("html").removeClass("blacktheme");
	}
}
themes();
