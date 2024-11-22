module.exports = (app) => {
    const paseCtrl = require('../Controllers/cPaseadores');
    const { authMiddleware } = require('../middleware/auth');

    app.route('/api/getAllPaseadores')
        .get(authMiddleware, paseCtrl.getAllPaseadores) // Método GET protegido
        .post(authMiddleware, paseCtrl.getParamPost);   // Método POST protegido

    app.route('/api/users')
        .get(authMiddleware, paseCtrl.getUsers);        // Método GET protegido

    app.route('/api/insPas')
        .post(authMiddleware, paseCtrl.insPas);         // Método POST protegido

    app.route('/api/getPas')
        .post(authMiddleware, paseCtrl.getPas);         // Método POST protegido

    app.route('/api/updPas')
        .post(authMiddleware, paseCtrl.updPas);         // Método POST protegido

    app.route('/api/eliPas')
        .post(authMiddleware, paseCtrl.eliPas);         // Método POST protegido

    app.route('/api/getAllPaseadoresH')
        .get(authMiddleware, paseCtrl.getAllPaseadoresH); // Método GET protegido

    // Ruta pública (sin protección)
    app.route('/api/login')
        .post(paseCtrl.login);         // Método POST para el login del paseador
};
