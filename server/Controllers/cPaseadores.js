const { default: mongoose } = require('mongoose');
const Paseadore = require('../Models/mPaseadores');
const Pase = require('../Models/mPaseo');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-v2';


// Función getParamPost
exports.getParamPost = (req, res, next) => {
    res.end("<html><head><title>Paseadores</title></head><body>En GET:Nombre:" + req.query.nombre + "---Horario:" + req.query.horario + "</h1></body></html>");
};

// Función getUsers
exports.getUsers = (req, res) => {
    if (req.query.id == '123') {
        var usr = {
            id: '123',
            email: "fullstack@tt.com",
            first_name: "FULL",
            last_name: "STACK",
            avatar: "https://reqres.in/img/faces/7-image.jpg"
        }

        res.send(usr);
    } else {
        res.statusCode = 404;
        res.send("<html><head><title>ERROR</title></head><body>Id usuario:" + req.body.id + ", no existe</h1></body></html>");
    }
};

// Función getAllPaseadores sin relacionar tabla de horarios
exports.getAllPaseadores = function (req, res, next) {
    try {
        Paseadore.find({})
            //.populate('horario') // Agregar populate para incluir el horario
            .then((rta) => {
                // console.log('Paseadores: ', rta);
                res.send({ msg: "ok", info: rta });
            })
            .catch((err) => {
                console.log('Error consultando paseadores: ', err);
                res.send({ msg: "ER", info: "informacion no disponible" });
            });
    } catch (error) {
        console.log('Error consultando paseadores: ', error);
        res.status(500).send(error.message);
    }
};
// CREACION DE PASEADORES
exports.insPas = function (req, res) {
    try {
        //console.log("Creando paseador: ", req.body.info);
        var nPas = new Paseadore(req.body.info);
        // const nPas = new Paseadore({
        //     nompas: req.body.info.nompas,
        //     tipide: req.body.info.tipide,
        //     numide: req.body.info.numide,
        //     numcelpas: req.body.info.numcelpas,
        //     email: req.body.info.email,
        //     numcelemp: req.body.info.numcelemp,
        //     diremp: req.body.info.diremp,
        //     dirpas: req.body.info.dirpas,
        //     imgpas: req.body.info.imgpas,
        //     tarifa: req.body.info.tarifa,
        //     calpas: req.body.info.calpas
        // });

        nPas.save()
            .then(() => res.send({ msg: "OK", info: "Paseador creado - OK" }))
            .catch((err) => {
                console.log("Error en la creación del paseador: ", err);
                res.status(500).send({ msg: "ER", info: "Creacion del paseador" });
            });
    } catch (error) {
        console.log("ER: en la creación del paseador", error);
        res.status(500).send({ msg: "ER", info: "Error en el servidor" });
    }
};


// Similarmente para getPas
exports.getPas = function (req, res) {
    try {
        Paseadore.find({ id: req.body.info.id })
            .then((rta) => {
                console.log("Rta del servidor bbdd consultar paseador x id:", rta);
                res.send({ msg: "OK", info: rta });
            })
            .catch((err) => {
                console.log("ERR:", err);
                res.status(500).send({ msg: "ER", info: "Informacion no disponible" });
            });
    } catch (error) {
        console.log("ERR: consultando paseador x id - ", error);
        res.status(500).send({ msg: "ER", info: "Error en el servidor" });
    }
};

