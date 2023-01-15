import { parse } from "dotenv"
import getData from "itunes-nowplaying-mac"
import { filter } from "lodash"
import { about } from "./common/about"
import { parseBlur } from "./common/blurhash"
import { getMulti, setMulti, initColumn, getColumn, setColumn } from "./common/storage"
import { verck, closeStart } from "./common/version"
import { defaultEmoji, customEmoji, defEmoji } from "./emoji/defaultEmoji"
import { ck, refresh, ckdb, multiSelector, ticker } from "./login/login"
import { loadAcctList, maxChars, multiDel, backToInit, instance, code, atSetup, mainAcct, colorAdd, asReadEnd, autoCompleteInitTrigger, support } from "./login/manager"
import { execCopy, playSound } from "./platform/end"
import { escapeHTML, nl2br, br2nl, formatTime, formatTimeUtc, makeCID, rgbToHex, setLog, escapeCsv, statusModel, initWebviewEvent, twemojiParse } from "./platform/first"
import { initPlugin, getMeta, execPlugin, testExec } from "./platform/plugin"
import { emojiToggle, emojiGet, emojiList, emojiInsert, brInsert } from "./post/emoji"
import { closeDrop, fileSelect, media, toBlob, deleteImage, altImage, stamp, alertProcessUnfinished, syncDetail } from "./post/img"
import { sec, expPostMode, clear, post } from "./post/post"
import { nsfw, vis, loadVis, cw, cwShow, schedule, draftToggle, addToDraft, useThisDraft, deleteThisDraft } from "./post/secure"
import { fav, rt, boostWith, bkm, follow, acctResolve, acctResolveLegacy, block, muteDo, muteMenu, muteTime, del, redraft, editToot, draftToPost, pin, request, domainBlock, addDomainblock, empUser, pinUser, tootUriCopy, staEx, toggleAction } from "./post/status"
import { tagInsert } from "./post/suggest"
import { re, reEx, qt } from "./post/useTxtBox"
import { announParse, announReaction, announReactionNew, emojiReactionDef } from "./tl/announParse"
import { mastodonBaseStreaming } from "./tl/baseStreaming"
import { additional, additionalIndv, cardHtml, cardHtmlShow, cardToggle, cardCheck, mov, resetmv } from "./tl/card"
import { details, cbCopy, staCopy, trans, brws, detEx, detExCore } from "./tl/datails"
import { date, crat } from "./tl/date"
import { dirMenu, dirselCk, dirChange, directory } from "./tl/directory"
import { mediaToggle, remoteOnly, remoteOnlyCk, ebtToggle, mediaCheck, ebtCheck, filterMenu, filterTime, makeNewFilter, filterEdit, filterDel, getFilter, getFilterType, convertColumnToFilter, getFilterTypeByAcct, filterUpdate, filterUpdateInternal, exclude, excludeCk, checkNotfFilter, resetNotfFilter, notfFilter } from "./tl/filter"
import { listMenu, list, makeNewList, listShow, listUser, hisList, listAdd, listRemove } from "./tl/list"
import { mixTl, mixre, mixMore } from "./tl/mix"
import { notfParse } from "./tl/notfParse"
import { notf, notfColumn, notfCommon, notfMore, notfToggle, allNotfRead } from "./tl/notification"
import { customEmojiReplace } from "./tl/parse"
import { pollToggle, pollCalc, voteSelMastodon, voteMastodon, showResult, voteMastodonrefresh } from "./tl/poll"
import { pollParse } from "./tl/pollParse"
import { say, voiceToggle, voiceCheck, voicePlay, voiceSettings, voiceSettingLoad } from "./tl/speech"
import { searchMenu, src, tootsearch, moreTs, trend, srcBox, doSrc } from "./tl/src"
import { tagShow, tShowBox, doTShowBox, tagRemove, favTag, tagShowHorizon, tagTL, autoToot, addTag } from "./tl/tag"
import { tl, moreLoad, tlDiff, tlCloser, cap, com, icon, reconnector, columnReload, getMarker, showUnread, ueLoad, asRead, announ } from "./tl/tl"
import { userParse, popupNotification } from "./tl/userParse"
import { imgv, imgCont, zoom, rotate, detFromImg, dlImg, openFinder, stopVideo, copyImgUrl, copyImgBinary } from "./ui/img"
import { parseColumn, checkStr, addColumn, removeColumn, setToggle, setToggleTag, colorPicker, bookmark, favTl, utl, leftFoldSet, leftFoldRemove, resetWidth } from "./ui/layout"
import { menu, help } from "./ui/menu"
import { hide, mini, show, initPostbox, mdCheck } from "./ui/postBox"
import { scrollEvent, scrollCk, goTop, goColumn } from "./ui/scroll"
import { settings, load, customVol, climute, cliMuteDel, wordmuteSave, wordempSave, notfTest, oks, changeLang, exportSettings, exportSettingsCore, importSettings, importSettingsCore, saveFolder, font, fontList, insertFont, copyColor, customComp, deleteIt, ctLoad, ctLoadCore, customSel, custom, customConnect, customImp, advanced, clearCustomImport, hardwareAcceleration, useragent, frameSet, customSound, customSoundSave, pluginEdit, completePlugin, testExecTrg, deletePlugin, checkUpd, lastFmSet } from "./ui/settings"
import { sortLoad, sort, sortMenu } from "./ui/sort"
import { spotifyConnect, spotifyAuth, spotifyDisconnect, checkSpotify, spotifyFlagSave, aMusicFlagSave, cMusicFlagSave, nowplaying, npCore, spotifySave } from "./ui/spotify"
import { themes } from "./ui/theme"
import { todo, todc, bottomReverse, tips, renderMem, spotifyTips, tipsToggle } from "./ui/tips"
import { utlShow, utlAdd, flw, fer, showFav, showMut, showBlo, showReq, showDom, showFrl, udAdd } from "./userdata/hisData"
import { profEdit, imgChange } from "./userdata/profEdit"
import { udgEx, udg, historyShow, profShow, profbrws, setMain, hisclose } from "./userdata/showOnTL"

