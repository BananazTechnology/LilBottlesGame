import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { User } from '../../classes/user'
import { GameState } from '../../classes/gameState'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import * as dotenv from 'dotenv'
import path from 'path'

export class GameInfo extends Command {
  name = 'gameinfo'
  description = 'Check in on the Claw Machine'
  type = 'CHAT_INPUT'

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    const gameState = await GameState.getGameState()
    try {
      await interaction.deferReply()
      dotenv.config({ path: path.resolve('./config.env') })
      const dropScale = Number(process.env.DROPSCALE)
      const embed = new MessageEmbed()
        .setColor('#FFA500')
        .setTitle('Claw Game Info')
        .addField('Active:', `${gameState.getActive() === true ? 'True' : 'False'}`, false)
        .addField('Current Winners:', `${gameState.getCurrentWinners()}`, false)
        .addField('Total Winners:', `${gameState.getTotalWinners()}`, false)
        .addField('Win %:', `${((1 / dropScale) * 100).toFixed(0)}%`, false)
      await interaction.followUp({
        embeds: [embed]
      })

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Game Info Command Completed Successfully'))
      })
    } catch (e) {
      console.log(e)
      return new Promise((resolve, reject) => {
        reject(new LogResult(false, LogStatus.Error, 'Game Info Command Error'))
      })
    }
  }
}
