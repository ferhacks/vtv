const { default: WASocket, Browsers ,DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, delay, jidNormalizedUser, makeWALegacySocket, useSingleFileLegacyAuthState, DEFAULT_CONNECTION_CONFIG, DEFAULT_LEGACY_CONNECTION_CONFIG } = require("@whiskeysockets/baileys")
let interval = null
groups = null
canexecute = true
global.prefa = /^[#$+.?_&<>!/\\]/
const simple = require("./libs/simple")
const functions = require("./libs/Function")
const { sleep, fetchUrl, checkPrefix} = functions
const { serialize, WAConnection } = simple
const { Boom } = require("@hapi/boom")
var cookie = 'uniqid=090000003d73b63c1dc631af1aabd9fa32b43df59e8620ad76b4866e0a0d73b2ccab42b436ccdd5ff4505b606862a1ae994bb09d230d79607e55; tid=090000003d73b63c1dc631af1aabd9fa32b43df59e8620ad76b4866e0a0d73b2ccab42b436ccdd5ff4505b606862a1ae994bb09d230d79607e55; nick_name=Aicy; data5=http%3A%2F%2Fesx.bigo.sg%2Fna_live%2F3a3%2F2YCBRv.jpg; user_name=632448478; yyuid=859059703; head_icon_url=http%3A%2F%2Fesx.bigo.sg%2Fna_live%2F3a3%2F2YCBRv.jpg; www_random_gray=37';
async function getStudioInfo(siteId) {
    const url = 'https://ta.bigo.tv/official_website/studio/getInternalStudioInfo';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookie,
            'origin': 'https://bigo.tv',
            'referer': 'https://bigo.tv/',
            "host": "ta.bigo.tv",
            "origin": "https://www.bigo.tv",
            "referer":"https://www.bigo.tv/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Edg/104.0.1293.63"
        },
        body: `siteId=${siteId}&verify=`
    };
    const json = await fetchUrl(url, options);
    return json;
}
async function connect () {
    if (interval) clearInterval(interval)
    function setConfg (){
        global.online = require(process.cwd() + "/config.json").online
        global.groups = require(process.cwd() + "/config.json").groups
    }
    function setStatus (sts){
        global.online = sts
        require("fs").writeFileSync("./config.json", JSON.stringify({online: sts, groups: groups}, null, 2))
    }
    async function restart (){
        canexecute = false
        console.log("Se creo el archivo de configuracion y mensaje, Puede editarlos y reiniciar el bot, El bot se reiniciara en 5 segundos")
        await sleep(5000)

        process.exit(1)
    }
const { state, saveCreds } = await useMultiFileAuthState("botdata")
let { version, isLatest } = await fetchLatestBaileysVersion()
const fs = require("fs")
fs.existsSync("config.json") ? setConfg() : fs.writeFileSync("config.json", JSON.stringify({"groups" : [], "online" : true}))
fs.existsSync("message.txt") ? null : fs.writeFileSync("message.txt", "Gianni Esta en directo! https://www.bigo.tv/giannimnz")
groups ? console.log("Config Loaded") : restart()
messagedf = fs.readFileSync("message.txt", "utf-8")
const chalk = require("chalk")
const pino = require("pino")
    let connOptions = {
        printQRInTerminal: true,
        logger: pino({ level: "silent" }),
        browser: Browsers.macOS('Desktop'),
        auth: state,
        printQRInTerminal: true,
        downloadHistory: false,
        version
    }
    if (!canexecute) return
    const killua = new WAConnection(WASocket(connOptions))
    killua.reply = (jid, text, quoted, options) => {
        killua.sendMessage(jid, { text: text}, { quoted: quoted, ...options })
    }
    killua.ev.on("creds.update", saveCreds)

    



    killua.ev.on("messages.upsert", async (chatUpdate) => {
        m = serialize(killua, chatUpdate.messages[0])

        if (!m.message) return
        if (m.key && m.key.remoteJid == "status@broadcast") return
        if (m.key.id.startsWith("BAE5") && m.key.id.length == 16) return
        
        try {
            let { type, isGroup, sender, from } = m
            let body = (type == "buttonsResponseMessage") ? m.message[type].selectedButtonId : (type == "listResponseMessage") ? m.message[type].singleSelectReply.selectedRowId : (type == "templateButtonReplyMessage") ? m.message[type].selectedId : m.text 
            let metadata = isGroup ? await killua.groupMetadata(from) : {}
            let pushname = isGroup ? metadata.subject : m.pushName
            let participants = isGroup ? metadata.participants : [sender]
            let groupAdmin = isGroup ? participants.filter(v => v.admin !== null).map(v => v.id) : []
            let isBotAdmin = isGroup ? groupAdmin.includes(killua.user?.jid) : false
            let isAdmin = isGroup ? groupAdmin.includes(sender) : false
    
            var prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#%^&.©^]/gi)[0] : checkPrefix(prefa, body).prefix ?? "#"
    
            let isCmd = body.startsWith(prefix)
            let quoted = m.quoted ? m.quoted : m
            let mime = (quoted.msg || m.msg).mimetype
            let isMedia = /image|video|sticker|audio/.test(mime)
            let budy = (typeof m.text == "string" ? m.text : "")
            let args = body.trim().split(/ +/).slice(1)
            let ar = args.map((v) => v.toLowerCase())
            let text = q = args.join(" ")
            let cmdName = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()

            switch (cmdName) {
                case "tag":
                case "tagall":
                case "noti":
                if (!isGroup) return killua.reply(from, "Este comando solo se puede usar en grupos!", m)
                if (!isAdmin) return killua.reply(from, "Necesitas ser administrador para usar este comando!", m)
                if (quoted) {
                    killua.sendMessage(from, { text : quoted.text  , mentions: participants.map(a => a.id)}, { quoted: m })
                }
                killua.sendMessage(from, { text : q ? q : '' , mentions: participants.map(a => a.id)}, { quoted: m })
                break
                case "setgrp":
                    /* Establece los grupos al los cuales enviar mensajes */
                    if (!isGroup) return killua.reply(from, "Este comando solo se puede usar en grupos!", m)
                    if (!isAdmin) return killua.reply(from, "Necesitas ser administrador para usar este comando!", m)
                if (groups.includes(from)) return killua.reply(from, "Este grupo ya esta en la lista!", m)
                groups.push(from)
                require("fs").writeFileSync("./config.json", JSON.stringify({online: online, groups: groups}, null, 2))
                killua.reply(from, "Grupo agregado a la lista de grupos a notificar!", m)
                break
                case "delgrp":
                    /* Elimina los grupos al los cuales enviar mensajes */
                    if (!isGroup) return killua.reply(from, "Este comando solo se puede usar en grupos!", m)
                    if (!isAdmin) return killua.reply(from, "Necesitas ser administrador para usar este comando!", m)
                if (!groups.includes(from)) return killua.reply(from, "Este grupo no esta en la lista!", m)
                groups.splice(groups.indexOf(from), 1)
                require("fs").writeFileSync("./config.json", JSON.stringify({online: online, groups: groups}, null, 2))
            }

            
        } catch (e) {
            console.log(e)
        }
    })

    killua.ev.on("connection.update", async(update) => {
        
        const { lastDisconnect, connection } = update
        if (connection) {
            console.info(`Estado de conexion : ${connection}`)
        }

        if (connection == "open") {
            interval = setInterval(async() => {
                const siteId = "giannimnz";
                const json = await getStudioInfo(siteId);
                console.log("Online? " + json.data.alive);
                if (json.data.alive != 1 && online == true) return setStatus(false)
                if (json.data.alive == 1 && online == false) {
                    if (groups.length == 0) return setStatus(true)
                    groups.forEach(async (group) => {
                        let metadata =  await killua.groupMetadata(group)
                        let participants = metadata.participants
                        killua.sendMessage(group, { text : messagedf ? messagedf : '' , mentions: participants.map(a => a.id)})
        
                    })
                    return setStatus(true)
                }
        
            }, 20000)
        }

        if (connection == "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`La carpeta de datos esta corrupta. Por favor elimine la carpera "botdata"`); killua.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Conexion Cerrada... Reconectando..."); connect(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Conexion perdida desde el servidor, Reconectando..."); connect(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); killua.logout(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`La sesion ha sido cerrada, Por favor Reescanee E Intente nuevamente`); process.exit(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Reinicio Requerido, Reiniciando"); connect(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); connect(); }
            else killua.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }

    })
}
connect()
