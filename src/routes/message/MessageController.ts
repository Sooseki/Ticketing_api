import { Router } from "express"
import { Crud } from "../../classes/Crud"
import { IIndexQuery, IIndexResponse, IReadWhere } from "~/types/api/IIndexQuery"
import { authentication } from "../../auth/authentication"
import { IMessage } from "~/types/tables/message/IMessage"

const router = Router()

router.get<{id: number}, IIndexResponse<IMessage>, {}, IIndexQuery>('/all/:id',
  async (request, response, next) => {

    const authVerified = await authentication(request)

    if(authVerified) {   
      try {
        const whereCols: Array<string|number> = ['message.ticket_id']
        const whereValues: Array<string|number> = [request.params.id]
        const where: IReadWhere = [whereCols, whereValues]

        const joinTables: string[][] = [
          ['ticket', 'message'], ['user_ticket', 'ticket'], ['user', 'message']
        ];
        const joinColumns: string[][] = [
          ['id', 'ticket_id'], ['ticket_id', 'id'], ['id', 'user_id']
        ];

        const order = 'message.id';
        
        const query = await Crud.Index<IMessage>(request.query, 'message', ['message.id', 'text', 'date', 'message.ticket_id', 'first_name', 'role'], joinTables, joinColumns, where, order)
        response.json(query)
      } catch (err) {
        next(err)
      }
    } else {
      next(new Error('Authentication failed'))
    } 
  }
)

export const MESSAGE_ROUTES = router