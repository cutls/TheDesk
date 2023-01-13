//Poll Parser
function pollParse(poll, acct_id, emojis) {
	var rand = uuid()
	var datetype = localStorage.getItem('datetype')
	var anime = localStorage.getItem('animation')
	if (anime === 'yes' || !anime) {
		var lpAnime = 'lpAnime'
	} else {
		var lpAnime = ''
	}
	var gif = localStorage.getItem('gif')
	if (!gif) {
		gif = 'yes'
	}
	var choices = poll.options
	if (poll.own_votes) {
		var minechoice = poll.own_votes
	} else {
		var minechoice = []
	}
	var refresh = `<a onclick="voteMastodonrefresh('${acct_id}','${poll.id}','${rand}')" class="pointer">
		${lang.lang_manager_refresh}
	</a>`
	if (poll.voted && minechoice.length) {
		var myvote = lang.lang_parse_voted
		if (poll.expired) myvote = myvote + '/' + lang.lang_parse_endedvote
		var result_hide = ''
	} else if (poll.voted && !minechoice.length) {
		var myvote = lang.lang_parse_myvote
		if (poll.expired) myvote = myvote + '/' + lang.lang_parse_endedvote
		var result_hide = ''
	} else if (poll.expired) {
		var myvote = lang.lang_parse_endedvote
		var result_hide = ''
	} else {
		var myvote = `<a onclick="voteMastodon('${acct_id}','${poll.id}','${rand}')" class="votebtn">${lang.lang_parse_vote}</a><br>`
		if (choices[0].votes_count === 0 || choices[0].votes_count > 0) {
			myvote =
				myvote +
				`<a onclick="showResult('${acct_id}','${poll.id}','${rand}')" class="pointer">
				${lang.lang_parse_unvoted}
				</a>　`
		}
		var result_hide = 'hide'
	}
	var ended = date(poll.expires_at, datetype)
	var pollHtml = ''
	if (choices[0].votes_count === 0 || choices[0].votes_count > 0) {
		var max = _.maxBy(choices, 'votes_count').votes_count
	} else {
		var max = 0
	}

	Object.keys(choices).forEach(function (keyc) {
		var choice = choices[keyc]
		var voteit = ''
		for (var i = 0; i < minechoice.length; i++) {
			var me = minechoice[i]
			if (me === keyc) {
				var voteit =
					'<span class="ownMark"><img class="emoji" draggable="false" src="https://twemoji.maxcdn.com/v/12.1.4/72x72/2705.png"></span>'
				break
			}
		}
		if (!poll.voted && !poll.expired) {
			var votesel =
				`voteSelMastodon('${acct_id}','${poll.id}',${keyc},${poll.multiple}, this)`
			var voteclass = 'pointer'
		} else {
			var votesel = ''
			var voteclass = ''
		}
		var per = Math.ceil((choice.votes_count / poll.votes_count) * 100)
		if (!per) per = 0
		if (max === choice.votes_count) {
			var addPoll = 'maxVoter'
		} else {
			var addPoll = ''
		}
		var openData = ''
		if (choice.votes_count !== null) {
			openData = `<span style="float: right">${voteit}${choice.votes_count}<span class="sml">(${per}%)</span></span>`
		} else {
			openData = `<span style="float: right">${voteit}?<span class="sml">(-%)</span></span>`
		}
		var choiceText = escapeHTML(choice.title)
		if (emojis) {
			//絵文字があれば
			Object.keys(emojis).forEach(function (key5) {
				var emoji = emojis[key5]
				var shortcode = emoji.shortcode
				if (gif === 'yes') {
					var emoSource = emoji.url
				} else {
					var emoSource = emoji.static_url
				}
				var emoji_url = `
			<img draggable="false" src="${emoSource}" class="emoji-img" data-emoji="${shortcode}" 
				alt=" :${shortcode}: " title="${shortcode}" onclick="this.classList.toggle('bigemoji');" loading="lazy">
		`
				var regExp = new RegExp(':' + shortcode + ':', 'g')
				choiceText = choiceText.replace(regExp, emoji_url)
			})
			choiceText = twemojiParse(choiceText)
		}
		pollHtml =
			pollHtml +
			`<div class="${voteclass} vote vote_${acct_id}_${poll.id}_${keyc}" onclick="${votesel}">
				<span class="vote_${acct_id}_${poll.id}_result leadPoll ${result_hide} ${addPoll} ${lpAnime}" style="width: ${per}%"></span>
				<span class="onPoll">${choiceText}</span>
				<span class="vote_${acct_id}_${poll.id}_result ${result_hide} onPoll">
					${openData}
				</span>
			</div>`
	})
	if (poll.expired) {
		refresh = ''
	}
	pollHtml = `<div class="vote_${acct_id}_${poll.id}" id="vote${rand}">
			${pollHtml}${myvote}
			${refresh}
			<span class="cbadge cbadge-hover" title="${date(poll.expires_at, 'absolute')}">
				<i class="far fa-calendar-times"></i>
				${ended}
			</span>${poll.voters_count} ${lang.lang_parse_people}
		</div>`
	return pollHtml
}