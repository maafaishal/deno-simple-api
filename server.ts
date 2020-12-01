import { Application } from 'https://deno.land/x/oak/mod.ts'
import router from './routes.ts'

const PORT = Deno.env.get("PORT") || 7700

const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Server running on port ${PORT}`)

await app.listen({ port: +PORT })