import { x } from '../../utils.js'

export default async function (fastify, options) {
  fastify.get('/:username/followers', async (request, reply) => {
    const username = request.params.username
    const url = `https://devpost.com/${username}/followers`
    const data = await x(url, x('div.user-entry ', [
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
    ]))
    return data
  })
}
