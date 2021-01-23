require("dotenv/config");
const request = require("request");

const BOT_TOKEN = process.env.BOT_TOKEN;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/movie (.+)/, function (msg, match) {
  let movie = encodeURI(match[1]);
  let chatId = msg.chat.id;
  request(
    `http://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&t=${movie}`,
    (error, response, body) => {
      console.log(movie);
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

bot.onText(/\/weather (.+)/, (msg, match) => {
  let chatId = msg.chat.id;
  var weather = encodeURI(match[1]);
  request(
    `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${weather}`,
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let res = JSON.parse(body);
        try {
          bot.sendMessage(
            chatId,
            `🚩*${res.location.name}, ${res.location.region}, ${res.location.country}*\n⌚${res.location.localtime}\n🌡${res.current.temperature}Cº\n☁${res.current.weather_descriptions[0]}`,
            {
              parse_mode: "Markdown",
            }
          );
        } catch (error) {
          bot.sendMessage(
            chatId,
            "Localização não encontrada. Verifique e tente novamente."
          );
        }
      }
    }
  );
});
