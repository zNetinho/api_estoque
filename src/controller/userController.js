const services = require('../services/userService');
const userModel = require('./../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth, loginWithGoogle } = require('../services/Login');
const { fetchUser } = require('../shared/utils/funtions');

const userController = {
    create: async (req, res) => {
        try {
            debugger
            const user = {
                nome: req.body.nome,
                email: req.body.email,
                password: req.body.password,
                confirm_password: req.body.confirm_password,
                avatar: req.body.avatar
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
                return res.status(201).json({ msg: `Usuario registrado`, user })
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
                  id: user._id,
              }, secret)
              const userLogged = await fetchUser(token)
              console.log(token, userLogged)
              if(!userLogged) {
                return res.status(500).json({ message: "Erro ao adiquirir as informaçeos do usuario"})
              }
              return res.status(200).json({ token, userLogged })
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
        try {
            let user = await loginWithGoogle.logarGoole(auth, email, password);
        if(user == null) {
           console.log(user)
           user = await loginWithGoogle.criarComGoogle(auth, email, password)
           return res.status(200).json(user) 
        }
        console.log('usuario Google',user)
        return res.status(200).json({message: `O usuario logou ${user}`})
        } catch (error) {
            throw {
                toString: function () {
                    return "Verifique a função loginWithEmailAndPassword"
                }
            }
        }        
    },

    deleteUser: async (req, res) => {
        const { id } = req.body;
        if(!id) return res.status(403).json({ message: "Id não enviado"});

        try {
            const user = await userModel.findByIdAndDelete(id);
            if (!user) return res.status(403).json({ message: "Usuario não encontrado"});

            return res.status(200).json({ message: `removido`})
        } catch (error) {
            throw {
                toString: function () {
                    return "Verifique a função deleteUser"
                }
            }
        }
    },

    listUser: async (req, res) => {
        if(req.method === 'GET') {
            const users = await userModel.find({}, '-password -confirm_password');
            console.log(users)
            return res.status(200).json({ users })
        }
    },

    verifyToken: async (req, res, next) => {
        const token_jwt = req.headers.authorization
        const tokenSlice = token_jwt.slice(7)
        console.log(token_jwt)
        
        console.log(tokenSlice)
      
        if (!tokenSlice) {
          return res.status(401).json({ message: 'Token não fornecido' });
        }
      
        jwt.verify(tokenSlice, 'abacaxidemelancia', (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: 'Token inválido' });
          }
      
          req.user = decoded;
          const user = req.user
          console.log(user)
          return res.status(200).json()
        });
    },

    fetchUser: async (req, res) => {
        try {
            const user = await fetchUser(req);
        
            if (!user) {
              return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            console.log(user)
        
            // Aqui você pode retornar as informações relevantes do usuário
            res.json({
              userId: user._id,
              username: user.username,
              email: user.email,
              avatar: user.avatar
              // Adicione outros campos conforme necessário
            });
          } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar informações do usuário' });
          }
    }
  };

  module.exports = userController;