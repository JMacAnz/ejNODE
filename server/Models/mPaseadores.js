const mongoose = require('mongoose');

const schema = mongoose.Schema;

const SchPaseadores = new schema({
    nompas:     { type: String, required: "El campo nompas es obligatorio", maxlength: 100 },
    Tipide:     { type: String, required: "El campo Tipide es obligatorio", maxlength: 3, default: "CC" },
    Numide:     { type: String, required: "El campo Numide es obligatorio", maxlength: 20 },
    Numcelpas:  { type: String, required: "El campo Numcelpas es obligatorio", maxlength: 20 },
    Email:      { type: String, required: "El campo Email es obligatorio", maxlength: 50 },
    Numcelemp:  { type: String, required: "El campo Numcelemp es obligatorio", maxlength: 50 },
    Diremp:     { type: String, required: "El campo Diremp es obligatorio", maxlength: 100 },
    Dirpas:     { type: String, required: "El campo Dirpas es obligatorio", maxlength: 100 },
    Imgepas:    { type: String, required: "El campo Imgepas es obligatorio" }, // Almacena ruta de imagen en formato PNG/JPG
    Tarifa:     { type: Number, required: "El campo Tarifa es obligatorio" },
    Calpas:     { type: Number, required: "El campo Calpas es obligatorio", min: 1, max: 10, default: 1 },
});

module.exports = mongoose.model('Paseadore', SchPaseadores);
