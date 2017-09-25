'use strict'

const defaults = require('defaults')
const moment = require('moment-timezone')

const config = require('../config')

function processQueryOptions (query) {
  return defaults(query, {
    value: '*',
    limit: config.influx.limit,
    fill: null
  })
}

function processIQueryOptionsDefaults (options) {
  return defaults(options, {
    database: config.db.name,
    precision: config.influx.precision
  })
}

function metricsFromQueryOptions (query) {
  let from = 'FROM '

  if (query.metrics.length > 1) {
    return from.concat(query.metrics.join(','))
  }

  return from.concat(query.metrics[0])
}

function whereFromQueryOptions (query) {
  let where = `WHERE true`

  if (query.host) {
    where = where.concat(` AND "host" = '${query.host}'`)
  }

  if (query.from) {
    where = where.concat(` AND time >= '${query.from}'`)

    if (query.to) {
      where = where.concat(` AND time <= '${query.to}'`)
    } else {
      where = where.concat(` AND time <= '${moment().tz(config.influx.timezone).format('x')}'`)
    }
    
  }

  return where
}

module.exports = {
  processQueryOptions,
  processIQueryOptionsDefaults,
  metricsFromQueryOptions,
  whereFromQueryOptions
}
