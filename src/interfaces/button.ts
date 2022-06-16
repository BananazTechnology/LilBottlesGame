import {
  ApplicationCommandSubCommandData,
  Client,
  ButtonInteraction
} from 'discord.js'
import { User } from '../classes/user'
import { Interaction } from './interaction'

export abstract class Button implements ApplicationCommandSubCommandData, Interaction {
  public abstract name: string;
  public abstract description: string;
  public abstract type: any;

  protected cooldown?: number = undefined;

  abstract run: (client: Client, interaction: ButtonInteraction, user: User|undefined) => void;

  execute (client: Client, interaction: ButtonInteraction, user: User|undefined) {
    this.run(client, interaction, user)
  }
}
