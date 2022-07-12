const search = require('youtube-search')

const YtSearch = {
    searchAndSend: async (wa, jid, msg, query) => {
        const opts = {
            maxResults: 15,
            key: 'AIzaSyBZlCWMjr7nXlH4scIajtx2ePuYNbBp56w'
        }

        search(query, opts, async (err, results) => {

            var result = `*Youtube Search* \n\n`
                result = result + `Hasil pencarian dari _${query}_ \n\n\n`

            if(err){
                await wa.sendMessage(jid, {text: "Server Error, Coba Lagi Nanti"}, {quoted: msg})
            }

            results.map((res, i) => {
                result = result + `(${i + 1}). *${res.title}* \n`
                result = result + `${res.description} \n`
                result = result + `Link: ${res.link} \n\n`
            })

            await wa.sendMessage(jid, {text: result}, {quoted: msg})
        })
    }
}

module.exports = YtSearch