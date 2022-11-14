import { results } from '../fixtures/moreData'
import moment from 'moment'
import { groupBy } from 'lodash'

const calcAverage = (avg, { responseTime }, _, { length }) => avg + responseTime / length
// roundDate(date, moment.duration(15, "minutes"), "ceil");
function roundDate (date, duration, method = 'ceil') {
  return moment(Math[method]((+date) / (+duration)) * (+duration)).unix() * 1000
}

function getGranularity (min, max) {
  const diff = max - min
  // range is less than 6 hours
  if (diff < 1000 * 60 * 60 * 6) {
    return moment.duration(15, 'minutes')
    // range is less than 12 hours
  } else if (diff < 1000 * 60 * 60 * 12) {
    return moment.duration(30, 'minutes')
    // range is less than 24 hours
  } if (diff < 1000 * 60 * 60 * 24) {
    return moment.duration(1, 'hour')
  } else {
    return moment.duration(3, 'hour')
  }
}

function getMinMax (results, min, max) {
  if (min & max) return { min, max }

  const defaultMax = results[0].created_at
  const defaultMin = results[results.length - 1].created_at

  return { min: new Date(defaultMin).getTime(), max: new Date(defaultMax).getTime() }
}
/**
 * Load new data depending on the selected min and max
 */
export function afterSetExtremes (e) {
  console.log(e)
  const { target: { chart }, min: chartMin, max: chartMax, trigger } = e
  console.log('FOO', trigger, trigger !== 'zoom' && trigger !== 'setup')

  if (!['zoom', 'setup'].includes(trigger)) return // prevent infinite loop on reset zoom
  chart.showLoading('Loading data...')

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { min, max } = getMinMax(results, chartMin, chartMax)

      try {
        const newData = results
          .filter(d => new Date(d.created_at) >= min && new Date(d.created_at) <= max)
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        // Group the data by the rounded date
        const granularity = getGranularity(min, max)
        const groupedData = groupBy(newData, d => roundDate(new Date(d.created_at), granularity))

        const lineSeries = []
        const columnSeriesSuccess = []
        const columnSeriesFail = []
        const columnSeriesDegraded = []
        const columnSeriesDummy = []

        Object.entries(groupedData).forEach(([timestamp, runResults]) => {
          // Calculate the average for each group
          const average = runResults.reduce(calcAverage, 0)
          const success = runResults.filter(({ hasFailures, isDegraded }) => !hasFailures && !isDegraded).length
          const fail = runResults.filter(({ hasFailures }) => hasFailures).length
          const degraded = runResults.filter(({ isDegraded }) => isDegraded).length

          columnSeriesSuccess.push({ x: Number(timestamp), y: success })
          columnSeriesFail.push({ x: Number(timestamp), y: fail })
          columnSeriesDegraded.push({ x: Number(timestamp), y: degraded })
          columnSeriesDummy.push({ x: Number(timestamp), y: 1 })

          lineSeries.push({ x: Number(timestamp), y: Math.round(average, 0) })
        })

        chart.series[0].setData(lineSeries)
        chart.series[1].setData(columnSeriesSuccess)
        chart.series[2].setData(columnSeriesFail)
        chart.series[3].setData(columnSeriesDegraded)
        chart.series[4].setData(columnSeriesDummy)
        chart.hideLoading()
        resolve()
      } catch (error) {
        reject(error)
      }
    }, 1000)
  })
}
