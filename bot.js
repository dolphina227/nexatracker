console.log("BOT_TOKEN:", process.env.BOT_TOKEN);
console.log("WEBAPP_URL:", process.env.WEBAPP_URL);
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Token bot kamu dari @BotFather (masukkan di file .env)
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const webAppUrl = process.env.WEBAPP_URL; // URL dari ngrok kamu

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "👋 Hai! Klik tombol di bawah untuk membuka Mini App:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📊 Buka Portfolio Tracker", web_app: { url: webAppUrl } }]
      ]
    }
  });
});
