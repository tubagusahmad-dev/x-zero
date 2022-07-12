const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')

const StickerMaker = {
    makeAndSend: async (wa, jid, msg, path) => {
        const sticker = new Sticker(path, {
            pack: 'ayla-alkhaer.my.love', 
            author: 'Tubagus Love Ayla',
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 50,
            background: {
                "r": 255,
                "g": 255,
                "b": 255,
                "alpha": 1
            }
        })

        await wa.sendMessage(jid, await sticker.toMessage(), {quoted: msg})
    }
}

module.exports = StickerMaker