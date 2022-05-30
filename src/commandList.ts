import { Profile } from './commands/profile/profile'
import { Help } from './commands/help/help'
import { Command } from './interfaces/command'

export const Commands: Command[] = [new Help(), new Profile()]
