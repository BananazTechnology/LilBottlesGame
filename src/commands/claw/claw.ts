import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { User } from '../../classes/user'
import { GameState } from '../../classes/gameState'
import { GameResult } from '../../classes/gameResult'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import * as dotenv from 'dotenv'
import path from 'path'
import { InventoryItem } from '../../classes/inventory'

dotenv.config({ path: path.resolve('./config.env') })

export class Claw extends Command {
  name = 'claw'
  description = 'Try your chances at the Little Bottles Claw Machine!'
  type = 'CHAT_INPUT'
  cooldown = 1
  requiredRole = 964999297923960843n;
  //requiredRole = 984278979257184286n; //dev;

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    await interaction.deferReply()

    const gameState = await GameState.getGameState()
    let secondEmbed = false;

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
        const dropScale = 10;//Number(process.env.DROPSCALE)
        const randNum = Math.floor(Math.random() * dropScale)
        let result

        // win
        if (randNum < 8) {
          result = await GameResult.getGameResult(true)
          if (result) {
            console.log(result.getResult())
            InventoryItem.insertInventory(user.getId(),result.getId())
            if(await InventoryItem.checkWinner(user) == true){
              User.createWinner(user)
              console.log(JSON.stringify(user))
              await InventoryItem.clearInventory(user.getId())
              secondEmbed = true;
            }
          } else {
          }
        } 
        // lose
        else {
          result = await GameResult.getGameResult(false)
          if (result) {
            console.log(result.getResult())
          } else {
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
          embed.setTitle(Boolean(title) === true ? 'CONGRATS!' : 'SORRY! COME BACK SOON!');
          embed.setThumbnail(Boolean(title) === true ? `https://raw.githubusercontent.com/BananazTechnology/client-assets/main/lilBottles/claw_thumbnail_branded.png` : `https://raw.githubusercontent.com/BananazTechnology/client-assets/main/lilBottles/claw_thumbnail_branded_loss.png`);

          console.log(JSON.stringify(result))

          if(secondEmbed){
           const embed2 = new MessageEmbed()
           .setColor('#FFA500')
           .setTitle('CONGRATS YOU HAVE EARNED YOUR SPOT ON THE ALLOWLIST')
           .setDescription('YOUR PROGRESS HAS BEEN RESET SO YOU CAN GO AGAIN!');
            await interaction.followUp({
              embeds: [embed,embed2]
            })
          } else {
            await interaction.followUp({
              embeds: [embed]
            })
          }
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
