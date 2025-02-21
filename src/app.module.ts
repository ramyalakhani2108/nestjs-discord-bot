import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NecordModule } from 'necord';
import { BotModule } from './bot/bot.module';
import { ListenersModule } from './listenrs/listenrs.module';
import { CommandsModule } from './commands/commands.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN ?? '',
      intents: [
        'Guilds',
        'GuildMembers',
        'GuildMessages',
        'MessageContent', 
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('SUPABASE_DB_HOST'),
        username: config.get('SUPABASE_DB_USER'),
        password: config.get('SUPABASE_DB_PASSWORD'),
        database: config.get('SUPABASE_DB_NAME'),
        port: config.get('SUPABASE_DB_PORT')
      })
    }),
    BotModule,
    ListenersModule,
    CommandsModule, // ✅ Import it here
  ],
})
export class AppModule {}