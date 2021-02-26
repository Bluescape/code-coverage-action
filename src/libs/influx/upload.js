const Influx = require('influxdb-nodejs')
const uuidv4 = require('uuid/v4')

module.exports = (tags, results, influxdb) => {
  const uuid = uuidv4()

  const client = new Influx(
    `https://${influxdb.auth.username}:${influxdb.auth.password}@${influxdb.host}/${influxdb.db}`
  )
  // Write the datapoints for each total to InfluxDB
  Object.keys(results.total).forEach((type) => {
    client
      .write(influxdb.series)
      .tag({ ...tags, uuid, type })
      .field(results.total[type])
      .then(() =>
        console.debug(
          `Data point successfully written to influxdb for '${type}'`
        )
      )
      .catch((e) => {
        console.error('Failed to write point to influxdb.')
        throw e // throw this error to get a more detailed stack trace
      })
      .catch((e) => {
        // catch the above thrown error so we don't get a unhandled rejected promise, also provides a more detailed stack trace
        console.error(e)
        process.exit(1) // exit, we don't care to handle the promises, we just want to know it failed and have no other steps to do.
      })
  })
}
