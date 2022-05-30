import {
  BaseCommandInteraction,
  ButtonInteraction,
  ChatInputApplicationCommandData,
  Client,
  SelectMenuInteraction
} from 'discord.js'
import { User } from '../classes/user'

export interface Interaction extends ChatInputApplicationCommandData {
  name: string,
  description,
  type,
  execute: (client: Client, interaction: BaseCommandInteraction|SelectMenuInteraction|ButtonInteraction, user: User|undefined) => void;
}
