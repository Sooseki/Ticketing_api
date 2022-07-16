import { Router } from "express"
import { ICreateResponse } from "~/types/api/ICreateResponse"
import { Crud } from "../../classes/Crud"
import { IUser, IUserCreate } from "../../types/tables/user/IUser"
import { IIndexQuery, IIndexResponse } from "~/types/api/IIndexQuery"

const router = Router()

router.get<{}, IIndexResponse<IUser>, {}, IIndexQuery>('/',
  async (request, response, next) => {
    try {
      const query = await Crud.Index<IUser>(request.query, 'user', ['id', 'first_name', 'last_name', 'email'])
      response.json(query)
    } catch (err) {
      next(err)
    }
  }
)

router.get<{ id: number }, IUser, {}, {}>('/:id',
  async (request, response, next) => {
    try {
      const query = await Crud.Read<IUser>('user', 'id', request.params.id, ['id', 'first_name', 'last_name', 'email'])
      response.json(query)
    } catch (err) {
      next(err)
    }
  }
)

router.post<{}, ICreateResponse|IIndexResponse<IUser>, IUserCreate, {}>('/',
  async (request, response, next) => {
    try {
      const where = {'email': request.body.email}
      const checkIfExists = await Crud.Index<IUser>({page: 0, limit: 1}, 'user', ['id'], null, null, where)

      if(checkIfExists.rows.length === 0) {
        try {
          const query = await Crud.Create<IUserCreate>(request.body, 'user')
          response.json(query)
        } catch (err) {
          next(err)
        }
      } else {
        response.json(checkIfExists)
      }
    } catch (err) {
      next(err)
    }

  }
)

export const USER_ROUTES = router