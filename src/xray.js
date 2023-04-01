const Xray = require('@thegu5/x-ray')
const x = Xray({
    filters: {
      trim: function (value) {
        return typeof value === 'string' ? value.trim() : value
      },
      newlinesplit: function (value, index) {
        return typeof value === 'string' ? value.split('\n')[index] : value
      },
      regex: function (value, regex) {
        return typeof value === 'string' ? value.matchAll(regex)[0] : value
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
        return typeof value === 'string' ? value.match(/(?<=\/)[^\/]+$/)[0] : value
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
        return typeof value === 'string' ? value.match(/background\: (#[0-F]{6})/g)[0] : value
      }
    }
  })
module.exports = x;