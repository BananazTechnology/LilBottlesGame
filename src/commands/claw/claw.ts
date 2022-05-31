import { BaseCommandInteraction, Client } from 'discord.js'
import { User } from '../../classes/user'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'

export class Claw extends Command {
  name = 'claw'
  description = 'Try your chances at the Little Bottles Claw Game!'
  type = 'CHAT_INPUT'

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    try {
      await interaction.deferReply({ ephemeral: true })
      let content = 'Test'

      await interaction.followUp({
        content
      })

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Help Command Completed Successfully'))
      })
    } catch {
      return new Promise((resolve, reject) => {
        reject(new LogResult(false, LogStatus.Error, 'General Help Command Error'))
      })
    }
  }
}
