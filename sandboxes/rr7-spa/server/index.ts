import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { api } from './routes'

const app = new Hono()

app.use(logger())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
  exposeHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.get('/', (c) => c.text('🔥 Hello from Remix PWA + Hono!'))

app.route('/api', api)

serve({
  fetch: app.fetch,
  port: 9999
})
