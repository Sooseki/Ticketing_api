import { Router } from "express"
import { ICreateResponse } from "~/types/api/ICreateResponse"
import { Crud } from "../../classes/Crud"
import { IIndexResponse, IReadWhere } from "~/types/api/IIndexQuery"
import { authentication } from "../../auth/authentication"
import { ITicket, ITicketCreate, ITicketCreateAll, ITicketIndexQuery } from "../../types/tables/ticket/ITicket"
import { IMessage, IMessageCreate } from "~/types/tables/message/IMessage"
import { IUserTicket, IUserTicketCreate } from "~/types/tables/userTicket/IUserTicket"
import { IUpdateResponse } from "~/types/api/IUpdateResponse"

const router = Router()

router.get<{}, IIndexResponse<ITicket>, {}, ITicketIndexQuery>('/waiting',
  async (request, response, next) => {

    const authVerified = await authentication(request)

    if(authVerified) {   
      try {
       
        const whereCols: Array<string|number> = []
        const whereValues: Array<string|number> = []
        const where: IReadWhere = []

        if (request.query.status) {
          whereCols.push('status')
          whereValues.push(parseInt(request.query.status))
        }

        if (whereCols.length !== 0 && whereValues.length !== 0) {
          where.push(whereCols, whereValues)
        }

        const query = await Crud.Index<ITicket>(
          request.query, 
          'ticket', 
          ['id', 'opening_date', 'closing_date', 'status', 'description', 'theme'], 
          [], 
          [], 
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

router.get<{}, IIndexResponse<ITicket>, {}, ITicketIndexQuery>('/active',
  async (request, response, next) => {

    const authVerified = await authentication(request)

    if(authVerified) {   
      try {

        const whereCols: Array<string|number> = []
        const whereValues: Array<string|number> = []
        const where: IReadWhere = []

        if (request.query.status) {
          whereCols.push('status')
          whereValues.push(parseInt(request.query.status))
        }

        const joinTables = []
        const joinColumns = []

        if (request.query.user_id) {
          whereCols.push('user_ticket.user_id')
          whereValues.push(parseInt(request.query.user_id))
          joinTables.push(['user_ticket', 'ticket'])
          joinColumns.push(['ticket_id', 'id'])
        }

        if (whereCols.length !== 0 && whereValues.length !== 0) {
          where.push(whereCols, whereValues)
        }

        const query = await Crud.Index<ITicket>(
          request.query, 
          'ticket', 
          ['ticket.id', 'opening_date', 'closing_date', 'status', 'description', 'theme'], 
          joinTables, 
          joinColumns, 
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
          ticket_id: query.id,
          user_id: request.body.user_id
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

router.put<{}, IUpdateResponse, number[], {}>('/merge',
  async (request, response, next) => {
    const authVerified = await authentication(request)

    if(authVerified) {   
      try { 
        const firstTicketId: number = (request.body[0] < request.body[1]) ? request.body[0] : request.body[1]
        const secondTicketId: number = (request.body[0] < request.body[1]) ? request.body[1] : request.body[0]

        const query = await Crud.Update<{ticket_id: number}>({ticket_id: firstTicketId}, 'message', 'ticket_id', secondTicketId)
        await Crud.Delete('ticket', 'id', secondTicketId)

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