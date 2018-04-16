//入力時にハッシュタグと@をサジェスト
var timer = null;

var input = document.getElementById("url");

var prev_val = input.value;
var oldSuggest;
var suggest;
input.addEventListener("focus", function() {
	$("#ins-suggest").html("");
	window.clearInterval(timer);
	timer = window.setInterval(function() {
		var new_val = input.value;
		if (prev_val != new_val) {
			if (new_val.length > 3) {
				var start = "https://instances.social/api/1.0/instances/search?q=" +
					new_val;
				fetch(start, {
					method: 'GET',
					headers: {
						'content-type': 'application/json',
						'Authorization': 'Bearer tC8F6xWGWBUwGScyNevYlx62iO6fdQ4oIK0ad68Oo7ZKB8GQdGpjW9TKxBnIh8grAhvd5rw3iyP9JPamoDpeLQdz62EToPJUW99hDx8rfuJfGdjQuimZPTbIOx0woA5M'
					},
				}).then(function(response) {
					return response.json();
				}).catch(function(error) {
					todo(error);
					console.error(error);
				}).then(function(json) {
					console.log(json);
					if (!json.error) {

						var urls = "もしかして:";
						Object.keys(json.instances).forEach(function(key) {
							var url = json.instances[key];
							urls = urls + '　<a onclick="login(\'' + url.name +
								'\')" class="pointer">' + url.name + '</a>  ';
						});
						$("#ins-suggest").html(urls);
					}
				});
			}
			oldSuggest = suggest;
			prev_value = new_val;
		}
	}, 1000);
}, false);

input.addEventListener("blur", function() {
	window.clearInterval(timer);
}, false);
