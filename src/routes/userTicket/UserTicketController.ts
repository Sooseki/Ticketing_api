import { Router } from "express"
import {  ICreateResponse } from "~/types/api/ICreateResponse"
import { Crud } from "../../classes/Crud"
import { authentication } from "../../auth/authentication"
import { IUserTicketCreate, IUserTicketUpdate } from "../../types/tables/userTicket/IUserTicket"
import { IUpdateResponse } from "~/types/api/IUpdateResponse"

const router = Router()

router.post<{}, ICreateResponse, IUserTicketCreate, {}>('/:id',
  async (request, response, next) => {
    const authVerified = await authentication(request)

    if(authVerified) {   
      try {

        const query = await Crud.Create<IUserTicketCreate>(request.body, 'user_ticket')
        await Crud.Update<{}>({'status': 1}, 'ticket', 'id', request.body.ticket_id)
        response.json(query)
    
      } catch (err) {
        next(err)
      }
    } else {
      next(new Error('Authentication failed'))
    } 

  }
)

router.put<{id: number}, IUpdateResponse, IUserTicketUpdate, {}>('/close/:id',
  async (request, response, next) => {

    try {
      console.log(request.headers)
      await authentication(request) 

      try {
        const query = await Crud.Update<{}>({'status': 2}, 'ticket', 'id', request.params.id)
        response.json(query)
    
      } catch (err) {
        next(err)
      }
    } catch (err) {
      next(new Error('Authentication failed'))
    }
  }
)

export const USER_TICKET_ROUTES = router