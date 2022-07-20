import { Router } from "express"
import { ICreateJWTResponse, ICreateResponse } from "~/types/api/ICreateResponse"
import { Crud } from "../../classes/Crud"
import { IUser, IUserCreate } from "../../types/tables/user/IUser"
import { IIndexQuery, IIndexResponse } from "~/types/api/IIndexQuery"
import { authentication } from "../../auth/authentication"
import { createAuthentication } from "../../auth/createAuthentication"
import bcrypt from 'bcrypt'

const router = Router()

router.get<{}, IIndexResponse<IUser>, {}, IIndexQuery>('/',
  async (request, response, next) => {

    const authVerified = await authentication(request)

    if(authVerified) {   
      try {
        const query = await Crud.Index<IUser>(request.query, 'user', ['id', 'first_name', 'last_name', 'email'])
        response.json(query)
      } catch (err) {
        next(err)
      }
    } else {
      next(new Error('Authentication failed'))
    } 
  }
)

router.get<{ id: number }, IUser, {}, {}>('/:id',
  async (request, response, next) => {
    
    const authVerified = await authentication(request)

    if(authVerified) {   
      try {
        const query = await Crud.Read<IUser>('user', 'id', request.params.id, ['id', 'first_name', 'last_name', 'email'])
        response.json(query)
      } catch (err) {
        next(err)
      }
    } else {
      next(new Error('Authentication failed'))
    } 
  }
)

router.post<{}, ICreateJWTResponse, IUserCreate, {}>('/register',
  async (request, response, next) => {
    try {
      const where: Array<string|number>[] = [['email'], [request.body.email]]
      const checkIfExists = await Crud.Index<IUser>({page: 0, limit: 1}, 'user', ['id'], null, null, where)

      if(checkIfExists.rows.length === 0) {
        try {

          const password = bcrypt.hashSync(request.body.password, 10)

          console.log(password)

          if(password == null) {
            next(new Error('An error occured'))
            return
          }

          const body = {
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            email: request.body.email,
            password: password,
            role: 0
          }

          const query = await Crud.Create<IUserCreate>(body, 'user')
          const token = await createAuthentication(query.id)
          response.json({ 
            'token': token, 
            'id': query.id,
            'first_name': request.body.first_name,
            'last_name': request.body.last_name,
            'role': 0
          })
        } catch (err) {
          next(err)
        }
      } else {
        next(new Error('This email is already in use'))
      }
    } catch (err) {
      next(err)
    }

  }
)

router.post<{}, ICreateJWTResponse, IUserCreate, {}>('/login',
  async (request, response, next) => {
    try {
      const where: Array<string|number>[] = [
        ['email'], 
        [request.body.email]
      ]
      const query = await Crud.Index<IUser>({page: 0, limit: 1}, 'user', ['id', 'first_name', 'last_name', 'role', 'password'], null, null, where)

      if (!bcrypt.compare(request.body.password, query.rows[0].password)) {
        next('Authentication error. Email or Password is invalid')
        return;
      }

      const token = await createAuthentication(query.rows[0].id)
      response.json({ 
        'token': token, 
        'id': query.rows[0].id, 
        'first_name': query.rows[0].first_name, 
        'last_name': query.rows[0].last_name, 
        'role': query.rows[0].role, 
      })
    } catch (err) {
      next(err)
    }

  }
)

export const USER_ROUTES = router