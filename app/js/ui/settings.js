//設定(setting.html)で読む
//設定ボタン押した。
function settings() {
	var dd = $("[name=time]:checked").val();
	if (dd != localStorage.getItem("datetype")) {
		Materialize.toast("時間設定を" + dd + "に設定しました。", 3000);
	}
	localStorage.setItem("datetype", dd);
	var cd = $("[name=theme]:checked").val();
	if (cd != localStorage.getItem("theme")) {
		Materialize.toast("テーマ設定を" + cd + "に設定しました。", 3000);
	}
	//テーマはこの場で設定
	themes(cd);
	localStorage.setItem("theme", cd);
	var nd = $("[name=nsfw]:checked").val();
	if (nd != localStorage.getItem("nsfw")) {
		Materialize.toast("画像表示設定を" + nd + "に設定しました。", 3000);
	}
	localStorage.setItem("nsfw", nd);
	var cwd = $("[name=cw]:checked").val();
	if (cwd != localStorage.getItem("cw")) {
		Materialize.toast("テキスト表示設定を" + cwd + "に設定しました。", 3000);
	}
	localStorage.setItem("cw", cwd);
	var cwtd = $("#cw-text").val();
	if (cwtd != localStorage.getItem("cw-text")) {
		Materialize.toast("デフォルトの警告文を「" + cwtd + "」に設定しました。", 3000);
	}
	localStorage.setItem("cw-text", cwtd);
	var visd = $("[name=vis]:checked").val();
	if (visd != localStorage.getItem("vis")) {
		Materialize.toast("デフォルトの公開設定を" + visd + "に設定しました。", 3000);
	}
	localStorage.setItem("vis", visd);
	var popd = $("#popup").val();
	if (popd > 0 && popd != localStorage.getItem("popup")) {
		Materialize.toast("ポップアップお知らせを" + popd + "秒に設定しました。", 3000);
	} else if (popd != localStorage.getItem("popup")) {
		Materialize.toast("ポップアップお知らせをオフに設定しました。", 3000);
	}
	localStorage.setItem("popup", popd);
	var boxd = $("[name=box]:checked").val();
	if (boxd != localStorage.getItem("box")) {
		Materialize.toast("デフォルトでボックスを隠すかを" + boxd + "に設定しました。", 3000);
	}
	localStorage.setItem("box", boxd);
	var sentd = $("#sentence").val();
	if (sentd != localStorage.getItem("sentence")) {
		Materialize.toast("指定行超過折りたたみを" + sentd + "行に設定しました。", 3000);
	}
	localStorage.setItem("sentence", sentd);
	var widthd = $("#width").val();
	if (widthd != localStorage.getItem("width")) {
		Materialize.toast("横幅最低を" + widthd + "pxに設定しました。", 3000);
	}
	localStorage.setItem("width", widthd);
	var imgd = $("[name=img]:checked").val();
	if (imgd != localStorage.getItem("img")) {
		Materialize.toast("画像投稿後の設定を" + imgd + "に設定しました。", 3000);
	}
	var sized = $("#size").val();
	if (sized != localStorage.getItem("size")) {
		Materialize.toast("フォントサイズを" + sized + "pxに設定しました。", 3000);
	}
	localStorage.setItem("size", sized);
	localStorage.setItem("img", imgd);
}

//読み込み時の設定ロード
function load() {
	var prof = localStorage.getItem("prof");
	$("#my-prof").attr("src", prof);
	var datetype = localStorage.getItem("datetype");
	if (!datetype) {
		var datetype = "absolute";
	}
	$("#" + datetype).prop("checked", true);

	var theme = localStorage.getItem("theme");
	if (!theme) {
		var theme = "white";
	}
	$("#" + theme).prop("checked", true);

	var nsfw = localStorage.getItem("nsfw");
	if (!nsfw) {
		var nsfw = "yes";
	}
	$("#n_" + nsfw).prop("checked", true);

	var cw = localStorage.getItem("cw");
	if (!cw) {
		var cw = "yes";
	}
	$("#c_" + cw).prop("checked", true);

	var popup = localStorage.getItem("popup");
	if (!popup) {
		var popup = "0";
	}
	$("#popup").val(popup);

	var box = localStorage.getItem("box");
	if (!box) {
		var box = "no";
	}
	$("#b_" + box).prop("checked", true);

	var sent = localStorage.getItem("sentence");
	if (!sent) {
		var sent = "500";
	}
	$("#sentence").val(sent);

	var width = localStorage.getItem("width");
	if (!width) {
		var width = "300";
	}
	$("#width").val(width);

	var cwt = localStorage.getItem("cw-text");
	if (!cwt) {
		var cwt = "";
	}
	$("#cw-text").val(cwt);

	var vis = localStorage.getItem("vis");
	if (!vis) {
		var vis = "public";
	}
	$("#" + vis).prop("checked", true);

	var img = localStorage.getItem("img");
	if (!img) {
		var img = "no-act";
	}
	$("#i_" + img).prop("checked", true);

	var size = localStorage.getItem("size");
	if (!size) {
		var size = "15";
	}
	$("#size").val(size);

	//並べ替え
	sortload();
}
//最初に読む
load();