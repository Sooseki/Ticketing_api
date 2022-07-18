export interface IUserTicket {
  'id': number;
  'user_id': number;
  'ticket_id': number;
}

export type IUserTicketCreate = Omit<IUserTicket, 'id'>