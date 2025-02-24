import { Injectable } from '@nestjs/common';
import { On, Context } from 'necord';
import { Message, TextChannel, DMChannel, NewsChannel, ThreadChannel, PublicThreadChannel, PrivateThreadChannel, ChannelType } from 'discord.js';
import axios from 'axios';

@Injectable()
export class BotService {
  private readonly botId = '1342062783394742314';
  private readonly geminiApiKey = 'AIzaSyDwjDIYVeBqtMun4PG76Jmcwg6kVw26iKc';

  @On('messageCreate')
  async onMessage(@Context() [message]: [Message]): Promise<void> {
    if (!message.mentions.users.has(this.botId)) return;
    
    const userInput = message.content.replace(`<@${this.botId}>`, '').trim() || 'Say something!';
    
    if (this.canSendMessage(message.channel)) {
      await message.channel.sendTyping(); // Show typing animation
      
      const aiResponse = await this.generateResponse(userInput);

      try{

        await message.channel.send(aiResponse);
      }catch {
        await message.channel.send('something went wrong');
      }
    }
  }

  private canSendMessage(
    channel: typeof Message.prototype.channel
  ): channel is TextChannel | DMChannel | NewsChannel | PublicThreadChannel<boolean> | PrivateThreadChannel {
    return (
      channel instanceof TextChannel ||
      channel instanceof DMChannel ||
      channel instanceof NewsChannel ||
      (channel instanceof ThreadChannel &&
        (channel.type === ChannelType.PublicThread || channel.type === ChannelType.PrivateThread))
    );
  }

  private async generateResponse(input: string): Promise<string> {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{ parts: [{ text: input }] }]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I couldn’t generate a response!';
    } catch (error) {
      console.error('Error calling Gemini AI API:', error);
      return 'Sorry, something went wrong with my AI brain! Don\'t ask long answers please....';
    }
  }
}