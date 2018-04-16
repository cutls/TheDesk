//テーマ適用
function themes(theme) {
	if (!theme) {
		var theme = localStorage.getItem("theme");
		if(!theme){
			var theme="black";
			localStorage.setItem("theme","black");
		}
	}
	if (theme == "black") {
		$("html").removeClass("indigotheme");
		$("html").removeClass("greentheme");
		$("html").removeClass("browntheme");
		$("html").addClass("blacktheme");
	} else if (theme == "indigo") {
		$("html").removeClass("blacktheme");
		$("html").removeClass("greentheme");
		$("html").removeClass("browntheme");
		$("html").addClass("indigotheme");
	} else if (theme == "green") {
		$("html").removeClass("indigotheme");
		$("html").removeClass("greentheme");
		$("html").removeClass("browntheme");
		$("html").removeClass("blacktheme");
		$("html").addClass("greentheme");
	} else if (theme == "brown") {
		$("html").removeClass("indigotheme");
		$("html").removeClass("greentheme");
		$("html").removeClass("blacktheme");
		$("html").addClass("browntheme");
	} else{
		$("html").removeClass("indigotheme");
		$("html").removeClass("greentheme");
		$("html").removeClass("browntheme");
		$("html").removeClass("blacktheme");
	}
}
themes();