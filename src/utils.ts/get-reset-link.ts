export function createResetLink(token: string) {
  return `${process.env.FRONTEND_BASE_URL}/reset-password/${token}`
}
