var yesno = [
    {
        text: "Да",
        value: "yes"
    }, {
        text: "Не",
        value: "no"
    }
];
var sound = [
    {
        text: "Няма",
        value: "none"
    }, {
        text: "По подразбиране",
        value: "default"
    }, {
        text: "Custom 1",
        value: "c1"
    }, {
        text: "Custom 2",
        value: "c2"
    }, {
        text: "Custom 3",
        value: "c3"
    }, {
        text: "Custom 4",
        value: "c4"
    }
];
var envConstruction = [
    {
        id: "popup",
        storage: "popup",
        checkbox: false,
        doubleText: false,
        setValue: 0,
        width: 50,
        text: {
            head: "Известие с изскачащ прозорец (за Windows)",
            desc: "Скрито ако е зададено на „0“",
            after: "сек"
        }
    }, {
        id: "notf",
        storage: "nativenotf",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Вътрешно уведомяване",
            desc: "Това не работи в Windows Portable вер.",
            checkbox: yesno
        }
    }, {
        id: "width",
        storage: "width",
        checkbox: false,
        doubleText: false,
        width: 50,
        setValue: 300,
        text: {
            head: "Минимална ширина на колоните",
            desc: "Лентата за превъртане ще се покаже, когато размерът на прозореца е по-голям от размера на колони.",
            after: "px над"
        }
    }, {
        id: "fixwidth",
        storage: "fixwidth",
        checkbox: false,
        doubleText: false,
        setValue: 300,
        width: 50,
        text: {
            head: "Минимална ширина на браузъра TweetDeck",
            desc: "",
            after: "px над"
        }
    }, {
        id: "size",
        storage: "size",
        checkbox: false,
        doubleText: false,
        width: 50,
        setValue: 13,
        text: {
            head: "Размер на шрифта",
            desc: "<span style=\"font-size:13px\">13px(абсолютна стойност)</span>",
            after: "px"
        }
    }, {
        id: "ha",
        storage: "ha",
        checkbox: true,
        setValue: false,
        text: {
            head: "Деактивиране на хардуерното ускорение",
            desc: "Автоматичното рестартиране",
            checkbox: [
                {
                    text: "Да",
                    value: "true"
                }, {
                    text: "Не",
                    value: "false"
                }
            ]
        }
    }
];
var tlConstruction = [
    {
        id: "time",
        storage: "datetype",
        checkbox: true,
        setValue: "absolute",
        text: {
            head: "Времеви формат",
            desc: "Относителен формат: „преди 1 минута“, „преди 3 дни“<br>Абсолютен формат:\"23:25:21\",\"2017/12/30 23:59:00\"<br>Смесен формат: някои от раздумките са с относителен-формат, други са с абсолютен формат.",
            checkbox: [
                {
                    text: "Относителен",
                    value: "relative"
                }, {
                    text: "Абсолютен",
                    value: "absolute"
                }, {
                    text: "Относителен и абсолютен",
                    value: "double"
                }, {
                    text: "Смесено",
                    value: "medium"
                }

            ]
        }
    }, {
        id: "ul",
        storage: "locale",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Уникално място на Сървърите",
            desc: "Тази стойност е налична за някои Японски сървъри",
            checkbox: yesno
        }
    }, {
        id: "nsfw",
        storage: "nsfw",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Скриване на NSFW снимки",
            desc: "Силен ефект на размазване",
            checkbox: yesno
        }
    }, {
        id: "cw",
        storage: "cw",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Скриване на CW съдържание",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "rp",
        storage: "replyct",
        checkbox: true,
        setValue: "hidden",
        text: {
            head: "Стил на брояча на отговори",
            desc: "",
            checkbox: [
                {
                    text: "Показване на 1+, ако отговорите са повече от 1.",
                    value: "hidden"
                }, {
                    text: "Показване на 1+, ако отговорите са повече от 1.",
                    value: "all"
                }

            ]
        }
    }, {
        id: "gif",
        storage: "gif",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Анимация на анимирани GIF изображения",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "tag",
        storage: "tag-range",
        checkbox: true,
        setValue: "local",
        text: {
            head: "Tag в TL търсене",
            desc: "",
            checkbox: [
                {
                    text: "Използване в обединената мрежа",
                    value: "all"
                }, {
                    text: "Използване в локалната мрежа",
                    value: "local"
                }

            ]
        }
    }, {
        id: "via",
        storage: "viashow",
        checkbox: true,
        setValue: "no",
        text: {
            head: "С показване",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "mov",
        storage: "mouseover",
        checkbox: true,
        setValue: "no",
        text: {
            head: "Hide action buttons without mouseover",
            desc: "You may feel 'mouseover' is unconfortable:(",
            checkbox: [
                {
                    text: "Mouseover to show",
                    value: "yes"
                }, {
                    text: "Click to show",
                    value: "click"
                }, {
                    text: "Не",
                    value: "no"
                }

            ]
        }
    }, {
        id: "notfm",
        storage: "setasread",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Show Notification marker, red colored bell and counter(if you show a notification column.)",
            desc: "",
            checkbox: yesno
        }
    }, {
        checkbox: false,
        doubleText: true,
        data: [
            {
                id: "sentence",
                storage: "sentence",
                width: 50,
                setValue: 500,
                text: { after: "lines над or" }
            }, {
                id: "letters",
                storage: "letters",
                width: 50,
                setValue: 7000,
                text: { after: "букви над" }
            }
        ],
        text: {
            head: "Auto folding",
            desc: "TheDesk does not collapse totes of 5 characters or less. Also, when collapsing, newlines are not shown. TheDesk count only newlines as the number of lines.",
        }
    }, {
        id: "img-height",
        storage: "img-height",
        checkbox: false,
        doubleText: false,
        width: 80,
        setValue: 200,
        text: {
            head: "Height of images",
            desc: "Option:Set \"full\" to uncrop.",
            after: "px"
        }
    }, {
        id: "ticker",
        storage: "ticker_ok",
        checkbox: true,
        setValue: "no",
        text: {
            head: "Enable #InstanceTicker",
            desc: "Show colorful stickers about the server. <a href=\"https://cdn.weep.me/mastodon/\">About #InstanceTicker</a> Copyright 2018 weepjp, kyori19.",
            checkbox: yesno
        }
    }, {
        id: "anime",
        storage: "animation",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Анимация на времевата линия",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "replySound",
        storage: "replySound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Звук (Отговор)",
            desc: "",
            checkbox: sound
        }
    }, {
        id: "favSound",
        storage: "favSound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Звук(Фаворит)",
            desc: "",
            checkbox: sound
        }
    }, {
        id: "btSound",
        storage: "btSound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Звук(Подсилване)",
            desc: "",
            checkbox: sound
        }
    }, {
        id: "followSound",
        storage: "followSound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Звук(Харесване)",
            desc: "",
            checkbox: sound
        }
    }
];
var postConstruction = [
    {
        id: "cw-text",
        storage: "cw-text",
        checkbox: false,
        doubleText: false,
        width: 150,
        setValue: "",
        text: {
            head: "Текст за предупреждение по подразбиране",
            desc: "",
            after: ""
        }
    }, {
        checkbox: false,
        doubleText: true,
        data: [
            {
                id: "cw_sentence",
                storage: "cw_sentence",
                width: 50,
                setValue: 500,
                text: { after: "lines над or" }
            }, {
                id: "cw_letters",
                storage: "cw_letters",
                width: 50,
                setValue: 7000,
                text: { after: "букви над" }
            }
        ],
        text: {
            head: "Предупреждение преди публикуване на дълга раздумка.",
            desc: "Показване на диалогов прозорец, когато правите твърде дълъг скрит текст.",
        }
    }, {
        id: "cws",
        storage: "always-cw",
        checkbox: true,
        setValue: "no",
        text: {
            head: "Винаги да е зададено CW",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "vis",
        storage: "vis",
        checkbox: true,
        setValue: "public",
        text: {
            head: "Видимост по подразбиране",
            desc: "",
            checkbox: [
                {
                    text: "Публично",
                    value: "public"
                }, {
                    text: "Скрито",
                    value: "unlisted"
                }, {
                    text: "Частно",
                    value: "private"
                }, {
                    text: "Директно",
                    value: "direct"
                }, {
                    text: "Памет(запомнено на всеки сървър)",
                    value: "memory"
                }, {
                    text: "Видимост по подразбиране (Зададени от предпочитанията в Mastodon сървъра)",
                    value: "useapi"
                }
            ]
        }
    }, {
        id: "img",
        storage: "img",
        checkbox: true,
        setValue: "no-act",
        text: {
            head: "Предпочитания за публикуване на изображения",
            desc: "",
            checkbox: [
                {
                    text: "Вмъкване на URL адрес на медия",
                    value: "url"
                }, {
                    text: "Без вмъкване",
                    value: "no-act"
                }
            ]
        }
    }, {
        id: "box",
        storage: "box",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Действие на кутията за публикации",
            desc: "",
            checkbox: [
                {
                    text: "Прибрана",
                    value: "yes"
                }, {
                    text: "Отворена и след публикуване",
                    value: "no"
                }, {
                    text: "Постоянно отворена",
                    value: "absolute"
                }
            ]
        }
    }, {
        id: "quote",
        storage: "quote",
        checkbox: true,
        setValue: "nothing",
        text: {
            head: "Quote format",
            desc: "",
            checkbox: [
                {
                    text: "Only URL",
                    value: "simple"
                }, {
                    text: "URL and acct(mention to the user)",
                    value: "mention"
                }, {
                    text: "URL, text and acct(mention to the user)",
                    value: "full"
                }, {
                    text: "Disabled(Hide buttons on TLs)",
                    value: "nothing"
                }
            ]
        }
    }, {
        id: "main",
        storage: "mainuse",
        checkbox: true,
        setValue: "remain",
        text: {
            head: "Default accounts of actions",
            desc: "Main account can be set on Account Manager.",
            checkbox: [
                {
                    text: "Account you used recently",
                    value: "remain"
                }, {
                    text: "Main account",
                    value: "main"
                }
            ]
        }
    }, {
        id: "sec",
        storage: "sec",
        checkbox: true,
        setValue: "public",
        text: {
            head: "Secondary Toot Button",
            desc: "",
            checkbox: [
                {
                    text: "Hidden",
                    value: "nothing"
                }, {
                    text: "Публично",
                    value: "public"
                }, {
                    text: "Скрито",
                    value: "unlisted"
                }, {
                    text: "Частно",
                    value: "private"
                }, {
                    text: "Директно",
                    value: "direct"
                }, {
                    text: "Local Only",
                    value: "local",
                    kirishima: true,
                    kirishimaText: "非対応インスタンスでは「未収載」になります。"
                }
            ]
        }
    }, {
        id: "zero",
        storage: "emoji-zero-width",
        checkbox: true,
        setValue: "normal",
        setValue: "no",
        text: {
            head: "Zero-width space when inserting emojis",
            desc: "",
            checkbox: yesno
        }
    }
]