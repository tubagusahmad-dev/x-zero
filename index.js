const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@adiwajshing/baileys");
const fs = require('fs')
const MessageHelper = require('./lib/helper/message-helper.js')

const connectWA = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/db/auth_info_baileys')

    const conn = await makeWASocket({
        printQRInTerminal: true,
        auth: state
    })

    conn.ev.on('connection.update', async (update) => {

        const { connection, lastDisconnect } = update

        if(connection === 'close') {

            const shouldReconnect = lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed')
            
            if(shouldReconnect) {
                connectWA()
            }

        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })

    conn.ev.on('messages.upsert', m => {
        const message = m.messages
        new MessageHelper({
            wa: conn,
            message: message
        })
        
    })

    conn.ev.on('chats.upsert', m => {
        
        
    })

    conn.ev.on('creds.update', saveCreds)

    
}

connectWA()