global.about = about
global.parseBlur = parseBlur
global.getMulti = getMulti
global.setMulti = setMulti
global.initColumn = initColumn
global.getColumn = getColumn
global.setColumn = setColumn
global.verck = verck
global.closeStart = closeStart
global.defaultEmoji = defaultEmoji
global.customEmoji = customEmoji
global.defEmoji = defEmoji
global.ck = ck
global.refresh = refresh
global.ckdb = ckdb
global.multiSelector = multiSelector
global.ticker = ticker
global.loadAcctList = loadAcctList
global.maxChars = maxChars
global.getData = getData
global.multiDel = multiDel
global.support = support
global.backToInit = backToInit
global.instance = instance
global.code = code
global.atSetup = atSetup
global.mainAcct = mainAcct
global.colorAdd = colorAdd
global.asReadEnd = asReadEnd
global.autoCompleteInitTrigger = autoCompleteInitTrigger
global.execCopy = execCopy
global.playSound = playSound
global.escapeHTML = escapeHTML
global.nl2br = nl2br
global.br2nl = br2nl
global.formatTime = formatTime
global.formatTimeUtc = formatTimeUtc
global.makeCID = makeCID
global.rgbToHex = rgbToHex
global.setLog = setLog
global.escapeCsv = escapeCsv
global.statusModel = statusModel
global.initWebviewEvent = initWebviewEvent
global.twemojiPars = twemojiParse
global.initPlugin = initPlugin
global.getMeta = getMeta
global.execPlugin = execPlugin
global.testExec = testExec
global.emojiToggle = emojiToggle
global.emojiGet = emojiGet
global.emojiList = emojiList
global.emojiInsert = emojiInsert
global.brInsert = brInsert
global.closeDrop = closeDrop
global.fileSelect = fileSelect
global.media = media
global.toBlob = toBlob
global.deleteImage = deleteImage
global.altImage = altImage
global.stamp = stamp
global.alertProcessUnfinished = alertProcessUnfinished
global.syncDetail = syncDetail
global.sec = sec
global.post = post
global.expPostMode = expPostMode
global.clear = clear
global.nsfw = nsfw
global.vis = vis
global.loadVis = loadVis
global.cw = cw
global.cwShow = cwShow
global.schedule = schedule
global.draftToggle = draftToggle
global.addToDraft = addToDraft
global.useThisDraft = useThisDraft
global.deleteThisDraft = deleteThisDraft
global.fav = fav
global.rt = rt
global.boostWith = boostWith
global.bkm = bkm
global.follow = follow
global.acctResolve = acctResolve
global.acctResolveLegacy = acctResolveLegacy
global.block = block
global.muteDo = muteDo
global.muteMenu = muteMenu
global.muteTime = muteTime
global.del = del
global.redraft = redraft
global.editToot = editToot
global.draftToPost = draftToPost
global.pin = pin
global.request = request
global.domainBlock = domainBlock
global.addDomainblock = addDomainblock
global.empUser = empUser
global.pinUser = pinUser
global.tootUriCopy = tootUriCopy
global.staEx = staEx
global.toggleAction = toggleAction
global.tagInsert = tagInsert
global.re = re
global.reEx = reEx
global.qt = qt
global.announParse = announParse
global.announReaction = announReaction
global.announReactionNew = announReactionNew
global.emojiReactionDef = emojiReactionDef
global.mastodonBaseStreaming = mastodonBaseStreaming
global.additional = additional
global.additionalIndv = additionalIndv
global.cardHtml = cardHtml
global.cardHtmlShow = cardHtmlShow
global.cardToggle = cardToggle
global.cardCheck = cardCheck
global.mov = mov
global.resetmv = resetmv
global.details = details
global.cbCopy = cbCopy
global.staCopy = staCopy
global.trans = trans
global.brws = brws
global.detEx = detEx
global.detExCore = detExCore
global.date = date
global.crat = crat
global.dirMenu = dirMenu
global.dirselCk = dirselCk
global.dirChange = dirChange
global.directory = directory
global.mediaToggle = mediaToggle
global.remoteOnly = remoteOnly
global.remoteOnlyCk = remoteOnlyCk
global.ebtToggle = ebtToggle
global.mediaCheck = mediaCheck
global.ebtCheck = ebtCheck
global.filterMenu = filterMenu
global.filter = filter
global.filterTime = filterTime
global.makeNewFilter = makeNewFilter
global.filterEdit = filterEdit
global.filterDel = filterDel
global.getFilter = getFilter
global.getFilterType = getFilterType
global.convertColumnToFilter = convertColumnToFilter
global.getFilterTypeByAcct = getFilterTypeByAcct
global.filterUpdate = filterUpdate
global.filterUpdateInternal = filterUpdateInternal
global.exclude = exclude
global.excludeCk = excludeCk
global.checkNotfFilter = checkNotfFilter
global.resetNotfFilter = resetNotfFilter
global.notfFilter = notfFilter
global.listMenu = listMenu
global.list = list
global.makeNewList = makeNewList
global.listShow = listShow
global.listUser = listUser
global.hisList = hisList
global.listAdd = listAdd
global.listRemove = listRemove
global.mixTl = mixTl
global.mixre = mixre
global.mixMore = mixMore
global.notfParse = notfParse
global.notf = notf
global.notfColumn = notfColumn
global.notfCommon = notfCommon
global.notfMore = notfMore
global.notfToggle = notfToggle
global.allNotfRead = allNotfRead
global.parse = parse
global.customEmojiReplace = customEmojiReplace
global.pollToggle = pollToggle
global.pollCalc = pollCalc
global.voteSelMastodon = voteSelMastodon
global.voteMastodon = voteMastodon
global.showResult = showResult
global.voteMastodonrefresh = voteMastodonrefresh
global.pollParse = pollParse
global.say = say
global.voiceToggle = voiceToggle
global.voiceCheck = voiceCheck
global.voicePlay = voicePlay
global.voiceSettings = voiceSettings
global.voiceSettingLoad = voiceSettingLoad
global.searchMenu = searchMenu
global.src = src
global.tootsearch = tootsearch
global.moreTs = moreTs
global.trend = trend
global.srcBox = srcBox
global.doSrc = doSrc
global.tagShow = tagShow
global.tShowBox = tShowBox
global.doTShowBox = doTShowBox
global.tagRemove = tagRemove
global.favTag = favTag
global.tagShowHorizon = tagShowHorizon
global.tagTL = tagTL
global.autoToot = autoToot
global.addTag = addTag
global.tl = tl
global.moreLoad = moreLoad
global.tlDiff = tlDiff
global.tlCloser = tlCloser
global.cap = cap
global.com = com
global.icon = icon
global.reconnector = reconnector
global.columnReload = columnReload
global.getMarker = getMarker
global.showUnread = showUnread
global.ueLoad = ueLoad
global.asRead = asRead
global.asReadEnd = asReadEnd
global.announ = announ
global.userParse = userParse
global.popupNotification = popupNotification
global.imgv = imgv
global.imgCont = imgCont
global.zoom = zoom
global.rotate = rotate
global.detFromImg = detFromImg
global.dlImg = dlImg
global.openFinder = openFinder
global.stopVideo = stopVideo
global.copyImgUrl = copyImgUrl
global.copyImgBinary = copyImgBinary
global.parseColumn = parseColumn
global.checkStr = checkStr
global.addColumn = addColumn
global.removeColumn = removeColumn
global.setToggle = setToggle
global.setToggleTag = setToggleTag
global.colorPicker = colorPicker
global.colorAdd = colorAdd
global.bookmark = bookmark
global.favTl = favTl
global.utl = utl
global.leftFoldSet = leftFoldSet
global.leftFoldRemove = leftFoldRemove
global.resetWidth = resetWidth
global.menu = menu
global.help = help
global.hide = hide
global.mini = mini
global.show = show
global.initPostbox = initPostbox
global.mdCheck = mdCheck
global.scrollEvent = scrollEvent
global.scrollCk = scrollCk
global.goTop = goTop
global.goColumn = goColumn
global.settings = settings
global.load = load
global.customVol = customVol
global.climute = climute
global.cliMuteDel = cliMuteDel
global.wordmuteSave = wordmuteSave
global.wordempSave = wordempSave
global.notfTest = notfTest
global.oks = oks
global.changeLang = changeLang
global.exportSettings = exportSettings
global.exportSettingsCore = exportSettingsCore
global.importSettings = importSettings
global.importSettingsCore = importSettingsCore
global.saveFolder = saveFolder
global.font = font
global.fontList = fontList
global.insertFont = insertFont
global.copyColor = copyColor
global.customComp = customComp
global.deleteIt = deleteIt
global.ctLoad = ctLoad
global.ctLoadCore = ctLoadCore
global.customSel = customSel
global.custom = custom
global.customConnect = customConnect
global.customImp = customImp
global.advanced = advanced
global.clearCustomImport = clearCustomImport
global.hardwareAcceleration = hardwareAcceleration
global.useragent = useragent
global.frameSet = frameSet
global.customSound = customSound
global.customSoundSave = customSoundSave
global.pluginEdit = pluginEdit
global.completePlugin = completePlugin
global.testExecTrg = testExecTrg
global.deletePlugin = deletePlugin
global.checkUpd = checkUpd
global.lastFmSet = lastFmSet
global.sortLoad = sortLoad
global.sort = sort
global.sortMenu = sortMenu
global.spotifyConnect = spotifyConnect
global.spotifyAuth = spotifyAuth
global.spotifyDisconnect = spotifyDisconnect
global.checkSpotify = checkSpotify
global.spotifyFlagSave = spotifyFlagSave
global.aMusicFlagSave = aMusicFlagSave
global.cMusicFlagSave = cMusicFlagSave
global.nowplaying = nowplaying
global.npCore = npCore
global.spotifySave = spotifySave
global.themes = themes
global.todo = todo
global.todc = todc
global.bottomReverse = bottomReverse
global.tips = tips
global.renderMem = renderMem
global.spotifyTips  = spotifyTips 
global.tipsToggle = tipsToggle
global.utlShow = utlShow
global.utlAdd = utlAdd
global.flw = flw
global.fer = fer
global.showFav = showFav
global.showMut = showMut
global.showBlo = showBlo
global.showReq = showReq
global.showDom = showDom
global.showFrl = showFrl
global.udAdd = udAdd
global.profEdit = profEdit
global.imgChange = imgChange
global.udgEx = udgEx
global.udg = udg
global.historyShow = historyShow
global.profShow = profShow
global.profbrws = profbrws
global.setMain = setMain
global.hisclose = hisclose