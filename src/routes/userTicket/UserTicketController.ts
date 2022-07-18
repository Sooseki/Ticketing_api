import { Router } from "express"
import {  ICreateResponse } from "~/types/api/ICreateResponse"
import { Crud } from "../../classes/Crud"
import { authentication } from "../../auth/authentication"
import { IUserTicketCreate } from "../../types/tables/userTicket/IUserTicket"

const router = Router()

router.post<{}, ICreateResponse, IUserTicketCreate, {}>('/:id',
  async (request, response, next) => {
    const authVerified = await authentication(request)

    if(authVerified) {   
      try {

        const query = await Crud.Create<IUserTicketCreate>(request.body, 'user_ticket')
        const updateTicket = await Crud.Update<{}>({'status': 1}, 'ticket', 'id', request.body.ticket_id)
        response.json(query)
    
      } catch (err) {
        next(err)
      }
    } else {
      next(new Error('Authentication failed'))
    } 

  }
)

export const USER_TICKET_ROUTES = router