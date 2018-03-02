const mongoose = require('mongoose')
const  Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,

    },
    email: {
        type: String,

    },

    telegramId: {
        type: String,
        required: true
    },

    chatId: {
        type: String
    },

    refer1: {
        type: String
    },
    refer2: {
        type: String
    },
    refer3: {
        type: String
    },
    refer4: {
        type: String
    },
    referURL: {
        type: String
    },

    isBilaOlata: {
        type: Boolean,
        default: false
    },

    isBiloPriglashenie: {
        type: Boolean,
        default: false
    },

    days :{
        type: Number,
        default: 0
    },

    tempOplata:{
        type: Boolean,
        default: false
    },
    balance: {
        type: Number,
        default: 0
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    urlOplati: {
        type: String
    }

})

mongoose.model('users', UserSchema)