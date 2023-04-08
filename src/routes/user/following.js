const x = require('../../xray.js')

module.exports = async function (fastify, options) {
  fastify.get('/:username/following', async (request, reply) => {
    const username = request.params.username
    const url = `https://devpost.com/${username}/following`
    const data = await x(url,
      {
        followers: x('div.user-entry ', [
          {
            name: '.entry-body > h5 > span',
            username: '.entry-body > h5 > span@data-url | slug',
            url: '.entry-body > h5 > span@data-url',
            avatar: '.entry-body > img@src',
            bannerColor: 'header@style | trim | bghex',
            stats: {
              projects: 'footer.with-achievement-count > div > div:nth-child(1) > div > span | number',
              hackathons: 'footer.with-achievement-count > div > div:nth-child(2) > div > span | number',
              followers: 'footer.with-achievement-count > div > div:nth-child(3) > div > span | number',
              achievements: 'footer.with-achievement-count > div > div:nth-child(4) > div > span | number',
              bio: '.entry-body > p.tagline | trim'
            }
          }
        ])
      })
    return data
  })
}
