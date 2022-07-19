export interface ITicket {
  'id': number;
  'opening_date': Date;
  'closing_date': Date;
  'status': number;
  'description': string;
  'theme': string;
}

export interface ITicketCreateAll {
  'opening_date': Date;
  'status': number;
  'theme': string;
  'user_id': number;
}

export type ITicketCreate = Omit<ITicket, 'id'|'closing_date'|'description'>;

export interface ITicketIndexQuery {
  page?: number;
  limit?: number; 
  user_id?: string; 
  status?: string;
}