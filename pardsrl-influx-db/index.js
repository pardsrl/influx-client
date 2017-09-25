'use strict'

const defaults = require('defaults')

const setupInflux = require('./lib/influx')
const setupMetric = require('./lib/metric')

module.exports = function (config) {
  config = defaults(config, {})

  let influx = setupInflux(config)

  let Metric = setupMetric(influx)

  return {
    Metric
  }
}
