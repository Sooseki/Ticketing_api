import cors from 'cors'
import express, { json, Router } from 'express'
import { Log } from './classes/Logging/Log'
import { DefaultErrorHandler } from './middlewares/error-handler'
import { USER_ROUTES } from './routes/user/UserController'

const PORT = process.env.PORT || 8080;

/**
 * On créé une nouvelle "application" express
 */
const app = express()

/**
 * On dit à Express que l'on souhaite parser le body des requêtes en JSON
 *
 * @example app.post('/', (req) => req.body.prop)
 */
app.use(json())

/**
 * On dit à Express que l'on souhaite autoriser tous les noms de domaines
 * à faire des requêtes sur notre API.
 */
app.use(cors())

/**
 * Toutes les routes CRUD pour les animaux seronts préfixées par `/pets`
 */
// const user_routes = Router()
// user_routes.use(USER_ROUTES)

app.use('/user', USER_ROUTES)

/**
 * Gestion des erreurs
 * /!\ Cela doit être le dernier `app.use`
 */
app.use(DefaultErrorHandler)

/**
 * On demande à Express d'ecouter les requêtes sur le port défini dans la config
 */
app.listen(PORT, () => {
  Log(`API Listening on port ${PORT}`)
})