var yesno = [
    {
        text: "Sí",
        value: "yes"
    }, {
        text: "No",
        value: "no"
    }
];
var sound = [
    {
        text: "Ninguno",
        value: "none"
    }, {
        text: "Predeterminado",
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
            head: "Ventana emergente de notificaciones (en Windows)",
            desc: "Establecer \"0\" para ocultar",
            after: "seg."
        }
    }, {
        id: "notf",
        storage: "nativenotf",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Notificación nativa",
            desc: "Esto no funciona en la compilación portátil para Windows.",
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
            head: "Ancho mínimo de las columnas",
            desc: "La barra de desplazamiento se mostrará cuando el tamaño de la ventana sea mayor que el de las columnas.",
            after: "px por encima"
        }
    }, {
        id: "fixwidth",
        storage: "fixwidth",
        checkbox: false,
        doubleText: false,
        setValue: 300,
        width: 50,
        text: {
            head: "Ancho mínimo del explorador de TweetDeck",
            desc: "",
            after: "px por encima"
        }
    }, {
        id: "size",
        storage: "size",
        checkbox: false,
        doubleText: false,
        width: 50,
        setValue: 13,
        text: {
            head: "Tamaño de tipografía",
            desc: "<span style=\"font-size:13px\">13px(valor absoluto)</span>",
            after: "px"
        }
    }, {
        id: "ha",
        storage: "ha",
        checkbox: true,
        setValue: false,
        text: {
            head: "Deshabilitar la aceleración por hardware",
            desc: "Inicio automático",
            checkbox: [
                {
                    text: "Sí",
                    value: "true"
                }, {
                    text: "No",
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
            head: "Formato del tiempo",
            desc: "Formato relativo: \"hace 1 minuto\", \"hace 3 días\"<br>Formato absoluto: \"14:30:00\", \"2019/12/31 23:59:59\"<br>Formato mezclado: los toots de hoy son relativos y el resto, absoluto.",
            checkbox: [
                {
                    text: "Relativo",
                    value: "relative"
                }, {
                    text: "Absoluto",
                    value: "absolute"
                }, {
                    text: "Ambos",
                    value: "double"
                }, {
                    text: "Mezclados",
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
            head: "Localización única del servidor",
            desc: "Este valor está disponible en algunos servidores japoneses",
            checkbox: yesno
        }
    }, {
        id: "nsfw",
        storage: "nsfw",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Ocultar imágenes explícitas",
            desc: "Efecto difumado",
            checkbox: yesno
        }
    }, {
        id: "cw",
        storage: "cw",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Ocultar contenidos con advertencias",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "rp",
        storage: "replyct",
        checkbox: true,
        setValue: "hidden",
        text: {
            head: "Estilo de conteo de respuestas",
            desc: "",
            checkbox: [
                {
                    text: "Mostrar \"1+\" si hay más de 1 respuesta.",
                    value: "hidden"
                }, {
                    text: "Mostrat el conteo total (1, 2,…)",
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
            head: "Animación de GIF",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "tag",
        storage: "tag-range",
        checkbox: true,
        setValue: "local",
        text: {
            head: "Búsqueda de línea temporal",
            desc: "",
            checkbox: [
                {
                    text: "Usar red federada",
                    value: "all"
                }, {
                    text: "Usar red local",
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
            head: "Mostrar nombre del cliente de Mastodon",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "mov",
        storage: "mouseover",
        checkbox: true,
        setValue: "no",
        text: {
            head: "Ocultar los botones de acción sin pasada del ratón",
            desc: "Podrías sentir que la pasada del ratón es incómoda :(",
            checkbox: [
                {
                    text: "Pasar el ratón para mostrar",
                    value: "yes"
                }, {
                    text: "Hacé clic para mostrar",
                    value: "click"
                }, {
                    text: "No",
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
            head: "Mostrar marcador de notificaciones, campara roja y contador (en una columna de notificaciones).",
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
                text: { after: "líneas por encima o" }
            }, {
                id: "letters",
                storage: "letters",
                width: 50,
                setValue: 7000,
                text: { after: "letras por encima" }
            }
        ],
        text: {
            head: "Colapsar automáticamente",
            desc: "TheDesk no colapsa toots de 5 caracteres o menos. Al colapsar, no se muestran las nuevas líneas. TheDesk sólo cuenta las líneas por cantidad.",
        }
    }, {
        id: "img-height",
        storage: "img-height",
        checkbox: false,
        doubleText: false,
        width: 80,
        setValue: 200,
        text: {
            head: "Altura de imagen",
            desc: "Opcional: establecé \"toda\" para no cortarla.",
            after: "px"
        }
    }, {
        id: "ticker",
        storage: "ticker_ok",
        checkbox: true,
        setValue: "no",
        text: {
            head: "Habilitar #InstanceTicker",
            desc: "Mostrar stickers coloridos sobre el servidor. <a href=\"https://wee.jp/\">Acerca de #InstanceTicker</a>, derechos de autor 2018 weepjo, kyori19.",
            checkbox: yesno
        }
    }, {
        id: "anime",
        storage: "animation",
        checkbox: true,
        setValue: "yes",
        text: {
            head: "Animación de líneas temporales",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "markers",
        storage: "markers",
        checkbox: true,
        setValue: "no",
        text: {
            head: "Marcadores (marcar como leído) en línea temporal principal y notificaciones",
            desc: "Mastodon 3.0~. Compartido en interface web y clientes de terceros soportados.",
            checkbox: yesno
        }
    }, {
        id: "replySound",
        storage: "replySound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Sonido (respuesta)",
            desc: "",
            checkbox: sound
        }
    }, {
        id: "favSound",
        storage: "favSound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Sonido (marcado como favorito)",
            desc: "",
            checkbox: sound
        }
    }, {
        id: "btSound",
        storage: "btSound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Sonido (retoot)",
            desc: "",
            checkbox: sound
        }
    }, {
        id: "followSound",
        storage: "followSound",
        checkbox: true,
        setValue: "none",
        text: {
            head: "Sonido (nuevo seguidor)",
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
            head: "Texto de advertencia predeterminado",
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
                text: { after: "líneas por encima o" }
            }, {
                id: "cw_letters",
                storage: "cw_letters",
                width: 50,
                setValue: 7000,
                text: { after: "letras por encima" }
            }
        ],
        text: {
            head: "Alertar antes de enviar un toot largo.",
            desc: "Mostrar un diálogo si estás escribiendo un texto oculto demasiado largo.",
        }
    }, {
        id: "cws",
        storage: "always-cw",
        checkbox: true,
        setValue: "no",
        text: {
            head: "Siempre establecer advertencia de contenido",
            desc: "",
            checkbox: yesno
        }
    }, {
        id: "vis",
        storage: "vis",
        checkbox: true,
        setValue: "public",
        text: {
            head: "Visibilidad predeterminada",
            desc: "",
            checkbox: [
                {
                    text: "Pública",
                    value: "public"
                }, {
                    text: "No listada",
                    value: "unlisted"
                }, {
                    text: "Privada",
                    value: "private"
                }, {
                    text: "Mensaje directo",
                    value: "direct"
                }, {
                    text: "Memoria (en cada servidor)",
                    value: "memory"
                }, {
                    text: "Visibilidad predeterminada (se establece en la configuración del servidor de Mastodon)",
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
            head: "Configuración al enviar imágenes",
            desc: "",
            checkbox: [
                {
                    text: "Dirección web para adjuntar medios",
                    value: "url"
                }, {
                    text: "No adjuntar nada",
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
            head: "Comportamiento de la caja de entradas",
            desc: "",
            checkbox: [
                {
                    text: "Colapsar",
                    value: "yes"
                }, {
                    text: "Abrir luego de enviar la entrada",
                    value: "no"
                }, {
                    text: "Absolutamente abierta",
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
            head: "Formato de cita",
            desc: "",
            checkbox: [
                {
                    text: "Sólo dirección web",
                    value: "simple"
                }, {
                    text: "Dirección web y cuenta (mención al usuario)",
                    value: "mention"
                }, {
                    text: "Dirección web, texto y cuenta (mención al usuario)",
                    value: "full"
                }, {
                    text: "API (sólo algunas instancias)",
                    value: "apiQuote",
                    quote: true
                }, {
                    text: "Deshabilitado (ocultar botones en las líneas temporales)",
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
            head: "Acciones de cuenta predeterminada",
            desc: "Se puede establecer la cuenta predeterminada en el Administrador de cuentas.",
            checkbox: [
                {
                    text: "Cuenta usada recientemente",
                    value: "remain"
                }, {
                    text: "Cuenta principal",
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
            head: "Botón de toot secundario",
            desc: "",
            checkbox: [
                {
                    text: "Oculto",
                    value: "nothing"
                }, {
                    text: "Pública",
                    value: "public"
                }, {
                    text: "No listada",
                    value: "unlisted"
                }, {
                    text: "Privada",
                    value: "private"
                }, {
                    text: "Mensaje directo",
                    value: "direct"
                }, {
                    text: "Sólo local",
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
            head: "No agregar espacio al insertar emojis",
            desc: "",
            checkbox: yesno
        }
    }
]
