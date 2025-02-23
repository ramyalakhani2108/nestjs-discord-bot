import {
  ActionRowBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
  ChatInputCommandInteraction,
  MessageFlags,
  Interaction,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  TextChannel,
} from 'discord.js';
import {
  Context,
  SlashCommand,
  On,
} from 'necord';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterForProject } from 'src/users/types/register-for-project.type';
import { RoleMasterService } from 'src/status_master/services/role-master.service';

@Injectable()
export class BeAPartOfProjectCommand {

  constructor(private readonly usersService: UsersService, private readonly roleMasterService: RoleMasterService) { }

  @SlashCommand({
    name: 'be-a-part-of-project',
    description: 'Apply to be a part of the project',
    guilds: ['1339996652110614663'],
  })
  public async onCommand(
    @Context() [interaction]: [ChatInputCommandInteraction]
  ) {

    const roleMaster = await this.roleMasterService.findAll();

    const roleSelectMenu = new StringSelectMenuBuilder()
      .setCustomId('role_select')
      .setPlaceholder('Select your role')
      .addOptions(roleMaster.map((role) => ({
        label: role.role,
        value: role.id.toString(),
      })));

    const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      roleSelectMenu
    );
    await interaction.reply({
      content: 'Please select your role:',
      components: [actionRow],
      flags: MessageFlags.Ephemeral,
    });
  }

  @On('interactionCreate')
  public async onRoleSelect(@Context() [interaction]: [Interaction]) {
    // Check if it's a string select menu interaction
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'role_select') {
      return;
    }

    const role = interaction.values[0];

    const modal = new ModalBuilder()
      .setCustomId(`project_application_${role}`)
      .setTitle('Project Application');

    const skillsInput = new TextInputBuilder()
      .setCustomId('skills')
      .setLabel('Your Skills (comma-separated)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g. React, NestJS, PostgreSQL');

    const hoursInput = new TextInputBuilder()
      .setCustomId('hours')
      .setLabel('How many hours can you contribute daily?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g. 4.5');

    const expectationsInput = new TextInputBuilder()
      .setCustomId('expectations')
      .setLabel('What are your expectations?')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Describe your expectations...');

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(skillsInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(hoursInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(expectationsInput)
    );

    await interaction.showModal(modal);
  }

  @On('interactionCreate')
  public async onModalSubmit(@Context() [interaction]: [Interaction]) {
    // Check if it's a modal submit interaction
    if (!interaction.isModalSubmit() || !interaction.customId?.startsWith('project_application_')) {
      return;
    }

    const role = interaction.customId.replace('project_application_', '');
    const skills = interaction.fields.getTextInputValue('skills');
    const hours = interaction.fields.getTextInputValue('hours');
    const expectations = interaction.fields.getTextInputValue('expectations');

    const data: RegisterForProject = {
      role,
      skills,
      time: hours,
      expectations,
    }
    const isRequestCreated = await this.usersService.addUserToProject(data, interaction.user);

    if (!isRequestCreated.status) {
      await interaction.reply({
        content: `❌ **Error:** ${isRequestCreated.message}\n\n> Please check your details and try again.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({
      content: `🎉 **Application Submitted Successfully!** ✅\n\n**Role:** \`${data.role}\`\n**Skills:** \`${data.skills}\`\n**Available Time:** \`${data.time} hrs/day\`\n**Expectations:** \`${data.expectations}\``,
      flags: MessageFlags.Ephemeral,
    });

    // Fetch the target channel (Make sure the bot has access to it)
    const targetChannel = interaction.client.channels.cache.get("1343188370855039068") as TextChannel;
    if (!targetChannel || targetChannel.type !== ChannelType.GuildText) {
      console.error("❌ Target channel not found or invalid.");
      return;
    }

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`accept_request_${interaction.user.id}`)
        .setLabel("✅ Accept")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`reject_request_${interaction.user.id}`)
        .setLabel("❌ Reject")
        .setStyle(ButtonStyle.Danger)
    );

    // Send request message in the channel
    await targetChannel.send({
      content: `🚀 **New Project Application Received!**\n\n👤 **User:** <@${interaction.user.id}>\n🛠️ **Role:** \`${data.role}\`\n💡 **Skills:** \`${data.skills}\`\n⌛ **Available Time:** \`${data.time} hrs/day\`\n📝 **Expectations:** \`${data.expectations}\`\n\n📌 **Moderators, please review and take action.**`,
      components: [actionRow],
    });

  }

  @On('interactionCreate')
  public async onButtonInteraction(@Context() [interaction]: [Interaction]) {
    if (!interaction.isButton()) return; // Ignore if not a button

    // Extract customId details
    const [action, _, userId] = interaction.customId.split("_"); // e.g., "accept_request_123456789"

    if (!["accept", "reject"].includes(action)) return; // Ignore if not related

    // Fetch the user’s request from DB
    const request = await this.usersService.getUserRequest(Number(userId));
    if (!request) {
      return interaction.reply({
        content: "❌ Request not found in the database.",
        ephemeral: true,
      });
    }

    const member = await interaction.guild?.members.fetch(userId);
    if (!member) {
      return interaction.reply({
        content: "❌ User not found in the server.",
        ephemeral: true,
      });
    }

    let statusUpdate = "";
    if (action === "accept") {
      statusUpdate = "✅ Approved";

      // (Optional) Assign a role to the user
      const role = interaction.guild?.roles.cache.find(r => r.name === request.forRole.role);
      if (role) {
        await member.roles.add(role);
      }
    } else {
      statusUpdate = "❌ Rejected";
    }

    // Update the request status in the database
    await this.usersService.updateUserRequestStatus(Number(userId), action);

    // Notify the user via DM
    try {
      await member.send({
        content: `📌 **Project Application Update**\n\n🛠️ **Role:** \`${request.forRole.role}\`\n📢 **Status:** ${statusUpdate}\n\n🔔 If you have any questions, contact a moderator.`,
      });
    } catch (error) {
      console.error("❌ Failed to send DM:", error);
    }

    // Edit the original message in the channel
    await (interaction.message as any).edit({
      content: `🚀 **New Project Application Reviewed!**\n\n👤 **User:** <@${userId}>\n🛠️ **Role:** \`${request.forRole.role}\`\n💡 **Skills:** \`${request.skills.join(", ")}\`\n⌛ **Available Time:** \`${request.availableTime} hrs/day\`\n📝 **Expectations:** \`${request.expectations}\`\n\n📢 **Decision:** ${statusUpdate}`,
      components: [], // Remove buttons
    });

  }
} 