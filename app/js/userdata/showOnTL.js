//ユーザーデータ表示
localStorage.removeItem("history")
//コード受信
if (location.search) {
	var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/)
	var mode = m[1]
	var codex = m[2]
	if (mode == "user") {
		udgEx(codex, "main")
	}
}
function udgEx(user, acct_id) {
	if (user == "selector") {
		user = $("#his-acct").attr("fullname")
	}
	if (acct_id == "selector") {
		acct_id = $("#user-acct-sel").val()
	}
	if (acct_id == "main") {
		acct_id = localStorage.getItem("main")
	}
	console.log("Get user data of " + user)
	var domain = localStorage.getItem("domain_" + acct_id)
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		return false
	}
	var at = localStorage.getItem("acct_" + acct_id + "_at")
	var start = "https://" + domain + "/api/v2/search?resolve=true&q=" + encodeURIComponent(user)
	fetch(start, {
		method: "GET",
		headers: {
			"content-type": "application/json",
			Authorization: "Bearer " + at
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, "JSON", error)
			console.error(error)
		})
		.then(function (json) {
			if (json.accounts[0]) {
				var id = json.accounts[0].id
				udg(id, acct_id)
			} else {
				postMessage(["openUrl", user], "*")
			}
		})
	return true
}
function udg(user, acct_id) {
	reset()
	if (!user) {
		user = localStorage.getItem("user-id_" + acct_id)
	}
	todo("User Data Loading...")
	var domain = localStorage.getItem("domain_" + acct_id)
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		misskeyUdg(user, acct_id)
		return
	}
	var at = localStorage.getItem("acct_" + acct_id + "_at")
	var start = "https://" + domain + "/api/v1/accounts/" + user
	fetch(start, {
		method: "GET",
		headers: {
			"content-type": "application/json",
			Authorization: "Bearer " + at
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, "JSON", error)
			console.error(error)
		})
		.then(function (json) {
			//一つ前のユーザーデータ
			if (!localStorage.getItem("history")) {
				$("#his-history-btn").prop("disabled", true)
			} else {
				$("#his-history-btn").prop("disabled", false)
				$("#his-data").attr("history", localStorage.getItem("history"))
			}
			//moved設定時
			if (json.moved) {
				M.toast({
					html: lang.lang_showontl_movetxt + '<button class="btn-flat toast-action" onclick="udg(\'' + json.moved.id + "','" + acct_id + "')\">" + lang.lang_showontl_movebtn + "</button>",
					displayLength: 4000
				})
			}
			$("#his-data").modal("open")
			$("#his-data").attr("user-id", user)
			$("#his-data").attr("use-acct", acct_id)
			if (json.username != json.acct) {
				//Remote
				$("#his-data").attr("remote", "true")
				var fullname = json.acct
			} else {
				$("#his-data").attr("remote", "false")
				var fullname = json.acct + "@" + domain
			}
			utlShow(json.id, "", acct_id)
			flw(json.id, "", acct_id)
			fer(json.id, "", acct_id)
			var dis_name = escapeHTML(json.display_name)
			dis_name = twemoji.parse(dis_name)

			var note = json.note
			if (json.emojis) {
				var actemojick = json.emojis[0]
			} else {
				var actemojick = false
			}
			//絵文字があれば
			if (actemojick) {
				Object.keys(json.emojis).forEach(function (key5) {
					var emoji = json.emojis[key5]
					var shortcode = emoji.shortcode
					var emoji_url = '<img src="' + emoji.url + '" class="emoji-img" data-emoji="' + shortcode + '" draggable="false">'
					var regExp = new RegExp(":" + shortcode + ":", "g")
					dis_name = dis_name.replace(regExp, emoji_url)
					note = note.replace(regExp, emoji_url)
				})
			}
			//noteの解析
			//var tags =  '<a onclick="tl(\'tag\',\'$1\',' + acct_id +',\'add\')" class="pointer parsed">#$1</a>';
			//var mens =  '<a onclick="udgEx(\'$1\',' + acct_id +')" class="pointer parsed">@$1</a>';
			//note=note.replace(/#(\S+)/gi, tags)
			//note=note.replace(/\s@([a-zA-Z_0-9@.-]+)/gi, mens)
			$("#his-name").html(dis_name)
			$("#his-acct").text(json.acct)
			$("#his-acct").attr("fullname", fullname)
			$("#his-prof").attr("src", json.avatar)
			$("#util-add").removeClass("hide")
			const title = $('.column-first').html()
			$("#my-data-nav .anc-link").removeClass("active-back")
			$('.column-first').addClass("active-back")
			$('#his-data-title').html(title) 
			$("#his-data").css("background-image", "url(" + json.header + ")")
			$("#his-sta").text(json.statuses_count)
			$("#his-follow").text(json.following_count)
			var flerc = json.followers_count
			if (flerc < 0) {
				flerc = "-"
			}
			$("#his-follower").text(flerc)
			$("#his-since").text(crat(json.created_at))
			$("#his-openin").attr("data-href", json.url)
			if (json.fields) {
				var table = ""
				if (json.fields.length > 0) {
					$("#his-des").css("max-height", "250px")
					table = '<table id="his-field">'
					for (var i = 0; i < json.fields.length; i++) {
						var fname = json.fields[i].name
						var fval = json.fields[i].value
						if (json.fields[i].verified_at) {
							var when = lang.lang_showontl_verified + ":" + crat(json.fields[i].verified_at)
							var color = "rgba(121,189,154,.25);"
						} else {
							var when = ""
							var color = "inherit"
						}
						table = table + '<tr><td class="his-field-title">' + escapeHTML(fname) + '</td><td class="his-field-content" title="' + when + '" style="background-color:' + color + '">' + fval + "</td></tr>"
					}
					table = table + "</table>"
					$("#his-des").html(twemoji.parse(note))
				} else {
					$("#his-des").css("max-height", "400px")
				}
				$("#his-table").html(twemoji.parse(table))
			} else {
				$("#his-des").css("max-height", "400px")
			}
			$("#his-des").html(twemoji.parse(note))
			if (json.bot) {
				$("#his-bot").html(lang.lang_showontl_botacct)
				$("#his-bot").removeClass("hide")
			}
			$("#his-des").attr("data-acct", acct_id)
			$("#his-data").css("background-size", "cover")
			$("#his-float-timeline").css("height", $("#his-data-show").height() + "px")
			localStorage.setItem("history", user)
			//自分の時
			if (json.acct == localStorage.getItem("user_" + acct_id)) {
				showFav("", acct_id)
				showBlo("", acct_id)
				showMut("", acct_id)
				showDom("", acct_id)
				showReq("", acct_id)
				showFrl("", acct_id)
				$("#his-name-val").val(json.display_name)
				if (json.fields.length > 0) {
					if (json.fields[0]) {
						$("#his-f1-name").val(json.fields[0].name)
						$("#his-f1-val").val($.strip_tags(json.fields[0].value))
					}
					if (json.fields[1]) {
						$("#his-f2-name").val(json.fields[1].name)
						$("#his-f2-val").val($.strip_tags(json.fields[1].value))
					}
					if (json.fields[2]) {
						$("#his-f3-name").val(json.fields[2].name)
						$("#his-f3-val").val($.strip_tags(json.fields[2].value))
					}
					if (json.fields[3]) {
						$("#his-f4-name").val(json.fields[3].name)
						$("#his-f4-val").val($.strip_tags(json.fields[3].value))
					}
				}
				var des = json.note
				des = des.replace(/<br \/>/g, "\n")
				des = $.strip_tags(des)
				$("#his-des-val").val(des)
				$("#his-follow-btn").hide()
				$("#his-block-btn").hide()
				$("#his-mute-btn").hide()
				$("#his-notf-btn").hide()
				$("#his-domain-btn").hide()
				$("#his-emp-btn").hide()
				$(".only-my-data").show()
				$(".only-his-data").hide()
				if (localStorage.getItem("main") == acct_id) {
					$("#his-main-acct").hide()
				}
			} else {
				relations(user, acct_id)
				$(".only-my-data").hide()
				$(".only-his-data").show()
			}
			todc()
			if (json.locked) {
				$('#his-data').addClass('locked')
			} else {
				$('#his-data').removeClass('locked')
			}
			//外部データ取得(死かもしれないので)
			udAdd(acct_id, user, json.url)
		})
}
function misskeyUdg(user, acct_id) {
	reset()
	if (!user) {
		user = localStorage.getItem("user-id_" + acct_id)
	}
	todo("User Data Loading...")
	var domain = localStorage.getItem("domain_" + acct_id)
	if (localStorage.getItem("mode_" + domain) != "misskey") {
		udg(user, acct_id)
		return
	}
	var at = localStorage.getItem("acct_" + acct_id + "_at")
	var start = "https://" + domain + "/api/users/show"
	fetch(start, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			i: at,
			userId: user
		})
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, "JSON", error)
			console.error(error)
		})
		.then(function (json) {
			//一つ前のユーザーデータ
			if (!localStorage.getItem("history")) {
				$("#his-history-btn").prop("disabled", true)
			} else {
				$("#his-history-btn").prop("disabled", false)
				$("#his-data").attr("history", localStorage.getItem("history"))
			}
			$("#his-data").modal("open")
			$("#his-data").attr("user-id", user)
			$("#his-data").attr("use-acct", acct_id)
			if (json.host) {
				//Remote
				$("#his-data").attr("remote", "false")
				var fullname = json.username + "@" + json.host
			} else {
				$("#his-data").attr("remote", "false")
				var fullname = json.acct + "@" + domain
			}
			utlShow(json.id, "", acct_id)
			flw(json.id, "", acct_id)
			fer(json.id, "", acct_id)
			if (json.name) {
				var dis_name = escapeHTML(json.name)
				dis_name = twemoji.parse(dis_name)
			} else {
				var dis_name = json.name
			}
			$("#his-name").html(dis_name)
			$("#his-acct").text(json.username)
			$("#his-acct").attr("fullname", fullname)
			$("#his-prof").attr("src", json.avatarUrl)
			$("#his-data").css("background-image", "url(" + json.bannerUrl + ")")
			$("#his-sta").text(json.notesCount)
			$("#his-follow").text(json.followingCount)
			$("#his-follower").text(json.followersCount)
			$("#his-since").text(crat(json.createdAt))
			var note = escapeHTML(json.description)
			$("#his-des").html(twemoji.parse(note))
			if (json.isCat) {
				$("#his-bot").html("Cat" + twemoji.parse("😺"))
			}
			$("#his-data").css("background-size", "cover")
			localStorage.setItem("history", user)
			//自分の時
			if (json.username == localStorage.getItem("user_" + acct_id) && !json.host) {
				//showFav('', acct_id);
				//showMut('', acct_id);
				//showReq('', acct_id);
				showFrl("", acct_id)
				$("#his-name-val").val(json.name)
				var des = json.note
				des = nl2br(des)
				des = $.strip_tags(des)
				$("#his-des-val").val(des)
				$("#his-follow-btn").hide()
				$("#his-block-btn").hide()
				$("#his-mute-btn").hide()
				$("#his-notf-btn").hide()
				$("#his-domain-btn").hide()
				$("#his-emp-btn").hide()
				$(".only-my-data").show()
				$(".only-his-data").hide()
				if (localStorage.getItem("main") == acct_id) {
					$("#his-main-acct").hide()
				}
			} else {
				if (json.isFollowing) {
					//自分がフォローしている
					$("#his-data").addClass("following")
					$("#his-follow-btn-text").text(lang.lang_status_unfollow)
					hisList(user, acct_id)
				} else {
					$("#his-follow-btn-text").text(lang.lang_status_follow)
				}
				if (json.isFollowed) {
					//フォローされてる
					$("#his-relation").text(lang.lang_showontl_followed)
				}
				$("#his-block-btn").hide()
				if (json.isMuted) {
					$("#his-data").addClass("muting")
					$("#his-mute-btn-text").text(lang.lang_status_unmute)
				} else {
					$("#his-mute-btn-text").text(lang.lang_status_mute)
				}
				$(".only-my-data").hide()
				$(".only-his-data").show()
			}
			todc()
		})
}
//一つ前のユーザーデータ表示
function historyShow() {
	var acct_id = $("#his-data").attr("use-acct")
	var user = $("#his-data").attr("history")
	udg(user, acct_id, "true")
}
//選択アカウントのプロフ
function profShow() {
	var acct_id = $("#post-acct-sel").val()
	var user = localStorage.getItem("user-id_" + acct_id)
	udg(user, acct_id)
	hide()
}

