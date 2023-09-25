const jwt = require('jsonwebtoken');


 const JWTvalidator = (handler) => 
    async (req, res) => {

        const { SECRET } = process.env;
        if (!SECRET) {
            return res.status(500).json({ error: 'Error in JWT token' })
        }

        if (!req || !req.headers) {
            return res.status(401).json({ error: 'Token invalid' })
        }

        if (req.method !== 'OPTIONS') {
            const authorization = req.headers['authorization'];
            if (!authorization) {
                return res.status(401).json({ error: 'Not possible validation token' })
            }
            const token = authorization.substring(7);
            if (!token) {
                return res.status(401).json({ error: 'Not possible validation token' })
            }
            const decoded = jwt.verify(token, SECRET);
            if (!decoded) {
                return res.status(401).json({ error: 'Not possible validation token' })
            }

            if(!req.query) {
                req.query = {};
            }

            req.query.idUser = decoded._id
        }
        return handler(req, res);
    }

module.exports = JWTvalidator