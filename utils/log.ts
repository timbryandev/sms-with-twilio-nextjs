import fs from 'fs'
import path from 'path'

function log(data: string, context = 'log'): void {
  const location = path.resolve(
    __dirname,
    '../../../../',
    `storage/logs/${context}.csv`,
  )

  fs.appendFile(location, data, (err: Error | null): void => {
    // If this log caused an error, throw the error
    if (err && context === 'log') throw err

    // If another log caused the error, try and log the error in our logs
    if (err) log(JSON.stringify(err))

    // else, all is good
  })
}

export default log
