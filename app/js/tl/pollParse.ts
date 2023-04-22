//Poll Parser
import { v4 as uuid } from 'uuid'
import lang from '../common/lang'
import { date, isDateType } from './date'
import _ from 'lodash'
import { Emoji, Poll } from '../../interfaces/MastodonApiReturns'
import { escapeHTML } from '../platform/first'
import { customEmojiReplace } from './parse'
const datetype = localStorage.getItem('datetype') || 'absolute'
const anime = localStorage.getItem('animation')
const gif = (localStorage.getItem('gif') || 'yes') === 'yes'

export function pollParse(poll: Poll, acctId: string, emojis: Emoji[]) {
	const rand = uuid()

	let lpAnime = ''
	if (anime === 'yes' || !anime) lpAnime = 'lpAnime'
	const choices = poll.options
	const mineChoice = poll.own_votes || []
	const refresh = poll.expired
		? `<a onclick="voteMastodonrefresh('${acctId}','${poll.id}','${rand}')" class="pointer">
		${lang.lang_manager_refresh}
	</a>`
		: ''
	let result_hide = ''
	let myVote = ''
	if (poll.voted && mineChoice.length) {
		myVote = lang.lang_parse_voted
		if (poll.expired) myVote = myVote + '/' + lang.lang_parse_endedvote
	} else if (poll.voted && !mineChoice.length) {
		myVote = lang.lang_parse_myvote
		if (poll.expired) myVote = myVote + '/' + lang.lang_parse_endedvote
	} else if (poll.expired) {
		myVote = lang.lang_parse_endedvote
	} else {
		myVote = `<a onclick="voteMastodon('${acctId}','${poll.id}','${rand}')" class="votebtn">${lang.lang_parse_vote}</a><br>`
		if (choices[0].votes_count === 0 || (choices[0].votes_count || 0) > 0) {
			myVote =
				myVote +
				`<a onclick="showResult('${acctId}','${poll.id}','${rand}')" class="pointer">
				${lang.lang_parse_unvoted}
				</a>&nbsp;`
		}
		result_hide = 'hide'
	}
	if (!isDateType(datetype)) return
	const ended = date(poll.expires_at, datetype)
	let pollHtml = ''
	const max = _.maxBy(choices, 'votes_count')?.votes_count || 0
	let keyc = 0
	for (const choice of choices) {
		let voteIt = ''
		for (let i = 0; i < mineChoice.length; i++) {
			const me = mineChoice[i]
			if (me === keyc) {
				voteIt = `<span class="ownMark"><img class="emoji" draggable="false" src="../../${globalThis.pwa ? 'dependencies' : 'node_modules'}/twemoji-asset/assets/72x72/2705.png"></span>`
				break
			}
		}
		let votesel = ''
		let voteclass = ''
		if (!poll.voted && !poll.expired) {
			votesel = `voteSelMastodon('${acctId}','${poll.id}',${poll.multiple}, this)`
			voteclass = 'pointer'
		}
		const per = Math.ceil(((choice.votes_count || 0) / poll.votes_count) * 100) || 0
		const addPoll = max === choice.votes_count ? 'maxVoter' : ''
		let openData = ''
		if (choice.votes_count !== null) {
			openData = `<span style="float: right">${voteIt}${choice.votes_count}<span class="sml">(${per}%)</span></span>`
		} else {
			openData = `<span style="float: right">${voteIt}?<span class="sml">(-%)</span></span>`
		}
		let choiceText = escapeHTML(choice.title)
		if (emojis) choiceText = customEmojiReplace(choiceText, { emojis }, gif)
		pollHtml =
			pollHtml +
			`<div class="${voteclass} vote vote_${acctId}_${poll.id}_${keyc}" onclick="${votesel}">
				<span class="vote_${acctId}_${poll.id}_result leadPoll ${result_hide} ${addPoll} ${lpAnime}" style="width: ${per}%"></span>
				<span class="onPoll">${choiceText}</span>
				<span class="vote_${acctId}_${poll.id}_result ${result_hide} onPoll">
					${openData}
				</span>
			</div>`
		keyc++
	}
	pollHtml = `<div class="vote_${acctId}_${poll.id}" id="vote${rand}">
			${pollHtml}${myVote}
			${refresh}
			<span class="cbadge cbadge-hover" title="${date(poll.expires_at, 'absolute')}">
				<i class="far fa-calendar-times"></i>
				${ended}
			</span>${poll.voters_count} ${lang.lang_parse_people}
		</div>`
	return pollHtml
}
