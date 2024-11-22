const { default: mongoose } = require('mongoose');
const User = require('../Models/mUser');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-v2';
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || 'your-refresh-secret-key'; // Define un secret para el refresh token

const { ObjectId } = require("mongodb");

// Login con autenticación y generación de token
exports.login = function(req, res) {
    const { usuario, password } = req.body;

    // Realizar la consulta con .then en lugar de await
    User.findOne({ usuario: usuario, password: password })
        .then(user => {
            if (!user) {
                return res.status(401).json({ msg: "Error", info: "Credenciales inválidas" });
            }

            // Generar el access token
            const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

            // Generar el refresh token
            const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

            // Aquí podrías guardar el refresh token en la base de datos para asociarlo con el usuario si lo deseas.

            res.json({ msg: "OK", info: { accessToken, refreshToken } });
        })
        .catch(error => {
            console.error("Error en login:", error);
            res.status(500).json({ msg: "Error", info: "Error en el servidor" });
        });
};

exports.refreshToken = function(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ msg: "Error", info: "Refresh token no proporcionado" });
    }

    // Verificar el refresh token
    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Error", info: "Refresh token inválido o expirado" });
        }

        // Si el refresh token es válido, generar un nuevo access token
        const newAccessToken = jwt.sign({ id: decoded.id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ msg: "OK", info: { accessToken: newAccessToken } });
    });
};

exports.ValidToken = function(req, res) {
    const token = req.headers['Authorization'];

    if (!token) {
        return res.status(400).json({ msg: "Error", info: "Token no proporcionado" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            let errorMessage = 'Token inválido';
            if (err.name === 'TokenExpiredError') {
                errorMessage = 'Token expirado';
            }
            return res.status(403).json({ msg: "Error", info: errorMessage });
        }

        // Convertir iat y exp a fechas legibles
        const issuedAt = new Date(decoded.iat * 1000).toLocaleString(); // Fecha de emisión
        const expiration = new Date(decoded.exp * 1000).toLocaleString(); // Fecha de expiración

        // Devolver los datos decodificados y las fechas legibles
        res.json({
            msg: "OK",
            info: {
                userId: decoded.id,
                issuedAt: issuedAt,   // Fecha de emisión
                expiration: expiration // Fecha de expiración
            }
        });
    });
};

exports.insUser = function(req, res) {
    try {
        const { usuario, password } = req.body.info;

        // Verificar si ya existe un usuario con el mismo nombre
        User.findOne({ usuario: usuario })
            .then(existingUser => {
                if (existingUser) {
                    // Si el usuario ya existe, devolver un error
                    return res.status(400).json({ msg: "Error", info: "El nombre de usuario ya está en uso" });
                }

                // Si no existe, crear el nuevo usuario
                var nUser = new User({
                    usuario: usuario,  // Asignar valores directamente
                    password: password
                });

                nUser.save()
                    .then(() => {
                        res.send({ msg: "OK", info: "Usuario creado - OK" });
                    })
                    .catch((err) => {
                        console.log("Error en la creación del Usuario: ", err);
                        res.status(500).send({ msg: "ER", info: "Creación del Usuario fallida" });
                    });
            })
            .catch((err) => {
                console.error("Error al verificar el nombre de usuario:", err);
                res.status(500).send({ msg: "ER", info: "Error al verificar el usuario" });
            });

    } catch (error) {
        console.log("Error en la creación del Usuario", error);
        res.status(500).send({ msg: "ER", info: "Error en el servidor" });
    }
};



//Consulta de Usuario por id
exports.getUser = function(req, res) {
    try {
        const id = new ObjectId(req.body.info.id); // Convertir a ObjectId

        User.find({ _id:  id})
            .then((rta) => {
                console.log("Rta del servidor bbdd consultar Usuario x id:", rta);
                res.send({ msg: "OK", info: rta });
            })
            .catch((err) => {
                console.log("ERR:", err);
                res.status(500).send({ msg: "ER", info: "Informacion no disponible" });
            });
    } catch (error) {
        console.log("ERR: consultando Usuario x id - ", error);
        res.status(500).send({ msg: "ER", info: "Error en el servidor" });
    }
};

// Update de Usuario
exports.updUser = function(req, res) {
    try {
        const idUsr = new ObjectId(req.body.id); // Convertir a ObjectId
        
        User.updateOne(
            { _id: idUsr },
            {
                $set: {
                    "usuario": req.body.usuario,
                    "password": req.body.password,              
                }
            }
        )
        .then((rta) => {
            console.log("rta:::>", rta);
            res.send({ msg: "OK", info: rta });
        })
        .catch((err) => {
            console.error("Error en la actualización:", err);
            res.status(500).send({ msg: "ER", info: "Error en la actualización del Usuario", error: err.message });
        });
    } catch (error) {
        console.error("ER: en la actualización del Usuario", error);
        res.status(500).send({ msg: "ER", info: "Error en la actualización del Usuario", error: error.message });
    }
};

exports.eliUser = function(req,res) {
    try {

        const idUsr = new mongoose.Types.ObjectId( req.body.info.iid ) ;
        
        User.deleteOne( {_id: idUsr} )
        .then( (rta) => {
            console.log( "rta:::>" + rta ) ;

            res.send( { msg:"OK",info: rta } ) ;
        } )
        .catch( (err) => {
            res.send( { msg:"ER",info: "Eliminacion del Usuario" } ) ;
        } ) ;
    } catch (error) {
        console.log( "ER: en la eliminacion del Usuario" ) ;
    }
} ;