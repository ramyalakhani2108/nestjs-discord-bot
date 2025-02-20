import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Client } from 'discord.js';
import { TextChannel } from 'discord.js';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly client: Client) {}

  @Cron(CronExpression.EVERY_10_MINUTES) // Runs every 24 hours at 00:00 UTC
  async sendDailyMessages() {
    this.logger.log('⏰ Running daily scheduled task...');

    // List of channels and the users to mention in each channel
    const messageTargets = [
      // { channelId: '1340003785166032966', userId: '1293243416838410322' }, // User 1 in Channel 1
      { channelId: '1340004234208350258', userId: 'USER_ID_2' }, // User 2 in Channel 2
    ];

    for (const target of messageTargets) {
      const { channelId, userId } = target;

      try {
        const channel = await this.client.channels.fetch(channelId) as TextChannel;
        if (!channel) {
          this.logger.error(`❌ Channel with ID ${channelId} not found.`);
          continue;
        }

        const mention = `<@${userId}>`;
        const message = `Hello ${mention}! 👋 Don't forget to check in today!`;

        await channel.send(message);
        this.logger.log(`✅ Sent daily message to ${mention} in channel ${channelId}`);
      } catch (error) {
        this.logger.error(`❌ Failed to send message to channel ${channelId}:`, error);
      }
    }
  }
}