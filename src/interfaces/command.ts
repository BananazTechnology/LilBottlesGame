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

    const result = await this.run(client, interaction, user).catch(() => { return new LogResult(false, LogStatus.Error, 'Error in command') });

    (await log).complete(result.complete)
  }
}
