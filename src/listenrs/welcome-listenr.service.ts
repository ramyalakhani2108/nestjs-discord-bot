import { Injectable, Logger } from '@nestjs/common';
import { On, Context } from 'necord';
import { GuildMember } from 'discord.js';

@Injectable()
export class WelcomeListenrService {
  private readonly logger = new Logger(WelcomeListenrService.name);

  @On('guildMemberAdd')
  async onGuildMemberAdd(@Context() [member]: [GuildMember]) {
    if (!member || !member.user) {
      this.logger.error('Member or user data is undefined.');
      return;
    }

    const username = member.user.tag; // 👈 Safe access
    this.logger.log(`Welcome ${username} to the server!`);
    
    const welcomeChannel = member.guild.channels.cache.find(
      (channel) => channel.name === 'welcome'
    );

    const userId = '1276039617937801237';
    const user = await member.guild.members.fetch(userId);

    if (welcomeChannel && welcomeChannel.isTextBased()) {
      welcomeChannel.send(`🎉 Welcome to the server, <@${member.user.id}>! Please get your first tasks from admin <@${userId}>`);
    }
  } 
}