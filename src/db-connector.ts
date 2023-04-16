import { UserModel, TokenModel, RoleModel } from './models';
import { MongoClient, Collection } from 'mongodb'
import { ApiKeyModel } from './models/api-key';

class DbConnector {
  mongoclient: MongoClient
  users: Collection<UserModel>
  tokens: Collection<TokenModel>
  roles: Collection<RoleModel>
  apiKeys: Collection<ApiKeyModel>

  async connect(url: string) {
    this.mongoclient = new MongoClient(url);
    await this.mongoclient.connect();

    this.users = this.mongoclient.db('authenticator').collection('users')
    this.tokens = this.mongoclient.db('authenticator').collection('tokens')
    this.roles = this.mongoclient.db('authenticator').collection('roles')
    this.apiKeys = this.mongoclient.db('authenticator').collection('api-keys')
  }
}

export const dbConnector = new DbConnector()