import { x } from '../../utils.js'

export default async function (fastify, options) {
  fastify.get('/:hackathon/project-gallery', async (request, reply) => {
    const hackathon = request.params.hackathon
    const data = await x(`https://${hackathon}.devpost.com/project-gallery?page=:page`,
      x('.gallery-item', [{
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
      // exzcept when href is #
      }]).paginate('.next_page:not(.unavailable) > a@href')
    )
    // temporary solution - if winner is null, set it to false
    data.forEach(project => {
      if (project.winner === null) {
        project.winner = false
      }
    })
    return data
  })
}
