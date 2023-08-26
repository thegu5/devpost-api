import { x } from '../../utils.js'

export default async function (fastify, options) {
  fastify.get('/:software/likes', async (request, reply) => {
    const software = request.params.software
    const baseUrl = `https://devpost.com/software/${software}/likes?page=:page`
    const temp = []
    let page = 1
    let hasNextPage = true
    // TODO: Use x-ray's built in pagination, this is a mess
    while (hasNextPage) {
      const url = baseUrl.replace(':page', page)
      const data = await x(url, x('a.like-row', [
        {
          name: '.content | trim',
          username: '@href | slug',
          url: '@href',
          avatar: 'img@src'
        }
      ]))
      temp.push(...data)
      hasNextPage = data.length > 0
      page++
    }
    return temp
  })
}
