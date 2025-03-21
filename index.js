require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const { TELEGRAM_TOKEN, WEB_APP_URL } = process.env;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(
      chatId,
      'Для завантаження зображення перейдіть по кнопці нижче або натисніть кнопку "Сайт"',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Перейти до завантаження зображення',
                web_app: { url: WEB_APP_URL },
              },
            ],
          ],
        },
      }
    );
  }
});

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
    return res.status(500).json({});
  }
});

const PORT = 5000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT));
