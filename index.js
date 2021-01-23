require("dotenv/config");
const request = require("request");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_KEY = process.env.API_KEY;
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/movie (.+)/, function (msg, match) {
  let movie = match[1];
  let movieEncoded = encodeURI(movie);
  let chatId = msg.chat.id;
  request(
    `http://www.omdbapi.com/?apikey=${API_KEY}&t=${movieEncoded}`,
    (error, response, body) => {
      console.log(movieEncoded);
      if (!error && response.statusCode == 200) {
        bot
          .sendMessage(chatId, `_Looking for_ ${movie}...`, {
            parse_mode: "Markdown",
          })
          .then((msg) => {
            let res = JSON.parse(body);
            // console.log(res);
            try {
              bot.sendPhoto(chatId, res.Poster, {
                parse_mode: "Markdown",

                caption: `*RESULT...*\n🎬 *Title*: ${res.Title}\n📆 *Released:* ${res.Released}\n⏳ *Runtime*: ${res.Runtime}\n🎭 *Genre*: ${res.Genre}\n🤵 *Director*: ${res.Director}\n👥*Actors*: ${res.Actors}\n✍ *Plot*: ${res.Plot}\n💬 *Language*: ${res.Language}\n🌍 *Country*: ${res.Country}\n🍅 *Rotten Tomatoes*: ${res.Ratings[1].Value}\n`,
              });
            } catch (error) {
              bot.sendMessage(
                chatId,
                "Não foi possível encontrar o título procurando."
              );
            }
          });
      }
    }
  );
  bot.sendMessage(chatID, movie);
});
