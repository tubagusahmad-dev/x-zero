const fs = require('fs')

const parseListSurah = (quran) => {

    var result = ``
    quran.map((res, i) => {
        result = result + `${i+1}. *${res.transliteration} (${res.translation})* \n`
        result = result + `${res.type} | ${res.total_verses} Ayat \n\n`
    })

    return result
}

const parseListAyah = (surah) => {

    var result = ``
    surah.map((res, i) => {
        result = result + `*${res.text}* \n`
        result = result + `_"${res.translation}"_ \n\n`
    })

    return result
}

const Quran = {
    getAndSend: async (wa, jid, msg, surahId = -1, verseId = -1, random = false) => {

        const file = fs.readFileSync(__dirname.replace('lib/utils', 'db') + '/quran_id.json', 'utf-8')
        const quran = JSON.parse(file)

        if(surahId > -1 && surahId < 115){

            if (random){
                surahId = 1 + Math.floor(Math.random() * quran.length -1)
                verseId = 1 + Math.floor(Math.random() * quran[surahId].total_verses - 1)
            }

            const surahName = quran[surahId].transliteration
            const surahTrans = quran[surahId].translation
            const totalverses = quran[surahId].total_verses
            const verses = quran[surahId].verses
            const type = quran[surahId].type

            if(verseId > -1 && verseId <= totalverses){
                const ayahText = verses[verseId].text
                const ayahTrans = verses[verseId].translation

                var result = ``
                result = result + `Allah Subhanallahu Wa Ta'ala Berfirman: \n\n`
                result = result + ayahText + `\n`
                result = result + `_"${ayahTrans}"_ \n`
                result = result + `(QS. ${surahName} ${surahId + 1} : Ayat ${verseId + 1}) \n\n`
                
                if(random){
                    result = result + `_@broadcast_message_  \n`
                    result = result + `By: X-Zero`
                }

                await wa.sendMessage(jid, {text: result}, {quoted: msg})
            }else{
                var result = ``
                result = result + `*${surahName} (${surahTrans})* \n`
                result = result + `${type} | ${totalverses} Ayat \n`
                result = result + `Surah ke: ${surahId + 1} \n\n`
                result = result + parseListAyah(verses)

                await wa.sendMessage(jid, {text: result}, {quoted: msg})
            }
        }else{
            var result = ``
            result = result + `*Al-Qur'an Indonesia* \n`
            result = result + `Baca Qur'an Yuk... \n\n`
            result = result + parseListSurah(quran)

            await wa.sendMessage(jid, {text: result}, {quoted: msg})
            console.log(parseListSurah(quran))
        }
    
    }
}

module.exports = Quran

