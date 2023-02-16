import { client, parse } from './tl/parse'
import { getData, refreshManager } from './login/manager'
import { filter } from './tl/filter'
import { about } from './common/about'
import { parseBlur } from './common/blurhash'
import { getMulti, setMulti, initColumn, getColumn, setColumn } from './common/storage'
import { verck, closeStart, closeSupport } from './common/version'
import { defaultEmoji, customEmoji, defEmoji } from './emoji/defaultEmoji'
import { ck, refresh, ckdb, multiSelector, ticker } from './login/login'
import { loadAcctList, maxChars, multiDel, backToInit, instance, code, atSetup, mainAcct, asReadEnd, autoCompleteInitTrigger } from './login/manager'
import { execCopy, nano, playSound } from './platform/end'
import { escapeHTML, nl2br, br2nl, formatTime, formatTimeUtc, makeCID, rgbToHex, setLog, escapeCsv, statusModel, initWebviewEvent, twemojiParse } from './platform/first'
import { initPlugin, getMeta, execPlugin, testExec } from './platform/plugin'
import { emojiToggle, emojiGet, emojiList, emojiInsert, brInsert } from './post/emoji'
import { closeDrop, fileSelect, media, toBlob, deleteImage, altImage, stamp, alertProcessUnfinished, pwaImgSelect } from './post/img'
import { sec, expPostMode, clear, post } from './post/post'
import { nsfw, vis, loadVis, cw, cwShow, schedule, draftToggle, addToDraft, useThisDraft, deleteThisDraft } from './post/secure'
import {
	fav,
	rt,
	boostWith,
	bkm,
	follow,
	acctResolve,
	acctResolveLegacy,
	block,
	muteDo,
	muteMenu,
	muteTime,
	del,
	redraft,
	editToot,
	draftToPost,
	pin,
	request,
	domainBlock,
	addDomainblock,
	empUser,
	pinUser,
	tootUriCopy,
	staEx,
	toggleAction,
	muteThread,
} from './post/status'
import { tagInsert } from './post/suggest'
import { re, reEx, qt } from './post/useTxtBox'
import { announParse, announReaction, announReactionNew, emojiReactionDef } from './tl/announParse'
import { mastodonBaseStreaming } from './tl/baseStreaming'
import { additional, additionalIndv, cardHtml, cardHtmlShow, cardToggle, cardCheck, mov, resetmv } from './tl/card'
import { details, cbCopy, staCopy, trans, brws, detEx, detExCore, contextToolChange } from './tl/datails'
import { date, crat } from './tl/date'
import { dirMenu, dirselCk, dirChange, directory } from './tl/directory'
import {
	mediaToggle,
	remoteOnly,
	remoteOnlyCk,
	ebtToggle,
	mediaCheck,
	ebtCheck,
	filterMenu,
	filterTime,
	makeNewFilter,
	filterEdit,
	filterDel,
	getFilter,
	getFilterType,
	convertColumnToFilter,
	getFilterTypeByAcct,
	filterUpdate,
	filterUpdateInternal,
	exclude,
	excludeCk,
	checkNotfFilter,
	resetNotfFilter,
	notfFilter,
} from './tl/filter'
import { listMenu, list, makeNewList, listShow, listUser, hisList, listAdd, listRemove } from './tl/list'
import { mixTl, mixre, mixMore } from './tl/mix'
import { notfParse } from './tl/notfParse'
import { notf, notfColumn, notfCommon, notfMore, notfToggle, allNotfRead } from './tl/notification'
import { customEmojiReplace } from './tl/parse'
import { pollToggle, pollCalc, voteSelMastodon, voteMastodon, showResult, voteMastodonrefresh } from './tl/poll'
import { pollParse } from './tl/pollParse'
import { say, voiceToggle, voiceCheck, voicePlay, voiceSettings, voiceSettingLoad } from './tl/speech'
import { searchMenu, src, tootsearch, moreTs, trend, srcBox, doSrc } from './tl/src'
import { tagShow, tShowBox, doTShowBox, tagRemove, favTag, tagShowHorizon, tagTL, autoToot, addTag } from './tl/tag'
import { tl, moreLoad, tlDiff, tlCloser, cap, com, icon, reconnector, columnReload, getMarker, showUnread, ueLoad, asRead, announ } from './tl/tl'
import { userParse, popupNotification } from './tl/userParse'
import { imgv, imgCont, zoom, rotate, detFromImg, dlImg, openFinder, stopVideo, copyImgUrl, copyImgBinary } from './ui/img'
import {
	parseColumn,
	checkStr,
	addColumn,
	removeColumn,
	setToggle,
	setToggleTag,
	colorPicker,
	bookmark,
	favTl,
	utl,
	leftFoldSet,
	leftFoldRemove,
	resetWidth,
	addColumnMenu,
	addselCk,
	colorAddMulti,
	colorAdd,
} from './ui/layout'
import { menu, help } from './ui/menu'
import { hide, mini, show, initPostbox, mdCheck } from './ui/postBox'
import { scrollEvent, scrollCk, goTop, goColumn } from './ui/scroll'
import {
	settings,
	configLoad,
	customVol,
	climute,
	cliMuteDel,
	wordmuteSave,
	wordempSave,
	notfTest,
	oks,
	changeLang,
	exportSettings,
	exportSettingsCore,
	importSettings,
	importSettingsCore,
	saveFolder,
	font,
	fontList,
	insertFont,
	copyColor,
	customComp,
	deleteIt,
	ctLoad,
	ctLoadCore,
	customSel,
	custom,
	customConnect,
	customImp,
	advanced,
	clearCustomImport,
	hardwareAcceleration,
	useragent,
	frameSet,
	customSound,
	customSoundSave,
	pluginEdit,
	completePlugin,
	testExecTrg,
	deletePlugin,
	checkUpd,
	lastFmSet,
} from './ui/settings'
import { sortLoad, sort, sortMenu } from './ui/sort'
import { spotifyConnect, spotifyAuth, spotifyDisconnect, checkSpotify, spotifyFlagSave, aMusicFlagSave, cMusicFlagSave, nowplaying, npCore, spotifySave } from './ui/spotify'
import { themes } from './ui/theme'
import { todo, todc, bottomReverse, tips, renderMem, spotifyTips, tipsToggle } from './ui/tips'
import { utlShow, utlAdd, flw, fer, showFav, showMut, showBlo, showReq, showDom, showFrl, udAdd } from './userdata/hisData'
import { profEdit, imgChange } from './userdata/profEdit'
import { udgEx, udg, historyShow, profShow, profbrws, setMain, hisclose } from './userdata/showOnTL'

