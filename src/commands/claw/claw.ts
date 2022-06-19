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
  requiredRole = 984278979257184286n;

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    await interaction.deferReply()

    const gameState = await GameState.getGameState()

    if (!gameState || !user) {
      await interaction.followUp({
        content: 'The dang thingermajig no worky work. We must INVESTIGATE!'
      })
      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Error, 'User or game state not loded correctly'))
      })
    }

    if (gameState.getCurrentWinners() >= gameState.getTotalWinners()) {
      await interaction.followUp({
        content: 'The game has completed. Thanks for playing!'
      })
      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Warn, 'Game has ended response sent successfully'))
      })
    } else if (gameState.getActive() === true) {
      try {
        const dropScale = Number(process.env.DROPSCALE)
        const randNum = Math.floor(Math.random() * dropScale)
        let result

        // win
        if (randNum === (dropScale - 1)) {
          result = await GameResult.getGameResult(true)
          if (result) {
            console.log(result.getResult())
            User.createWinner(user)
          } else {
            console.log('Result (true) was null')
          }
        } else { // lose
          result = await GameResult.getGameResult(false)
          if (result) {
            console.log(result.getResult())
          } else {
            console.log('Result (false) was null')
          }
        }

        if (result) {
          const embed = new MessageEmbed()
            .setColor('#FFA500')
            .setDescription(result.getDescription())

          const image = result.getImage()
          if (image) {
            embed.setImage(image)
          }

          const title = result.getResult()
          if (title) {
            embed.setTitle(title === true ? ':thumbsup:' : ':thumbsdown:')
          }

          console.log(JSON.stringify(result))

          await interaction.followUp({
            embeds: [embed]
          })

          return new Promise((resolve, reject) => {
            resolve(new LogResult(true, LogStatus.Success, 'Claw Command Completed Successfully'))
          })
        } else {
          await interaction.followUp({
            content: 'Well thats not supposed to happen. Try again and well look into this issue!'
          })
          return new Promise((resolve, reject) => {
            resolve(new LogResult(true, LogStatus.Error, 'result not loded correctly'))
          })
        }
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
