import { type ConnectOptions, MongoClient, type Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  async connect (uri: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this.client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions)
  },
  async disconnect () {
    await this.client.close()
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
}
