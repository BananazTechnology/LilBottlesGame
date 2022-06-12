import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { User } from '../../classes/user'
import { GameState } from '../../classes/gameState'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'

export class Resume extends Command {
  name = 'resume'
  description = 'Plug the Claw Machine in and get the game going!'
  type = 'CHAT_INPUT'

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    const gameState = await GameState.getGameState()
    if (gameState.getActive() === false) {
      try {
        await interaction.deferReply()
        GameState.resumeGame()
        const embed = new MessageEmbed()
          .setColor('#FFA500')
          .setTitle('Claw Game Resumed')

        await interaction.followUp({
          embeds: [embed]
        })

        return new Promise((resolve, reject) => {
          resolve(new LogResult(true, LogStatus.Success, 'Resume Command Completed Successfully'))
        })
      } catch (e) {
        console.log(e)
        return new Promise((resolve, reject) => {
          reject(new LogResult(false, LogStatus.Error, 'Resume Command Error'))
        })
      }
    } else {
      await interaction.reply({
        content: 'The claw machine is already on!'
      })
      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Game is already active response sent successfully'))
      })
    }
  }
}
