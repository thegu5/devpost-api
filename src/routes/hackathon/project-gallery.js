const Xray = require('@thegu5/x-ray')
const x = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.trim() : value
    },
    newlinesplit: function (value, index) {
      return typeof value === 'string' ? value.split('\n')[index] : value
    },
    regex: function (value, regex) {
      return typeof value === 'string' ? value.matchAll(regex)[0] : value
    },
    parentheses: function (value) {
      return typeof value === 'string' ? value.match(/\(([^)]+)\)/)[1] : value
    },
    hexcode: function (value, index) {
      return typeof value === 'string' ? value.match(/(#[0-F]{6})/g)[0] : value
    },
    img: function (value, index) {
      if (value === null || value.match(/url\((.*?)\)/) === null) { return null }
      return typeof value === 'string' ? value.match(/url\((.*?)\)/)[1] : value
    },
    username: function (value, index) {
      return typeof value === 'string' ? value.match(/.*\/(.+)/)[1] : value
    },
    slug: function (value, index) {
      return typeof value === 'string' ? value.match(/(?<=\/)[^\/]+$/)[0] : value
    },
    address: function (value, index) {
      return typeof value === 'string' ? value.match(/(?<==).*/)[0] : value
    },
    subdomain: function (value, index) {
      return typeof value === 'string' ? value.match(/^https?:\/\/(.+)\.devpost\.com/)[1] : value
    },
    number: function (value) {
      return typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
    },
    exists: function (value, index) {
      if (value === undefined || value === null || value.length === 0) {
        return false
      } else {
        return true
      }
    }
  }
})

module.exports = async function (fastify, options) {
  fastify.get('/hackathon/:hackathon/project-gallery/:limit', async (request, reply) => {
    const hackathon = request.params.hackathon
    const limit = parseInt(request.params.limit)
    const baseUrl = `https://${hackathon}.devpost.com/project-gallery?page=:page`
    const temp = []
    let page = 1
    let hasNextPage = true

    while (hasNextPage && temp.length <= limit) {
      const url = baseUrl.replace(':page', page)
      const data = await x(url, {
        projects: x('.gallery-item', [{
          name: 'div:nth-child(1) > h5:nth-child(1) | trim',
          tagline: 'div:nth-child(1) > p.tagline | trim',
          photo: '.software-entry > figure:nth-child(1) > img:nth-child(1)@src',
          slug: 'a:nth-child(1)@href | trim | slug',
          url: 'a:nth-child(1)@href',
          members: x('.gallery-item .gallery-entry .members .user-profile-link', [{
            name: 'img@alt',
            username: '@data-url | username',
            url: '@data-url',
            avatar: 'img@src'
          }]),
          like_count: '.counts .like-count | trim | number',
          comment_count: '.counts .comment-count | trim | number',
          winner: 'aside > img:nth-child(1)@src | exists'
          // featured: '.gallery-entry .ss-icon'
        }])
      })
      temp.push(...data.projects)
      hasNextPage = data.projects.length > 0
      page++
    }
    const projects = temp.slice(0, limit)
    return { projects }
  })
}
