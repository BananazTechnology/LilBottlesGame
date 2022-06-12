import {
  BaseCommandInteraction,
  ChatInputApplicationCommandData,
  Client
} from 'discord.js'
import { LogResult } from '../classes/logResult'
import { InteractionLog } from '../classes/interactionLog'
import { User } from '../classes/user'
import { Interaction } from './interaction'
import { LogStatus } from '../resources/logStatus'

export abstract class Command implements ChatInputApplicationCommandData, Interaction {
  public abstract name: string;
  public abstract description: string;
  public abstract type;

  protected cooldown?: number = undefined;

  abstract run (client: Client, interaction: BaseCommandInteraction, user: User|undefined): Promise<LogResult>;

  async execute (client: Client, interaction: BaseCommandInteraction, user: User|undefined) {
    const log = InteractionLog.log(interaction)

    let result: LogResult = new LogResult(false, LogStatus.Incomplete, 'Error in command')

    if (this.cooldown) {
      const lastLog = await InteractionLog.getLastByCommand(user, interaction)
      const cooldownNumber = (Number(Date.parse(lastLog.getTimestamp())) / 1000) + (this.cooldown * 60)
      const currentNumber = Number(Date.parse(new Date().toUTCString())) / 1000

      if (cooldownNumber - currentNumber <= 0) {
        result = await this.runCmd(client, interaction, user)
      } else {
        interaction.reply({
          content: `Easy there hotpocket, your cooldown aint over! You can run this command again <t:${((Number(Date.parse(lastLog.getTimestamp())) / 1000) + (this.cooldown * 60))}:R>`
        })
        result = new LogResult(false, LogStatus.Warn, 'Player has not reached cooldown')
      }
    } else {
      result = await this.runCmd(client, interaction, user)
    }

    console.log(`${user.getDiscordName()} ran ${this.name}: ${result.message}`);
    (await log).complete(result)
  }

  private async runCmd (client, interaction, user) {
    return await this.run(client, interaction, user)
      .catch(() => {
        interaction.followUp({
          content: 'Jeepers Creepers! You done broke it! We\'ll look into the issue'
        })
        return new LogResult(false, LogStatus.Incomplete, 'Error in command')
      })
  }
}
