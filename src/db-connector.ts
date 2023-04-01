import { UserModel, TokenModel, RoleModel } from './models';
import { MongoClient, Collection } from 'mongodb'

class DbConnector {
  mongoclient: MongoClient
  users: Collection<UserModel>
  tokens: Collection<TokenModel>
  roles: Collection<RoleModel>

  async connect(url: string) {
    this.mongoclient = new MongoClient(url);
    await this.mongoclient.connect();

    this.users = this.mongoclient.db('authenticator').collection('users')
    this.tokens = this.mongoclient.db('authenticator').collection('tokens')
    this.roles = this.mongoclient.db('authenticator').collection('roles')
  }
}

export const dbConnector = new DbConnector()