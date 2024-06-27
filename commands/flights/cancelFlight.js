const { SlashCommandBuilder } = require('discord.js');
const db = require("../../db/db")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cancelflight')
		.setDescription('Cancels a flight if the user using the command is the same user who made the flight')
		.addStringOption((option) =>
			option
				.setName("flightid")
				.setDescription("The id of the flight (given when flight is made)")
				.setRequired(true)),
				
	async execute(interaction) {
		const flightId = interaction.options.getString("flightid")
		let flight = db.collection("flights").find({ "flightId": parseInt(flightId) })
		if(!flight) {
			interaction.reply("Flight not found")
		} if (flight.user == interaction.user.id) {
			db.collection("archived").create(flight)
			db.collection("flights").del(flight.id)
			interaction.reply("Flight succesfully deleted. the ATC has been informed about this")
		} else {
			interaction.reply("The user of the flight is not you.")
		}
	},
};