import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PingCommand } from '../commands/ping.command';
import { SchedulerService } from './services/scheduler.service';
import { ListenersModule } from 'src/listenrs/listenrs.module';
import { CommandsModule } from 'necord';
import { BotService } from './services/bot.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ListenersModule,
    CommandsModule
  ],
  providers: [SchedulerService, BotService],
})
export class BotModule {}