
import { RowDataPacket } from 'mysql2';
import { GameSpecificDb } from '../database/db'

export class GameState {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private id: number;
  private totalWinners: number;
  private currentWinners: number;
  private active: boolean;

  // constructor is private. User object sould be created by one of the get or create commands
  private constructor (id: number, totalWinners: number, currentWinners: number, active: boolean) {
    this.id = id
    this.totalWinners = totalWinners
    this.currentWinners = currentWinners
    this.active = active
  }

  getId () {
    return this.id
  }

  getActive () {
    return this.active
  }

  getCurrentWinners () {
    return this.currentWinners
  }

  getTotalWinners () {
    return this.totalWinners
  }

  static async getGameState (): Promise<GameState> {
    const db = new GameSpecificDb()
    const queryString = `
      SELECT * FROM gameState 
      WHERE id = 1;`
    const result = await db.query(queryString)
    return new Promise((resolve, reject) => {
        try {
          const row = (<RowDataPacket[]> result)
          if (row) {
            const gameState: GameState = new GameState(row[0].id, row[0].totalWinners, row[0].currentWinners, row[0].active)
            resolve(gameState)
          } else {
            resolve(undefined)
          }
        } catch {
          reject(new Error('DB Connection OR Query Issue'))
        }
      })
  }

  static async pauseGame (): Promise<Boolean> {
    try {
    const db = new GameSpecificDb()
    const queryString = `
      UPDATE gameState
      SET active = false 
      WHERE id = 1;`
    await db.query(queryString)
    return new Promise((resolve, reject) => {
        resolve(true);
      })
    } catch {
        return new Promise((resolve, reject) => {
            resolve(false);
        })
    }
  }

  static async resumeGame (): Promise<Boolean> {
    try {
    const db = new GameSpecificDb()
    const queryString = `
      UPDATE gameState
      SET active = true 
      WHERE id = 1;`
    await db.query(queryString)
    return new Promise((resolve, reject) => {
        resolve(true);
      })
    } catch {
        return new Promise((resolve, reject) => {
            resolve(false);
        })
    }
  }
}
