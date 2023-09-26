const userModel = require('../models/userModels');
const jwt = require('jsonwebtoken');
require('dotenv').config

const itensService = {
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

    checkCredentials: async (req, res) => {
      const id = req.params.id;
      const user = await userModel.findById(id, '-password');
      if (!user) {
          return res.status(404).json({ message: 'Usuario não encontrado' });
      }
      return res.status(200).json({ message: user })
    },

    fetchUserLogged: async (token) => {
        const secret = process.env.SECRET
        const idUser = jwt.decode(token, secret)
        if(!idUser) return null
        const creatorUser = await userModel.findById(idUser.id);
        return creatorUser;
    }
}

module.exports = itensService;