export interface IIndexQuery {
  page?: number;
  limit?: number; 
}

export type IReadWhere = (string[] | number[])[];

export interface IIndexResponse<T> {
  page: number;
  limit: number;
  total: number;
  rows: T[];
}