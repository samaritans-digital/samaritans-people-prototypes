const express = require('express')
const nunjucks = require('nunjucks')
const basicAuth = require('express-basic-auth')
const utils = require('./utils')

const server = express()

nunjucks.configure('./src/views', {
  express: server,
  autoescape: true,
  watch: true
});
server.set('view engine', 'html');

if(process.env.NODE_ENV == 'production'){
  server.use(basicAuth({
    challenge: true,
    users: { [process.env.USERNAME]: process.env.PASSWORD }
  }))
}

// Auto-render any view file that exists
server.get(/^([^.]+)$/, function (req, res, next) {
  utils.matchRoutes(req, res, next)
})

// Serve anything in the assets folder
server.use(express.static('./src/assets'))

// Error handler
server.use(function (req, res, next) {
  res.status(404).send("Not found: There's no view file at that path")
})

const port = process.env.PORT || 3000
server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})