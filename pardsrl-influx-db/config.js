'use strict'

const { Precision } = require('influx')

module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    name: process.env.DB_NAME || 'db',
    port: process.env.DB_PORT || '8086',
    username: process.env.DB_USERNAME || 'username',
    password: process.env.DB_PASSWORD || 'securepass'
  },
  influx: {
    timezone: process.env.TIMEZONE || 'America/Argentina/Buenos_Aires',
    time_format: process.env.TIME_FORMAT || 'x',
    limit: process.env.IDB_LIMIT || 10,
    resolution: process.env.IDB_HISTOGRAM_RESOLUTION || 2000,
    sampleRate: process.env.SAMPLE_RATE || 250,
    precision: Precision.Milliseconds
  }
}
