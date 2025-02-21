import { Injectable } from '@nestjs/common';
import { On } from 'necord';
import { Message } from 'discord.js'; // Import Message from discord.js

@Injectable()
export class BotService {
  @On('messageCreate')
  onMessage(message: Message) {
    if (message.content === 'Hello') {
      message.reply(`Hello ${message.author.username}`);
    }
  }
}
