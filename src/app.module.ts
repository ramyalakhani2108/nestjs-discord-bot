import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NecordModule } from 'necord';
import { BotModule } from './bot/bot.module';
import { ListenersModule } from './listenrs/listenrs.module';
import { CommandsModule } from './commands/commands.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { StatusMasterModule } from './status_master/status_master.module';
import { UsersModule } from './users/users.module';

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
        'DirectMessages'
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
        port: config.get('SUPABASE_DB_PORT'),
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    BotModule,
    ListenersModule,
    CommandsModule,
    TasksModule,
    StatusMasterModule,
    UsersModule, // ✅ Import it here
  ],
})
export class AppModule {}