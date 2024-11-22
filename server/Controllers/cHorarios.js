const { default: mongoose } = require('mongoose');
const Horario = require('../Models/mHorarios');

// Función getHorarios

exports.getHorarios =  async (req, res) => {
    try {
        const horarios = await Horario.find();
        res.json(horarios);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// horario por id

exports.getHorarioById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'ID de horario no válido' });
        }

        const horario = await Horario.findById(req.params.id); 

        if (!horario) {
            return res.status(404).json({ message: 'No se encontró el horario' });
        }

        res.json(horario);
    } catch (err) {
        console.error("Error al obtener el horario:", err);
        res.status(500).json({ message: 'Error al obtener el horario', error: err.message });
    }
};