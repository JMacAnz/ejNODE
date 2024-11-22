module.exports = (app) => {
    const paseCtrl = require('../Controllers/cPaseo'); // Cambié de 'cDuenos' a 'cPaseo'
    const { authMiddleware } = require('../middleware/auth');

    // Rutas para Paseo

    // Obtener todas las Paseo
    app.route('/pase/getAllPase')
        .get(authMiddleware, paseCtrl.getAllPase); // Método GET para obtener todas las Paseo

    // Obtener todas las Paseo con detalles de mascota y paseador (si es necesario)
    app.route('/pase/getAllPascD')
        .get(authMiddleware, paseCtrl.getAllPascD); // Método GET para obtener Paseo con detalles de dueño

    // Crear una nueva Paseo
    app.route('/pase/insPase')
        .post(authMiddleware, paseCtrl.insPase); // Método POST para crear una Paseo

    // Obtener una Paseo por ID
    app.route('/pase/getPase')
        .post(authMiddleware, paseCtrl.getPase); // Método POST para obtener una Paseo por ID

    // Actualizar información de una Paseo
    app.route('/pase/updPase')
        .post(authMiddleware, paseCtrl.updPase); // Método PUT para actualizar una Paseo (generalmente se usa PUT para actualizaciones)

    // Eliminar una Paseo
    app.route('/pase/eliPase')
        .post(authMiddleware, paseCtrl.eliPase); // Método DELETE para eliminar una Paseo

};
