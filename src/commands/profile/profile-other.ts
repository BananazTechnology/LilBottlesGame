import { ApplicationCommandOptionData, BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { User } from '../../classes/user'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'

const id: ApplicationCommandOptionData = {
  name: 'id',
  description: 'Discord ID of users profile youd like to view',
  type: 'STRING',
  required: true
}

export class Other extends SubCommand {
  name = 'other'
  description = 'View a users profile'
  type = 'SUB_COMMAND'
  options = [id]
  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    await interaction.deferReply({ ephemeral: true })

    let id
    if (interaction.options.get('id')?.value === undefined) {
      id = undefined
    } else {
      id = `${interaction.options.get('id')?.value}`
    }

    try {
      const user = await User.getByDiscordId(id)

      const embed = new MessageEmbed()
        .setColor('#FFA500')
        .setTitle(`Profile: ${user.getDiscordName()}`)
      embed.addField('Wallet Address:', `\`${user.getWalletAddress()}\``, false)
      const imgUser = await client.users.fetch(id)
      embed.setThumbnail(imgUser.avatarURL({ dynamic: true }))

      await interaction.followUp({
        embeds: [embed]
      })

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Permit Other completed Successfully'))
      })
    } catch (err) {
      const content = 'You dont have a permit yet! Use /profile create!'

      await interaction.followUp({
        ephemeral: true,
        content
      })

      return new Promise((resolve, reject) => {
        reject(new LogResult(false, LogStatus.Error, 'General Permit Other Command Error'))
      })
    }
  }
}
