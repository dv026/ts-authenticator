import * as dotenv from 'dotenv'
dotenv.config()
var cors = require('cors')

import express from 'express';

import { routes } from './routes';
import { userController } from './controllers/user-controller';
import { dbConnector } from './db-connector';
import { adminConroller } from './controllers/admin-controller';

const app = express();
const port = 3000;

const url = process.env.MONGODB_URL;

// to allow every origin to connect
app.use(cors())
// get body from request
app.use(express.json())

app.post(routes.user.registration, async (req, res) => {
  const { login, password } = req.body
  console.log('route')
  console.log({ login, password })
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

app.get(routes.admin.users, async (req, res) => {
  try {
    const users = await adminConroller.getUsers()
    res.json(users)
  } catch (e) {
    throw new Error(e)
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