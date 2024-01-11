import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Checkout these packages to handle telegram bot
 * https://github.com/yagop/node-telegram-bot-api
 * Another one = https://github.com/telegraf/telegraf
 * Another = https://github.com/grammyjs/grammY
 * -----------------------------------------------------
 *
 * How to set webhook url
 * Just simply open the browser and type the url link below and hit enter.
 * https://api.telegram.org/bot<YOUR_API_TOKEN>/setWebhook?url=<YOU_PUBLIC_SEVER_URL>/new-message
 * For example = https://api.telegram.org/bot777845702:AAFdPS_taJ3pTecEFv2jXkmbQfeOqVZGER/setWebhook?url=https://3ac9-43-246-202-246.ngrok-free.app/new-message
 *
 * ------------------------
 * Tutorial blog
 * https://www.sohamkamani.com/nodejs/telegram-bot/
 */

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Hi from Telegram bot");
});

/**
 * Set commands to your bot
 * ref = https://core.telegram.org/bots/api#setmycommands
 */

// axios
//   .post(
//     `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setMyCommands`,
//     {
//       commands: [
//         { command: "/foo", description: "a foo" },
//         { command: "/how_u_doin", description: "doin" },
//       ],
//     }
//   )
//   .then((res) => console.log(res.data))
//   .catch((err) => console.log(err.message));

// ---------------------------------------------

//This is the route the API will call
app.post("/new-message", async function (req, res) {
  try {
    const { message } = req.body;

    // console.log(message);

    // console.dir(message.photo, { depth: null });

    if (!message) {
      return res.end();
    }

    if (message.text) {
      const text = message.text;
      let textRes = "";

      if (text === "/foo") {
        textRes = "Bar!";
      }

      if (text === "/how_u_doin") {
        textRes = "doin good!";
      }

      const resData = await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: message.chat.id,
          text: textRes || text,
        }
      );
    }

    if (message.photo) {
      const resData2 = await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
        {
          chat_id: message.chat.id,
          photo: message.photo[message.photo.length - 1].file_id,
          caption: message.caption,
        }
      );
    }

    console.log("Message posted");
    res.status(200).end("ok");
  } catch (err) {
    console.log("Error :", err);
    res.status(500).send("Error :" + err);
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Telegram app listening on http://localhost:3000");
});
