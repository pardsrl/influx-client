'use strict'

const { processQueryOptions, processIQueryOptionsDefaults, metricsFromQueryOptions, whereFromQueryOptions } = require('../utils/db')

const debug = require('debug')('pardsrl-influx:db')
const chalk = require('chalk')

module.exports = function setupMetric (influx) {
  async function show(options={}){
    let queryStr = "SHOW measurements"

    debug(`${chalk.green('[Running query]')} ${queryStr}`)
    
    let result = await influx.query(
      queryStr,
      processIQueryOptionsDefaults(options)
    )

    debug(`${chalk.green('[Info]')} Query executed successfully!`)

    return result
  }

  async function findAll (query, options) {
    query = processQueryOptions(query)

    let from = metricsFromQueryOptions(query)

    let where = whereFromQueryOptions(query)

    let queryStr = `SELECT ${query.value} ${from} ${where} LIMIT ${query.limit}`

    debug(`${chalk.green('[Running query]')} ${queryStr}`)

    let result = await influx.query(
      queryStr,
      processIQueryOptionsDefaults(options)
    )

    debug(`${chalk.green('[Info]')} Query executed successfully!`)

    return result
  }

  async function countBy (query, options) {
    query = processQueryOptions(query)

    let from = metricsFromQueryOptions(query)

    let where = whereFromQueryOptions(query)

    let queryStr = `SELECT count(*) ${from} ${where} `

    debug(`${chalk.green('[Running query]')} ${queryStr}`)

    let result = await influx.query(
      queryStr,
      processIQueryOptionsDefaults(options)
    )

    debug(`${chalk.green('[Info]')} Query executed successfully!`)

    return result
  }

  async function meanBy (query, options) {
    query = processQueryOptions(query)

    let from = metricsFromQueryOptions(query)

    let where = whereFromQueryOptions(query)

    let queryStr = `SELECT mean("${query.value}") ${from} ${where} GROUP BY time(${query.group}) FILL(${query.fill})`

    debug(`${chalk.green('[Running query]')} ${queryStr}`)

    let result = await influx.query(
        queryStr,
        processIQueryOptionsDefaults(options)
      )

    debug(`${chalk.green('[Info]')} Query executed successfully!`)

    return result
  }

  return {
    show,
    findAll,
    countBy,
    meanBy
  }
}
