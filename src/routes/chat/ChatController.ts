import { authentication } from "../../auth/authentication"
import express from 'express'
import expressWs from 'express-ws'
import { Crud } from "~/classes/Crud"
import { IMessage, IMessageCreate } from "~/types/tables/message/IMessage"
import { json } from "stream/consumers"

const router = expressWs(express()).app
const aWss = expressWs(express()).getWss()

router.ws('/:id',
  async (ws, request, next) => {
    // const authVerified = await authentication(request)
    const authVerified = true
    
    if(authVerified) {  

      try {
        ws.on('message', async (msg: any) => {
          // console.log('aWss : ', aWss)
          // console.log('clients : ', aWss.clients)

          msg = JSON.parse(msg)
          const message: IMessageCreate = {
            'text': msg.message,
            'ticket_id': msg.ticket_id,
            'date': new Date()
          }

          await Crud.Create<IMessageCreate>(message, 'message')

          // WS part does not word for now
          // --------------------------------------------------------------
          aWss.clients.forEach((client) => {
            console.log('client : ' + client)
            console.log('msg : ' + msg)
            client.send(msg)
          })
          // --------------------------------------------------------------

        })
      } catch (err) {
        return err
      }
    } 

  }
)

export const CHAT_ROUTES = router