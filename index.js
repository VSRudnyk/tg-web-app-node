require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const { TELEGRAM_TOKEN, BACKEND_URL, WEB_APP_URL, PORT } = process.env;

const bot = new TelegramBot(TELEGRAM_TOKEN);
const app = express();

app.use(express.json());
app.use(cors());

// Устанавливаем Webhook
const WEBHOOK_URL = `${BACKEND_URL}/bot${TELEGRAM_TOKEN}`;
bot.setWebHook(WEBHOOK_URL);

// Обработчик Webhook
app.post(`/bot${TELEGRAM_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Обработка сообщений от пользователя
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text) {
    await bot.sendMessage(
      chatId,
      'Для завантаження зображення перейдіть по кнопці нижче або натисніть кнопку "Сайт"',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Перейти до завантаження зображення',
                web_app: { url: WEB_APP_URL }, // Ссылка на фронтенд
              },
            ],
          ],
        },
      }
    );
  }
});

// Обработка данных от Web App
app.post('/web-data', async (req, res) => {
  const { responseMessage, queryId } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Success',
      input_message_content: {
        message_text: responseMessage,
      },
    });
    return res.status(200).json({});
  } catch (e) {
    console.error('Error handling web-data:', e);
    return res.status(500).json({});
  }
});

app.listen(PORT, () => console.log('Server started on PORT ' + PORT));