import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { warnUser } from "../../database";
import { BotCommand } from "../../structures";

class Warn extends BotCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("warn")
                .setDescription("warn a user")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user being warned")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("reason")
                        .setDescription("The reason the user is being warned")
                        .setRequired(true)
                )
                .setDefaultMemberPermissions(1099511627776)
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
        const reason = interaction.options.getString("reason");

        if (!user || !reason) return;

        const guildId = interaction.guild?.id;

        if (!guildId) return;

        await warnUser(user.id, guildId, reason);

        await interaction.reply(
            `The user ${user} has been warned for ${reason}`
        );
    }
}

export default new Warn();
