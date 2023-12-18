import { type ConnectOptions, MongoClient } from 'mongodb'

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
  }
}
