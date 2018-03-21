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
function reEx(id){
	$('#tootmodal').modal('close');
	var at=$("#tootmodal").attr("data-user");
	var acct_id = $("#status-acct-sel").val();
	var mode=$("#tootmodal .vis-data").attr("data-vis");
	re(id,at,acct_id,mode);
}