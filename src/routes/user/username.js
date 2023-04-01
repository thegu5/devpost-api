const x = require('../../xray.js');

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