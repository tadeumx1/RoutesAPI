const express = require('express')
const validate = require('express-validation')
const handle = require('express-async-handler')

const routes = express.Router()

const authMiddleware = require ('./app/middlewares/auth')

const controllers = require('./app/controllers')
const validators = require('./app/validators')

// const UserController = require('./app/controllers/UserController')
// const SessionController = require('./app/controllers/SessionController')

routes.post('/users', validate(validators.User), handle(controllers.UserController.store))
routes.post('/forgot_password', handle(controllers.AuthController.forgotPassword))
routes.post('/reset_password', handle(controllers.AuthController.resetPassword))
routes.post('/sessions', validate(validators.Session), handle(controllers.SessionController.store))

// Com isso todas rotas abaixo o usuário tem que estar autenticado
// para acessar

routes.use(authMiddleware)

/**
 *  Markers
 */

 routes.get('/markers', handle(controllers.MarkerController.index))
 routes.get('/marker/:id', handle(controllers.MarkerController.show))
 routes.post('/markers', handle(controllers.MarkerController.store))
 routes.put('/marker/:id', handle(controllers.MarkerController.update))
 routes.delete('/marker/:id', handle(controllers.MarkerController.destroy))

/**
 *  Routes
 */

 routes.get('/routes', handle(controllers.RoutesController.index))
 routes.get('/route/:id', handle(controllers.RoutesController.show))
 routes.post('/routes', handle(controllers.RoutesController.store))
 routes.put('/route/:id', handle(controllers.RoutesController.update))
 routes.delete('/route/:id', handle(controllers.RoutesController.destroy))

module.exports = routes