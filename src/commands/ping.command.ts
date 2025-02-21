import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PingCommand {
  @SlashCommand({ name: 'ping-admin', description: 'Replies!' })
  async onPing(@Context() [interaction]: SlashCommandContext) {
    try{
      await interaction.reply(`🎉 Yes! <@${interaction.user.id}>, hang tight! <@${'1276039617937801237'}> will be with you shortly. 🚀😊`);
      } catch(error) {
      console.error('❌ Error responding to interaction:', error);
  }
  }
}