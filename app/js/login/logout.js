'use strict'
//ログアウトします
function logout() {
	localStorage.removeItem("acct_" + acct_id + "_at");
	localStorage.removeItem("domain_" + acct_id);
	location.href = "index.html";
	todc();
}