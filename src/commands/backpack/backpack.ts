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
  requiredRole = 964999297923960843n;

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    try {
      await interaction.deferReply({ ephemeral: true })

      if(user){
        const inventory = await InventoryItem.getInventory(user.getId())
        const totalItems = await GameResult.getCount();
        const embed1 = new MessageEmbed()
                .setColor('#FFA500');

        const embed2 = new MessageEmbed()
                .setColor('#FFA500');

        if(inventory){
            for(let i = 0; i < totalItems; i++) {
                let exists = false;
                for( let item of inventory){
                    if(item.getItemID() == i){
                      if(i < 24 ) {
                        embed1.addField('\u200b',`${item.getEmote()}\n`, true);
                        exists = true;
                      }
                      if(i > 23 ) {
                        embed2.addField('\u200b',`${item.getEmote()}\n`, true);
                        exists = true;
                      }
                    } 
                }
                if(exists == false) {
                  if(i < 24){
                    embed1.addField('\u200b',':question:\n', true);
                  } if(i > 23) {
                    embed2.addField('\u200b',':question:\n', true);
                  }
                    
                }
            }
        }

        await interaction.followUp({
            embeds: [embed1,embed2]
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
