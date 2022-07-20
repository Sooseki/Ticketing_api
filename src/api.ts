import cors from 'cors'
import express, { json } from 'express'
import { Log } from './classes/Logging/Log'
import { DefaultErrorHandler } from './middlewares/error-handler'
import { TICKET_ROUTES } from './routes/ticket/TicketController'
import { USER_ROUTES } from './routes/user/UserController'
import { MESSAGE_ROUTES } from './routes/message/MessageController'
import { CHAT_ROUTES } from './routes/chat/ChatController'
import expressWs from 'express-ws'
import { USER_TICKET_ROUTES } from './routes/userTicket/UserTicketController'

const PORT = process.env.PORT || 8080;

/**
 * On créé une nouvelle "application" express
 */
const app = expressWs(express()).app

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
app.use('/user', USER_ROUTES)
app.use('/ticket', TICKET_ROUTES)
app.use('/ticket-user', USER_TICKET_ROUTES)
app.use('/chat', CHAT_ROUTES)
app.use('/message', MESSAGE_ROUTES)

/**
 * Gestion des erreurs
 */
app.use(DefaultErrorHandler)

/**
 * On demande à Express d'ecouter les requêtes sur le port défini dans la config
 */
app.listen(PORT, () => {
  Log(`API Listening on port ${PORT}`)
})