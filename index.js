const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@adiwajshing/baileys")
const fs = require('fs')
const MessageHelper = require('./lib/helper/message-helper.js')
const cronJob = require('cron').CronJob
const Quran = require('./lib/utils/quran-reader.js')
const Participant = require('./lib/utils/participant-writer.js')

var conn = null

const connectWA = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/db/auth_info_baileys')

    conn = await makeWASocket({
        printQRInTerminal: true,
        auth: state
    })

    conn.ev.on('connection.update', async (update) => {

        const { connection, lastDisconnect } = update

        if(connection === 'close') {

            const shouldReconnect = lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
            
            if(shouldReconnect) {
                connectWA()
            }

        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })

    conn.ev.on('messages.upsert', m => {
        const message = m.messages
        if(message[0].message){
            new MessageHelper({
                wa: conn,
                message: message
            })    
        }else{
            if(message[0].messageStubType == 28){
                Participant.delete(message[0].key.remoteJid)
            }

            if(message[0].messageStubType == 32){
                Participant.delete(message[0].key.remoteJid)
            }
        }

        
    })

    conn.ev.on('chats.upsert', m => {
        
        
    })

    conn.ev.on('creds.update', saveCreds)
}

connectWA()

const runCronJob = () => {
    new cronJob('0 5,18 * * * *', () => {
        Object.keys(Participant.get()).map((key) => {
            Quran.getAndSend(conn, key, null, 0, 0, true)
        })
    }).start()
}

runCronJob()
