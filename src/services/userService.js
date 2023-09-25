const userModel = require('../models/userModels');
const jwt = require('jsonwebtoken');
require('dotenv').config

const services = {
    checkUserForm: async ({user}) => {
        if (!user.name) {
            res.status(422).json({message: 'Preencha o nome do formulario'})
        };
        if (!user.email) {
            return console.log('Preencha o email do formulario');
        };
        if (!user.password) {
            return console.log('Preencha o password do formulario');
        };
        if (!user.confirm_password) {
            return console.log('Preencha o confirm_password do formulario');
        };

        // checkUserFormLength()
        return true;
    },

    checkUserFormLength: ({user}) => {
        if ( toString(user.name).length < 3 || toString(user.email).length < 10 || toString(user.confirm_password).length< 3 || toString(user.confirm_password).length < 3) {
            return false;
        };
        return true;
    },
    checkExistEmail: async ({ user }) => {
        const emaildb = await userModel.findOne({ email: user.email })
        if(emaildb) {
            return true;
        }
        return false;
    },

    checkToken: (req, res, next) => {
        // const authHeader = req.headers.authorization;
        // Se encontrar algo no headers, ele vai fazer o split, e transformar em um array separando as palavras
        // pelo espaço e pega o segundo item que e o token sem a palavra Bearer.
        const token = req.headers.authorization.split(' ')[1];

        if(!token) {
            return res.status(401).json({ message: 'Acesso não autorizado' })
        }
        try {
            const secret = process.env.SECRET
            jwt.verify(token, secret)
            next();

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Houve um erro no servidor' })
        }
    }

}

module.exports = services;