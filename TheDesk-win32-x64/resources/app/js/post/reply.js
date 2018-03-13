/*リプライ*/
function re(id,at,acct_id,mode){
	show();
	$("#reply").val(id);
	var te=$("#textarea").val();
	$("#textarea").val("@"+at+" "+te);
	$("#rec").text("はい");
	$("#post-acct-sel").val(acct_id);
	$('select').material_select();
	$("#textarea").attr("placeholder","返信モードです。クリアするときはShift+Cを押してください。");
	vis(mode);
}