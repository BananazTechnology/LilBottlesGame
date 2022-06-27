import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { User } from '../../classes/user'
import { GameState } from '../../classes/gameState'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'

export class Pause extends Command {
  name = 'pause'
  description = 'Unplug the Claw Machine for a little bit'
  type = 'CHAT_INPUT'
  requiredRole = 964999297923960846n;

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    const gameState = await GameState.getGameState()
    if (gameState && gameState.getActive() === true) {
      try {
        await interaction.deferReply()
        GameState.pauseGame()
        const embed = new MessageEmbed()
          .setColor('#FFA500')
          .setTitle('Claw Game Unplugged')

        await interaction.followUp({
          embeds: [embed]
        })

        return new Promise((resolve, reject) => {
          resolve(new LogResult(true, LogStatus.Success, 'Pause Command Completed Successfully'))
        })
      } catch (e) {
        console.log(e)
        return new Promise((resolve, reject) => {
          reject(new LogResult(false, LogStatus.Error, 'Pause Command Error'))
        })
      }
    } else {
      await interaction.reply({
        content: 'The claw machine is already off!'
      })
      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Game is already paused response sent successfully'))
      })
    }
  }
}
