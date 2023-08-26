import { x } from '../../utils.js'

export default async function (fastify, options) {
  fastify.get('/:hackathon/updates', async (request, reply) => {
    const hackathon = request.params.hackathon
    const url = `https://${hackathon}.devpost.com/updates`
    const data = await x(url, x('.columns .update', [
      {
        time: ':first-child | trim',
        title: 'h2:nth-child(2) > a:nth-child(1)',
        url: 'h2:nth-child(2) > a:nth-child(1)@href',
        slug: 'h2:nth-child(2) > a:nth-child(1)@href | slug',
        contentPreview: x('p:not(:nth-child(1))', ['@html'])
      }
    ]))
    for (let i = 0; i < data.length; i++) {
      data[i].contentPreview = data[i].contentPreview.join("")
    }
    return data
  })
}
