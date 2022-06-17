import { Profile } from './commands/profile/profile'
import { Help } from './commands/help/help'
import { Command } from './interfaces/command'
import { Claw } from './commands/claw/claw'
import { Pause } from './commands/pause/pause'
import { Resume } from './commands/resume/resume'
import { GameInfo } from './commands/gameinfo/gameinfo'
import { Export } from './commands/export/export'
import { Backpack } from './commands/backpack/backpack'

export const Commands: Command[] = [new Help(), new Profile(), new Claw(), new Pause(), new Resume(), new GameInfo(), new Export(), new Backpack()]
