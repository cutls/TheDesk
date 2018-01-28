//ログアウトします
function logout(){
	localStorage.removeItem(localStorage.getItem("domain_"+acct_id)+"_at");
	localStorage.removeItem("domain_"+acct_id);
	location.href="index.html";
	todc();
}