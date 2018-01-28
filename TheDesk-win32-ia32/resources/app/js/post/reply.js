/*リプライ*/
function re(id,at){
	show();
	$("#reply").val(id);
	var te=$("#textarea").val();
	$("#textarea").val("@"+at+" "+te);
	$("#rec").text("はい");
	$("#textarea").attr("placeholder","返信モードです。クリアするときはShift+Cを押してください。");
}