const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endflight')
        .setDescription('Ends a flight, can only be used by members with the ATC role.')
        .addStringOption((option) =>
            option
                .setName("flightid")
                .setDescription("The ID of the flight to end")
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        const flightId = interaction.options.getString("flightid")
        console.log(JSON.stringify(interaction.guild.members))
        interaction.reply("test")
    },
};