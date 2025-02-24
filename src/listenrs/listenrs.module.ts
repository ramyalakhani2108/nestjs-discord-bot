import { Module } from '@nestjs/common';
import { WelcomeListenrService } from './welcome-listenr.service';
import { Client, GatewayIntentBits } from 'discord.js'; 

@Module({
  providers: [
    WelcomeListenrService, 
    {
      provide: Client,
      useFactory: () => {
        return new Client({
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent, // 👈 Required if you want to read messages
            GatewayIntentBits.DirectMessages, // 👈 Required if you want to read messages
          ],
        });
      },
    },
    WelcomeListenrService,
  ],
  exports: [WelcomeListenrService], 
})
export class ListenersModule {}