import { UserModel } from './models/user';
import { MongoClient, Document, Collection } from 'mongodb'
import { IUser } from './types/user';

class DbConnector {
  mongoclient: MongoClient
  users: Collection<UserModel>

  async connect(url: string) {
    this.mongoclient = new MongoClient(url);
    await this.mongoclient.connect();

    this.users = this.mongoclient.db('authenticator').collection('users')
  }
}

export const dbConnector = new DbConnector()