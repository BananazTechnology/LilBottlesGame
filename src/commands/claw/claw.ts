import { BaseCommandInteraction, Client } from 'discord.js'
import { User } from '../../classes/user'
import { GameResult } from 'src/classes/gameResult'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import * as dotenv from 'dotenv'
import path from 'path'

export class Claw extends Command {
  name = 'claw'
  description = 'Try your chances at the Little Bottles Claw Machine!'
  type = 'CHAT_INPUT'

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    try {
      dotenv.config({ path: path.resolve('./config.env') })
      const dropScale = Number(process.env.DROPSCALE);
      const randNum = Math.floor(Math.random() * dropScale)
      let content = 'winner'
      console.log(`Random Number: ${randNum}`)

      if(randNum == (dropScale-1)) { 
        content = 'winner';
      } else {
        content = 'loser';
      }
      await interaction.deferReply({ ephemeral: true })

      await interaction.followUp({
        content
      })

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Help Command Completed Successfully'))
      })
    } catch {
      return new Promise((resolve, reject) => {
        reject(new LogResult(false, LogStatus.Error, 'General Help Command Error'))
      })
    }
  }
}
