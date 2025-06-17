require('dotenv').config(); // harus paling atas

const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

console.log("BOT_TOKEN:", BOT_TOKEN ? "✅ Loaded" : "❌ Missing");
console.log("WEBAPP_URL:", WEBAPP_URL || "❌ Not set");

if (!BOT_TOKEN || !WEBAPP_URL) {
  console.error("❌ BOT_TOKEN atau WEBAPP_URL belum diset di .env!");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ✅ Handle /start → kirim tombol Mini App
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

// ✅ Handle message: jika user kirim address, tampilkan token
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  // Jangan proses jika perintah /start
  if (text.startsWith('/start')) return;

  // Cek apakah input adalah wallet address
  if (/^0x[a-fA-F0-9]{40}$/.test(text)) {
    bot.sendMessage(chatId, `🔎 Checking token balance for:\n${text}`);

    try {
      const response = await fetch(`${WEBAPP_URL}/api/balance?address=${text}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const result = data.map((token) => {
          const symbol = token.symbol || '❓';
          const decimals = parseInt(token.decimals || 18);
          const amount = parseFloat(token.amount || '0') / Math.pow(10, decimals);
          return `• ${symbol}: ${amount.toFixed(4)}`;
        }).join('\n');

        bot.sendMessage(chatId, `💰 Tokens in wallet:\n\n${result}`);
      } else {
        bot.sendMessage(chatId, `⚠️ No active tokens found for this wallet.`);
      }
    } catch (err) {
      console.error("API error:", err);
      bot.sendMessage(chatId, `❌ Failed to retrieve token data. Please try again later.`);
    }
  } else {
    bot.sendMessage(chatId, "⚠️ Please send a valid wallet address (starting with `0x`).");
  }
});


