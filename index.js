#!/usr/bin/env node

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')

const app = new Koa()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

const defaultPort = 8080
const port = process.env.PORT || defaultPort

const router = require('./routes/user')
app.use(router.routes())

module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
