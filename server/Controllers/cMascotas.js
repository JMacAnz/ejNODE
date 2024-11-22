const { default: mongoose } = require('mongoose');
const Masc = require('../Models/mMascotas');
const Pase = require('../Models/mPaseo');
const { ObjectId } = require("mongodb");

// Función para manejar errores
const handleError = (res, err, customMessage) => {
    console.error(customMessage, err);
    res.status(500).send({ msg: "ER", info: customMessage, error: err.message });
};

// Obtener todas las mascotas
exports.getAllMasc = async (req, res) => {
    try {
        const rta = await Masc.find({});
        // console.log('Mascota: ', rta);
        res.send({ msg: "ok", info: rta });
    } catch (err) {
        handleError(res, err, "Información no disponible");
    }
};

// Crear una nueva mascota
exports.insMasc = async (req, res) => {
    try {
        if (!req.body || !req.body.info) {
            return res.status(400).send({ msg: "ER", info: "Faltan datos en la solicitud" });
        }

        const newMascota = new Masc(req.body.info);
        await newMascota.save();
        res.send({ msg: "OK", info: "Mascota creada correctamente" });
    } catch (error) {
        handleError(res, error, "Error en la creación de la mascota");
    }
};

// Obtener una mascota por ID
exports.getMasc = async (req, res) => {
    try {
        if (!req.body || !req.body.info || !req.body.info.id) {
            return res.status(400).send({ msg: "ER", info: "Faltan datos en la solicitud" });
        }

        const id = req.body.info.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ msg: "ER", info: "ID no válido" });
        }

        const rta = await Masc.findById(id);
        if (!rta) {
            return res.status(404).send({ msg: "ER", info: "Mascota no encontrada" });
        }

        console.log("Respuesta: ", rta);
        res.send({ msg: "OK", info: rta });
    } catch (err) {
        handleError(res, err, "Error consultando mascota por ID");
    }
};

// Actualizar una mascota
exports.updMasc = async (req, res) => {
    try {
        // Inicio de la solicitud
        console.log("Inicio de actualización de mascota. Body recibido: ", JSON.stringify(req.body));

        // Validación del cuerpo de la solicitud
        if (!req.body || !req.body.info || !req.body.info.id) {
            console.log("Error: Faltan datos en la solicitud. Body: ", req.body);
            return res.status(400).send({ msg: "ER", info: "Faltan datos en la solicitud" });
        }

        // Validar el ID
        const idMasc = req.body.info.id;
        console.log("ID de mascota recibido: ", idMasc);
        if (!mongoose.Types.ObjectId.isValid(idMasc)) {
            console.log("Error: ID de mascota no válido. ID: ", idMasc);
            return res.status(400).send({ msg: "ER", info: "ID no válido" });
        }

        // Preparar los datos para la actualización
        const updates = {
            nommas: req.body.info.nommas,
            edad: req.body.info.edad,
            raza: req.body.info.raza,
            genero: req.body.info.genero,
            recomendaciones: req.body.info.recomendaciones,
            duenoid: req.body.info.duenoid,
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
        const rta = await Masc.updateOne({ _id: idMasc }, { $set: updates });
        console.log("Resultado de la actualización: ", rta);

        // Validar resultado de la actualización
        if (rta.matchedCount === 0) {
            console.log("Error: Mascota no encontrada para actualizar. ID: ", idMasc);
            return res.status(404).send({ msg: "ER", info: "Mascota no encontrada para actualizar" });
        }

        // Éxito
        console.log("Mascota actualizada correctamente. ID: ", idMasc);
        res.send({ msg: "OK", info: "Mascota actualizada correctamente" });

    } catch (err) {
        console.log("Error en el try-catch: ", err);
        handleError(res, err, "Error en la actualización de la mascota");
    }
};

// Eliminar una mascota
exports.eliMasc = async (req, res) => {
    try {
        if (!req.body || !req.body.info || !req.body.info.id) {
            return res.status(400).send({ msg: "ER", info: "Faltan datos en la solicitud" });
        }

        const idMasc = req.body.info.id;
        if (!mongoose.Types.ObjectId.isValid(idMasc)) {
            return res.status(400).send({ msg: "ER", info: "ID no válido" });
        }

        // Verificar si la mascota está asociada a algún paseo
        const paseoRelacionado = await Pase.findOne({ mascid: idMasc });
        if (paseoRelacionado) {
            return res.status(400).send({ 
                msg: "ER", 
                info: "No se puede eliminar la mascota porque está asociada a un paseo." 
            });
        }

        // Proceder con la eliminación si no hay paseos asociados
        const rta = await Masc.deleteOne({ _id: idMasc });
        if (rta.deletedCount === 0) {
            return res.status(404).send({ msg: "ER", info: "Mascota no encontrada para eliminar" });
        }

        console.log("Eliminación: ", rta);
        res.send({ msg: "OK", info: "Mascota eliminada correctamente" });
    } catch (err) {
        console.error("Error eliminando mascota:", err);
        res.status(500).send({ msg: "ER", info: "Error eliminando mascota." });
    }
};


// Obtener todas las mascotas con información de dueño
exports.getAllMascD = async (req, res) => {
    try {
        const rta = await Masc.aggregate([
            {
                $lookup: {
                    from: "duens", // Nombre de la colección de dueños
                    localField: "duenoid",
                    foreignField: "_id",
                    as: "infDuen"
                }
            },
            { $unwind: "$infDuen" },
            { $match: { infDuen: { $ne: null } } } // Filtrar resultados sin dueños
        ]);

        //console.log("Resultado: ", rta);
        res.send({ msg: "ok", info: rta });
    } catch (err) {
        handleError(res, err, "Información no disponible");
    }
};
