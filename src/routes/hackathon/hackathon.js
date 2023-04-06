const x = require('../../xray.js')

module.exports = async function (fastify, options) {
  fastify.get('/:hackathon', async (request, reply) => {
    const hackathon = request.params.hackathon
    const url = `https://${hackathon}.devpost.com/`
    const data = await x(url,
      {
        name: 'div#introduction .row .content > h1',
        shortDescription: 'div#introduction .row .content > h3',
        description: '#challenge-description | trim',
        banner: 'header#challenge-header > img@src | img',
        bannerColor: "style:contains('#challenge-header')",
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
        requirements: '#eligibility-list | trim',
        prizes: x('.prize', [
          {
            name: '.prize-title | trim',
            description: 'p | trim'
          }
        ]),
        judges: x('.challenge_judge', [
          {
            name: '.row > div:nth-child(2) > p > strong',
            avatar: 'img.user-photo@src'
          }
        ]),
        judgingCriteria: '#judging-criteria .no-bullet | trim'
      })
    return data
  })
}
