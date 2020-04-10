require('dotenv').config();
const Discord = require('discord.js');
const moment = require('moment');
const uuid = require('uuid/v4');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

// bot.on('ready', () => {
// 	console.info(`Logged in as ${bot.user.tag}!`);
// });

let reminders = [];

bot.on('message', msg => {
	if (msg.content === '<3hi stannie') {
		msg.channel.send("you're stupid");
	} else if (msg.content.startsWith('<3add')) {
		// msg.channel.send("you're stupid");
		const message = msg.content.split(':');
		let hour = parseInt(message[0].slice(6));
		let minute = message[1];
		const ampm = minute.slice(2,4);
		if(ampm === 'pm') {
			hour += 12;
			if(hour === 24) {
				hour = 12;
			}	 
		}
		minute = minute.substring(0, 2);

		/****************************************/
		const content = message[1].slice(5);
		const user = msg.author.username;
		const timeForReminder = `${hour}:${minute}`;
		let id = uuid();
		reminders.push({
			id: id,
			user: user,
			time: timeForReminder,
			content: content
		})
		let first = false;
		setInterval( () => {
			if(!first && timeForReminder === moment().format("HH:mm")) {
				const sendThis = reminders.find(reminder => reminder.time === timeForReminder);
				if(sendThis) msg.channel.send(sendThis.content);
				first = true;
			}
		}, 1000);
		setTimeout( () => {
			first = false;
		}, 200000);
	} else if (msg.content.startsWith('<3list')) {
		const list = reminders.map(reminder => `
Requested by: ${reminder.user}
Reminder: ${reminder.content}
Time: ${reminder.time}
ID for deletion: ${reminder.id}
		`);
		list.length !== 0 ? msg.channel.send(list) : msg.channel.send('There are no reminders');
	} else if(msg.content.startsWith('<3delete')) {
		const id = msg.content.split(' ')[1];
		reminders = reminders.filter(reminder => reminder.id !== id);
		msg.channel.send('Removed');
	} else if(msg.content.startsWith('<3commands')) {
		const sendThis = `
<3add 12:00am (or pm) <message> (please dont use : in the message hehehehe ) 
<3list 
<3delete <id>
<3hi stannie
`;
		msg.channel.send(sendThis);
	}
});
