import { Router } from "express"
import { ICreateJWTResponse, ICreateResponse } from "~/types/api/ICreateResponse"
import { Crud } from "../../classes/Crud"
import { IUser, IUserCreate } from "../../types/tables/user/IUser"
import { IIndexQuery, IIndexResponse } from "~/types/api/IIndexQuery"
import { authentication } from "../../auth/authentication"

const router = Router()

// router.get<{}, IIndexResponse<IUser>, {}, IIndexQuery>('/',
//   async (request, response, next) => {

//     const authVerified = await authentication(request)

//     if(authVerified) {   
//       try {
//         const query = await Crud.Index<IUser>(request.query, 'user', ['id', 'first_name', 'last_name', 'email'])
//         response.json(query)
//       } catch (err) {
//         next(err)
//       }
//     } else {
//       next(new Error('Authentication failed'))
//     } 
//   }
// )

// router.get<{ id: number }, IUser, {}, {}>('/:id',
//   async (request, response, next) => {
    
//     const authVerified = await authentication(request)

//     if(authVerified) {   
//       try {
//         const query = await Crud.Read<IUser>('user', 'id', request.params.id, ['id', 'first_name', 'last_name', 'email'])
//         response.json(query)
//       } catch (err) {
//         next(err)
//       }
//     } else {
//       next(new Error('Authentication failed'))
//     } 
//   }
// )

router.post<{}, {}, IUserCreate, {}>('/',
  async (request, response, next) => {
    const authVerified = await authentication(request)

    if(authVerified) {   
      try { 
        response.json({})

      } catch (err) {
        next(err)
      }
    } else {
      next(new Error('Authentication failed'))
    } 

  }
)

export const MESSAGE_ROUTES = router