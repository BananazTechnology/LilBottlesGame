import mysql from 'mysql2'
import * as dotenv from 'dotenv'

dotenv.config()

const port = process.env.DB_PORT ? +process.env.DB_PORT : undefined

export class GameSpecificDb {
  static getConnection (): mysql.Connection|undefined {
    console.debug('Attempting DB Connection')

    try {
      const conn = mysql.createConnection({
        host: process.env.DB_HOST,
        port: port,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME
      })

      conn.on('error', function (err: any) {
        console.error(err)
      })

      return conn
    } catch (e) {
      console.error(e)
      return undefined
    }
  }
}
