import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { ConfigModule } from '@nestjs/config';
import { PingCommand } from './ping.command';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN ?? '', // Make sure this is correct
      intents: ['Guilds', 'GuildMessages', 'MessageContent'],
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [PingCommand, SchedulerService], // Register the command class
})
export class BotModule {}