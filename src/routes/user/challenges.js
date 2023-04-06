const x = require('../../xray.js')

module.exports = async function (fastify, options) {
  fastify.get('/:username/challenges', async (request, reply) => {
    const username = request.params.username
    const url = `https://devpost.com/${username}/challenges`
    const data = await x(url,
      {
        challenges: x('article.challenge-listing', [
          {
            name: 'a > div .content .title | trim',
            slug: 'a@href | subdomain',
            url: 'a@href',
            thumbnail: '.challenge-logo > img@src',
            featured: true,
            status: '.challenge-synopsis .content .participation-badge'
          }
        ])
      })
    return data
  })
}
