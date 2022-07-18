import { Router } from "express"
import { ICreateJWTResponse, ICreateResponse } from "~/types/api/ICreateResponse"
import { Crud } from "../../classes/Crud"
import { IIndexQuery, IIndexResponse } from "~/types/api/IIndexQuery"
import { authentication } from "../../auth/authentication"
import { ITicket, ITicketActiveQuery, ITicketCreate, ITicketCreateAll, ITicketIndexQuery } from "~/types/tables/ticket/ITicket"
import { IMessage, IMessageCreate } from "~/types/tables/message/IMessage"
import { IUserTicket, IUserTicketCreate } from "~/types/tables/userTicket/IUserTicket"

const router = Router()

router.get<{}, IIndexResponse<ITicket>, {}, ITicketIndexQuery>('/waiting',
  async (request, response, next) => {

    const authVerified = await authentication(request)

    if(authVerified) {   
      try {
        const where = [
          ['status'], 
          [parseInt(request.query.status)]
        ]

        console.log(request.query)
        const query = await Crud.Index<ITicket>(request.query, 'ticket', ['id', 'opening_date', 'closing_date', 'status', 'description', 'theme'], [], [], where)
        response.json(query)
      } catch (err) {
        next(err)
      }
    } else {
      next(new Error('Authentication failed'))
    } 
  }
)

router.get<{}, IIndexResponse<ITicket>, {}, ITicketActiveQuery>('/active',
  async (request, response, next) => {

    const authVerified = await authentication(request)

    if(authVerified) {   
      try {
        const where = [
          ['user_ticket.user_id'], 
          [parseInt(request.query.user_id)]
        ]

        console.log(request.query)
        const query = await Crud.Index<ITicket>(
          request.query, 
          'ticket', 
          ['ticket.id', 'opening_date', 'closing_date', 'status', 'description', 'theme'], 
          [['user_ticket', 'ticket']], 
          [['ticket_id', 'id']], 
          where
        )
        response.json(query)
      } catch (err) {
        next(err)
      }
    } else {
      next(new Error('Authentication failed'))
    } 
  }
)

router.get<{ id: number }, ITicket, {}, {'id': string; page?: number; limit?: number; }>('/:id',
  async (request, response, next) => {

    const authVerified = await authentication(request)

    if(authVerified) {   
      try {
        const where = [
          ['id'], 
          [parseInt(request.query.id)]
        ]

        const query = await Crud.Read<ITicket>('ticket', 'id', request.params.id, ['id', 'opening_date', 'closing_date', 'status', 'description', 'theme'])
        response.json(query)
      } catch (err) {
        next(err)
      }
    } else {
      next(new Error('Authentication failed'))
    } 
  }
)

router.post<{}, ICreateResponse, ITicketCreateAll, {}>('/',
  async (request, response, next) => {
    const authVerified = await authentication(request)

    if(authVerified) {   
      try { 
        const ticketBody = {
          theme: request.body.theme,
          status: 0,
          opening_date: new Date()
        }

        const query = await Crud.Create<ITicketCreate>(ticketBody, 'ticket')

        const mesageBody = {
          text: request.body.theme,
          date: ticketBody.opening_date,
          ticket_id: query.id
        }

        const userBody = {
          user_id: request.body.user_id,
          ticket_id: query.id
        }
        
        await Crud.Create<IMessageCreate>(mesageBody, 'message')
        await Crud.Create<IUserTicketCreate>(userBody, 'user_ticket')
        response.json(query)
      } catch (err) {
        next(err)
      }
    } else {
      next(new Error('Authentication failed'))
    } 

  }
)

export const TICKET_ROUTES = router