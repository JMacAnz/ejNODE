const { default: mongoose } = require('mongoose');
const Pase = require('../Models/mPaseo');
const { ObjectId } = require("mongodb");

// Función para manejar errores
const handleError = (res, err, customMessage) => {
    console.error(customMessage, err);
    res.status(500).send({ msg: "ER", info: customMessage, error: err.message });
};

// Obtener todas las Paseos
exports.getAllPase = async (req, res) => {
    try {
        const rta = await Pase.find({});
        // console.log('Paseo: ', rta);
        res.send({ msg: "ok", info: rta });
    } catch (err) {
        handleError(res, err, "Información no disponible");
    }
};

// Crear una nueva Paseo
exports.insPase = async (req, res) => {
    try {
        if (!req.body || !req.body.info) {
            return res.status(400).send({ msg: "ER", info: "Faltan datos en la solicitud" });
        }

        const newPaseo = new Pase(req.body.info);
        await newPaseo.save();
        res.send({ msg: "OK", info: "Paseo creada correctamente" });
    } catch (error) {
        handleError(res, error, "Error en la creación de la Paseo");
    }
};

// Obtener una Paseo por ID
exports.getPase = async (req, res) => {
    try {
        if (!req.body || !req.body.info || !req.body.info.id) {
            return res.status(400).send({ msg: "ER", info: "Faltan datos en la solicitud" });
        }

        const id = req.body.info.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ msg: "ER", info: "ID no válido" });
        }

        const rta = await Pase.findById(id);
        if (!rta) {
            return res.status(404).send({ msg: "ER", info: "Paseo no encontrada" });
        }

        console.log("Respuesta: ", rta);
        res.send({ msg: "OK", info: rta });
    } catch (err) {
        handleError(res, err, "Error consultando Paseo por ID");
    }
};

// Actualizar una Paseo
exports.updPase = async (req, res) => {
    try {
        // Inicio de la solicitud
        console.log("Inicio de actualización de Paseo. Body recibido: ", JSON.stringify(req.body));

        // Validación del cuerpo de la solicitud
        if (!req.body || !req.body.info || !req.body.info.id) {
            console.log("Error: Faltan datos en la solicitud. Body: ", req.body);
            return res.status(400).send({ msg: "ER", info: "Faltan datos en la solicitud" });
        }

        // Validar el ID
        const idPase = req.body.info.id;
        console.log("ID de Paseo recibido: ", idPase);
        if (!mongoose.Types.ObjectId.isValid(idPase)) {
            console.log("Error: ID de Paseo no válido. ID: ", idPase);
            return res.status(400).send({ msg: "ER", info: "ID no válido" });
        }

        // Preparar los datos para la actualización
        const updates = {
            fecpas: req.body.info.fecpas,
            horpas: req.body.info.horpas,
            tiepas: req.body.info.tiepas,
            mascid: req.body.info.mascid,
            paseadoreid: req.body.info.paseadoreid,
            novpas: req.body.info.novpas,
        };

        console.log("Datos de actualización inicial: ", updates);

        // Filtrar campos no definidos
        Object.keys(updates).forEach(key => {
            if (updates[key] === undefined) {
                console.log(`Campo eliminado de updates: ${key}`);
                delete updates[key];
            }
        });

        console.log("Datos de actualización final después del filtrado: ", updates);

        // Realizar la actualización
        const rta = await Pase.updateOne({ _id: idPase }, { $set: updates });
        console.log("Resultado de la actualización: ", rta);

        // Validar resultado de la actualización
        if (rta.matchedCount === 0) {
            console.log("Error: Paseo no encontrada para actualizar. ID: ", idPase);
            return res.status(404).send({ msg: "ER", info: "Paseo no encontrada para actualizar" });
        }

        // Éxito
        console.log("Paseo actualizada correctamente. ID: ", idPase);
        res.send({ msg: "OK", info: "Paseo actualizada correctamente" });

    } catch (err) {
        console.log("Error en el try-catch: ", err);
        handleError(res, err, "Error en la actualización de la Paseo");
    }
};


// Eliminar una Paseo
exports.eliPase = async (req, res) => {
    try {
        if (!req.body || !req.body.info || !req.body.info.id) {
            return res.status(400).send({ msg: "ER", info: "Faltan datos en la solicitud" });
        }

        const idPase = req.body.info.id;
        if (!mongoose.Types.ObjectId.isValid(idPase)) {
            return res.status(400).send({ msg: "ER", info: "ID no válido" });
        }

        const rta = await Pase.deleteOne({ _id: idPase });
        if (rta.deletedCount === 0) {
            return res.status(404).send({ msg: "ER", info: "Paseo no encontrada para eliminar" });
        }

        console.log("Eliminación: ", rta);
        res.send({ msg: "OK", info: "Paseo eliminada correctamente" });
    } catch (err) {
        handleError(res, err, "Error eliminando Paseo");
    }
};

// Obtener todas las Paseos con información de paseador y mascota
exports.getAllPascD = async (req, res) => {
    try {
        const rta = await Pase.aggregate([
            {
                $lookup: {
                    from: "paseadores", 
                    localField: "paseadoreid",
                    foreignField: "_id",
                    as: "infPaseador"
                }
            },
            {
                $lookup: {
                    from: "mascs", 
                    localField: "mascid",
                    foreignField: "_id",
                    as: "infMasco"
                }
            },
            { $unwind: { path: "$infPaseador", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$infMasco", preserveNullAndEmptyArrays: true } },
            // { $match: { infPaseador: { $ne: null } } } // Comentado para obtener todos los resultados, incluso si no hay paseadores
        ]);

        console.log("Resultado: ", rta);
        res.send({ msg: "ok", info: rta });
    } catch (err) {
        handleError(res, err, "Información no disponible");
    }
};

