import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import autoLoad from '@fastify/autoload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fastify = Fastify({
  ignoreTrailingSlash: true,
  logger: true,
  trustProxy: 1
})

fastify.register(cors, {
  origin: '*'
})

// Load all routes from the `routes` folder
fastify.register(autoLoad, {
  dir: join(__dirname, '/routes')
})

// Start the server
fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
  console.log(`Server listening on ${fastify.server.address().port}`)
})
