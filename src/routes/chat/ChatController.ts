import { authentication } from "../../auth/authentication"
import express from 'express'
import WebSocket from 'ws'
import { Crud } from "../../classes/Crud"
import { IMessageCreate } from "../../types/tables/message/IMessage"

var expressWs = require('express-ws');
var expressWss = expressWs(express());
var router = expressWss.app;

const clients: any = new Set()

router.ws('/',
  async (ws: any, request: any, next: any) => {
    // const authVerified = await authentication(request)
    const authVerified = true
    
    if(authVerified) {  

      try {
        // clients.add(ws)
        // console.log(clients.size)
        
        ws.on('message', async (msg: any) => {

          msg = JSON.parse(msg)
          const message: IMessageCreate = {
            'text': msg.message,
            'ticket_id': msg.ticket_id,
            'date': new Date(),
            'user_id': msg.user_id
          }

          await Crud.Create<IMessageCreate>(message, 'message')

          // WS part does not word for now
          // --------------------------------------------------------------
          clients.forEach((client: any) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              // client.send(msg);
            }
            // console.log('client : ' + client)
            // console.log('msg : ' + msg)
          })
          // --------------------------------------------------------------

          // Array.from(
          //   clients
          // ).filter((sock: any)=>{
          //   return sock.route == '/' + request.params.ticket /* <- Your path */
          // }).forEach(function (client: any) {
          //   client.send(msg.data);
          //   console.log(client)
          // });

        })
      } catch (err) {
        return err
      }
    } 

  }
)

export const CHAT_ROUTES = router