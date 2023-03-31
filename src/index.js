const fastify = require('fastify')({
  ignoreTrailingSlash: true,
  logger: true,
  trustProxy: 1
})

// Load all routes from the `routes` folder
fastify.register(require('@fastify/autoload'), {
  dir: `${__dirname}/routes`,
  options: {}
})

// Start the server
fastify.listen({port: 3000}, (err) => {
  if (err) throw err
  console.log(`Server listening on ${fastify.server.address().port}`)
})