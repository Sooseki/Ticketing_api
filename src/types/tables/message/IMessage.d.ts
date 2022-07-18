export interface IMessage {
  'id': number;
  'text': string;
  'date': Date;
  'ticket_id': number;
}

export type IMessageCreate = Omit<IMessage, 'id'>;
