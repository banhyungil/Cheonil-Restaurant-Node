import { writeFileSync } from 'fs'
import mysqldump from 'mysqldump'
// or const mysqldump = require('mysqldump')

// dump the result straight to a file
async function init() {
    const result = await mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            port: 3307,
            password: 'nice2122!',
            database: 'cheonil',
        },
        dump: {
            data: {
                verbose: false,
            },
        },
    })

    const data = result.dump.data
    if (data) writeFileSync('./scripts/dump.sql', data, { encoding: 'utf-8' })
}

init()
