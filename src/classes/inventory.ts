import { RowDataPacket } from 'mysql2'
import { resolve } from 'path';
import { dbQuery } from '../database/db'
import { GameResult } from './gameResult';
import { User } from './user';

export class InventoryItem {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private id: number;
  private userID: number;
  private itemID: number;
  private emote: string;

  // constructor is private. User object sould be created by one of the get or create commands
  private constructor (id: number, userID: number, itemID: number, emote: string) {
    this.id = id;
    this.userID = userID;
    this.itemID = itemID;
    this.emote = emote;
  }

  getId () {
    return this.id;
  }

  getUserID () {
    return this.userID;
  }

  getItemID () {
    return this.itemID;
  }

  getEmote() {
    return this.emote;
  }

  static async getInventory (userID: number): Promise<InventoryItem[]|undefined> {
    const queryString = `
    SELECT * FROM inventory i
        JOIN clawMachineOutput cm on i.itemId = cm.id
        WHERE i.userID = ${userID}`
    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const row = (<RowDataPacket> result)
        let fullInventory : InventoryItem[]= [];
        for(var i = 0; i < row.length ; i++) {
          const item: InventoryItem = new InventoryItem(row[i].id, row[i].userID, row[i].itemID, row[i].emote)
          if(fullInventory.filter(e => e.getItemID() === item.getItemID()).length == 0)
          fullInventory.push(item);
        } 
        if(fullInventory) {
            fullInventory = fullInventory.sort((obj1, obj2) => {
                if (obj1.itemID > obj2.itemID) {
                    return 1;
                }
            
                if (obj1.itemID < obj2.itemID) {
                    return -1;
                }
            
                return 0;
            });
            resolve(fullInventory)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  static async checkWinner (user: User): Promise<boolean> {

    let queryString = `
    SELECT * FROM winners as w WHERE w.userID = ${user.getId()}`
    let result = await dbQuery(queryString)
    // if(!(<RowDataPacket> result)[0]) {
    //     console.log('aint won before');
        queryString = `
        SELECT * FROM inventory i
            JOIN clawMachineOutput cm on i.itemId = cm.id
            WHERE i.userID = ${user.getId()}`
        result = await dbQuery(queryString)

        return new Promise(async (resolve, reject) => {
        try {
            const row = (<RowDataPacket> result)
            let fullInventory : InventoryItem[]= [];
            for(var i = 0; i < row.length ; i++) {
            const item: InventoryItem = new InventoryItem(row[i].id, row[i].userID, row[i].itemID, row[i].emote)
            if(fullInventory.filter(e => e.getItemID() === item.getItemID()).length == 0)
            fullInventory.push(item);
            } 
            const count = await GameResult.getCount();
            console.log(`${fullInventory.length} out of ${count}`);
            if(fullInventory.length == count) {
                resolve(true)
            } else {
            resolve(false)
            }
        } catch {
            reject(new Error('DB Connection OR Query Issue'))
        }
        })
    } 
    // else {
    // console.log('already won');
    // return new Promise(async (resolve, reject) => {
    //     resolve(false)
    // })
    // }
  //}

  static async insertInventory (userID: number, itemID: number): Promise<InventoryItem|undefined> {
    const queryString = `
      INSERT INTO inventory
      (userID,itemID)
      VALUES(${userID}, ${itemID})`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const row = (<RowDataPacket> result)
        const item: InventoryItem = new InventoryItem(row.id, row.userID, row.itemID, '')
        if(item) {
          resolve(item)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }


  static async clearInventory (userID: number): Promise<Boolean> {
    const queryString = `
      DELETE FROM inventory WHERE userID = ${userID}`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const row = (<RowDataPacket> result)
        if(row) {
          resolve(true)
        } else {
          resolve(false)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }
}
