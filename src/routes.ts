export const routes = {
  user: {
    login: "/login",
    registration: "/registration",
    checkAuth: "/check-auth",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  admin: {
    users: {
      get: "/admin/users",
      delete: "/admin/users",
    },
    user: {
      delete: "/admin/user/:id",
      create: "/admin/user",
      get: "/admin/user/:id",
      update: "/admin/user/:id",
    },
    apiKey: {
      delete: "/admin/api-key/:id",
      create: "/admin/api-key",
      get: "/admin/api-key/:id",
      update: "/admin/api-key/:id",
    },
    apiKeys: {
      get: "/admin/api-keys",
      delete: "/admin/api-keys",
    },
  },
  email: {
    send: "/email/send",
  },
}
