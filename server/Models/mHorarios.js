const { default: mongoose } = require('mongoose');

schema = mongoose.Schema;

var SchHorarios = new schema({
    jornada:      {type: String, required: "es obligatorio jornada" },
    horaini: {type: String, required: "es obligatorio hora inicio" },
    horafin:  {type: String, required: "es obligatorio hora fin" },
});