export interface ICreateResponse {
  id: number;
}

export interface ICreateJWTResponse {
  id: number;
  token: string;
  first_name: string;
  last_name:string;
  role: number;
}
