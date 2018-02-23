//設定(setting.html)で読む
//設定ボタン押した。
function settings() {
	var dd = $("[name=time]:checked").val();
	var dt = $("[for="+dd+"]").text();
		if (dd != localStorage.getItem("datetype")) {
		Materialize.toast("時間設定を" + dt + "に設定しました。", 3000);
	}
	localStorage.setItem("datetype", dd);

	var cd = $("[name=theme]:checked").val();
	var ct = $("[for="+cd+"]").text();
	if (cd != localStorage.getItem("theme")) {
		Materialize.toast("テーマ設定を" + ct + "に設定しました。", 3000);
	}
	//テーマはこの場で設定
	themes(cd);
	localStorage.setItem("theme", cd);

	var nd = $("[name=nsfw]:checked").val();
	var nt = $("[for=n_"+nd+"]").text();
	if (nd != localStorage.getItem("nsfw")) {
		Materialize.toast("画像表示設定を" + nt + "に設定しました。", 3000);
	}
	localStorage.setItem("nsfw", nd);

	var cwd = $("[name=cw]:checked").val();
	var cwt = $("[for=c_"+cwd+"]").text();
	if (cwd != localStorage.getItem("cw")) {
		Materialize.toast("テキスト表示設定を" + cwt + "に設定しました。", 3000);
	}
	localStorage.setItem("cw", cwd);

	var cwtd = $("#cw-text").val();
	if (cwtd != localStorage.getItem("cw-text")) {
		Materialize.toast("デフォルトの警告文を「" + cwtd + "」に設定しました。", 3000);
	}
	localStorage.setItem("cw-text", cwtd);

	var visd = $("[name=vis]:checked").val();
	var vist = $("[for="+visd+"]").text();
	if (visd != localStorage.getItem("vis")) {
		Materialize.toast("デフォルトの公開設定を" + vist + "に設定しました。", 3000);
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
	var boxt = $("[for=b_"+boxd+"]").text();
	if (boxd != localStorage.getItem("box")) {
		Materialize.toast("デフォルトでのボックスの挙動を" + boxt + "に設定しました。", 3000);
	}
	localStorage.setItem("box", boxd);

	var gifd = $("[name=gif]:checked").val();
	var gift = $("[for=g_"+gifd+"]").text();
	if (gifd != localStorage.getItem("gif")) {
		Materialize.toast("アイコンアニメーション再生を" + gift + "に設定しました。", 3000);
	}
	localStorage.setItem("gif", gifd);

	var sentd = $("#sentence").val();
	var ltrd = $("#letters").val();
	if (sentd != localStorage.getItem("sentence") || ltrd != localStorage.getItem("letters")) {
		Materialize.toast(sentd + "行以上または"+ltrd+"文字以上でテキストを隠します。", 3000);
	}
	localStorage.setItem("sentence", sentd);
	localStorage.setItem("letters", ltrd);

	var widthd = $("#width").val();
	if (widthd != localStorage.getItem("width")) {
		Materialize.toast("横幅最低を" + widthd + "pxに設定しました。", 3000);
	}
	localStorage.setItem("width", widthd);

	var imgd = $("[name=img]:checked").val();
	var imgt = $("[for=i_"+imgd+"]").text();
	if (imgd != localStorage.getItem("img")) {
		Materialize.toast("画像投稿後の設定を「" + imgt + "」に設定しました。", 3000);
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

	var gif = localStorage.getItem("gif");
	if (!gif) {
		var gif = "yes";
	}
	$("#g_" + gif).prop("checked", true);

	var sent = localStorage.getItem("sentence");
	if (!sent) {
		var sent = "500";
	}
	$("#sentence").val(sent);
	var ltrs = localStorage.getItem("letters");
	if (!ltrs) {
		var ltrs = "500";
	}
	$("#letters").val(ltrs);

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