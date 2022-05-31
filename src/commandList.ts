import { Profile } from './commands/profile/profile'
import { Help } from './commands/help/help'
import { Command } from './interfaces/command'
import { Claw } from './commands/claw/claw'

export const Commands: Command[] = [new Help(), new Profile(), new Claw()]
