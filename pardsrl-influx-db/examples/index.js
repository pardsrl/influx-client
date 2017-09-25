'use strict'

const db = require('../')
const config = require('../config')
const moment = require('moment-timezone')

async function run () {
  const { Metric } = db(config)

  // console.log(moment().tz(config.influx.timezone).format('h:m:s'))

  // let htaMetrics = await Metric.findBy({ metric: 'hta', host: 'dls301' }).catch(handleFatalError)

  // let count = await Metric.countBy({ metric: 'hta', host: 'dls075'}).catch(handleFatalError)

  var from = moment(1504381560000).tz(config.influx.timezone).utc().format()

  var to = moment(1506107303000).tz(config.influx.timezone).utc().format()

//   var from = moment("2017-08-28T03:00:00").tz(config.influx.timezone).utc().format()

//   var to = moment("2017-09-05T24:00:00").tz(config.influx.timezone).utc().format()

  // console.log(from)
  // console.log(to)

  let timeInterval = 1506107303000 - 1504381560000

  // console.log('-- time interval --', timeInterval)

  let query = {metrics: ['hta', 'anem', 'bpozo', 'llave'], value: 'value', host: 'dls301', from, to, group: null}

  // let count = await Metric.countBy(query).catch(handleFatalError)

  // console.log('-- metrics count --', count)

  // console.log(mpms)

  let res = 1200

  let mpms = timeInterval / res

  //let group = (res >= count) ? mpms : mpms * count / res

  let group = mpms

  query.group = parseInt(group).toString().concat('ms')

  // console.log(query)

  let meanResults = await Metric.meanBy(query)

  // console.log('--metrics--',htaMetrics)

  // htaMetrics.forEach(function(item) {
  //     console.log(item.time.getTime())
  // });

  // console.log('--means count--', meanResults.length)
  // console.log('--means--', meanResults)

  // meanResults.forEach(function (obj) {
  //   // console.log(moment(obj.time.getTime()).tz(config.influx.timezone).format())
  //   console.log(obj)
  // })
//   let time = moment(result[0].time.toNanoISOString())

//   console.log(result[0].time.toNanoISOString())
//     // console.log(time.format('DD MM YYYY h:m:s'))

//   time = time.tz(config.influx.timezone)
//   console.log(time.format(config.influx.time_format))

    // console.log(time)

  function handleFatalError (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(1)
  }

  process.on('unhandledRejection', handleFatalError)
  process.on('uncaughtException', handleFatalError)
}

run()
