var yesno = [
	{
		text: 'Oui',
		value: 'yes'
	},
	{
		text: 'Non',
		value: 'no'
	}
]
var sound = [
	{
		text: 'Aucun',
		value: 'none'
	},
	{
		text: 'Par défaut',
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
var envConstruction = [
	{
		id: 'popup',
		storage: 'popup',
		checkbox: false,
		doubleText: false,
		setValue: 0,
		width: 50,
		text: {
			head: 'Notification pop-up',
			desc: 'Hide to set "0"',
			after: 'sec'
		}
	},
	{
		id: 'notf',
		storage: 'nativenotf',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: 'Native notification',
			desc: 'Cela ne fonctionne pas sur la version portable pour Windows.',
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
			head: 'Largeur des colonnes',
			desc: 'Scroll bar will be shown when your window size is more than ammounts of columns.'
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
			head: 'Marge entre les timelines',
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
			head: 'Largeur minimale du navigateur TweetDeck',
			desc: '',
			after: 'px above'
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
			head: 'Taille de la police de caractères',
			desc: '<span style="font-size:13px">13px(valeur absolue)</span>',
			after: 'px'
		}
	},
	{
		id: 'ha',
		storage: 'ha',
		checkbox: true,
		setValue: false,
		text: {
			head: 'Désactiver l\accélération matérielle',
			desc: 'Redémarrage Automatique',
			checkbox: [
				{
					text: 'Oui',
					value: 'true'
				},
				{
					text: 'Non',
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
			head: 'User agent',
			desc: 'Restart when changed'
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
			head: 'Moteur de recherche',
			desc: '{q} will be replaced to query.',
			after: ''
		}
	},{
		id: 'download',
		storage: 'dl-win',
		checkbox: true,
		setValue: 'no',
		text: {
			head: 'Versioning(o Windows downloader)',
			desc: 'ex: TheDesk-1.0.0-setup.exe',
			checkbox: yesno
		}
	}
]
var tlConstruction = [
	{
		id: 'time',
		storage: 'datetype',
		checkbox: true,
		setValue: 'absolute',
		text: {
			head: 'Format de l’heure',
			desc: 'Relative format:"1 minutes ago","3 days ago"<br>Absolute format:"23:25:21","2017/12/30 23:59:00"<br>Mixed format:toots posted today are relative-format, others are absolute-format.',
			checkbox: [
				{
					text: 'Relative',
					value: 'relative'
				},
				{
					text: 'Absolute',
					value: 'absolute'
				},
				{
					text: 'Both relative and absolute',
					value: 'double'
				},
				{
					text: 'Mixed',
					value: 'medium'
				}
			]
		}
	},
	{
		id: 'ul',
		storage: 'locale',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: 'Server\s unique locale',
			desc: 'This value is available on some Japanese servers',
			checkbox: yesno
		}
	},
	{
		id: 'nsfw',
		storage: 'nsfw',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: 'Hide NSFW pictures',
			desc: 'Strong blur effect',
			checkbox: yesno
		}
	},
	{
		id: 'cw',
		storage: 'cw',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: 'Hide CW contents',
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
			head: 'Reply counter style',
			desc: '',
			checkbox: [
				{
					text: 'Show 1+ if the replies are more than 1.',
					value: 'hidden'
				},
				{
					text: 'Show full count(1,2...)',
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
			head: 'Animated GIF images animation',
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
			head: 'Tag TL Search',
			desc: '',
			checkbox: [
				{
					text: 'Use federated network',
					value: 'all'
				},
				{
					text: 'Utiliser le réseau local',
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
			head: 'Afficher via',
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
			head: 'Hide action buttons without mouseover',
			desc: 'You may feel \mouseover\ is unconfortable:(',
			checkbox: [
				{
					text: 'Mouseover to show',
					value: 'yes'
				},
				{
					text: 'Cliquez pour afficher',
					value: 'click'
				},
				{
					text: 'Non',
					value: 'no'
				}
			]
		}
	},
	{
		id: 'notfm',
		storage: 'setasread',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: 'Show Notification marker, red colored bell and counter(if you show a notification column.)',
			desc: '',
			checkbox: yesno
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
				text: { after: 'lignes above ou' }
			},
			{
				id: 'letters',
				storage: 'letters',
				width: 50,
				setValue: 7000,
				text: { after: 'lettres above' }
			}
		],
		text: {
			head: 'Auto folding',
			desc: 'TheDesk ne réduit pas les toots de 5 caractères ou moins. Si réduit, les retours à la ligne ne sont pas affichés. TheDesk compte uniquement les retours à la ligne comme le nombre de lignes.'
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
			head: 'Hauteur des images',
			desc: 'Option:Set "full" to uncrop.',
			after: 'px'
		}
	},
	{
		id: 'ticker',
		storage: 'ticker_ok',
		checkbox: true,
		setValue: 'no',
		text: {
			head: 'Activer OpenSticker',
			desc: 'Show colorful stickers about tooters\ server. <a href="https://cdn.weep.me/mastodon/">About #InstanceTicker</a> Copyright 2018 weepjp, kyori19.',
			checkbox: yesno
		}
	},
	{
		id: 'anime',
		storage: 'animation',
		checkbox: true,
		setValue: 'yes',
		text: {
			head: 'Animation des timelines',
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
			head: 'Markers(mark as read) on HTL and notifications',
			desc: 'Mastodon 3.0~. Shared on WebUI and third-party supported clients.',
			checkbox: yesno
		}
	},
	{
		id: 'remote_img',
		storage: 'remote_img',
		checkbox: true,
		setValue: 'no',
		text: {
			head: 'Récupérer les images depuis le serveur distant',
			desc: 'All previews are got from your loginned cache server.',
			checkbox: yesno
		}
	},
	{
		id: 'bkm',
		storage: 'bookmark',
		checkbox: true,
		setValue: 'no',
		text: {
			head: 'Show a bookmarking toot button',
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
			head: 'Height of the scroll bar',
			desc: '',
			checkbox: [
				{
					text: 'Thick',
					value: 'thickScrollBar'
				},
				{
					text: 'Normal',
					value: 'normalScrollBar'
				},
				{
					text: 'Thin',
					value: 'thinScrollBar'
				}
			]
		}
	},
	{
		id: 'replySound',
		storage: 'replySound',
		checkbox: true,
		setValue: 'none',
		text: {
			head: 'Son (Réponse)',
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
			head: 'Son (Fav)',
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
			head: 'Son (Boost)',
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
			head: 'Son (Follow)',
			desc: '',
			checkbox: sound
		}
	}
]
var postConstruction = [
	{
		id: 'cw-text',
		storage: 'cw-text',
		checkbox: false,
		doubleText: false,
		width: 150,
		setValue: '',
		text: {
			head: 'Texte d\avertissement par défaut',
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
				text: { after: 'lignes above ou' }
			},
			{
				id: 'cw_letters',
				storage: 'cw_letters',
				width: 50,
				setValue: 7000,
				text: { after: 'lettres above' }
			}
		],
		text: {
			head: 'Alerte avant de poster un long toot.',
			desc: 'Afficher la boîte de dialogue si vous cachez un texte trop long.'
		}
	},
	{
		id: 'cws',
		storage: 'always-cw',
		checkbox: true,
		setValue: 'no',
		text: {
			head: 'Always CW set',
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
			head: 'Visibilité par défaut',
			desc: '',
			checkbox: [
				{
					text: 'Public',
					value: 'public'
				},
				{
					text: 'Non listé',
					value: 'unlisted'
				},
				{
					text: 'Privé',
					value: 'private'
				},
				{
					text: 'Direct',
					value: 'direct'
				},
				{
					text: 'Memory(memorized as each server)',
					value: 'memory'
				},
				{
					text: 'Default of your visibility(Set on preferences of Mastodon server)',
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
			head: 'Posting images preferences',
			desc: '',
			checkbox: [
				{
					text: 'Insert media URL',
					value: 'url'
				},
				{
					text: 'Insert nothig',
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
			head: 'Action of posting-box',
			desc: '',
			checkbox: [
				{
					text: 'Folding',
					value: 'yes'
				},
				{
					text: 'Open after posting',
					value: 'no'
				},
				{
					text: 'Absolutely open',
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
			head: 'Format des citations',
			desc: '',
			checkbox: [
				{
					text: 'URL uniquement',
					value: 'simple'
				},
				{
					text: 'URL and acct(mention to the user)',
					value: 'mention'
				},
				{
					text: 'URL, text and acct(mention to the user)',
					value: 'full'
				},
				{
					text: 'API (seulement certaines instances)',
					value: 'apiQuote',
					quote: true
				},
				{
					text: 'Disabled(Hide buttons on TLs)',
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
			head: 'Default accounts of actions',
			desc: 'Main account can be set on Account Manager.',
			checkbox: [
				{
					text: 'Account you used recently',
					value: 'remain'
				},
				{
					text: 'Compte principal',
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
			head: 'Secondary Toot Button',
			desc: '',
			checkbox: [
				{
					text: 'Hidden',
					value: 'nothing'
				},
				{
					text: 'Public',
					value: 'public'
				},
				{
					text: 'Non listé',
					value: 'unlisted'
				},
				{
					text: 'Privé',
					value: 'private'
				},
				{
					text: 'Direct',
					value: 'direct'
				},
				{
					text: 'Local Only',
					value: 'local',
					kirishima: true,
					kirishimaText: '非対応インスタンスでは「未収載」になります。'
				}
			]
		}
	},
	{
		id: 'zero',
		storage: 'emoji-zero-width',
		checkbox: true,
		setValue: 'normal',
		setValue: 'no',
		text: {
			head: 'Zero-width space when inserting emojis',
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
			head: 'Ajuster automatiquement la taille',
			desc: 'Max long-side px. Uploaded images are converted to JPEG(from JPEG) or PNG(from others). Set 0 and the images will not be resized. Notice: if you post an animated picture like GIF, it will be converted static one.',
			after: 'px'
		}
	}
]
