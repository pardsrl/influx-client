'use strict'

const debug = require('debug')('pardsrl-influx:api:routes')
const db = require('pardsrl-influx-db')
const config = require('pardsrl-influx-db/config')

const moment = require('moment-timezone')
const express = require('express')
const asyncify = require('express-asyncify')
const defaults = require('defaults')

const api = asyncify(express.Router())

let services, Metric

api.use('*', (req, res, next) => {
  if (!services) {
    debug('Connecting to influx...')
    try {
      debug('Loading Metric Service...')
      services = db(config)

      Metric = services.Metric
    } catch (e) {
      return next(e)
    }
  }
  next()
})

api.get('/metrics/show', async (req, res, next) => {
  debug(`Request has come to /metrics/show`)

  let results = {}

  try {
    results = await Metric.show()
  } catch (e) {
    return next(e)
  }

  res.send(results)
})

api.get('/metrics/count/:metric/:host', async (req, res, next) => {
  const metric = req.params.metric
  const host = req.params.host

  debug(`Request has come to /metrics/count/${metric}/${host}`)

  let results = {}
  let value = null

  const query = {
    metrics: [metric],
    host,
    value
  }

  try {
    results = await Metric.countBy(query)
  } catch (e) {
    return next(e)
  }

  res.send(results.shift())
})

api.get('/metrics/:metric/:host', async (req, res, next) => {
  const metric = req.params.metric
  const host = req.params.host
  const limit = req.query.rpp

  debug(`Request has come to /metrics/${metric}/${host}`)

  let results = {}

  const query = {
    metrics: [metric],
    host,
    value: 'value',
    limit
  }

  try {
    results = await Metric.findAll(query)
  } catch (e) {
    return next(e)
  }

  res.send(results.groupRows)
})

api.get('/histogram/:host', async (req, res, next) => {
  // URl params
  const host = req.params.host

  // Query Url Params
  let filters = req.query.filters
  const resolution = req.query.resolution || config.influx.resolution
  const sampleRate = req.query.sampleRate || config.influx.sampleRate

  debug(`Request has come to /histogram/${host}`)

  if (filters) {
    try {
      filters = JSON.parse(filters)
    } catch (err) {
      return next(new Error(err.message))
    }
  }

  let now = moment().tz(config.influx.timezone).utc()

  filters = defaults(filters, {
    from: now.clone().subtract(1, 'hour').valueOf(),
    to: now.valueOf()
  })

  let results = {}

  let range = (filters.to - filters.from) / resolution
  
  let roundRange = Math.round(range)

  //Si el tiempo de muestreo es menor a la tasa de muestreo, se toma la tasa de muestreo(sampleRate)
  //como minimo tiempo de agrupamiento
  let group = roundRange <= sampleRate ? sampleRate : roundRange 

  let from = moment(filters.from).tz(config.influx.timezone).utc().format()
  let to = moment(filters.to).tz(config.influx.timezone).utc().format()

  const query = {
    metrics: [filters.metrics],
    host,
    value: 'value',
    from,
    to,
    group: group.toString().concat('ms'),
    fill: -1
  }

  try {
    results = await Metric.meanBy(query)
  } catch (e) {
    return next(e)
  }

  res.send(results.groupRows)
})

module.exports = api
