import { MongoClient, type Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },
  async disconnect () {
    await this.client.close()
    this.client = null
  },
  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  }
}
