const ffmpegPath = '/usr/bin/ffmpeg'
const YoutubeMp3Downloader = require("youtube-mp3-downloader")

const YtMp3 = {
    downloadAndSend: async (wa, jid, message, url) => {

        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        const match = url.match(regExp)
        const videoId = match[7]
        
        await wa.sendMessage(jid, {text: "🕗 Download on progress... "}, {quoted: message})

        var YD = new YoutubeMp3Downloader({
            "ffmpegPath": ffmpegPath,        
            "outputPath": __dirname.replace('lib/utils', 'files/mp3'), 
            "youtubeVideoQuality": "highestaudio",
            "queueParallelism": 2,           
            "progressTimeout": 2000,            
            "allowWebm": false                 
        });
        
        YD.download(videoId);
        
        YD.on("finished", async (err, data) => {
            console.log(JSON.stringify(data))
            await wa.sendMessage(jid, {audio: {url: data.file}, mimetype: 'audio/mp4'}, {quoted: message})
        });
        
        YD.on("error", async (error) => {
            console.log(error);
            await wa.sendMessage(jid, {text: "✖ Download Failed "}, {quoted: message})
        });
    }
}

module.exports = YtMp3
