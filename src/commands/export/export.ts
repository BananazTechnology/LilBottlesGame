import { BaseCommandInteraction, Client, MessageAttachment } from 'discord.js'
import { User } from '../../classes/user'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'

export class Export extends Command {
  name = 'export'
  description = 'Export winners of the Claw Machine'
  type = 'CHAT_INPUT'
  requiredRole = 964999297923960846n;
  //requiredRole = 984278979257184286n; //dev;

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    try {
      await User.getWinners()
      await interaction.deferReply()

      const attachment = new MessageAttachment('Winners.xlsx')
        .setDescription('Winner export')
        .setFile('Winners.xlsx')

      await interaction.followUp({
        files: [attachment]
      })

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Export Winners Command Completed Successfully'))
      })
    } catch (e) {
      console.log(e)
      return new Promise((resolve, reject) => {
        reject(new LogResult(false, LogStatus.Error, 'Export Winners Command Error'))
      })
    }
  }
}