//FF関係取得
function relations(user, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id)
	var at = localStorage.getItem("acct_" + acct_id + "_at")
	var start = "https://" + domain + "/api/v1/accounts/relationships?id=" + user
	fetch(start, {
		method: "GET",
		headers: {
			"content-type": "application/json",
			Authorization: "Bearer " + at
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, "JSON", error)
			console.error(error)
		})
		.then(function (json) {
			var json = json[0]
			if (json.requested) {
				//フォロリク中
				$('#his-data').addClass('following')
				$("#his-follow-btn-text").text(lang.lang_status_requesting)
			}
			if (json.following) {
				//自分がフォローしている
				$("#his-data").addClass("following")
				$("#his-follow-btn-text").text(lang.lang_status_unfollow)
				hisList(user, acct_id)
			} else {
				$("#his-follow-btn-text").text(lang.lang_status_follow)
			}
			if (json.followed_by) {
				//フォローされてる
				$("#his-relation").text(lang.lang_showontl_followed)
			}
			if (json.blocking) {
				$("#his-data").addClass("blocking")
				$("#his-block-btn-text").text(lang.lang_status_unblock)
			} else {
				$("#his-block-btn-text").text(lang.lang_status_block)
			}
			if (json.muting) {
				$("#his-data").addClass("muting")
				$("#his-mute-btn-text").text(lang.lang_status_unmute)
			} else {
				$("#his-mute-btn-text").text(lang.lang_status_mute)
			}
			if (json.muting_notifications) {
				$("#his-data").addClass("mutingNotf")
				$("#his-notf-btn-text").text(lang.lang_showontl_notf + lang.lang_status_unmute)
			} else {
				$("#his-notf-btn-text").text(lang.lang_showontl_notf + lang.lang_status_mute)
			}
			if (json.domain_blocking) {
				$("#his-data").addClass("blockingDom")
				$("#his-domain-btn-text").text(lang.lang_showontl_domain + lang.lang_status_unblock)
			} else {
				$("#his-domain-btn-text").text(lang.lang_showontl_domain + lang.lang_status_block)
			}
			//Endorsed
			if (json.endorsed) {
				$("#his-end-btn").addClass("endorsed")
				$("#his-end-btn-text").text(lang.lang_status_unendorse)
			} else {
				$("#his-end-btn").removeClass("endorsed")
				$("#his-end-btn-text").text(lang.lang_status_endorse)
			}
			//Blocked
			if (json.blocked_by) {
				$("#my-data-nav .btn").addClass("disabled")
				$(".his-var-content").hide()
				$("#his-float-blocked").show()
				$("#his-follow-btn").hide()
			}
		})
}
function profbrws() {
	var url = $("#his-openin").attr("data-href")
	postMessage(["openUrl", url], "*")
}
function setMain() {
	var acct_id = $("#his-data").attr("use-acct")
	localStorage.setItem("main", acct_id)
	multiSelector(true)
	M.toast({ html: lang.lang_manager_mainAcct, displayLength: 3000 })
}
//オールリセット
function hisclose() {
	$("#his-data").modal("close")
	reset()
	$("#his-data").attr("history", "")
	localStorage.removeItem("history")
}
function reset() {
	$(".his-var-content:eq(0)").show()
	$(".his-var-content:gt(0)").hide()
	$("#my-data-nav .btn").removeClass("disabled")
	$(".active-back").removeClass("active-back")
	$(".column-first").addClass("active-back")
	$("#his-name").text("Loading")
	$("#his-acct").text("")
	$("#his-prof").attr("src", "../../img/loading.svg")
	$("#his-data").css("background-image", "url(../../img/loading.svg)")
	$("#his-sta").text("")
	$("#his-follow").text("")
	$("#his-follower").text("")
	$("#his-des").html("")
	$("#his-data").css("background-size", "cover")
	$("#his-since").text("")
	$("#his-data").removeClass("following")
	$("#his-data").removeClass("muting")
	$("#his-data").removeClass("blocking")
	$("#his-data").removeClass("mutingNotf")
	$("#his-data").removeClass("blockingDom")
	$("#his-end-btn").removeClass("endorsed")
	$("#his-des").css("max-height", "250px")
	$("#his-bot").html("")
	$("#his-bot").addClass("hide")
	$("#his-follow-btn").show()
	$("#his-block-btn").show()
	$("#his-mute-btn").show()
	$("#his-notf-btn").show()
	$("#his-domain-btn").show()
	$("#his-emp-btn").show()
	$("#his-follow-btn-text").text(lang.lang_status_follow)
	$("#his-mute-btn-text").text(lang.lang_status_mute)
	$("#his-block-btn-text").text(lang.lang_status_block)
	$("#his-notf-btn").text(lang.lang_showontl_notf + lang.lang_status_mute)
	$("#his-domain-btn").text(lang.lang_showontl_domain + lang.lang_status_block)
	$("#his-relation").text("")
	$(".cont-series").html("")
	$("#domainblock").val("")
	$("#his-lists-a").html(lang.lang_showontl_listwarn)
	$("#his-lists-b").html("")
	$("#his-name-val").val("")
	$("#his-des-val").val("")
	$("#his-f1-name").val("")
	$("#his-f1-val").val("")
	$("#his-f2-name").val("")
	$("#his-f2-val").val("")
	$("#his-f3-name").val("")
	$("#his-f3-val").val("")
	$("#his-f4-name").val("")
	$("#his-f4-val").val("")
	$("#his-endorse").html("")
	$("#his-openin").attr("data-href", "")
	$("#his-float-timeline").show()
	$("#his-float-blocked").hide()
	$("#his-main-acct").show()
	$("#his-proof-prof").html("")
	$('#his-data').removeClass('locked')
	$('#his-data').removeClass('requesting')
}
$("#my-data-nav .anc-link").on("click", function () {
	var target = $(this).attr("go")
	if (target) {
		let title = $(this).html()
		if (target === '#his-tl') $("#util-add").removeClass("hide")
		if (target != '#his-tl') $("#util-add").addClass("hide")
		$('#his-data-title').html(title) 
		$("#my-data-nav .anc-link").removeClass("active-back")
		$(this).addClass("active-back")
		$(target).show()
		$(".his-var-content:not(" + target + ")").hide()
	}
})
