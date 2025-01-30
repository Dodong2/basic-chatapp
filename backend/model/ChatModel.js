const mongoose = require('mongoose')

const chatSchema = mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        }
    },
    
    {
        timestamps: true,
    }
)

const Chat = mongoose.model('chats', chatSchema)

module.exports = Chat