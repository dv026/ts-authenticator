import { UserModel } from './models/user';
import { MongoClient, Collection } from 'mongodb'

class DbConnector {
  mongoclient: MongoClient
  users: Collection<UserModel>

  async connect(url: string) {
    this.mongoclient = new MongoClient(url);
    console.log({ url })
    await this.mongoclient.connect();

    this.users = this.mongoclient.db('authenticator').collection('users')
  }
}

export const dbConnector = new DbConnector()