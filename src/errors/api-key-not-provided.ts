export class ApiKeyNotProvided extends Error {
  constructor() {
    super("ApiKeyNotProvided")
    this.name = "ApiKeyNotProvided"
  }
}
