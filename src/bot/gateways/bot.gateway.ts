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
    });

    await this.client.login(token);
  }
}
