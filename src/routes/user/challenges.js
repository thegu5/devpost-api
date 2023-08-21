import { x } from '../../utils.js'

export default async function (fastify, options) {
  fastify.get('/:username/challenges', async (request, reply) => {
    const username = request.params.username
    const url = `https://devpost.com/${username}/challenges`
    const data = await x(url, x('article.challenge-listing', [
      {
        name: 'a > div .content .title | trim',
        slug: 'a@href | subdomain',
        url: 'a@href',
        thumbnail: '.challenge-logo > img@src',
        featured: '.featured-tag | exists',
        status: '.challenge-status | trim'
      }
    ])
    )
    return data
  })
}
