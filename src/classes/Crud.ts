import { OkPacket, RowDataPacket } from 'mysql2'
import { ICreateResponse } from '../types/api/ICreateResponse'
import { IIndexQuery, IIndexResponse, IReadWhere } from '../types/api/IIndexQuery'
import { ITableCount } from '../types/api/ITableCount'
import { IUpdateResponse } from '../types/api/IUpdateResponse'
import { DbTable } from '../types/tables/tables'
import { DB } from './DB'
import { ApiError } from './Errors/ApiError'
import { ErrorCode } from './Errors/ErrorCode'

/**
 * Crud Operations available in this class
 * 
 */
export class Crud {

  /**
   * Get nth lines of a table, chosing columns to get
   * @param {IIndexQuery} query limit and offset for the query
   * @param {DbTable} table name of the table
   * @param {string[]} columns columns to return
   * @param {string[][]} joinTables tables to join
   * @param {string[][]} joinTablesColumns name of the columns to link for the join
   * @param {IReadWhere} where conditions (where clause)
   * @returns {IIndexResponse}  
   */
  public static async Index<T>(
    query: IIndexQuery, 
    table: DbTable, 
    columns: string[], 
    joinTables: string[][] | null = null,
    joinTablesColumns: string[][] | null = null, 
    where?: IReadWhere,
    order?: string): Promise<IIndexResponse<T>> 
  {

    const db = DB.Connection

    // Page is the nth page of this request consulted by user 
    const page = Math.max(query.page || 0, 0)

    // Make default limit for the query
    const limit = Math.min(query.limit || 0, 50) || 30
    const offset = page * limit

    let whereClause = (where && where.length !== 0 ? `where ` : '')
    let whereParams: Array<number|string> = []
    let allParams: Array<number|string> = []

    if (where && where.length !== 0) {
      for (let n = 0; n < where[0].length; n ++) {
        whereParams.push(where[1][n])
        allParams.push(where[1][n])
        whereClause += where[0][n + 1] ? where[0][n] + ' = ? && ' : where[0][n] + ' = ? '
      }
    }

    allParams.push(limit)
    allParams.push(offset)

    let join = '';
    if (joinTables && joinTablesColumns && joinTables.length == joinTablesColumns.length) {

      for (let i = 0; i < joinTables.length; i++) {
        join += ` INNER JOIN ${joinTables[i][0]} ON ${joinTables[i][0]}.${joinTablesColumns[i][0]} = ${joinTables[i][1]}.${joinTablesColumns[i][1]}`

      }
    }

    let orderClause = (order ? `order by ` + order : '')

    const count = await db.query<ITableCount[] & RowDataPacket[]>(`select count(*) as total from ${table} ${join} ${whereClause} ${orderClause}`, whereParams)

    const sqlBase = `select ${columns.join(',')} from ${table} ${join} ${whereClause} ${orderClause} limit ? offset ?`
   
    const data = await db.query<T[] & RowDataPacket[]>(sqlBase, allParams.filter(e => e !== undefined))
   
    const res: IIndexResponse<T> = {
      page,
      limit,
      total: count[0][0].total,
      rows: data[0]
    }

    return res;
  }

  /**
   * Create a new 
   * @param {IIndexQuery} query limit and offset for the query
   * @param {T} body body sent to insert in the db
   * @param {DbTable} table name of the table
   * @returns {ICreateResponse}  
   */
  public static async Create<T>(body: T, table: DbTable): Promise<ICreateResponse> {
    const db = DB.Connection
    const data = await db.query<OkPacket>(`insert into ${table} set ?`, body)
    return {
      id: data[0].insertId
    }
  }

  public static async Update<T>(body: T, table: DbTable, idName: string, idValue: number): Promise<IUpdateResponse> {
    const db = DB.Connection

    const data = await db.query<OkPacket>(`update ${table} set ? where ${idName} = ?`, [body, idValue])

    return {
      rows: data[0].affectedRows
    }
  }

  public static async Read<T>(
    table: DbTable,
    idName: string,
    idValue: number,
    columns: string[],
    joinTables: string[][] | null = null,
    joinTablesColumns: string[][] | null = null): Promise<T> {
    const db = DB.Connection

    let join = ''
    if (joinTables && joinTablesColumns && joinTables.length == joinTablesColumns.length) {

      for (let i = 0; i < joinTables.length; i++) {
        join += ` INNER JOIN ${joinTables[i][0]} ON ${joinTables[i][0]}.${joinTablesColumns[i][0]} = ${joinTables[i][1]}.${joinTablesColumns[i][1]}`

      }
    }
    
    const data =
      await db.query<
        T[] & RowDataPacket[]
      >(`select ${columns.join(',')} from ${table} ${join} where ${idName} = ?`, [idValue])

    if (data[0].length > 0) {
      return data[0][0]
    } else {
      throw new ApiError(ErrorCode.BadRequest, 'sql/not-found', `Could not read row with ${idName} = ${idValue}`)
    }
  }

  public static async Delete(table: DbTable, idName: string, idValue: number): Promise<IUpdateResponse> {
    const db = DB.Connection
    const data = await db.query<OkPacket>(`delete from ${table} where ${idName} = ?`, [idValue])

    return {
      rows: data[0].affectedRows
    }
  }

}