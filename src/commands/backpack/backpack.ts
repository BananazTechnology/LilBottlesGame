import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { User } from '../../classes/user'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { InventoryItem } from '../../classes/inventory'
import { GameResult } from '../../classes/gameResult'

export class Backpack extends Command {
  name = 'backpack'
  description = 'check what items you have already collected!'
  type = 'CHAT_INPUT'

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    try {
      await interaction.deferReply({ ephemeral: true })

      if(user){
        const inventory = await InventoryItem.getInventory(user.getId())
        const totalItems = await GameResult.getCount();
        const embed = new MessageEmbed()
                .setColor('#FFA500')
        if(inventory){
            for(let i = 0; i < totalItems; i++){
                let exists = false;
                for( let item of inventory){
                    if(item.getItemID() == i){
                        embed.addField('\u200b',`${item.getEmote()}\n`, true);
                        exists = true;
                    } 
                }
                if(exists == false) {
                    embed.addField('\u200b',':question:\n', true);
                }
            }
        }

        await interaction.followUp({
            embeds: [embed]
        })
    }

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Backpack Command Completed Successfully'))
      })
    } catch {
      return new Promise((resolve, reject) => {
        reject(new LogResult(false, LogStatus.Error, 'Backpack Command Error'))
      })
    }
  }
}