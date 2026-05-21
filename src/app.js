const express = require('express')
const app = express()

const routes = require('./routes')
const path = require('path')

app.use(express.json())

app.use('/', routes)

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

module.exports = app;