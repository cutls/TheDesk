//入力時にハッシュタグと@をサジェスト
var timer = null;

var input = document.getElementById("textarea");

var prev_val = input.value;
var oldSuggest;
var suggest;
input.addEventListener("focus", function() {
	$("#suggest").html("");
	window.clearInterval(timer);
	timer = window.setInterval(function() {
		var new_val = input.value;
		if (prev_val != new_val) {
			var tag = new_val.match(/#(\S{3,})/);
			var acct = new_val.match(/@(\S{3,})/);
			if (tag && tag[1]) {
				var q = tag[1];
			} else if (acct[1]) {
				var q = acct[1];
			} else {
				$("#suggest").html("");
				return;
			}
			var domain = localStorage.getItem("domain_" + acct_id);
			var at = localStorage.getItem(domain + "_at");
			suggest = "https://" + domain + "/api/v1/search?q=" + q
			if (suggest != oldSuggest) {
				console.log(suggest)
				fetch(suggest, {
					method: 'GET',
					headers: {
						'content-type': 'application/json',
						'Authorization': 'Bearer ' + at
					},
				}).then(function(response) {
					return response.json();
				}).catch(function(error) {
					todo(error);
					console.error(error);
				}).then(function(json) {
					if (json.hashtags[0] && tag[1]) {
						var tags = "";
						Object.keys(json.hashtags).forEach(function(key4) {
							var tag = json.hashtags[key4];
							tags = tags + '<a onclick="emojiInsert(\'#' + tag + '\',\'#' + q +
								'\')" class="pointer">#' + tag + '</a>  ';
						});
						$("#suggest").html("Tags:" + tags);
					} else if (json.accounts[0] && acct[1]) {
						var accts = "";
						Object.keys(json.accounts).forEach(function(key3) {
							var acct = json.accounts[key3];
							accts = accts + '<a onclick="emojiInsert(\'@' + acct.acct +
								'\',\'@' + q + '\')" class="pointer">@' + acct.acct + '</a>  ';
						});
						$("#suggest").html("@:" + accts);
					} else {
						$("#suggest").html("Not Found");
					}
				});
			}
		};
		oldSuggest = suggest;
		prev_value = new_val;
	}, 1000);
}, false);

input.addEventListener("blur", function() {
	window.clearInterval(timer);
	favTag();
}, false);
