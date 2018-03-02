const TelegramBot = require('node-telegram-bot-api')
TOKEN = '524303186:AAEOmhUV6HOH2VfyIo0_Ca-_s4kGLkT_pew'
DB_URL = 'mongodb://localhost/TGBusers'
const mongoose = require('mongoose')
require('./user.model')
const User = mongoose.model('users')
const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard')
mongoose.connect(DB_URL).then(() => console.log('MongoDb Connected'))
//переменные
var colvoref1
var colvoref2
var colvoref3

var md5 = require('md5');
const merchId = 69152
const payCost = 2000
var isStart = false
//конец переменных

bot = new TelegramBot(TOKEN, {
    polling: true
})


printNumbersInterval()
deleteDays()


bot.on('message', msg=> {
    const chatId = msg.chat.id
    const userId = msg.from.id






    User.findOne({telegramId: userId})
        .then(user => {
            //получили юзера с которым работаем!
            if (user) {
                //юзер есть уже


                switch (msg.text){
                    case kb.firstQuest.soglasieOne:
                        bot.sendMessage(chatId, 'Вы можете оптаить франшизу или посмотреть ответы на вопросы:', {
                            reply_markup: {
                                keyboard: keyboard.secondQuest,
                                resize_keyboard: true
                            }
                        })
                        break
                    case kb.secondQuest.ostalVopr:
                        bot.sendMessage(chatId, 'Вот вам поддробные ответы на вопросики, что-то еще?')
                        break
                    case kb.secondQuest.opltatit:

                        bot.sendMessage(chatId, 'Отлично, давайте начинать. Ваш индентификатор: ' + userId, {
                            reply_markup: {
                                remove_keyboard: true
                            }

                        })


                        const zakazNumber = userId
                        const secWord = 'g3ciap4h'
                        const createMD5 = md5 (merchId + ':' + payCost + ':' + secWord + ':' + zakazNumber)
                        const urlOplati = 'http://www.free-kassa.ru/merchant/cash.php' + '?' + 'm=' +
                            + merchId + '&' + "oa=" + payCost + '&' + "o=" + zakazNumber + '&' + "s=" + createMD5
//"ID Вашего магазина:Сумма платежа:Секретное слово:Номер заказа", пример
                        user.urlOplati = urlOplati
                        user.save()
                        setTimeout(function() {
                            bot.sendMessage(chatId, 'Оплатить: ', {
                                reply_markup: {
                                    inline_keyboard : [
                                        [{
                                            text: 'Оплатить 500k',
                                            url: urlOplati
                                        }]
                                    ]
                                }
                            })
                        }, 1500);

                        break
                }

                if (user.isBilaOlata === true){
// тут уже совершена оплата, замечательно. Тут принимаются сообщения от пользователей, которые оплатили
                    switch (msg.text) {
                        case "Привет":
                            bot.sendMessage(chatId, 'Привет андрей')
                            break
                        case "Накинь бабла":
                            user.days = user.days + 30
                            user.save()
                            bot.sendMessage(chatId, 'Пополнение совершено. На балансе ' + user.days)
                            break
                        case kb.gl.stat:
                            bot.sendMessage(chatId, 'Ваша стата:\n' +
                                'Ваш баланс :' + user.balance + '\nДней до следущей оплаты:' + user.days)
                            break
                        case kb.gl.chatenter:
                            bot.sendMessage(user.chatId, "Войди в чат, подними баблишко", {
                                reply_markup: {
                                    //Формирование ссылки на приват чат
                                    inline_keyboard: [
                                        [
                                            {
                                                text: 'Войти в чат',
                                                url: 'https://t.me/joinchat/AAAAAEqEGiRSzar_dYHRLQ'
                                            }
                                        ]
                                    ]
                                    //keyboard: keyboard.glMenu
                                }
                            })
                            break
                        case kb.gl.popolnSchet:
                            bot.sendMessage(chatId, 'Оплатить: ', {
                                reply_markup: {
                                    inline_keyboard : [
                                        [{
                                            text: 'Оплатить 500k',
                                            url: user.urlOplati
                                        }]
                                    ]
                                }
                            })
                            break
                        case kb.gl.refset:

                            User.count({refer1: userId}).then(userscount => {
                                colvoref1 = userscount
                            })
                            User.count({refer2: userId}).then(usercounttwo => {
                                colvoref2 = usercounttwo
                            })
                            User.count({refer3: userId}).then(usercounttre => {
                                colvoref3 = usercounttre
                            })

                            bot.sendMessage(chatId, 'Ваша реф сеть:\n Рефералов 1 уровня: ' + colvoref1 + "\n" +
                                "Рефералов 2 уровня: " + colvoref2 + "\nРефералов 3 уровня: " + colvoref3)

                            break
                        case kb.gl.refurl:
                            const reftempUr = 'https://telegram.me/TRBets_bot?start=' + userId
                            bot.sendMessage(chatId, 'Ваша реф ссылка.\nВсе пользователи, которые по ней перейдут,' +
                                'автоматически закрепляются за вами:\n' + reftempUr)
                            break
                        case kb.gl.spravka:
                            bot.sendMessage(chatId, 'Немного инфы по ставкам')
                            break
                        case kb.gl.support:
                            bot.sendMessage(chatId, 'Пишите этому челику')
                            break
                        case kb.gl.bettingKontora:
                            bot.sendMessage(chatId, 'Наша рефка беттинга')
                            break
                    }












                }

            }

        })

})




