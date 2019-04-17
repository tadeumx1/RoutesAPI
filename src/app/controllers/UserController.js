
const User = require('../models/User')
  
// User Controller

module.exports = {

  async store (req, res) {
    const { email } = req.body

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = await User.create(req.body)

    return res.json(user)
  },

  async findUser (req, res) {
    const { email } = req.params

    const user = await User.findOne(email)

    return res.json(user)
  },

}

