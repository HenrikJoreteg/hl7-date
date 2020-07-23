# hl7-date

Parse and stringify HL7 date format to native JS `Date` objects.

It only exports two methods: `parse` and `stringify` (just like `JSON`) and has zero dependencies.

HL7's date format is structured as follows, everything in `[]` is optional,

```
YYYY[MM[DD[HH[MM[SS[.S[S[S[S]]]]]]]]][+/-ZZZZ]
```

`ZZZZ` if present is in `HHMM` format

## Install

```
$ npm i --save hl7-date
```

## Examples

```js
import HL7Date from 'hl7-date'

// precision is inferred based on precision of date
HL7Date.stringify(new Date(2010, 11, 3)) // 20101203

// precision can also be specifically passed
HL7Date.stringify(new Date(2010, 11, 3), 'year') // 2010

// parsing
HL7Date.parse('20101203231524.029-0800') // Date Object w/ value: 2010-12-04T07:15:24.029Z
```

## available precision options for stringify

By default, precision will be determined by precision of date object given.

If a specific precision is required these are the available options:

`'millisecond'`, `'second'`, `'minute'`, `'hour'`, `'date'`, `'month'`, `'year'`

## Credits

Created by [@HenrikJoreteg](https://twitter.com/henrikjoreteg) for [anesthesiacharting.com](https://anesthesiacharting.com)

## Changelog

- `1.0.1` - removed accidental inclusion of unused dependency
- `1.0.0` - initial release

## License

[MIT](https://mit.joreteg.com/)
