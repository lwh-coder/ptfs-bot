const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../db/db.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('createflight')
        .setDescription('Creates a flight path between two points, updates the database, and informs ATC about the flight.')
        .addStringOption(option =>
            option.setName('startlocation')
                .setDescription('The starting location of the flight')
                .addChoices(
                    { name: 'Funny', value: 'gif_funny' },
                    { name: 'Meme', value: 'gif_meme' },
                    { name: 'Tokyo International, ORENJI', value: 'ORJ' },
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('endlocation')
                .setDescription('The ending location of the flight')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('planecode')
                .setDescription('The code of your flight (e.g., Veticus-3234)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('requestingtakeoffrunway')
                .setDescription('The requested takeoff runway')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('requestinglandingrunway')
                .setDescription('The requested landing runway')
                .setRequired(false)),
    async execute(interaction) {
        try {
            const startlocation = interaction.options.getString('startlocation');
            const endlocation = interaction.options.getString('endlocation');
            const planecode = interaction.options.getString('planecode');
            const requestingtakeoffrunway = interaction.options.getString('requestingtakeoffrunway');
            const requestinglandingrunway = interaction.options.getString('requestinglandingrunway');
            const flightId = Math.floor(Math.random() * 10000000) + 1;
            const flight = { user: interaction.user.id, startlocation, endlocation, planecode, requestingtakeoffrunway, requestinglandingrunway, flightId: flightId };
            
            // Save flight to database
            await db.collection("flights").create(flight);

            // Example embed for notification
            const exampleEmbed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle('Flight Created')
                .setDescription(`Flight ID: ${flightId}`)
                .setTimestamp();

            // Replace 'CHANNEL_ID' with the actual ID of the channel you want to send the message to
            const channelId = '1255689028939026432'; // Update this with your channel ID
            const channel = await interaction.client.channels.fetch(channelId);

            if (channel) {
                // Send a message to the channel
                await channel.send({ embeds: [exampleEmbed] });
            } else {
                console.log('Channel not found or is not a text channel.');
            }

            await interaction.reply(`Flight successfully created with ID: ${flightId}`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`Failed to create flight: ${error.message}`);
        }
    },
};
