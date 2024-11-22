const mongoose = require('mongoose');

// Definición del esquema
const schMascotas = new mongoose.Schema({
    nommas: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    edad: {
        type: Number,
        required: [true, "La edad es obligatoria"]
    },
    raza: {
        type: String,
        required: [true, "La raza es obligatoria"]
    },
    genero: {
        type: Number,
        required: [true, "El género es obligatorio"]
    },
    recomendaciones: {
        type: String,
        required: [true, "Las recomendaciones son obligatorias"]
    },
    duenoid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Duen', // Relación con el modelo Duen
        required: [true, "El ID del dueño es obligatorio"]
    }
}, {
    timestamps: true // Opcional: agrega automáticamente createdAt y updatedAt
});

// Exportar el modelo
module.exports = mongoose.model('Masc', schMascotas);
