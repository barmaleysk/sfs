const TelegramBot = require('node-telegram-bot-api')
TOKEN = '520652901:AAFiO6SKuurM0zLYGFv7LTSOaYtt52Grgmc'
DB_URL = 'mongodb://localhost/TGBusers'
const mongoose = require('mongoose')
require('/Users/vryazanow/WebstormProjects/TRB-bot/src/user.model.js')
const User = mongoose.model('users')
mongoose.connect(DB_URL).then(() => console.log('MongoDb bot2 Connected'))

var md5 = require('md5');
const merchId = 68539
const payCost = 5000
var isStart = false

//Создание бота

bot = new TelegramBot(TOKEN, {
    polling: true
})
//тут мы приглашаем юзера
bot.onText(/\/start(.+)/, (msg, [source,match]) => {
    bot.sendMessage(msg.chat.id, 'Реагируем')
    console.log(match.slice(1))
    isStart = true


})


bot.onText(/\/start/, msg => {
    const userId = msg.from.id
    const chatId = msg.chat.id
    if (isStart === true){
        isStart = false
    } else {
        bot.sendMessage(msg.chat.id, 'Реагируем на просто страрт')

        User.findOne({telegramId: userId})
            .then(user => {
                user = new User({
                    telegramId: userId,
                    //тут сохраняем всех реферов в систему
                    chatId: chatId,
                    isBiloPriglashenie: false,
                    isBilaOlata: false
                })

                user.save()

            })

        bot.sendMessage(msg.chat.id, 'Регистрация', {
            reply_markup: {
                keyboard: [
                    ['Начать регистрацию']
                ]
            }
        })

    }



})

bot.on('message', msg=> {
    const userId = msg.from.id
    const chatId = msg.chat.id

    if (msg.text === 'Начать регистрацию'){
        User.findOne({telegramId: userId})
            .then(user => {
                if(user){
                    user.isStartedRegistration = true
                    user.save()
                    bot.sendMessage(chatId, 'Введите имя')
                }

            })

    }

            User.findOne({telegramId: userId})
                .then(user => {
                    if (user) {

                    }


                })



})


User.find().remove().then(users => console.log(users))
User.find().then(users => console.log(users))