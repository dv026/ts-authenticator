import { dbConnector } from "../db-connector"

export class ApiKeyService {
  constructor() {}

  checkApiKey(apiKey: string) {
    // TODO: добавить логику для проверки не только существования ключа,
    // но и для того, чтобы убедиться что никто другой не использует чужой ключ
    // возможно это не обязательно, тк ключи случайны и не получится его
    // подобрать --- нужно подумать
    return this.checkApiKeyExists(apiKey)
  }

  checkApiKeyExists(apiKey: string) {
    const key = dbConnector.apiKeys.findOne({ value: apiKey })

    if (!key) {
      return false
    }

    return true
  }
}

export const apiKeyService = new ApiKeyService()
