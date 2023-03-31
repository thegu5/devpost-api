module.exports = async function (fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { message: 'An API for devpost! Under heavy development.' }
  })
}