// CREACION DE PASEADORES
exports.updPas = async function (req, res) {
    try {
        const info = req.body.info;
        console.log("Datos recibidos para actualizar: ", info);

        if (!info._id) {
            return res.status(400).send({ msg: "ER", info: "Falta el _id para actualizar el paseador" });
        }

        const idPas = new mongoose.Types.ObjectId(info._id);

        // Normalizar los valores para evitar problemas con mayúsculas/minúsculas o espacios adicionales
        const newEmail = info.Email.trim().toLowerCase(); // Normalizando el email recibido
        const currentPaseador = await Paseadore.findOne({ _id: idPas });

        if (currentPaseador && currentPaseador.Email.trim().toLowerCase() === newEmail) {
            console.log("El email no ha cambiado");
        } else {
            console.log("El email ha cambiado");
        }

        // Realizar la actualización sin comparar el email, ya que la lógica ya ha sido verificada
        const rta = await Paseadore.updateOne(
            { _id: idPas },
            {
                $set: { 
                    nompas: info.nompas,
                    Tipide: info.Tipide,
                    Numide: info.Numide,
                    Numcelpas: info.Numcelpas,
                    Email: newEmail, // Asegurarse de actualizar el email normalizado
                    Numcelemp: info.Numcelemp,
                    Diremp: info.Diremp,
                    Dirpas: info.Dirpas,
                    Imgepas: info.Imgepas,
                    Tarifa: info.Tarifa,
                    Calpas: info.Calpas
                }
            }
        );

        console.log("Respuesta de la actualización:", rta);
        if (rta.modifiedCount > 0) {
            res.send({ msg: "OK", info: "Paseador actualizado correctamente" });
        } else {
            res.status(400).send({ msg: "ER", info: "No se realizaron cambios. Verifique los datos." });
        }

    } catch (error) {
        console.error("Error en la actualización del paseador:", error);
        res.status(500).send({ msg: "ER", info: "Error en la actualización del paseador", error: error.message });
    }
};


// ELIMINACION DE PASEADORES
exports.eliPas = async function (req, res) {
    try {
        if (!req.body || !req.body.info || !req.body.info.iid) {
            return res.status(400).send({ msg: "ER", info: "Faltan datos en la solicitud" });
        }

        const idPas = req.body.info.iid;

        if (!mongoose.Types.ObjectId.isValid(idPas)) {
            return res.status(400).send({ msg: "ER", info: "ID no válido" });
        }

        // Verificar si el paseador está asociado a algún paseo
        const paseoRelacionado = await Pase.findOne({ paseadoreid: idPas });
        if (paseoRelacionado) {
            return res.status(400).send({
                msg: "ER",
                info: "No se puede eliminar el paseador porque está asociado a un paseo."
            });
        }

        // Proceder con la eliminación si no hay paseos asociados
        const rta = await Paseadore.deleteOne({ _id: idPas });
        if (rta.deletedCount === 0) {
            return res.status(404).send({ msg: "ER", info: "Paseador no encontrado para eliminar." });
        }

        console.log("Eliminación: ", rta);
        res.send({ msg: "OK", info: "Paseador eliminado correctamente." });
    } catch (err) {
        console.error("Error eliminando paseador:", err);
        res.status(500).send({ msg: "ER", info: "Error eliminando paseador." });
    }
};


// Función getAllPaseadores con la relacion tabla de horarios
exports.getAllPaseadoresH = function (req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        console.log('Authorization Header:', authHeader);  // Esto te ayudará a verificar que está llegando correctamente
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(403).send({ msg: "ER", info: "Token no proporcionado" });
        }

        console.log('Token recibido:', token); // Verifica que el token se extrae correctamente

        Paseadore.aggregate([
            {
                $lookup: {
                    from: "horarios",
                    localField: "idhora",
                    foreignField: "_id",
                    as: "infpas"
                }
            },
            {
                $unwind: "$infpas"
            }
        ])
            .then((rta) => {
                console.log('rta: ', rta);
                res.send({ msg: "ok", info: rta });
            })
            .catch((err) => {
                console.log('Error consultando paseadores: ', err);
                res.send({ msg: "ER", info: "informacion no disponible" });
            });
    } catch (error) {
        console.log('Error consultando paseadores: ', error);
        res.status(500).send(error.message);
    }
};



//Validacion del usuario y creacion de token
exports.login = function (req, res) {
    const { usuario, password } = req.body;

    // Simulación de base de datos
    const users = [
        { id: 1, usuario: 'admin', password: 'admin123' },
        { id: 2, usuario: 'user', password: 'user456' }
    ];

    const user = users.find(u => u.usuario === usuario && u.password === password);

    if (!user) {
        return res.status(401).json({ msg: "Error", info: "Credenciales inválidas" });
    }

    // Generar el token
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ msg: "OK", info: token });
};

exports.ValidToken = function (req, res) {
    const token = req.headers['token'];

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
