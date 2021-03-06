const { downloadMediaMessage } = require('@adiwajshing/baileys')
const { writeFile } = require('fs/promises')

const StickerMaker = require('../utils/sticker-maker.js')
const YtSearch = require('../utils/ytsearch.js')
const YtMp3 = require('../utils/ytdl-mp3.js')
const Quran = require('../utils/quran-reader.js')
const Participant = require('../utils/participant-writer.js')

class MessageHelper {

	constructor(props){
		
		this.wa = props.wa
		this.message = props.message[0]

		this.initialize()
	}


	async initialize(){

		const jid = this.message.key.remoteJid
		const textMessage = this.message.message.extendedTextMessage
		const imageMessage = this.message.message.imageMessage
		const videoMessage = this.message.message.videoMessage
		const msgConversation = this.message.message.conversation
		const mediaMessage = imageMessage || videoMessage

		if(textMessage){
			this.sendTextMessage(jid, this.message, textMessage.text)
			console.log(textMessage)
		}

		if(msgConversation){
			this.sendTextMessage(jid, this.message, msgConversation)
		}

		if(mediaMessage){
			if(mediaMessage.caption == '!sticker'){
				const path = `./files/image/${new Date().getTime()}.jpeg`
				const buffer = await downloadMediaMessage(
					this.message,
					'buffer',
					{ },
					{ 
						reuploadRequest: this.wa.updateMediaMessage
					}
				)
				await writeFile(path, buffer)

				StickerMaker.makeAndSend(this.wa, jid, this.message, path)
			}
		}

	}

	async sendTextMessage(jid, message, text = ""){

		const command = text.split(' ')

		if (command[0].toLocaleLowerCase().includes("assalam")){

			await this.wa.sendMessage(jid, {text: "Waalaikumsalam Warohmatullahi Wabarokatuh"}, { quoted: message })

		}else if (command[0] == "!subscribe"){

			Participant.write(jid)
			await this.wa.sendMessage(jid, {text: "Terimakasih, kami akan mengirim pesan yg mungkin menarik dan bermanfaat untuk anda ☺☺☺"}, { quoted: message })

		}else if (command[0] == "!unsubs"){

			Participant.delete(jid)
			await this.wa.sendMessage(jid, {text: "Yah... Maaf ya jika pesan-pesan kami mengganggu aktifitasmu, kami akan perbaiki selanjutnya 🙏🏻🙏🏻🙏🏻"}, { quoted: message })

		}else if (command[0] == "!start"){

			var msg = "*🤖 X-Zero 🤖* \n"
				msg = msg + "----------------------------------------------------------- \n\n\n"
				msg = msg + "*Menu:* \n\n"
				msg = msg + "- !ytmp3 <url> : Unduh audio dari Youtube\n\n"
				msg = msg + "- !ytsearch <query> : Pencarian Youtube\n\n"
				msg = msg + "- !sticker 	: Kirim dengan gambar atau video untuk membuat stiker\n\n"
				msg = msg + "- !quran : Menampilkan daftar surah Al-Qur'an\n\n"
				msg = msg + "- !quran [index_surah] : Menampilkan Seluruh Ayat Dalam 1 Surah\n\n"
				msg = msg + "- !quran [index_surah] [index_ayat]: Menampilkan 1 Ayat Dari Suatu Surah\n\n\n\n"
				msg = msg + "- !subscribe 	: Untuk menerima notifikasi konten\n\n"
				msg = msg + "- !unsubs 	: Berhenti menerima notifikasi konten\n\n"
				msg = msg + "Author : Tubagus Ahmad \n"
				msg = msg + "Tanggal : " + new Date()

			await this.wa.sendMessage(jid, {text: msg}, {quoted: message})

		}else if(command[0] == '!ytmp3'){

			const url = command[1]

			if(!url.startsWith('https://')){
				await this.wa.sendMessage(jid, {text: "Enter valid URL!!"}, {quoted: message})
				return
			}

			YtMp3.downloadAndSend(this.wa, jid, this.message, url)

		}else if(command[0] == '!quran'){
			
			const surahId = parseInt(command[1]) - 1
			const ayahId = parseInt(command[2]) - 1

			Quran.getAndSend(this.wa, jid, message, surahId, ayahId, false)

		}else if(command[0] == '!ytsearch'){

			const query = text.substring(command[0].length + 1, text.length)

			YtSearch.searchAndSend(this.wa, jid, message, query)

		}

	}
}

module.exports = MessageHelper