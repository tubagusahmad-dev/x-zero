const fs = require('fs')

const Participant = {
    write: (id = "") => {
        const path = __dirname.replace('lib/utils', '') + 'db/participant.json'

        if(!fs.existsSync(path)){
            fs.writeFileSync(path, "{}", 'utf-8')
        }

        var parts = JSON.parse(fs.readFileSync(path, 'utf-8'))

        parts[id] = id

        fs.writeFileSync(path, JSON.stringify(parts), 'utf-8')
    },

    get: () => {
        const path = __dirname.replace('lib/utils', '') + 'db/participant.json'

        if(!fs.existsSync(path)){
            fs.writeFileSync(path, "{}", 'utf-8')
        }

        return JSON.parse(fs.readFileSync(path, 'utf-8'))
    },

    delete: (id) => {
        const path = __dirname.replace('lib/utils', '') + 'db/participant.json'

        if(!fs.existsSync(path)){
            fs.writeFileSync(path, "{}", 'utf-8')
        }

        var parts = JSON.parse(fs.readFileSync(path, 'utf-8'))

        delete parts[id]

        fs.writeFileSync(path, JSON.stringify(parts), 'utf-8')
    }
}

module.exports = Participant