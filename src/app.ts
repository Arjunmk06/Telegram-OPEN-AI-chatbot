import TelegramBot from 'node-telegram-bot-api';
import { Configurations } from '../config';
import { BotController } from './controller.ts/bot.controller';


const token = Configurations.Config.telegram_bot_token

const bot = new TelegramBot(token!, {polling: true});


bot.onText(/\/start/, (msg)=>{
    bot.sendMessage(msg.chat.id,"Welcome to your assistant. How can i help you?")
})

bot.on('message', async (msg: any) => {

    let message = msg.text
    console.log("message", msg)
    const reply = await BotController.getReply(msg)
    bot.sendMessage(msg.chat.id, reply)
});

