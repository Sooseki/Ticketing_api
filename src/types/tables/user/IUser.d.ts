export interface IUser {
  'id': number;
  'last_name': string;
  'first_name': string;
  'email': string;
  'password': string;
}

export type IUserCreate = Omit<IUser, 'id'>;