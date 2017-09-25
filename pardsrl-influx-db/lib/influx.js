'use strict'

const Influx = require('influx')

let influx

module.exports = function setupInflux (config) {
  const db = config.db

  if (!influx) {
    influx = new Influx.InfluxDB({
      host: db.host,
      database: db.name,
      port: db.port,
      username: db.username,
      password: db.password
    })

    return influx
  } else {
    return influx
  }
}
