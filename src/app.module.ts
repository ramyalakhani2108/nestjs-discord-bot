import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NecordModule } from 'necord';
import { BotModule } from './bot/bot.module';
import { ListenersModule } from './listenrs/listenrs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN ?? '',
      intents: [
        'Guilds',
        'GuildMembers',
        'GuildMessages',
        'MessageContent', 
      ],
    }),
    BotModule,
    ListenersModule, // ✅ Import it here
  ],
})
export class AppModule {}