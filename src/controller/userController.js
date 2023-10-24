const services = require('../services/userService');
const userModel = require('./../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GoogleAuthProvider, signInWithPopup, User } = require("firebase/auth");
const { auth, loginWithGoogle } = require('../services/Login');
const userModels = require('./../models/userModels');

const userController = {
    create: async (req, res) => {
        try {
            debugger
            const user = {
                nome: req.body.nome,
                email: req.body.email,
                password: req.body.password,
                confirm_password: req.body.confirm_password
            }

            if (!user.nome) {
                return res.status(422).json({ message: 'Preencha o nome do formulario' })
            }

            else if (!user.email) {
                return res.status(422).json({ message: 'Preencha o email do formulario' })
            }

            else if (!user.password) {
                return res.status(422).json({ message: 'Preencha o senha do formulario' })
            }

            else if (user.confirm_password !== user.password) {
                return res.status(422).json({ message: 'Confirmação de senha não confere' })
            }

            const emaildb = await (services.checkExistEmail({ user }))
            if (emaildb) {
                return res.status(422).json({ message: 'Email já cadastrado' })

            } else {
                const salt = await bcrypt.genSalt(12)
                const passwordHash = await bcrypt.hash(user.password, salt)
                user.password = passwordHash
                user.confirm_password = passwordHash
                await userModel.create(user);
                console.log(user)
                return res.status(201).json({ msg: `Usuario registrado` })
            }

        } catch (error) {
            return console.log(error)
        }

    },

    login: async (req, res) => {

      const { email, password } = req.body;
      try {

          if (!email) {
              return res.status(422).json({ message: 'Preencha o email do formulario' })
          }

          if (!password) {
              return res.status(422).json({ message: 'Preencha o senha do formulario' })
          }

          const user = await userModel.findOne({ email: email })

          if (!user) {
              return res.status(404).json({ message: 'Não foi encontrado o email do formulario' })
          }

          const checkPassword = await bcrypt.compare(password, user.password)

          if (!checkPassword) {
              return res.status(422).json({ message: 'Preencha o senha corretamente' })
          }

          try {
              const secret = process.env.SECRET;
              const token = jwt.sign({
                  // O id do user irá junto com o token
                  id: user._id
              }, secret)
              return res.status(200).json({ Message: `${token}` })
          } catch (error) {
              console.log(error);
              return res.status(500).json({ message: 'Error' })
          }
      } catch (error) {
          console.log(error);
      }

    },

    loginWithEmailAndPassword: async (req, res, next) => {
        const { email, password } = req.body;
        console.log(email, password)
        let user = await loginWithGoogle.logarGoole(auth, email, password);
        if(user == null) {
           user = await loginWithGoogle.criarComGoogle(auth, email, password)
           return res.status(200).json({message: `O usuario cadastrado foi cadastrado${user}`}) 
        }
        console.log('usuario Google',user)
        return res.status(200).json({message: `O usuario logou ${user}`})        
    },

    deleteUser: async (req, res) => {
        const { id } = req.body;
        if(!id) return res.status(403).json({ message: "Id não enviado"});

        const user = await userModel.findByIdAndDelete(id);
        if (!user) return res.status(403).json({ message: "Usuario não encontrado"});

        return res.status(200).json({ message: `removido`})
    },

    listUser: async (req, res) => {
        if(req.method === 'GET') {
            const users = await userModel.find({}, '-password -confirm_password');
            console.log(users)
            return res.status(200).json({ users })
        }
    }
  };

  module.exports = userController;