require('dotenv').config(); // ⬅️ Wajib di paling atas sebelum akses env

const TelegramBot = require('node-telegram-bot-api');

// Cek dan tampilkan environment
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

console.log("BOT_TOKEN:", BOT_TOKEN ? "✅ Loaded" : "❌ Missing");
console.log("WEBAPP_URL:", WEBAPP_URL || "❌ Not set");

// Validasi
if (!BOT_TOKEN || !WEBAPP_URL) {
  console.error("❌ BOT_TOKEN atau WEBAPP_URL belum diset di .env!");
  process.exit(1); // Stop kalau variabel penting belum ada
}

// Inisialisasi bot dengan polling
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Saat user kirim /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, "👋 Hi! Click the button below to open your Mini App:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📊 Open Tracker",
            web_app: { url: WEBAPP_URL }
          }
        ]
      ]
    }
  });
});

