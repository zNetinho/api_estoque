const jwt = require('jsonwebtoken');
require('dotenv').config;
const userModel = require('../../models/userModels')

const utils = {
  checkToken: async (req, res, next) => {
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
      const token = req.headers?.authorization?.split(' ')[1];
      const secret = process.env.SECRET
      const idUser = jwt.decode(token, secret)
      if(!idUser) return null
      const creatorUser = await userModel.findById(idUser.id);
      console.log(creatorUser.nome)
        return creatorUser.nome;
  },

  fetchUser: async (token) => {
    const secret = process.env.SECRET
    const idUser = jwt.decode(token, secret)
    if(!idUser) return null
    const User = await userModel.findById(idUser.id, '-password -confirm_password -__v');
    console.log(User)
      return User;
},

  createASlug: (nomeProduto) => {
    const regexAcentos = /[áàãâäéèêëíìîïóòõôöúùûü]/g;
    const regexEspacos = /\s+/g;
    const nomeLimpo = nomeProduto.replace(regexAcentos, function (match) {
      const mapaAcentos = {
        'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
        'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
      };
      return mapaAcentos[match];
    });
    return nomeLimpo.replace(regexEspacos, "-").toLowerCase();
  }
}

module.exports = utils;