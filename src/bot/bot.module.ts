import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PingCommand } from '../commands/ping.command';
import { SchedulerService } from './services/scheduler.service';
import { ListenersModule } from 'src/listenrs/listenrs.module';
import { CommandsModule } from 'necord';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ListenersModule,
    CommandsModule
  ],
  providers: [SchedulerService],
})
export class BotModule {}