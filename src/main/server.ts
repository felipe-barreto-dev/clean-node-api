import { MongoHelper } from '@/infra/db/mongodb/helpers'
import env from '@/main/config/env'
import 'module-alias/register'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () => {
      console.log('Server running')
    })
  })
  .catch(console.error)
