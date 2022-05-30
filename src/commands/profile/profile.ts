import { BaseCommandInteraction, Client } from 'discord.js'
// import { SubCommand } from '../../interfaces/subCommand'
import { Command } from '../../interfaces/command'
import { View } from './profile-view'
import { Create } from './profile-create'
import { User } from '../../classes/user'
import { Other } from './profile-other'
import { Edit } from './profile-edit'
import { SubCommand } from '../../interfaces/subCommand'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'

export class Profile extends Command {
  name = 'profile'
  description = 'Profile Command'
  type = 'CHAT_INPUT'
  options: SubCommand[] = [new Create(), new View(), new Other(), new Edit()]

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    try {
      interaction.options.data.forEach(option => {
        if (option.type === 'SUB_COMMAND') {
          this.options.find((c) => c.name === option.name).execute(client, interaction, user)
            .then((res: LogResult) => {
              return new Promise((resolve, reject) => {
                resolve(res)
              })
            })
            .catch((res: LogResult) => {
              return new Promise((resolve, reject) => {
                reject(res)
              })
            })
        }
      })
    } catch {
      return new Promise((resolve, reject) => {
        reject(new LogResult(false, LogStatus.Error, 'General Profile Command Error'))
      })
    }
  }
}
