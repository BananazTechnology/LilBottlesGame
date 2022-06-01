import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { User } from '../../classes/user'
import { GameResult } from '../../classes/gameResult'
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

      await interaction.deferReply()
        
      dotenv.config({ path: path.resolve('./config.env') })
      const dropScale = Number(process.env.DROPSCALE);
      const randNum = Math.floor(Math.random() * dropScale)
      let result;
      
      //win
      if(randNum == (dropScale-1)) { 
        result = await GameResult.getGameResult(true)
        console.log(result.getResult());

      } 
      //lose
      else {
        result = await GameResult.getGameResult(false)
        console.log(result.getResult());
      }
      const embed = new MessageEmbed()
      .setColor('#FFA500')
      .setImage(result.getImage())
      .setTitle(result.getResult() == 1 ? ':thumbsup:' : ':thumbsdown:')
      .setDescription(result.getDescription())

      console.log(JSON.stringify(result));

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
  }
}
