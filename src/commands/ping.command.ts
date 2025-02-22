import { Context, SlashCommand, SlashCommandContext, ModalComponent } from 'necord';
import { Injectable } from '@nestjs/common';
import { ActionRowBuilder, GuildMember, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js';
import { On } from '@discord-nestjs/core';

@Injectable()
export class PingCommand {
  @SlashCommand({ name: 'ping-admin-1', description: 'Replies!' })
  async onPing(@Context() [interaction]: SlashCommandContext) {
    try{
      const modal = new ModalBuilder()
        .setCustomId('ping_modal')
        .setTitle('User Feedback Form');

      // Creating an input field
      const input1 = new TextInputBuilder()
        .setCustomId('feedback')
        .setLabel('What do you think about our bot?')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const input2 = new TextInputBuilder()
        .setCustomId('rating')
        .setLabel('Rate us from 1 to 10')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      // Adding input fields to rows
      const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(input1);
      const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(input2);

      // Adding rows to modal
      modal.addComponents(row1, row2);

      // Show the modal
      await interaction.showModal(modal);
      } catch(error) {
      console.error('❌ Error responding to interaction:', error);
  }
  }

  @On('interactionCreate')
  async onModalSubmit(interaction: ModalSubmitInteraction) {
    if (!interaction.isModalSubmit() || interaction.customId !== 'ping_modal') return;

    try {
      // Fetching user input
      const feedback = interaction.fields.getTextInputValue('feedback');
      const rating = interaction.fields.getTextInputValue('rating');

      // Replying to the user
      await interaction.reply({
        content: `✅ Thank you for your feedback!\n\n**Feedback:** ${feedback}\n**Rating:** ${rating}/10`,
        ephemeral: true,
      });

      console.log(`User Feedback: ${feedback}, Rating: ${rating}`);
    } catch (error) {
      console.error('❌ Error handling modal submission:', error);
    }
  }
}