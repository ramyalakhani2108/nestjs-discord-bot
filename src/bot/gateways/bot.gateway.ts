import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, IntentsBitField } from 'discord.js';
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { ConfigService } from '@nestjs/config';
// 1339996652110614663
@Injectable()
export class BotGateway implements OnModuleInit {
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent, // Important for receiving messages
        IntentsBitField.Flags.GuildMembers,
      ],
    });
  }

  async onModuleInit() {
    const token = this.configService.get<string>('DISCORD_TOKEN');
    if (!token) {
      throw new Error('DISCORD_TOKEN is not set in .env file');
    }

    this.client.once('ready', async () => {
      console.log(`Logged in as ${this.client.user?.tag}`);
      await this.registerCommands();
    });

    await this.client.login(token);
  }

  @SlashCommand({ name: 'ping', description: 'Replies with Pong!' })
  async onPing(@Context() [interaction]: SlashCommandContext) {
    console.log('Received /ping command');
  
    try {
      await interaction.deferReply(); // Acknowledges the command immediately
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating delay
      await interaction.followUp({ content: 'Pong!' }); // Sends actual response
      await this.registerCommands();
    } catch (error) {
      console.error('Error responding to interaction:', error);
    }
  }

  async registerCommands() {
    const guildId = '1339996652110614663'; // Replace with your Discord server (guild) ID
    const applicationId = this.client.application?.id;
  
    if (!applicationId) {
      console.error('Application ID not found.');
      return;
    }
  
    await this.client.application?.commands.set(
      [
        {
          name: 'ping',
          description: 'Replies with Pong!',
        },
      ],
      guildId // You can remove this to register globally, but it takes longer
    );
  }
}