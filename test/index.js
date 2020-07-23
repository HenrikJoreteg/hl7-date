const test = require('tape')
const { parse, stringify } = require('../src/hl7-date')

test('parse', t => {
  const parsePairs = [
    ['2010 07 14 22 20 33+0100', Date.UTC(2010, 6, 14, 22 - 1, 20, 33)],
    ['2010 07 14 22 20 33-0100', Date.UTC(2010, 6, 14, 22 + 1, 20, 33)],
    [
      '2010 07 14 22 20 33.0344+1200',
      Date.UTC(2010, 6, 14, 22 - 12, 20, 33, 34),
    ],
    ['2010 07 14 22 20 33.003', new Date(2010, 6, 14, 22, 20, 33, 3)],
    ['2010 07 14 22 20 33.032', new Date(2010, 6, 14, 22, 20, 33, 32)],
    ['2010 07 14 22 20 33.2', new Date(2010, 6, 14, 22, 20, 33, 200)],
    ['2010 07 14 22 20 33', new Date(2010, 6, 14, 22, 20, 33)],
    ['2010 07 14 22 20', new Date(2010, 6, 14, 22, 20)],
    ['2010 07 14 22', new Date(2010, 6, 14, 22)],
    ['2010 07 14', new Date(2010, 6, 14)],
  ]

  parsePairs.forEach(([string, date]) => {
    const cleaned = string.replace(/\s/g, '')
    const parsed = parse(cleaned)
    t.equal(parsed.valueOf(), date.valueOf())
  })

  t.end()
})

test('stringify and re-parse', t => {
  const validPairs = [
    [new Date(2010, 0, 1), '2010'],
    [new Date(2010, 11), '2010 12'],
    [new Date(2010, 11, 3), '2010 12 03'],
    [new Date(2010, 5, 3), '2010 06 03'],
    [new Date(2010, 11, 3, 23), '2010 12 03 23-0800'],
    [new Date(2010, 11, 3, 23, 15), '2010 12 03 23 15-0800'],
    [new Date(2010, 11, 3, 23, 15, 24), '2010 12 03 23 15 24-0800'],
    [new Date(2010, 11, 3, 23, 15, 24, 200), '2010 12 03 23 15 24.2-0800'],
    [new Date(2010, 11, 3, 23, 15, 24, 223), '2010 12 03 23 15 24.223-0800'],
    [new Date(2010, 11, 3, 23, 15, 24, 29), '2010 12 03 23 15 24.029-0800'],
  ]

  validPairs.forEach(([date, string]) => {
    const originalMs = date.valueOf()
    const targetValue = string.replace(/\s/g, '')
    const stringified = stringify(date)
    t.equal(stringified, targetValue)
    t.equal(parse(stringified).valueOf(), originalMs)
  })

  t.end()
})

test('stringify to specific precision', t => {
  const date = new Date(1998, 9, 8, 7, 6, 5, 4)
  const items = [
    [date, 'year', '1998'],
    [date, 'month', '199810'],
    [date, 'date', '19981008'],
    [date, 'hour', '1998100807-0700'],
    [date, 'minute', '199810080706-0700'],
    [date, 'second', '19981008070605-0700'],
    [date, 'millisecond', '19981008070605.004-0700'],
  ]
  items.forEach(([date, precision, expected]) => {
    t.equal(stringify(date, precision), expected)
  })

  t.end()
})
