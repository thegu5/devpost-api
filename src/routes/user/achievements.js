import { x } from '../../utils.js'

export default async function (fastify, options) {
  fastify.get('/:username/achievements', async (request, reply) => {
    const username = request.params.username
    const url = `https://devpost.com/${username}/achievements`
    const data = await x(url,
      {
        achievements: x('div.user-achievement-tile ', [
          {
            name: '.content > h5 | trim | extratrim',
            description: '.content > p',
            image: 'img@src',
            date: '.content > small'
          }
        ])
      })
    return data
  })
}
