const x = require('../../xray.js');

module.exports = async function (fastify, options) {
    fastify.get('/:hackathon/forum_topics', async (request, reply) => {
        const hackathon = request.params.hackathon
        const url = `https://${hackathon}.devpost.com/forum_topics`
        const data = await x(url,
            {
                forum_topics: x('#forum-topics > li .row', [
                  {
                    title: "p > a",
                    replies: "div:nth-child(2) > a > span.text | number",
                    slug: "p > a@href | slug"
                  }
                ])
              });
          return data;
    });
}
