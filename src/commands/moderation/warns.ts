import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { getAllWarns, getUserWarns } from "../../database";
import { BotCommand } from "../../structures";

class Warns extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("warns")
                .setDescription("View all warns a user has or view all warns")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription(
                            "The user of whom the warns are to be fetched"
                        )
                )
                .toJSON(),
            {
                timeout: 5000,
            }
        );
    }

    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<void> {
        const user = interaction.options.getUser("user");

        const guildId = interaction.guild?.id;

        if (!guildId) return;

        if (!user) {
            const embed = await getAllWarns(guildId);

            if (!embed) {
                interaction.reply("No wanrs found in server");
                return;
            }

            await interaction.reply({
                embeds: [embed],
            });
        } else {
            const embed = await getUserWarns(guildId, user.id);

            if (!embed) return;

            await interaction.reply({
                embeds: [embed],
            });
        }
    }
}

export default new Warns();
