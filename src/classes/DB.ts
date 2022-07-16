import mysql, { Pool } from 'mysql2/promise';

/** Wrapper de la connexion à la SGBDR.
 * On stock une seule référence à la connexion-pool, et on va systematiquement
 * récupérer cette référence pour nos requêtes.
 */
export class DB {

  // Variable "static": une seule instance pour toutes les instances de la classe DB
  private static POOL: Pool;

  /**
   * Récupérer ou créer la connexion-pool.
   */
  static get Connection(): Pool {
    if (!this.POOL) {
      this.POOL = mysql.createPool({
        host: process.env.DB_HOST || 'dbms',
        user: process.env.DB_USER || 'root',
        database: process.env.DB_DATABASE || 'ticket_app',
        password: process.env.DB_PASSWORD || 'root',  
      });
    }

    return this.POOL;
  }

}