import { x } from '../../utils.js'

export default async function (fastify, options) {
  // TODO: add authentication for this one; need to be logged in to view participants
  fastify.get('/:hackathon/participants', async (request, reply) => {
    const hackathon = request.params.hackathon
    const url = `https://${hackathon}.devpost.com/participants`
    console.log(url)
    const data = await x(url, {
      name: 'body',
      username: 'string',
      url: 'string',
      avatar: 'string',
      stats: {
        projects: 0,
        followers: 0,
        achievements: 0
      },
      specialty: 'string',
      skills: [
        'string'
      ],
      interests: [
        'AR/VR'
      ],
      teamStatus: 'Has a team'
    })
    return data
  })
}
