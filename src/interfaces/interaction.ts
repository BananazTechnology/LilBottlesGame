import {
  ChatInputApplicationCommandData,
  Client
} from 'discord.js'
import { ApplicationCommandTypes } from 'discord.js/typings/enums'
import { User } from '../classes/user'

export interface Interaction extends ChatInputApplicationCommandData {
  name: string,
  description: string,
  type: 'CHAT_INPUT' | ApplicationCommandTypes.CHAT_INPUT | undefined,
  execute: (client: Client, interaction: any, user: User|undefined) => void;
}
