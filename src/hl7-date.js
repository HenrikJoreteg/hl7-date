const timeZoneDelimiterRe = /[\+\-]/
const getSection = (str, start, end) => {
  const section = str.slice(start, end)
  return section ? Number(section) : 0
}

const toMilliseconds = str => Math.round(Number('0.' + str) * 1000)

// Specifies a point in time using a 24-hour clock notation.
// Format: YYYY[MM[DD[HH[MM[SS[.S[S[S[S]]]]]]]]][+/-ZZZZ].
export const parse = input => {
  debugger
  const [str, timeZoneOffset] = input.split(timeZoneDelimiterRe)
  const year = getSection(str, 0, 4)
  let month = getSection(str, 4, 6)
  if (month) {
    month = month - 1
  }
  const day = getSection(str, 6, 8) || 1
  let hour = getSection(str, 8, 10)
  let min = getSection(str, 10, 12)
  const seconds = getSection(str, 12, 14)
  const msString = str.split('.')[1]
  const milliseconds = msString ? toMilliseconds(msString) : ''

  let minuteAdjustments = 0
  if (timeZoneOffset) {
    const isNegative = input.includes('-')
    const multiplier = isNegative ? 1 : -1
    const offsetHours = getSection(timeZoneOffset, 0, 2)
    const offsetMinutes = getSection(timeZoneOffset, 2, 4)
    if (offsetHours) {
      minuteAdjustments += offsetHours * multiplier * 60
    }
    if (offsetMinutes) {
      minuteAdjustments += offsetMinutes * multiplier
    }
  }

  const args = [year, month, day, hour, min, seconds, milliseconds]

  let date = new Date(...args)

  if (timeZoneOffset) {
    // if we're given a timezone offset, use it
    date = new Date(Date.UTC(...args) + minuteAdjustments * 60000)
  }

  return date
}

const fnMap = {
  getMilliseconds: 'millisecond',
  getSeconds: 'second',
  getMinutes: 'minute',
  getHours: 'hour',
  getDate: 'date',
  getMonth: 'month',
}
const determinePrecision = date => {
  for (const fnName in fnMap) {
    const value = date[fnName]()
    let isMatch = !!value
    if (fnName === 'getDate') {
      isMatch = value !== 1
    }
    if (isMatch) {
      return fnMap[fnName]
    }
  }
  return 'year'
}

const getTimeZoneAddOn = offsetMinutes => {
  if (!offsetMinutes) {
    return '+0000'
  }
  const plusMinus = offsetMinutes > 0 ? '-' : '+'
  const hours = Math.floor(offsetMinutes / 60)
    .toString()
    .padStart(2, 0)
  return plusMinus + hours + (offsetMinutes % 60).toString().padStart(2, 0)
}

// year, date, month, hour, minute, second, millisecond
export const stringify = (date, precisionSpec) => {
  const precision = precisionSpec || determinePrecision(date)
  const includeTimeZoneOffset = !['year', 'month', 'date'].includes(precision)
  const timeZoneAddOn = includeTimeZoneOffset
    ? getTimeZoneAddOn(date.getTimezoneOffset())
    : ''
  const endIndex = {
    millisecond: 7,
    second: 6,
    minute: 5,
    hour: 4,
    date: 3,
    month: 2,
    year: 1,
  }[precision]
  return (
    [
      'getFullYear',
      'getMonth',
      'getDate',
      'getHours',
      'getMinutes',
      'getSeconds',
      'getMilliseconds',
    ]
      .slice(0, endIndex)
      .reduce((res, fnName, index) => {
        let value = date[fnName]()
        // silly javascript months
        if (index === 1) {
          value = value + 1
        }
        const str = value + ''
        if (index === 6) {
          if (!value) {
            return res
          } else {
            // strips trailing zeros
            // *NOTE: cannot just do the Number transformation
            // at the end because JS does crazy things on larger
            // floats. The decimals change, for example:
            // Number('20101203231524.029') becomes: 20101203231524.027
            // so we do it just with the decimal
            const decimalEnding = Number(
              '0.' + (value + '').padStart(3, '0')
            ).toString()
            return res + decimalEnding.slice(1, 5)
          }
        }
        return res + (index === 0 ? str : str.padStart(2, 0))
      }, '') + timeZoneAddOn
  )
}
