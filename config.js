require('dotenv').config();

module.exports = {
    "token": process.env.BOT_TOKEN,
    "prefix": process.env.PREFIX,
    "api": process.env.API, // Youtube API Key https://console.cloud.google.com/apis/library/youtube.googleapis.com
}