import { values } from '@syuilo/aiscript'
import { migrate } from './platform/migrate'
globalThis.asCommon = {
	'TheDesk:console': values.FN_NATIVE((z) => {
		if(!z) return
		if (z[0]?.type === 'str') console.log(z[0].value)
	}),
}

globalThis.nano = nano
globalThis.about = about
globalThis.parseBlur = parseBlur
globalThis.getMulti = getMulti
globalThis.setMulti = setMulti
globalThis.initColumn = initColumn
globalThis.getColumn = getColumn
globalThis.setColumn = setColumn
globalThis.verck = verck
globalThis.closeStart = closeStart
globalThis.defaultEmoji = defaultEmoji
globalThis.customEmoji = customEmoji
globalThis.defEmoji = defEmoji
globalThis.ck = ck
globalThis.refresh = refresh
globalThis.ckdb = ckdb
globalThis.multiSelector = multiSelector
globalThis.ticker = ticker
globalThis.loadAcctList = loadAcctList
globalThis.maxChars = maxChars
globalThis.getData = getData
globalThis.multiDel = multiDel
globalThis.backToInit = backToInit
globalThis.instance = instance
globalThis.refreshManager = refreshManager
globalThis.code = code
globalThis.atSetup = atSetup
globalThis.mainAcct = mainAcct
globalThis.colorAdd = colorAdd
globalThis.asReadEnd = asReadEnd
globalThis.autoCompleteInitTrigger = autoCompleteInitTrigger
globalThis.execCopy = execCopy
globalThis.playSound = playSound
globalThis.escapeHTML = escapeHTML
globalThis.nl2br = nl2br
globalThis.br2nl = br2nl
globalThis.formatTime = formatTime
globalThis.formatTimeUtc = formatTimeUtc
globalThis.makeCID = makeCID
globalThis.rgbToHex = rgbToHex
globalThis.setLog = setLog
globalThis.escapeCsv = escapeCsv
globalThis.statusModel = statusModel
globalThis.initWebviewEvent = initWebviewEvent
globalThis.twemojiPars = twemojiParse
globalThis.initPlugin = initPlugin
globalThis.getMeta = getMeta
globalThis.execPlugin = execPlugin
globalThis.testExec = testExec
globalThis.emojiToggle = emojiToggle
globalThis.emojiGet = emojiGet
globalThis.emojiList = emojiList
globalThis.emojiInsert = emojiInsert
globalThis.brInsert = brInsert
globalThis.closeDrop = closeDrop
globalThis.fileSelect = fileSelect
globalThis.media = media
globalThis.toBlob = toBlob
globalThis.deleteImage = deleteImage
globalThis.altImage = altImage
globalThis.stamp = stamp
globalThis.alertProcessUnfinished = alertProcessUnfinished
globalThis.sec = sec
globalThis.post = post
globalThis.expPostMode = expPostMode
globalThis.clear = clear
globalThis.nsfw = nsfw
globalThis.vis = vis
globalThis.loadVis = loadVis
globalThis.cw = cw
globalThis.cwShow = cwShow
globalThis.schedule = schedule
globalThis.draftToggle = draftToggle
globalThis.addToDraft = addToDraft
globalThis.useThisDraft = useThisDraft
globalThis.deleteThisDraft = deleteThisDraft
globalThis.fav = fav
globalThis.rt = rt
globalThis.muteThread = muteThread
globalThis.boostWith = boostWith
globalThis.bkm = bkm
globalThis.follow = follow
globalThis.acctResolve = acctResolve
globalThis.acctResolveLegacy = acctResolveLegacy
globalThis.block = block
globalThis.muteDo = muteDo
globalThis.muteMenu = muteMenu
globalThis.muteTime = muteTime
globalThis.del = del
globalThis.redraft = redraft
globalThis.editToot = editToot
globalThis.draftToPost = draftToPost
globalThis.pin = pin
globalThis.request = request
globalThis.domainBlock = domainBlock
globalThis.addDomainblock = addDomainblock
globalThis.empUser = empUser
globalThis.pinUser = pinUser
globalThis.tootUriCopy = tootUriCopy
globalThis.staEx = staEx
globalThis.toggleAction = toggleAction
globalThis.tagInsert = tagInsert
globalThis.re = re
globalThis.reEx = reEx
globalThis.qt = qt
globalThis.announParse = announParse
globalThis.announReaction = announReaction
globalThis.announReactionNew = announReactionNew
globalThis.emojiReactionDef = emojiReactionDef
globalThis.mastodonBaseStreaming = mastodonBaseStreaming
globalThis.additional = additional
globalThis.additionalIndv = additionalIndv
globalThis.cardHtml = cardHtml
globalThis.cardHtmlShow = cardHtmlShow
globalThis.cardToggle = cardToggle
globalThis.cardCheck = cardCheck
globalThis.mov = mov
globalThis.resetmv = resetmv
globalThis.details = details
globalThis.contextToolChange = contextToolChange
globalThis.cbCopy = cbCopy
globalThis.staCopy = staCopy
globalThis.trans = trans
globalThis.brws = brws
globalThis.detEx = detEx
globalThis.detExCore = detExCore
globalThis.date = date
globalThis.crat = crat
globalThis.dirMenu = dirMenu
globalThis.dirselCk = dirselCk
globalThis.dirChange = dirChange
globalThis.directory = directory
globalThis.mediaToggle = mediaToggle
globalThis.remoteOnly = remoteOnly
globalThis.remoteOnlyCk = remoteOnlyCk
globalThis.ebtToggle = ebtToggle
globalThis.mediaCheck = mediaCheck
globalThis.ebtCheck = ebtCheck
globalThis.filterMenu = filterMenu
globalThis.filter = filter
globalThis.filterTime = filterTime
globalThis.makeNewFilter = makeNewFilter
globalThis.filterEdit = filterEdit
globalThis.filterDel = filterDel
globalThis.getFilter = getFilter
globalThis.getFilterType = getFilterType
globalThis.convertColumnToFilter = convertColumnToFilter
globalThis.getFilterTypeByAcct = getFilterTypeByAcct
globalThis.filterUpdate = filterUpdate
globalThis.filterUpdateInternal = filterUpdateInternal
globalThis.exclude = exclude
globalThis.excludeCk = excludeCk
globalThis.checkNotfFilter = checkNotfFilter
globalThis.resetNotfFilter = resetNotfFilter
globalThis.notfFilter = notfFilter
globalThis.listMenu = listMenu
globalThis.list = list
globalThis.makeNewList = makeNewList
globalThis.listShow = listShow
globalThis.listUser = listUser
globalThis.hisList = hisList
globalThis.listAdd = listAdd
globalThis.listRemove = listRemove
globalThis.mixTl = mixTl
globalThis.mixre = mixre
globalThis.mixMore = mixMore
globalThis.notfParse = notfParse
globalThis.notf = notf
globalThis.notfColumn = notfColumn
globalThis.notfCommon = notfCommon
globalThis.notfMore = notfMore
globalThis.notfToggle = notfToggle
globalThis.allNotfRead = allNotfRead
globalThis.parse = parse
globalThis.customEmojiReplace = customEmojiReplace
globalThis.pollToggle = pollToggle
globalThis.pollCalc = pollCalc
globalThis.voteSelMastodon = voteSelMastodon
globalThis.voteMastodon = voteMastodon
globalThis.showResult = showResult
globalThis.voteMastodonrefresh = voteMastodonrefresh
globalThis.pollParse = pollParse
globalThis.say = say
globalThis.voiceToggle = voiceToggle
globalThis.voiceCheck = voiceCheck
globalThis.voicePlay = voicePlay
globalThis.voiceSettings = voiceSettings
globalThis.voiceSettingLoad = voiceSettingLoad
globalThis.searchMenu = searchMenu
globalThis.src = src
globalThis.tootsearch = tootsearch
globalThis.moreTs = moreTs
globalThis.trend = trend
globalThis.srcBox = srcBox
globalThis.doSrc = doSrc
globalThis.tagShow = tagShow
globalThis.tShowBox = tShowBox
globalThis.doTShowBox = doTShowBox
globalThis.tagRemove = tagRemove
globalThis.favTag = favTag
globalThis.tagShowHorizon = tagShowHorizon
globalThis.tagTL = tagTL
globalThis.autoToot = autoToot
globalThis.addTag = addTag
globalThis.tl = tl
globalThis.moreLoad = moreLoad
globalThis.tlDiff = tlDiff
globalThis.tlCloser = tlCloser
globalThis.cap = cap
globalThis.com = com
globalThis.icon = icon
globalThis.reconnector = reconnector
globalThis.columnReload = columnReload
globalThis.getMarker = getMarker
globalThis.showUnread = showUnread
globalThis.ueLoad = ueLoad
globalThis.asRead = asRead
globalThis.asReadEnd = asReadEnd
globalThis.announ = announ
globalThis.userParse = userParse
globalThis.popupNotification = popupNotification
globalThis.imgv = imgv
globalThis.imgCont = imgCont
globalThis.zoom = zoom
globalThis.rotate = rotate
globalThis.detFromImg = detFromImg
globalThis.dlImg = dlImg
globalThis.openFinder = openFinder
globalThis.stopVideo = stopVideo
globalThis.copyImgUrl = copyImgUrl
globalThis.copyImgBinary = copyImgBinary
globalThis.parseColumn = parseColumn
globalThis.checkStr = checkStr
globalThis.addColumn = addColumn
globalThis.removeColumn = removeColumn
globalThis.setToggle = setToggle
globalThis.setToggleTag = setToggleTag
globalThis.colorPicker = colorPicker
globalThis.colorAddMulti = colorAddMulti
globalThis.bookmark = bookmark
globalThis.favTl = favTl
globalThis.utl = utl
globalThis.leftFoldSet = leftFoldSet
globalThis.leftFoldRemove = leftFoldRemove
globalThis.resetWidth = resetWidth
globalThis.menu = menu
globalThis.help = help
globalThis.hide = hide
globalThis.mini = mini
globalThis.show = show
globalThis.initPostbox = initPostbox
globalThis.mdCheck = mdCheck
globalThis.scrollEvent = scrollEvent
globalThis.scrollCk = scrollCk
globalThis.goTop = goTop
globalThis.goColumn = goColumn
globalThis.settings = settings
globalThis.configLoad = configLoad
globalThis.customVol = customVol
globalThis.climute = climute
globalThis.cliMuteDel = cliMuteDel
globalThis.wordmuteSave = wordmuteSave
globalThis.wordempSave = wordempSave
globalThis.notfTest = notfTest
globalThis.oks = oks
globalThis.changeLang = changeLang
globalThis.exportSettings = exportSettings
globalThis.exportSettingsCore = exportSettingsCore
globalThis.importSettings = importSettings
globalThis.importSettingsCore = importSettingsCore
globalThis.saveFolder = saveFolder
globalThis.font = font
globalThis.fontList = fontList
globalThis.insertFont = insertFont
globalThis.copyColor = copyColor
globalThis.customComp = customComp
globalThis.deleteIt = deleteIt
globalThis.ctLoad = ctLoad
globalThis.ctLoadCore = ctLoadCore
globalThis.customSel = customSel
globalThis.custom = custom
globalThis.customConnect = customConnect
globalThis.customImp = customImp
globalThis.advanced = advanced
globalThis.clearCustomImport = clearCustomImport
globalThis.hardwareAcceleration = hardwareAcceleration
globalThis.useragent = useragent
globalThis.frameSet = frameSet
globalThis.customSound = customSound
globalThis.customSoundSave = customSoundSave
globalThis.pluginEdit = pluginEdit
globalThis.completePlugin = completePlugin
globalThis.testExecTrg = testExecTrg
globalThis.deletePlugin = deletePlugin
globalThis.checkUpd = checkUpd
globalThis.lastFmSet = lastFmSet
globalThis.sortLoad = sortLoad
globalThis.sort = sort
globalThis.sortMenu = sortMenu
globalThis.spotifyConnect = spotifyConnect
globalThis.spotifyAuth = spotifyAuth
globalThis.spotifyDisconnect = spotifyDisconnect
globalThis.checkSpotify = checkSpotify
globalThis.spotifyFlagSave = spotifyFlagSave
globalThis.aMusicFlagSave = aMusicFlagSave
globalThis.cMusicFlagSave = cMusicFlagSave
globalThis.nowplaying = nowplaying
globalThis.npCore = npCore
globalThis.spotifySave = spotifySave
globalThis.themes = themes
globalThis.todo = todo
globalThis.todc = todc
globalThis.bottomReverse = bottomReverse
globalThis.tips = tips
globalThis.renderMem = renderMem
globalThis.spotifyTips = spotifyTips
globalThis.tipsToggle = tipsToggle
globalThis.utlShow = utlShow
globalThis.utlAdd = utlAdd
globalThis.flw = flw
globalThis.fer = fer
globalThis.showFav = showFav
globalThis.showMut = showMut
globalThis.showBlo = showBlo
globalThis.showReq = showReq
globalThis.showDom = showDom
globalThis.showFrl = showFrl
globalThis.udAdd = udAdd
globalThis.profEdit = profEdit
globalThis.imgChange = imgChange
globalThis.udgEx = udgEx
globalThis.udg = udg
globalThis.historyShow = historyShow
globalThis.profShow = profShow
globalThis.profbrws = profbrws
globalThis.setMain = setMain
globalThis.hisclose = hisclose
globalThis.addColumnMenu = addColumnMenu
globalThis.addselCk = addselCk
globalThis.client = client
globalThis.migrate = migrate
globalThis.pwaImgSelect = pwaImgSelect
globalThis.closeSupport = closeSupport