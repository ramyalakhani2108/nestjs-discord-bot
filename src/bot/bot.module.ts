import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PingCommand } from './ping.command';
import { SchedulerService } from './scheduler.service';
import { ListenersModule } from 'src/listenrs/listenrs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ListenersModule
  ],
  providers: [PingCommand, SchedulerService],
})
export class BotModule {}