import axios, { AxiosError } from 'axios'
import { BaseCommandInteraction } from 'discord.js'

export class InteractionLog {
  // userInteraction attributes. Should always be private as updating information will need to be reflected in the db
  private id: number;
  private user: string;
  private server: string;
  private channel: string;
  private command: string;
  private subCommand: string|undefined;
  private options: string = '';
  private success: boolean = false;

  // constructor is private. Code should use a provided function
  private constructor (id: number, user: string, server: string, channel: string, command: string, subCommand: string|undefined, options: string = '', success: boolean = false) {
    this.id = id
    this.user = user
    this.server = server
    this.channel = channel
    this.command = command
    this.subCommand = subCommand
    this.options = options
    this.success = success
  }

  // logs action completion
  async complete (success: boolean): Promise<InteractionLog> {
    this.success = success

    const reqURL = `${process.env.userAPI}/log`
    console.debug(`Request to UserAPI: PUT - ${reqURL}`)

    return new Promise((resolve, reject) => {
      axios
        .put(reqURL, this)
        .then(res => {
          const data = res.data.data
          if (data) {
            resolve(this)
          } else {
            reject(new Error('Log Complete Unsuccessful'))
          }
        })
        .catch((err: AxiosError) => {
          // console.log(err)
          reject(err)
        })
    })
  }

  // creates a new user interaction and returns a UserInteraction object
  static async log (interaction: BaseCommandInteraction): Promise<InteractionLog> {
    const log = new InteractionLog(0, interaction.user.id, interaction.guildId, interaction.channelId, interaction.commandName, undefined, undefined)
    interaction.options.data.forEach(option => {
      if (option.type === 'SUB_COMMAND') {
        log.subCommand = option.name
        option.options.forEach(option => {
          log.options += `#${option.name}: `
          log.options += `'${option.value}' `
        })
      } else {
        log.options += `#${option.name}: `
        log.options += `'${option.value}' `
      }
    })

    const reqURL = `${process.env.userAPI}/log`
    console.debug(`Request to UserAPI: POST - ${reqURL}`)
    // console.debug(`Data: { user: ${log.user}, server: ${log.server}, channel: ${log.channel}, command: ${log.command}, subCommand: ${log.subCommand}, options: ${log.options} }`)
    // console.log(`COMMAND: { user: ${interaction.user.username}, channel: ${log.channel}, command: ${log.command}, subCommand: ${log.subCommand}, options: ${log.options} }`)

    return new Promise((resolve, reject) => {
      axios
        .post(reqURL, log)
        .then(res => {
          const data = res.data.data
          if (data) {
            log.id = data.id
            resolve(log)
          } else {
            reject(new Error('Log Unsuccessful'))
          }
        })
        .catch((err: AxiosError) => {
          // console.log(err)
          reject(err)
        })
    })
  }
}
