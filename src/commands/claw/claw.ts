import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { User } from '../../classes/user'
import { GameState } from '../../classes/gameState'
import { GameResult } from '../../classes/gameResult'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./config.env') })

export class Claw extends Command {
  name = 'claw'
  description = 'Try your chances at the Little Bottles Claw Machine!'
  type = 'CHAT_INPUT'
  cooldown = 2

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    await interaction.deferReply()

    const gameState = await GameState.getGameState()
    if (gameState.getCurrentWinners() >= gameState.getTotalWinners()) {
      await interaction.followUp({
        content: 'The game has completed. Thanks for playing!'
      })
      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Warn, 'Game has ended response sent successfully'))
      })
    } else if (!await user.checkRole(984278979257184286n, interaction)) {
      await interaction.followUp({
        content: 'You don\'t have permission the play the game'
      })
      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Warn, 'User had insignifficant permissions'))
      })
    } else if (gameState.getActive() === true) {
      try {
        const dropScale = Number(process.env.DROPSCALE)
        const randNum = Math.floor(Math.random() * dropScale)
        let result

        // win
        if (randNum === (dropScale - 1)) {
          result = await GameResult.getGameResult(true)
          console.log(result.getResult())
          User.createWinner(user)
        } else { // lose
          result = await GameResult.getGameResult(false)
          console.log(result.getResult())
        }
        const embed = new MessageEmbed()
          .setColor('#FFA500')
          .setImage(result.getImage())
          .setTitle(result.getResult() === 1 ? ':thumbsup:' : ':thumbsdown:')
          .setDescription(result.getDescription())

        console.log(JSON.stringify(result))

        await interaction.followUp({
          embeds: [embed]
        })

        return new Promise((resolve, reject) => {
          resolve(new LogResult(true, LogStatus.Success, 'Claw Command Completed Successfully'))
        })
      } catch (e) {
        console.log(e)
        return new Promise((resolve, reject) => {
          reject(new LogResult(false, LogStatus.Error, 'Claw Command Error'))
        })
      }
    } else {
      await interaction.followUp({
        content: 'Looks like the game is paused, check back shortly!'
      })
      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Warn, 'Game is paused response sent successfully'))
      })
    }
  }
}
