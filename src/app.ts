import * as dotenv from 'dotenv'
dotenv.config()
var cors = require('cors')

import express from 'express';

import { routes } from './routes';
import { userController } from './controllers/user-controller';
import { dbConnector } from './db-connector';
import { adminConroller } from './controllers/admin-controller';
import { apiKeysConroller } from './controllers/api-keys-controller';

const app = express();
const port = 3000;

const url = process.env.MONGODB_URL;

// to allow every origin to connect
app.use(cors())
// get body from request
app.use(express.json())

app.post(routes.user.registration, async (req, res) => {
  const { login, password } = req.body
  try {
    const user = await userController.registration({ login, password })
    return res.json(user)
  } catch (e) {
    return res.status(400).send({ 
      message: e.message
    })
  }
});

app.post(routes.user.login, async (req, res) => {
  const { login, password } = req.body
  try {
    const user = await userController.login({ login, password})
    return res.json(user)
  } catch (e) {
    return res.status(400).send({ 
      message: e.message
    })
  }
})

app.get(routes.user.checkAuth, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  try {
    return res.json(userController.checkAuth(token))
  } catch (e) {
    return res.json(e)
  }
})

app.post(routes.user.forgotPassword, async (req, res) => {
  const { login } = req.body
  try {
    await userController.forgotPassword({ login })
    res.json({ message: 'Email\'s been sent to your email'})
  } catch (e) {
    return res.json(e)
  }
})

app.post(routes.user.resetPassword, async (req, res) => {
  const { token, newPassword } = req.body
  try {
    await userController.resetPassword({ token, newPassword })
    res.json('Password\'s been successfully changed')
  } catch (e) {
    throw new Error(e)
  }
})

app.get(routes.admin.users.get, async (req, res) => {
  const queryParams = req.query
  try {
    const users = await adminConroller.getUsers({ 
      pageSize: parseInt(queryParams.pageSize.toString()) || 10,
      currentPage: parseInt(queryParams.currentPage.toString()) || 1,
      roles: queryParams.roles as string,
      login: queryParams.login as string
    })
    const totalCount = await adminConroller.getUsersCount()
    res.json({
      users,
      totalCount
    })
  } catch (e) {
    res.json({ error: e})
  }
})

app.delete(routes.admin.user.delete, async (req, res) => {
  const { id } = req.params
  try {
    await adminConroller.deleteUser(id)
    res.json('User\'s been deleted')
  } catch (e) {
    res.json({ error: e })
  }
})

app.get(routes.admin.user.get, async (req, res) => {
  const { id } = req.params
  try {
    const user = await adminConroller.getUser(id)
    res.json(user)
  } catch (e) {
    res.json({ error: e })
  }
})

app.post(routes.admin.users.delete, async (req, res) => {
  const { ids } = req.body
  try {
    await adminConroller.deleteUsers(ids)
    res.json('Users\'re been deleted')
  } catch (e) {
    res.json({ error: e })
  }
})

app.post(routes.admin.user.create, async (req, res) => {
  const { login, password, roles  } = req.body
  try {
    await adminConroller.createUser({ login, password, roles  })
    res.json('User\'s been created')
  } catch (e) {
    res.json({ error: e })
  }
})

app.put(routes.admin.user.update, async (req, res) => {
  const { login, password, roles  } = req.body
  const { id } = req.params
  try {
    const user = await adminConroller.updateUser({ id, login, password, roles })
    res.json({ user })
  } catch (e) {
    res.json({ error: e })
  }
})

app.put(routes.admin.apiKey.update, async (req, res) => {
  const { name  } = req.body
  const { id } = req.params
  try {
    const apiKey = await apiKeysConroller.update(id, name)
    res.json({ apiKey })
  } catch (e) {
    res.json({ error: e })
  }
})

app.delete(routes.admin.apiKey.delete, async (req, res) => {
  const { id } = req.params
  try {
    const apiKey = await apiKeysConroller.delete(id)
    res.json({ apiKey })
  } catch (e) {
    res.json({ error: e })
  }
})

app.get(routes.admin.apiKey.get, async (req, res) => {
  const { id } = req.params
  try {
    const apiKey = await apiKeysConroller.get(id)
    res.json({ apiKey })
  } catch (e) {
    res.json({ error: e })
  }
})

app.post(routes.admin.apiKey.create, async (req, res) => {
  const { name  } = req.body
  try {
    const apiKey = await apiKeysConroller.create(name)
    res.json({ apiKey })
  } catch (e) {
    res.json({ error: e })
  }
})

app.post(routes.admin.apiKeys.delete, async (req, res) => {
  const { ids } = req.body
  try {
    const apiKey = await apiKeysConroller.deleteMany(ids)
    res.json({ apiKey })
  } catch (e) {
    res.json({ error: e })
  }
})

app.get(routes.admin.apiKeys.get, async (req, res) => {
  try {
    const apiKeys = await apiKeysConroller.getAll()
    res.json(apiKeys)
  } catch (e) {
    res.json({ error: e })
  }
})

app.listen(port, async () => {
  await dbConnector.connect(url)
  console.log('server started')
});


// login работает
// registration работает
// check-auth работает

// добавить остальные методы
// разобраться с ролями