const jwt = require('jsonwebtoken');
require('dotenv').config;
const userModel = require('../../models/userModels')

const utils = {
  checkToken: (req, res, next) => {
    // const authHeader = req.headers.authorization;
    // Se encontrar algo no headers, ele vai fazer o split, e transformar em um array separando as palavras
    // pelo espaço e pega o segundo item que e o token sem a palavra Bearer.
    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
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
  },

  fetchUserLogged: async (req) => {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.SECRET
      const idUser = jwt.decode(token, secret)
      if(!idUser) return null
      const creatorUser = await userModel.findById(idUser.id);
      console.log(creatorUser.nome)
        return creatorUser.nome;
  }
}

module.exports = utils;