function round (n, precision = 2) {
  return Math.round((n + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision)
}

const TimeUnit = {
  MICROSECOND: 'μs',
  MILLISECOND: 'ms',
  SECOND: 's',
  MINUTE: 'min',
}

export function formatDuration (milliseconds, options = {}) {
  const { showUnit = false, precision = 2, asObject = false } = options

  if (!milliseconds) return asObject ? { amount: 0 } : !showUnit ? '0' : ''

  /**
   * @param {string} unit
   * @returns string
   */
  const getUnit = (unit) => (showUnit && ` ${unit}`) || ''

  /**
   * @param {number} amount
   * @param {string} unit
   */
  const formatOutput = (amount, unit) => !asObject ? `${amount}${getUnit(unit)}` : { amount, unit }

  // I am unsure about this part
  if (milliseconds < 1) return formatOutput(Math.round(milliseconds * 1000), TimeUnit.MICROSECOND)

  // Between 1 and 1000 ms, display milliseconds
  if (milliseconds < 1000) return formatOutput(Math.round(milliseconds), TimeUnit.MILLISECOND)

  const duration = round(milliseconds / 1000, precision)

  // Over 1000 milliseconds but under 60 seconds, display seconds
  if (duration < 60) return formatOutput(duration, TimeUnit.SECOND)

  // Otherwise display minutes
  return formatOutput(round(duration / 60, 2), TimeUnit.MINUTE)
}

export const mergeDates = function (values, dates) {
  return values.map((d, i) => ({ x: new Date(dates[i]).getTime(), y: d }))
}

const errDates = [
  '2022-10-20T22:15:00Z',
  '2022-10-21T00:00:00Z',
  '2022-10-21T00:45:00Z',
  '2022-10-21T02:15:00Z',
  '2022-10-21T06:00:00Z',
  '2022-10-21T09:00:00Z',
  '2022-10-21T10:45:00Z',
  '2022-10-21T11:30:00Z',
  '2022-10-21T13:00:00Z',
  '2022-10-21T16:45:00Z',
]

export const mergeResponseDates = function (values, dates) {
  return values.map((d, i) => {
    // Error state is hardcoded with the errDates array. If the date is included, it will be an error state.
    if (errDates.includes(dates[i])) {
      return {
        x: new Date(dates[i]).getTime(),
        y: d,
        color: '#BF0B23',
        marker: { lineColor: '#BF0B23', lineWidth: 2 },
      }
    }
    return { x: new Date(dates[i]).getTime(), y: d }
  })
}

export const getSeries = function (data, name = 'Some Series', dates) {
  return {
    lineWidth: 1,
    color: '#333',
    name,
    data: mergeDates(data, dates),
    step: 'center',
    tooltip: {
      valueDecimals: 2,
    },
    states: {
      hover: {
        lineWidth: 1,
      },
    },
    marker: {
      enabled: false,
    },
  }
}

export function getAlertsPlotLines (alerts) {
  return alerts.map((alert, index) => ({
    value: new Date(alert.created_at).getTime(),
    width: 0,
    label: {
      align: 'center',
      rotation: 0,
      x: -1,
      y: -14,
      useHTML: true,
      formatter () {
        return `
          <div class="flex justify-center rounded-sm  text-red-800 border border-red-700 min-w-[16px]
                      min-h-[16px]">
            <a href="/" target="_blank" class="text-red">
              ${alert.number}
            </a>
          </div>
        `
      },
    },
  }))
}
