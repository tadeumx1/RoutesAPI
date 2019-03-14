const User = require ('../models/User')

// Session Controller

module.exports = {

    async store (req, res) {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if(!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        // Comparar as senhas

        if ( !await user.compareHash(password) ) {

            return res.status(400).json({ error: 'Invalid password' })

        }

        const userResponse = await User.findOne({ email }).select('-password')

        return res.json({ userResponse, token: User.generateToken(user) })
        
    }
}