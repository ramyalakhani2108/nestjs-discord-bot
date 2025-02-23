import { CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommand, SlashCommandContext, Context } from "necord";
import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()

export class UserRequestsCommand {
    constructor(private readonly userRequestsService: UsersService) {}

    @SlashCommand({
        name: "request_status",
        description: "Check your request status",
        guilds: ['1339996652110614663'],
    })
    async requestStatus(@Context() [interaction]: SlashCommandContext) {
        await interaction.deferReply({ ephemeral: true }); // Only user can see

        const userId = interaction.user.id;
        const request = await this.userRequestsService.getUserRequest(Number(userId));

        if (!request) {
            return interaction.editReply({
                content: "❌ You have no active requests.",
            });
        }

        // Fancy UI - Embed for better visualization
        const embed = new EmbedBuilder()
        .setColor("#5865F2") // Discord blurple color
        .setTitle("📌 Your Request Status")
        .addFields(
            { name: "🆔 Request ID", value: `\`${request.id}\``, inline: true },
            { name: "\u200B", value: "\u200B", inline: true }, // Adds spacing
            { name: "🛠️ Role Requested", value: `\`${request.forRole.role}\``, inline: true },

            { name: "⏳ Status", value: `\`${request.status.name}\``, inline: true },
            { name: "\u200B", value: "\u200B", inline: true }, // More spacing
            { name: "💡 Skills", value: request.skills.join(", ") || "N/A", inline: true },

            { name: "⌛ Available Time", value: `${request.availableTime} hours`, inline: true },
            { name: "\u200B", value: "\u200B", inline: true }, // More spacing
            { name: "📝 Expectations", value: request.expectations, inline: true } 
        )
        .setFooter({ text: "Requested via Project-Discord-Bot", iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();


        return interaction.editReply({ embeds: [embed] });
    }
}
