const x = require('../../xray.js')

module.exports = async function (fastify, options) {
  fastify.get('/:software', async (request, reply) => {
    const software = request.params.software
    const url = `https://devpost.com/software/${software}`
    const data = await x(url,
      {
        // id: ".software-updates article.content-section@data-commentable-id | number", // will be used later for the updates
        name: '#app-title',
        tagline: '.page-header .row .columns .large | trim',
        description: '#app-details-left > div:nth-child(2) | trim',
        createdAt: '.content-section.software-update.with-sidebar:last-child > div.row > div.large-8 > div.media > div.media-content > p.author > span.light-text > a > time@datetime',
        slug: 'str', // taken care of later
        members: x('.software-team-member', [
          {
            name: '.row div:nth-child(2) .user-profile-link',
            username: '.row div:nth-child(2) .user-profile-link@href | slug',
            url: '.row div:nth-child(2) .user-profile-link@href',
            avatar: 'img.software-member-photo@src',
            contributions: '.bubble | trim',
            bio: '.row div:nth-child(2) > small'
          }
        ]),
        tags: [
          'div#built-with .no-bullet .cp-tag'
        ],
        links: [
          '.app-links > ul.no-bullet > li > a@href'
        ],
        hackathons: x('ul.software-list-with-thumbnail > li', [
          {
            name: '.software-list-content > p > a',
            slug: 'li > div:nth-child(2) > p > a@href | subdomain',
            url: 'li > div:nth-child(2) > p > a@href',
            thumbnail: 'li > figure > a > img@src',
            prizes: [
              '.software-list-content > ul:nth-child(2) > li | trim'
            ]
          }
        ]),
        video: 'iframe.video-embed@src',
        carousel: x('#gallery > ul > li.text-center', [
          {
            url: "a@href",
            caption: "a@src"
          }
        ]),
        stats: {
          likes: 'a.like-button > span.side-count | number',
          comments: 'a.comment-button > span.side-count | number',
          updates: 'span.side-count | number'
        }
      })
    data.slug = `${software}`
    return data
  })
}
