const mongoose = require('mongoose');

// Definición del esquema
const schPaseo = new mongoose.Schema({
    fecpas: {
        type: String,
        required: [true, "Fecha paseo es obligatorio"]
    },
    horpas: {
        type: Number,
        required: [true, "Hora del paseo es obligatoria"]
    },
    tiepas: {
        type: String,
        required: [true, "Tiempo del paseo es obligatorio"]
    },
    mascid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Masc', // Relación con el modelo Duen
        required: [true, "El ID de la mascota es obligatorio"]
    },
    paseadoreid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paseadore', // Relación con el modelo Duen
        required: [true, "El ID del paseador es obligatorio"]
    },
    novpas:{
        type: String,
        required: [true, "Nota del paseo es obligatorio"]
    }
}, {
    timestamps: true // Opcional: agrega automáticamente createdAt y updatedAt
});

// Exportar el modelo
module.exports = mongoose.model('Pase', schPaseo);
