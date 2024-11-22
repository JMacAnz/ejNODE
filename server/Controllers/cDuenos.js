const { default: mongoose } = require('mongoose');
const Duen = require('../Models/mDuenos');
const Masc = require('../Models/mMascotas');
const { ObjectId } = require("mongodb");

// Función getAllDue sin relacionar
exports.getAllDue = function(req, res, next) {
    try {
        Duen.find({})
            .then((rta) => {
                console.log('dueño: ', rta);
                res.send({ msg: "ok", info: rta });
            })
            .catch((err) => {
                console.log('Error consultando dueño: ', err);
                res.send({ msg: "ER", info: "informacion no disponible" });
            });
    } catch (error) {
        console.log('Error consultando dueño: ', error);
        res.status(500).send(error.message);
    }
};

// CREACION DE DUEÑO
exports.insDue = function(req, res) {
    try {
        var nDue = new Duen(req.body.info); // Asumiendo que 'info' tiene todos los campos
        nDue.save()
            .then(() => {
                res.send({ msg: "OK", info: "Dueño creado - OK" });
            })
            .catch((err) => {
                console.log("Error en la creación del Dueño: ", err);
                res.status(500).send({ msg: "ER", info: "Creacion del Dueño" });
            });
    } catch (error) {
        console.log("ER: en la creación del Dueño", error);
        res.status(500).send({ msg: "ER", info: "Error en el servidor" });
    }
};

//Consulta de Dueño por id
exports.getDue = function(req, res) {
    try {
        const id = new ObjectId(req.body.info.id); // Convertir a ObjectId

        Duen.find({ _id:  id})
            .then((rta) => {
                console.log("Rta del servidor bbdd consultar Dueño x id:", rta);
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

// Update de Dueño
exports.updDue = function(req, res) {
    try {
        const idDue = new ObjectId(req.body.info.id); // Convertir a ObjectId
        
        Duen.updateOne(
            { _id: idDue },
            {
                $set: {
                    "nomdue": req.body.info.nomdue,
                    "teldue": req.body.info.teldue,
                    "dirdue": req.body.info.dirdue,
                    "cordue": req.body.info.cordue                 
                }
            }
        )
        .then((rta) => {
            console.log("rta:::>", rta);
            res.send({ msg: "OK", info: rta });
        })
        .catch((err) => {
            console.error("Error en la actualización:", err);
            res.status(500).send({ msg: "ER", info: "Error en la actualización del Dueño", error: err.message });
        });
    } catch (error) {
        console.error("ER: en la actualización del paseador", error);
        res.status(500).send({ msg: "ER", info: "Error en la actualización del Dueño", error: error.message });
    }
};
exports.eliDue = async function (req, res) {
    try {
        console.log("req.body.info.id:", req.body.info.id);

        // Convertir el id a ObjectId
        const idDue = new ObjectId(req.body.info.id);

        console.log("Verificando relaciones del dueño con id:", idDue);

        // Verificar si el dueño está relacionado con alguna mascota
        const mascsRelacionadas = await Masc.findOne({ duenoid: idDue });
        if (mascsRelacionadas) {
            // Si hay una relación con mascotas, no permitir la eliminación
            return res.status(400).send({ 
                msg: "ER", 
                info: "No se puede eliminar el dueño porque tiene mascotas asociadas." 
            });
        }

        console.log("Eliminando dueño con id:", idDue);

        // Realizar la eliminación en la base de datos
        const rta = await Duen.deleteOne({ _id: idDue });
        if (rta.deletedCount === 0) {
            // Si no se eliminó ningún documento, enviar un error
            return res.status(404).send({ 
                msg: "ER", 
                info: "No se encontró el dueño para eliminar." 
            });
        }

        // Si la eliminación fue exitosa
        console.log("rta:::>", rta);
        res.send({ msg: "OK", info: rta });

    } catch (error) {
        // Manejo de errores
        console.error("Error durante la operación:", error);
        res.status(500).send({ 
            msg: "ER", 
            info: "Hubo un error al eliminar al dueño." 
        });
    }
};

