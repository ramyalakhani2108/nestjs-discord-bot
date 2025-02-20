import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PingCommand {
  @SlashCommand({ name: 'ping', description: 'Replies with Pong!' })
  async onPing(@Context() [interaction]: SlashCommandContext) {
    console.log('✅ Received /ping command');

    try {
      await interaction.reply('Pong!');
    } catch (error) {
      console.error('❌ Error responding to interaction:', error);
    }
  }
}