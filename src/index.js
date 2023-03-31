const fastify = require('fastify')({
  ignoreTrailingSlash: true,
  logger: true,
  trustProxy: 1
})
const path = require('path')
// Load all routes from the `routes` folder
fastify.register(require('@fastify/autoload'), {
  dir: path.join(__dirname, 'routes'),
  dirNameRoutePrefix: true,
  options: {}
})

// Start the server
fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
  console.log(`Server listening on ${fastify.server.address().port}`)
})
