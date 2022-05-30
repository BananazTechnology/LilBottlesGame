import {
  BaseCommandInteraction,
  ApplicationCommandSubCommandData,
  Client
} from 'discord.js'
import { LogResult } from '../classes/logResult'
import { User } from '../classes/user'
import { Interaction } from './interaction'

export abstract class SubCommand implements ApplicationCommandSubCommandData, Interaction {
  public abstract name: string;
  public abstract description: string;
  public abstract type;

  protected cooldown?: number = undefined;

  abstract run (client: Client, interaction: BaseCommandInteraction, user: User|undefined): Promise<LogResult>;

  execute (client: Client, interaction: BaseCommandInteraction, user: User|undefined): Promise<LogResult> {
    return this.run(client, interaction, user)
  }
}
