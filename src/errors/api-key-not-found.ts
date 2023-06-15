export class ApiKeyNotFound extends Error {
  constructor() {
    super("Api Key Not Found")
    this.name = "ApiKeyNotFound"
  }
}
