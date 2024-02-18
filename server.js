import express from 'express'
import mongoose from 'mongoose'
import { APP_PORT, MONGODB_URI } from './config'
import cors from 'cors'
import methodOverride from 'method-override'

import bodyParser from 'body-parser'
import router from './routes'
import errorHandler from './middlewares/errorHandler'
const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(router)

mongoose.set('strictQuery', false)
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Database Connected'))
  .then(() => {
    app.use(errorHandler)

    app.listen(APP_PORT, () => {
      console.log(`Server on ${APP_PORT}`)
    })
  })
  .catch(err => console.log('database not connected'))
