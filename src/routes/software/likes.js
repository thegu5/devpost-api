import { x } from '../../utils.js'

export default async function (fastify, options) {
  fastify.get('/:software/likes', async (request, reply) => {
    const software = request.params.software
    const baseUrl = `https://devpost.com/software/${software}/likes?page=:page`
    const temp = []
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
      const url = baseUrl.replace(':page', page)
      const data = await x(url, {
        likes: x('a.like-row', [
          {
            name: '.content | trim',
            username: '@href | slug',
            url: '@href',
            avatar: 'img@src'
          }
        ])
      })
      temp.push(...data.likes)
      hasNextPage = data.likes.length > 0
      page++
    }
    return { temp }
  })
}
