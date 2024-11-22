module.exports = (app) => {
    const mascCtrl = require('../Controllers/cMascotas'); // Cambié de 'cDuenos' a 'cMascotas'
    const { authMiddleware } = require('../middleware/auth');

    // Rutas para Mascotas

    // Obtener todas las Mascotas
    app.route('/masc/getAllMasc')
        .get(authMiddleware, mascCtrl.getAllMasc); // Método GET para obtener todas las mascotas

    // Obtener todas las Mascotas con detalles de dueño (si es necesario)
    app.route('/masc/getAllMascD')
        .get(authMiddleware, mascCtrl.getAllMascD); // Método GET para obtener mascotas con detalles de dueño

    // Crear una nueva Mascota
    app.route('/masc/insMasc')
        .post(authMiddleware, mascCtrl.insMasc); // Método POST para crear una mascota

    // Obtener una Mascota por ID
    app.route('/masc/getMasc')
        .post(authMiddleware, mascCtrl.getMasc); // Método POST para obtener una mascota por ID

    // Actualizar información de una Mascota
    app.route('/masc/updMasc')
        .post(authMiddleware, mascCtrl.updMasc); // Método PUT para actualizar una mascota (generalmente se usa PUT para actualizaciones)

    // Eliminar una Mascota
    app.route('/masc/eliMasc')
        .post(authMiddleware, mascCtrl.eliMasc); // Método DELETE para eliminar una mascota

};
