export interface IUserTicket {
  'id': number;
  'user_id': number;
  'ticket_id': number;
}

export type IUserTicketCreate = Omit<IUserTicket, 'id'>
export type IUserTicketUpdate = Omit<IUserTicket, 'id'|'user_id'>