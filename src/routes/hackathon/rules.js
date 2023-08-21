import { x } from '../../utils.js'

export default async function (fastify, options) {
  fastify.get('/:hackathon/rules', async (request, reply) => {
    const hackathon = request.params.hackathon
    const url = `https://${hackathon}.devpost.com/rules`
    const data = await x(url,
      {
        name: 'section.large-12 | trim'
      })
    return data
  })
}
