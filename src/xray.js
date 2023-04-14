const Xray = require('@thegu5/x-ray')
const x = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.trim() : value
    },
    extratrim: function (value) {
      return typeof value === 'string' ? value.replace(/\s\s+/g, ' ') : value
    },
    replace: function (value, search, replace) {
      // isn't working for some reason... tried replacing extratrim w/ this and it didn't work
      console.log(value.replace(search, replace))
      return typeof value === 'string' ? value.replace(search, replace) : value
    },
    newlinesplit: function (value, index) {
      return typeof value === 'string' ? value.split('\n')[index] : value
    },
    regex: function (value, regex, index) {
      return typeof value === 'string' ? value.match(new RegExp(regex))[index] : value
    },
    parentheses: function (value) {
      return typeof value === 'string' ? value.match(/\(([^)]+)\)/)[1] : value
    },
    hexcode: function (value, index) {
      return typeof value === 'string' ? value.match(/(#[0-F]{6})/g)[0] : value
    },
    img: function (value, index) {
      if (value === null || value === undefined || value.match(/url\((.*?)\)/) === null) { return null }
      return typeof value === 'string' ? value.match(/url\((.*?)\)/)[1] : value
    },
    username: function (value, index) {
      return typeof value === 'string' ? value.match(/.*\/(.+)/)[1] : value
    },
    slug: function (value, index) {
      return typeof value === 'string' ? value.match(/(?<=\/)[^/]+$/)[0] : value
    },
    address: function (value, index) {
      return typeof value === 'string' ? value.match(/(?<==).*/)[0] : value
    },
    subdomain: function (value, index) {
      return typeof value === 'string' ? value.match(/^https?:\/\/(.+)\.devpost\.com/)[1] : value
    },
    number: function (value) {
      return typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
    },
    exists: function (value, index) {
      if (value === undefined || value === null || value.length === 0) {
        return false
      } else {
        return true
      }
    },
    bghex: function (value) {
      if (value === null || value === undefined || value.length === 0) { return null }
      console.log("value " + value)
      const match = typeof value === 'string' ? value.match(/background(?:-color)?:\s*#?([0-9a-fA-F]{6})/) : null
      return match ? '#' + match[1] : null
    }
  }
})
module.exports = x
