const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-v2';

const authMiddleware = (req, res, next) => {
    console.log("Headers:", req.headers);
    console.log("Authorization:", req.headers.authorization);

    // Acceder al encabezado Authorization
    const token = req.headers['authorization']; // 'authorization' en minúsculas
    if (!token) {
        return res.status(400).json({ msg: "Error", info: "Token no proporcionado" });
    }

    // Verificar el token JWT
    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
        if (err) {
            const errorMessage = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
            return res.status(403).json({ msg: "Error", info: errorMessage });
        }

        req.user = { id: decoded.id }; // Agregar información del usuario al request
        next(); // Pasar al siguiente middleware o controlador
    });
};

module.exports = { authMiddleware };