bot.onText(/\/start(.+)/, (msg, [source,match]) => {
    const userId = msg.from.id
    const chatId = msg.chat.id
    var refer = match.slice(1)
    isStart = true
    User.findOne({telegramId: userId})
        .then(user => {
            if (user) {
                if(user.isBilaOlata === true) {
                    bot.sendMessage(chatId, 'Рады снова видеть вас, оплативший!', {
                        reply_markup: {
                            keyboard: keyboard.glMenu
                        }
                    })
                } else {
                    //////////////////////
                    privetstvieFunk(chatId)
                }
            } else {
                //Реферальная система на четыре уровня
                user = new User({
                    telegramId: userId,
                    //тут сохраняем всех реферов в систему
                    refer1: refer,
                    chatId: chatId,
                    isBiloPriglashenie: false,
                    isBilaOlata: false
                })

                user.save()


                /////Доп условия

                User.findOne({telegramId: refer})
                    .then(refOne => {
                        if (refOne) {
                            //refer1
                            console.log(refOne.telegramId)
                            User.findOne({telegramId: refOne.refer1})
                                .then(refTwo =>{
                                    if(refTwo){
                                        console.log(refTwo.telegramId)
                                        user.refer2 = refTwo.telegramId
                                        user.save()
                                        /*
                                        User.findOne({telegramId: refTwo.refer1})
                                            .then(refTri =>{
                                                if(refTri) {
                                                    referTri = refTri.telegramId
                                                    User.findOne({telegramId: refTri.refer1})
                                                        .then(refFour => {
                                                            if(refFour) {
                                                                referFour = refFour.telegramId

                                                            }
                                                        })
                                                }
                                            })*/
                                        }
                                })
                        }
                    })





                //////////////////////
                privetstvieFunk(chatId)


            }
    })

})

bot.onText(/\/start/, msg => {
    const userId = msg.from.id
    const chatId = msg.chat.id

    if (isStart === true){
        isStart = false
    } else {
        User.findOne({telegramId: userId})
            .then(user => {
                if (user) {
                    if(user.isBilaOlata === true) {
                        bot.sendMessage(chatId, 'Рады снова видеть вас, оплативший!', {
                            reply_markup: {
                                keyboard: keyboard.glMenu
                            }
                        })
                    } else {
                        //////////////////////
                        privetstvieFunk(chatId)
                    }
                } else {
                    //Реферальная система на четыре уровня
                    user = new User({
                        telegramId: userId,
                        //тут сохраняем всех реферов в систему
                        chatId: chatId,
                        isBiloPriglashenie: false,
                        isBilaOlata: false
                    })

                    user.save()
                    privetstvieFunk(chatId)

                }
            })
    }



})



