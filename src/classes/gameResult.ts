import { RowDataPacket } from 'mysql2'
import { dbQuery } from '../database/db'

export class GameResult {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private id: number;
  private result: boolean;
  private description: string;
  private image?: string;

  // constructor is private. User object sould be created by one of the get or create commands
  private constructor (id: number, result: boolean, description: string, image: string|undefined) {
    this.id = id
    this.result = result
    this.description = description
    this.image = image
  }

  getId () {
    return this.id
  }

  getResult () {
    return this.result
  }

  getDescription () {
    return this.description
  }

  getImage () {
    return this.image
  }

  static async getGameResult (win: boolean): Promise<GameResult|undefined> {
    const queryString = `
      SELECT c.id, c.result, c.description, c.image
      FROM clawMachineOutput AS c
      WHERE c.result = ${win}
      ORDER BY RAND()
      LIMIT 1`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const row = (<RowDataPacket> result)[0]
        if (row) {
          const gameResult: GameResult = new GameResult(row.id, row.result, row.description, row.image)
          resolve(gameResult)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  static async getCount (): Promise<Number> {
    const queryString = `
      SELECT COUNT(*) as count
      FROM clawMachineOutput AS c
      WHERE c.result = 1`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const row = (<RowDataPacket> result)[0]
        if (row) {
          resolve(row.count)
        } else {
          resolve(0)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }
}
