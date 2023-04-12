const x = require('../../xray.js')

module.exports = async function (fastify, options) {
    fastify.get('/:hackathon/updates', async (request, reply) => {
        const hackathon = request.params.hackathon
        const url = `https://${hackathon}.devpost.com/updates`
        const data = await x(url,
            {
                updates: x('.columns .update', [
                  {
                    time: ":first-child | trim",
                    title: "h2:nth-child(2) > a:nth-child(1)",
                    slug: "h2:nth-child(2) > a:nth-child(1)@href",
                    contentPreview: x('p:not(:nth-child(1))', ['@text'])
                  }
                ])
              });
          return data;
    })
}
