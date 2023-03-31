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
      if (value === null || value.match(/url\((.*?)\)/) === null) { return null }
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
    }
  }
})
module.exports = async function (fastify, options) {
  fastify.get(':hackathon', async (request, reply) => {
    const hackathon = request.params.hackathon
    const url = `https://${hackathon}.devpost.com/`
    const data = await x(url,
      {
        name: 'div#introduction .row .content > h1',
        shortDescription: 'div#introduction .row .content > h3',
        description: '#challenge-description | trim',
        // banner: "style:contains('#challenge-header')",
        // bannerColor: "style:contains('#challenge-header')",
        time: '#date-info-tag > time',
        location: 'table.is-marginless > tbody > tr > td > div > div:nth-child(2) | trim',
        address: 'table.is-marginless > tbody > tr > td > div > div:nth-child(2) > a@href | address',
        availability: 'table.is-marginless > tbody > tr > td:nth-child(2) > .info-with-icon > .info:nth-child(2) | trim',
        prizeTotal: 'td:nth-child(1) > strong:nth-child(1) > span:nth-child(1) > span:nth-child(1) | number',
        participantCount: 'td.nowrap > strong:nth-child(1) | number',
        tags: [
          'div.info-with-icon:nth-child(2) > div:nth-child(2) > a | trim'
        ],
        requirementText: '#challenge-requirements > div:nth-child(2) | trim',
        requirements: 'string',
        prizes: x('.prize', [
          {
            name: '.prize-title | trim',
            description: 'p | trim'
          }
        ]),
        judges: x('.challenge_judge', [
          {
            name: '.row > div:nth-child(2) > p > strong',
            avatar: '.user-photo@href'
          }
        ]),
        judgingCriteria: '#judging-criteria .no-bullet | trim'
      })
    if (data.address === undefined) {
      data.address = null
    }
    return data
  })
}
