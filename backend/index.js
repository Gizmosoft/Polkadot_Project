import express from 'express';
import initialize from './app/app.js'
import dotenv from 'dotenv'

dotenv.config()

// define an express app
const app = express()
// set port from the .env file
const port = process.env.DEV_PORT

// call the initialize function to init the app
initialize(app)

// set the root API endpoint
app.get('/', (req, res) => res.send('Hello world! Landing page of the app would be coming up here soon...'))

// setup the server to run on a defined port
app.listen(port, () => console.log(`${process.env.STATUS} Server Up and Running! Listening on port: ${port}`))