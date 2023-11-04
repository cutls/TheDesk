export const yesno = [
	{
		text: '@@yes@@',
		value: 'yes'
	},
	{
		text: '@@no@@',
		value: 'no'
	}
]
export const sound = [
	{
		text: '@@none@@',
		value: 'none'
	},
	{
		text: '@@default@@',
		value: 'default'
	},
	{
		text: 'Custom 1',
		value: 'c1'
	},
	{
		text: 'Custom 2',
		value: 'c2'
	},
	{
		text: 'Custom 3',
		value: 'c3'
	},
	{
		text: 'Custom 4',
		value: 'c4'
	}
]
export const envConstruction = [
	{
		id: 'notf',
		storage: 'nativenotf',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: '@@nativenotf@@',
			desc: '@@nnwarn@@',
			checkbox: yesno
		}
	},
	{
		checkbox: false,
		doubleText: true,
		data: [
			{
				id: 'width',
				storage: 'width',
				width: 50,
				setValue: 300,
				text: { after: 'px ~ ' }
			},
			{
				id: 'maxWidth',
				storage: 'max-width',
				width: 50,
				setValue: 600,
				text: { after: 'px' }
			}
		],
		text: {
			head: '@@width@@',
			desc: '@@widthwarn@@'
		}
	},
	{
		id: 'margin',
		storage: 'margin',
		checkbox: false,
		doubleText: false,
		setValue: 0,
		width: 50,
		text: {
			head: '@@margin@@',
			desc: '',
			after: 'px'
		}
	},
	{
		id: 'fixwidth',
		storage: 'fixwidth',
		checkbox: false,
		doubleText: false,
		setValue: 300,
		width: 50,
		text: {
			head: '@@fixwidth@@',
			desc: '@@fixwidthwarn@@',
			after: 'px @@above@@'
		}
	},
	{
		id: 'size',
		storage: 'size',
		checkbox: false,
		doubleText: false,
		width: 50,
		setValue: 13,
		text: {
			head: '@@fontsize@@',
			desc: '<span style="font-size:13px">13px(@@absolute@@)</span>',
			after: 'px'
		}
	},
	{
		id: 'ha',
		storage: 'ha',
		checkbox: true,
		setValue: false,
		text: {
			head: '@@hardwareAcceleration@@',
			desc: '@@hardwareAccelerationWarn@@',
			checkbox: [
				{
					text: '@@yes@@',
					value: 'true'
				},
				{
					text: '@@no@@',
					value: 'false'
				}
			]
		}
	},
	{
		id: 'ua',
		storage: 'ua_setting',
		checkbox: false,
		doubleText: false,
		setValue: '',
		width: 200,
		text: {
			head: '@@useragent@@',
			desc: '@@useragentWarn@@'
		}
	},
	{
		id: 'webview',
		storage: 'webview_setting',
		checkbox: true,
		setValue: false,
		text: {
			head: '@@webview@@',
			desc: '@@webviewWarn@@',
			checkbox: [
				{
					text: '@@yes@@',
					value: 'true'
				},
				{
					text: '@@no@@',
					value: 'false'
				}
			]
		}
	},
	{
		id: 'srcUrl',
		storage: 'srcUrl',
		checkbox: false,
		doubleText: false,
		width: 200,
		setValue: 'https://google.com/search?q={q}',
		text: {
			head: '@@srcUrl@@',
			desc: '@@srcUrlWarn@@',
			after: ''
		}
	},{
		id: 'download',
		storage: 'dl-win',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@downloadWin@@',
			desc: 'ex: TheDesk-1.0.0-setup.exe',
			checkbox: yesno
		}
	}
]
export const tlConstruction = [
	{
		id: 'time',
		storage: 'datetype',
		checkbox: true,
		setValue: 'absolute',
		text: {
			head: '@@timemode@@',
			desc: '@@relativetime@@<br>@@absolutetime@@<br>@@mixtime@@',
			checkbox: [
				{
					text: '@@relativesel@@',
					value: 'relative'
				},
				{
					text: '@@absolutesel@@',
					value: 'absolute'
				},
				{
					text: '@@absolute12sel@@',
					value: 'absolute12'
				},
				{
					text: '@@doublesel@@',
					value: 'double'
				},
				{
					text: '@@mixsel@@',
					value: 'medium'
				}
			]
		}
	},
	{
		id: 'nsfw',
		storage: 'nsfw',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: '@@nswf@@',
			desc: '@@nsfwwarn@@',
			checkbox: yesno
		}
	},
	{
		id: 'cw',
		storage: 'cw',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: '@@cw@@',
			desc: '',
			checkbox: yesno
		}
	},
	{
		id: 'rp',
		storage: 'replyct',
		checkbox: true,
		setValue: 'hidden',
		text: {
			head: '@@replyct@@',
			desc: '',
			checkbox: [
				{
					text: '@@replyct_hidden@@',
					value: 'hidden'
				},
				{
					text: '@@replyct_full@@',
					value: 'all'
				}
			]
		}
	},
	{
		id: 'gif',
		storage: 'gif',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: '@@gif@@',
			desc: '',
			checkbox: yesno
		}
	},
	{
		id: 'tag',
		storage: 'tag-range',
		checkbox: true,
		setValue: 'local',
		text: {
			head: '@@tag@@',
			desc: '',
			checkbox: [
				{
					text: '@@tagfed@@',
					value: 'all'
				},
				{
					text: '@@taglocal@@',
					value: 'local'
				}
			]
		}
	},
	{
		id: 'via',
		storage: 'viashow',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@via@@',
			desc: '',
			checkbox: yesno
		}
	},
	{
		id: 'mov',
		storage: 'mouseover',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@mouseover@@',
			desc: '',
			checkbox: [
				{
					text: '@@mv@@',
					value: 'yes'
				},
				{
					text: '@@mvclick@@',
					value: 'click'
				},
				{
					text: '@@no@@',
					value: 'no'
				}
			]
		}
	},
	{
		checkbox: false,
		doubleText: true,
		data: [
			{
				id: 'sentence',
				storage: 'sentence',
				width: 50,
				setValue: 500,
				text: { after: '@@lines@@ @@above@@ @@or@@' }
			},
			{
				id: 'letters',
				storage: 'letters',
				width: 50,
				setValue: 7000,
				text: { after: '@@letters@@ @@above@@' }
			}
		],
		text: {
			head: '@@autofold@@',
			desc: '@@autofoldwarn@@'
		}
	},
	{
		id: 'img-height',
		storage: 'img-height',
		checkbox: false,
		doubleText: false,
		width: 80,
		setValue: 200,
		text: {
			head: '@@imgheight@@',
			desc: '@@imgheightwarn@@',
			after: 'px'
		}
	},
	{
		id: 'ticker',
		storage: 'ticker_ok',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@ticker@@',
			desc: '@@tickerwarn@@',
			checkbox: yesno
		}
	},
	{
		id: 'anime',
		storage: 'animation',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: '@@animation@@',
			desc: '',
			checkbox: yesno
		}
	},
	{
		id: 'markers',
		storage: 'markers',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@markers@@',
			desc: '@@markerswarn@@',
			checkbox: yesno
		}
	},
	{
		id: 'remote_img',
		storage: 'remote_img',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@remote_img@@',
			desc: '@@remote_imgWarn@@',
			checkbox: yesno
		}
	},
	{
		id: 'bkm',
		storage: 'bookmark',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@showBookmarkAction@@',
			desc: '',
			checkbox: yesno
		}
	},
	{
		id: 'scroll',
		storage: 'scroll',
		checkbox: true,
		setValue: 'normalScrollBar',
		text: {
			head: '@@scrollBar@@',
			desc: '',
			checkbox: [
				{
					text: '@@thick@@',
					value: 'thickScrollBar'
				},
				{
					text: '@@normal@@',
					value: 'normalScrollBar'
				},
				{
					text: '@@thin@@',
					value: 'thinScrollBar'
				}
			]
		}
	},
	{
		id: 'small-header',
		storage: 'smallHeader',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@smallHeader@@',
			desc: '',
			checkbox: yesno
		}
	},
	{
		id: 'replySound',
		storage: 'replySound',
		checkbox: true,
		setValue: 'none',
		text: {
			head: '@@replySound@@',
			desc: '',
			checkbox: sound
		}
	},
	{
		id: 'favSound',
		storage: 'favSound',
		checkbox: true,
		setValue: 'none',
		text: {
			head: '@@favSound@@',
			desc: '',
			checkbox: sound
		}
	},
	{
		id: 'btSound',
		storage: 'btSound',
		checkbox: true,
		setValue: 'none',
		text: {
			head: '@@btSound@@',
			desc: '',
			checkbox: sound
		}
	},
	{
		id: 'followSound',
		storage: 'followSound',
		checkbox: true,
		setValue: 'none',
		text: {
			head: '@@followSound@@',
			desc: '',
			checkbox: sound
		}
	}
]
export const postConstruction = [
	{
		id: 'cw-text',
		storage: 'cw-text',
		checkbox: false,
		doubleText: false,
		width: 150,
		setValue: '',
		text: {
			head: '@@defaultcw@@',
			desc: '',
			after: ''
		}
	},
	{
		checkbox: false,
		doubleText: true,
		data: [
			{
				id: 'cw_sentence',
				storage: 'cw_sentence',
				width: 50,
				setValue: 500,
				text: { after: '@@lines@@ @@above@@ @@or@@' }
			},
			{
				id: 'cw_letters',
				storage: 'cw_letters',
				width: 50,
				setValue: 7000,
				text: { after: '@@letters@@ @@above@@' }
			}
		],
		text: {
			head: '@@autocw@@',
			desc: '@@autocwwarn@@'
		}
	},
	{
		id: 'cws',
		storage: 'always-cw',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@cws@@',
			desc: '',
			checkbox: yesno
		}
	},
	{
		id: 'cw-continue',
		storage: 'cw-continue',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@cwContinue@@',
			desc: '',
			checkbox: yesno
		}
	},
	{
		id: 'vis',
		storage: 'vis',
		checkbox: true,
		setValue: 'public',
		text: {
			head: '@@defaultvis@@',
			desc: '',
			checkbox: [
				{
					text: '@@public@@',
					value: 'public'
				},
				{
					text: '@@unlisted@@',
					value: 'unlisted'
				},
				{
					text: '@@private@@',
					value: 'private'
				},
				{
					text: '@@direct@@',
					value: 'direct'
				},
				{
					text: '@@memory@@',
					value: 'memory'
				},
				{
					text: '@@useapi@@',
					value: 'useapi'
				}
			]
		}
	},
	{
		id: 'img',
		storage: 'img',
		checkbox: true,
		setValue: 'no-act',
		text: {
			head: '@@postimg@@',
			desc: '',
			checkbox: [
				{
					text: '@@showurl@@',
					value: 'url'
				},
				{
					text: '@@nourl@@',
					value: 'no-act'
				}
			]
		}
	},
	{
		id: 'box',
		storage: 'box',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: '@@box@@',
			desc: '',
			checkbox: [
				{
					text: '@@boxyes@@',
					value: 'yes'
				},
				{
					text: '@@boxno@@',
					value: 'no'
				},
				{
					text: '@@boxabs@@',
					value: 'absolute'
				}
			]
		}
	},
	{
		id: 'quote',
		storage: 'quote',
		checkbox: true,
		setValue: 'nothing',
		text: {
			head: '@@quote@@',
			desc: '',
			checkbox: [
				{
					text: '@@simple@@',
					value: 'simple'
				},
				{
					text: '@@mention@@',
					value: 'mention'
				},
				{
					text: '@@full@@',
					value: 'full'
				},
				{
					text: '@@apiQuote@@',
					value: 'apiQuote',
					quote: true
				},
				{
					text: '@@notqt@@',
					value: 'nothing'
				}
			]
		}
	},
	{
		id: 'main',
		storage: 'mainuse',
		checkbox: true,
		setValue: 'remain',
		text: {
			head: '@@main@@',
			desc: '@@mainwarn@@',
			checkbox: [
				{
					text: '@@lastacct@@',
					value: 'remain'
				},
				{
					text: '@@usemainacct@@',
					value: 'main'
				}
			]
		}
	},
	{
		id: 'sec',
		storage: 'sec',
		checkbox: true,
		setValue: 'public',
		text: {
			head: '@@secondary@@',
			desc: '',
			checkbox: [
				{
					text: '@@nothing@@',
					value: 'nothing'
				},
				{
					text: '@@public@@',
					value: 'public'
				},
				{
					text: '@@unlisted@@',
					value: 'unlisted'
				},
				{
					text: '@@private@@',
					value: 'private'
				},
				{
					text: '@@direct@@',
					value: 'direct'
				}
			]
		}
	},
	{
		id: 'zero',
		storage: 'emoji-zero-width',
		checkbox: true,
		setValue: 'no',
		text: {
			head: '@@zeroWidthEmoji@@',
			desc: '',
			checkbox: yesno
		}
	},{
		id: 'uploadCrop',
		storage: 'uploadCrop',
		checkbox: false,
		doubleText: false,
		width: 100,
		setValue: '0',
		text: {
			head: '@@uploadCrop@@',
			desc: '@@uploadCropWarn@@',
			after: 'px'
		}
	}
]
