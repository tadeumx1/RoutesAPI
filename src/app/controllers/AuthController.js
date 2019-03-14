
const User = require('../models/User')
const Mail = require('../services/Mail')
const crypto = require('crypto')

module.exports = {

    async resetPassword (req, res) {
    
        const { email, token, password} = req.body;

        try {

        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        console.log(user);
        console.log(user.name);
        console.log(user.email);
        console.log(user.passwordResetToken);

        if(!user)
        return res.status(400).send({ error: 'User not found' });

        if(token !== user.passwordResetToken)
        return res.status(400).send({ error: 'Token invalid' });

        const now = new Date();

        if(now > user.passwordResetExpires)
        return res.status(400).send({ error: 'Token expired, generate a new one' });

        user.password = password;

        await user.save();

        res.send();

        // Não precisamos encriptar a senha aqui pois estamos
        // fazendo isso usando o Mongoose no model de usuário

        } catch (err) {

            console.log(err)
            res.status(400).send({ error: ' Cannot reset password, try again' })

        }

    },

    async forgotPassword(req, res) {

        const { email } = req.body;

        try {
    
            const user = await User.findOne({ email });
    
            if(!user)
            return res.status(400).send({ error: 'User not found' });
    
            const token = crypto.randomBytes(20).toString('hex');
    
            const now = new Date();
    
            now.setHours(now.getHours() + 1);
    
            await User.findByIdAndUpdate(user.id , {
                
                '$set': {
    
                    passwordResetToken: token,
                    passwordResetExpires: now,
    
                }
    
            });
    
            Mail.sendMail({
    
                to: email,
                from: 'mtqr1@hotmail.com',
                template: 'forgot_password',
                context: { token },
                // Não precisamos passar a data de expiração do token
                // Pois vamos verificar na hora de resetar a senha
                
            }, (err) => {
    
                if(err)
                return res.status(400).send({ error: 'Cannot send forgot password email' });
    
                return res.send();
    
            })
    
            console.log(token, now);
    
        } catch (err) {
    
            res.status(400).send({ error: 'Error on forgot password, try again' })
    
        }

    }

}