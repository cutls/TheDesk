var yesno = [
    {
        text: "Ja",
        value: "yes"
    }, {
        text: "Nein",
        value: "no"
    }
];
var sound = [
    {
        text: "Ohne",
        value: "none"
    }, {
        text: "Standard",
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
            head: "Popup-Benachrichtigung(unter Windows)",
            desc: "Bei \"0\" Ausgeschaltet.",
            after: "Sek"
        }
    }, {
        id: "notf",
        storage: "nativenotf",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "System Benachrichtigungen",
            desc: "Dies funktioniert nicht mit der Portablen Windows Version.",
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
            head: "Minimale Breite der Spalten",
            desc: "Die Scroll-Leiste wird angezeigt, wenn Spalten breiter als das Fenster sind.",
            after: "px über"
        }
    }, {
        id: "fixwidth",
        storage: "fixwidth",
        checkbox: false,
        doubleText: false,
        setValue: 300,
        width: 50,
        text: {
            head: "Minimale Breite des TweetDeck-Browsers",
            desc: "",
            after: "px über"
        }
    }, {
        id: "size",
        storage: "size",
        checkbox: false,
        doubleText: false,
        width: 50,
        setValue: 13,
        text: {
            head: "Schriftgröße",
            desc: "<span style=\"font-size:13px\">13px(Absoluter Wert)</span>",
            after: "px"
        }
    }, {
        id: "ha",
        storage: "ha",
        checkbox: true,
        setValue: false,
        text: {
            head: "Hardwarebeschleunigung deaktivieren",
            desc: "Automatischer Neustart",
            checkbox: [
                {
                    text: "Ja",
                    value: "true"
                }, {
                    text: "Nein",
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
            head: "Zeitformat",
            desc: "Relatives Format:\"vor 1 Minuten\",\"vor 3 Tagen\"<br>Absolutes Format:\"23:25:21\",\"2017/12/30 23:59:00\"<br>Gemischtes Format:Die heute geposteten Zahn sind relativ formatiert, andere sind absolut formatiert.",
            checkbox: [
                {
                    text: "Relativ",
                    value: "relative"
                }, {
                    text: "Absolut",
                    value: "absolute"
                }, {
                    text: "Sowohl relativ als auch absolut",
                    value: "double"
                }, {
                    text: "Gemischt",
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
            head: "Server's unique locale",
            desc: "Dieser Wert ist auf einigen japanischen Servern verfügbar",
            checkbox: yesno
        }
    }, {
        id: "nsfw",
        storage: "nsfw",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "NSFW Bilder ausblenden",
            desc: "Starker Unschärfeeffekt",
            checkbox: yesno
        }
    }, {
        id: "cw",
        storage: "cw",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Hide CW contents",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "rp",
        storage: "replyct",
        checkbox: true,
        setValue: "hidden",
        text: {
            head: "Aussehen der Antwortzähler",
            desc: "",
            checkbox: [
                {
                    text: "1+ anzeigen, bei mehr als einer Antworten.",
                    value: "hidden"
                }, {
                    text: "1+ anzeigen, bei mehr als einer Antworten.",
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
            head: "Animierte GIF-Bilder abspielen",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "tag",
        storage: "tag-range",
        checkbox: true,
        setValue: "local",
        text: {
            head: "Suche im Tag-Verlauf",
            desc: "",
            checkbox: [
                {
                    text: "Auch in Verbundenen Netzwerken",
                    value: "all"
                }, {
                    text: "Nur im lokalen Netzwerk",
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
            head: "Show via",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "mov",
        storage: "mouseover",
        checkbox: true,
        setValue: "no",
        text: {
            head: "Aktionsbuttons ausblenden wenn der Mauszeiger weg ist.",
            desc: "Du wirst vielleicht das Gefühl haben, dass \"Mouseover\" unangenehm ist :-(",
            checkbox: [
                {
                    text: "Maus drüber zum Anzeigen",
                    value: "yes"
                }, {
                    text: "Klicken um anzuzeigen",
                    value: "click"
                }, {
                    text: "Nein",
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
            head: "Benachrichtigungs-Markierung, rote Klingel und Zähler anzeigen(wenn Sie eine Benachrichtigungsspalte haben.)",
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
                text: { after: "Zeilen über oder" }
            }, {
                id: "letters",
                storage: "letters",
                width: 50,
                setValue: 7000,
                text: { after: "Buchstaben über" }
            }
        ],
        text: {
            head: "Automatisches Zusammenfalten",
            desc: "TheDesk faltet nicht Tröts von 5 Zeichen oder weniger. Zusammengefaltet, werden keine Zeilen angezeigt. TheDesk zählen nur richtige Zeilen. (Zeilenumbrüche nicht.)",
        }
    }, {
        id: "img-height",
        storage: "img-height",
        checkbox: false,
        doubleText: false,
        width: 80,
        setValue: 200,
        text: {
            head: "Höhe der Bilder",
            desc: "Option:Setze \"full\" für Unbeschnitten.",
            after: "px"
        }
    }, {
        id: "ticker",
        storage: "ticker_ok",
        checkbox: true,
        setValue: "no",
        text: {
            head: "Aktiviere #InstanceTicker",
            desc: "Zeigt bunte Sticker über den Server. <a href=\"https://cdn.weep.me/mastodon/\">Über #InstanceTicker</a> Copyright 2018 weepjp, kyori19.",
            checkbox: yesno
        }
    }, {
        id: "anime",
        storage: "animation",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Animation der Verläufe",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "replySound",
        storage: "replySound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Ton bei Antwort",
            desc: "",
            checkbox: sound
        }
    }, {
        id: "favSound",
        storage: "favSound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Ton bei Favorit",
            desc: "",
            checkbox: sound
        }
    }, {
        id: "btSound",
        storage: "btSound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Ton bei Verstärkung",
            desc: "",
            checkbox: sound
        }
    }, {
        id: "followSound",
        storage: "followSound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Ton bei Folgen",
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
            head: "Standard Warnung",
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
                text: { after: "Zeilen über oder" }
            }, {
                id: "cw_letters",
                storage: "cw_letters",
                width: 50,
                setValue: 7000,
                text: { after: "Buchstaben über" }
            }
        ],
        text: {
            head: "Warnung vor dem Versenden eines langen Toots.",
            desc: "Dialog anzeigen, ob Sie den zu langen Text verstecken möchten.",
        }
    }, {
        id: "cws",
        storage: "always-cw",
        checkbox: true,
        setValue: "no",
        text: {
            head: "Always CW set",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "vis",
        storage: "vis",
        checkbox: true,
        setValue: "public",
        text: {
            head: "Standardsichtbarkeit",
            desc: "",
            checkbox: [
                {
                    text: "Öffentlich",
                    value: "public"
                }, {
                    text: "Nicht aufgeführt",
                    value: "unlisted"
                }, {
                    text: "Privat",
                    value: "private"
                }, {
                    text: "Direkt",
                    value: "direct"
                }, {
                    text: "Merken (bei jeden Server gespeichert)",
                    value: "memory"
                }, {
                    text: "Ihrer Standard-Sichtbarkeit (Einstellungen des Mastodon-Servers setzen)",
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
            head: "Bilder-Einstellungen fürs Senden",
            desc: "",
            checkbox: [
                {
                    text: "MedienURL einfügen",
                    value: "url"
                }, {
                    text: "Nichts einfügen",
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
            head: "Verhalten der Posting-Box",
            desc: "",
            checkbox: [
                {
                    text: "Zusammengeklappt",
                    value: "yes"
                }, {
                    text: "Nach dem Posting offen",
                    value: "no"
                }, {
                    text: "Alles geöffnet",
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
            head: "Zitierformat",
            desc: "",
            checkbox: [
                {
                    text: "Nur URL",
                    value: "simple"
                }, {
                    text: "URL und Name (Hinweis auf den Benutzer)",
                    value: "mention"
                }, {
                    text: "URL, Text und Name(Hinweis auf den Benutzer)",
                    value: "full"
                }, {
                    text: "Deaktiviert (Taste in Verlauf ausgeblendet)",
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
            head: "Standard-Konto für Aktionen",
            desc: "Das Hauptkonto kann in der Kontoverwaltung gestellt werden.",
            checkbox: [
                {
                    text: "Konto, das Sie kürzlich verwendet haben",
                    value: "remain"
                }, {
                    text: "Hauptkonto",
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
            head: "Zweite Tröt-Tasten",
            desc: "",
            checkbox: [
                {
                    text: "Versteckt",
                    value: "nothing"
                }, {
                    text: "Öffentlich",
                    value: "public"
                }, {
                    text: "Nicht aufgeführt",
                    value: "unlisted"
                }, {
                    text: "Privat",
                    value: "private"
                }, {
                    text: "Direkt",
                    value: "direct"
                }, {
                    text: "Nur lokal",
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
            head: "Emojis ohne Abstand Einfügen",
            desc: "",
            checkbox: yesno
        }
    }
]