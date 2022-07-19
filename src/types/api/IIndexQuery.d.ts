export interface IIndexQuery {
  page?: number;
  limit?: number; 
}

export type IReadWhere = Array<string|number>[];

export interface IIndexResponse<T> {
  page: number;
  limit: number;
  total: number;
  rows: T[];
}