function printNumbersInterval() {
    var timerId = setInterval(function() {
// проверка на приглашение
        User.find({isBilaOlata: true, isBiloPriglashenie: false})
            .then(user => {
                user.forEach(user => {
                    if (user) {

                        bot.sendMessage(user.chatId, "Погнали, ты принят", {
                            reply_markup: {
                                //Формирование ссылки на приват чат
                                inline_keyboard: [
                                    [
                                        {
                                            text: 'Добавьтесь в группу',
                                            url: 'https://t.me/joinchat/AAAAAEqEGiRSzar_dYHRLQ'
                                        }
                                    ]
                                ]
                                //keyboard: keyboard.glMenu
                            }
                        })
                        setTimeout(function() {
                            bot.sendMessage(user.chatId, "Главное меню, будь здоров", {
                                reply_markup: {
                                    keyboard: keyboard.glMenu
                                }
                            })
                        }, 1500);

                        user.isBiloPriglashenie = true
                        user.save()

                    }
                })
            })

        // проверка на последующие оплаты
        //////////////////
        User.find({tempOplata:true})
            .then(user => {
                user.forEach(user => {
                    if (user) {
                        //поменять!!!!
                        if(user.isBiloPriglashenie === true) {
                            bot.sendMessage(user.chatId, 'Поздравляем, платеж прошел успешно!')
                        }
                        user.days = user.days + 30
                        if(user.isBilaOlata === false) {
                            user.isBilaOlata = true
                            user.save()
                            console.log(user)
                        }
                        user.tempOplata = false
                        user.save()

//Отсылает деньги рефералам:
                        User.findOne({telegramId: user.refer1})
                            .then(referFirst =>{
                                if(referFirst) {
                                    bot.sendMessage(referFirst.chatId, 'Привет, у тебя реферал первого уровня!')
                                    referFirst.balance = referFirst.balance + 500
                                    referFirst.save()
                                    bot.sendMessage(referFirst.chatId, referFirst.balance)
                                }
                            })
                        User.findOne({telegramId: user.refer2})
                            .then(referSecond =>{
                                if(referSecond) {
                                    bot.sendMessage(referSecond.chatId, 'Привет, у тебя реферал второго уровня!')
                                    referSecond.balance = referSecond.balance + 250
                                    referSecond.save()
                                    bot.sendMessage(referSecond.chatId, referSecond.balance)
                                }
                            })
                        User.findOne({telegramId: user.refer3})
                            .then(referTri =>{
                                if(referTri) {
                                    bot.sendMessage(referTri.chatId, 'Привет, у тебя реферал третьего уровня!')
                                    referTri.balance = referTri.balance + 100
                                    referTri.save()
                                    bot.sendMessage(referTri.chatId, referTri.balance)
                                }
                            })



                    }
                })
            })
        ////////////////











    }, 10000);
}


function deleteDays() {
    var timerIdTwo = setInterval(function() {
        //вывести всех юзеров и вычесть из их user.days = user.days -1
        User.find({}).then(user => {
            if(user){
            user.forEach(user => {
                if(user.days > 0) {
                    user.days = user.days - 1
                    user.save()
                }
                console.log(user)
                /// Тут мы баним и разбаниваем
                //Если юзер оплатил когда то, и если его дни равны 0 и он не забанен
                // = бан, если же оплатил и не равны нулю, но забанен = разбан
                if (user.isBilaOlata === true) {
                    if (user.isBiloPriglashenie === true) {
                        if (user.days === 0) {
                            if (user.isBanned === false) {
                                user.isBanned = true
                                user.save()
                                bot.sendMessage(user.chatId, 'Я вас баню!')
                            }
                        } else {
                            if (user.isBanned === true) {
                                user.isBanned = false
                                user.save()
                                bot.sendMessage(user.chatId, 'Я вас разбанил!')
                            }
                        }
                    }

                }

                ///

            })
            }
        })
    }, 30000)
}

function privetstvieFunk(chatId) {
    /// Тут приветсвие///
    setTimeout(function() {
        bot.sendPhoto(chatId, "https://cdn1.savepice.ru/uploads/2018/3/2/3ae945a1c2260f693a0530fd61e5c44f-full.png")
    }, 200);

    const text = '1 шаг\nДорогой друг, если ты целеустремленный и хочешь зарабатывать - то тебе к нам! Мы уверены, что с нами ты сможешь заработать десятки и даже сотни тысяч рублей. Сейчас мы расскажем тебе, как.  Для начала - открой файл. Там ты увидишь способ заработка на нашем продукте. Скажем сразу - он не один! А теперь внимательно изучи информацию в файле и начинай зарабатывать с нами!'

    setTimeout(function() {
        bot.sendMessage(chatId, text, {
            reply_markup: {
                keyboard: keyboard.firstQues,
                resize_keyboard: true
            }
        })
    }, 400);

    setTimeout(function() {
        //длинная пикча левайс
        bot.sendPhoto(chatId, "https://cdn1.savepice.ru/uploads/2018/3/2/b38f98f82411e91adf8b1a418c936646-full.png")
    }, 600);




    setTimeout(function() {
        bot.sendMessage(chatId, "Шаг 2\nКидаю файл")
    }, 800);

    /// Тут приветсвие заканчивается///
}



User.find().remove().then(users => console.log(users))
User.find().then(users => console.log(users))