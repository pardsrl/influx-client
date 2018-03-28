'use strict'

const chalk = require('chalk')
const debug = require('debug')('pardsrl-influx:api')
const http = require('http')
const express = require('express')
const api = require('./api')

const port = process.env.PORT || '8081'
const app = express()

const server = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded())
app.use('/api', api)

// Express Error Handler
app.use((err, req, res, next) => {
  debug(`App Error: ${err.stack}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

server.listen(port, () => {
  console.log(`${chalk.green('[pardsrl-influx-api]')} server listening on port ${port}`)
  debug(`${chalk.green('[info]')} server listening on port ${port}`)
})

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

module.exports = server
