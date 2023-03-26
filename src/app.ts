import { routes } from './routes';
import { userController } from './controllers/user-controller';
import { dbConnector } from './db-connector';
import express from 'express';

const app = express();
const port = 3000;

const url = 'mongodb+srv://admin:ySHbVCNgAUe5BB5V@claster1.zhallab.mongodb.net/?retryWrites=true&w=majority';

// get body from request
app.use(express.json())

app.post(routes.user.registration, async (req, res) => {
  const { login, password } = req.body
  try {
    const user = await userController.registration({ login, password})
    return res.json(user)
  } catch (e) {
    return res.json(e)
  }
});

app.post(routes.user.login, async (req, res) => {
  const { login, password } = req.body
  try {
    const user = await userController.login({ login, password})
    return res.json(user)
  } catch (e) {
    return res.json(e)
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

app.listen(port, async () => {
  await dbConnector.connect(url)
});