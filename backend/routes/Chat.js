const express = require('express')
const Chat = require('../model/ChatModel')
const router = express.Router()

/* get all datas */
router.get('/messages', async(req, res) => {
    try {
        const messages = await Chat.find()
        res.status(201).json(messages)
    } catch(err) {
        console.log(err)
        res.status(500).json({ err: err.message })
    }
})

/* create messages */
router.post('/createMessages', async (req, res) => {
    try {
        const { message } = req.body
        const newMessages = new Chat({ message })
        await newMessages.save()
        res.status(201).json(newMessages)
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})





module.exports = router