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
  fastify.get('/:username', async (request, reply) => {
    const username = request.params.username
    console.log(request.params)
    const url = `https://devpost.com/${username}`
    const data = await x(url,
      {
        name: 'h1#portfolio-user-name | trim | newlinesplit:0',
        bio: 'p#portfolio-user-bio > i',
        avatar: '#portfolio-user-photo > img@src',
        banner: "style:contains('#portfolio-cover') | img",
        bannerColor: "style:contains('#portfolio-cover') | hexcode",
        external: {
          location: 'is.first-child',
          website: "a:contains('Website')@href",
          github: "a:contains('GitHub')@href",
          twitter: "a:contains('Twitter')@href",
          linkedin: "a:contains('LinkedIn')@href"
        },
        skills: [
          '.portfolio-tags > li span'
        ],
        interests: [
          'div.tag-list:nth-child(3) > ul:nth-child(2) > li > span'
        ],
        stats: {
          projects: 'li:nth-child(1) > a > div > span | number',
          hackathons: 'li:nth-child(2) > a > div > span | number',
          achievements: 'li:nth-child(3) > a > div > span | number',
          followers: 'li:nth-child(4) > a > div > span | number',
          following: 'li:nth-child(5) > a > div > span | number',
          likes: 'li:nth-child(6) > a > div > span | number'
        }
      })

    // console.log(data)
    // data.stats = Object.fromEntries(Object.entries(data.stats).map(([key, value]) => [key, parseInt(value)]));
    // data.like_count = Object.fromEntries(Object.entries(data.like_count).map(([key, value]) => [key, parseInt(value)]));
    const searchurl = `https://devpost.com/software/search?query=%40%22${username}%22`
    const projects = await x(searchurl, '.gallery-item',
      {
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
    data.projects = projects
    return data
  })
}