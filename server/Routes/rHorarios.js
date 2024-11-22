module.exports = (app) => {
    const horaCtrl = require('../Controllers/cHorarios');

    // Rutas para manejar horarios
    app.get('/api/getHorarios', horaCtrl.getHorarios);
    app.get('/api/getHorarioById/:id', horaCtrl.getHorarioById);
};
