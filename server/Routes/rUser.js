module.exports = (app) => {
    const userCtrl = require('../Controllers/cUser');

    app.route('/user/login')
        .post(userCtrl.login);         // Método POST para el login del paseador

     // Nueva ruta para el refresh token
    app.route('/user/refresh-token')
        .post(userCtrl.refreshToken);    // Método POST para renovar el access token usando un refresh token
    
    app.route('/user/ValidToken')
        .get(userCtrl.ValidToken);        // Método POST para validar el token

    app.route('/user/insUser')
        .post(userCtrl.insUser);         // Método POST para crear un user
    
    app.route('/user/getUser')
        .post(userCtrl.getUser);         // Método POST para obtener un paseador por ID

    app.route('/user/updUser')
        .post(userCtrl.updUser);         // Método POST para actualizar un paseador

    app.route('/user/eliUser')
        .post(userCtrl.eliUser);           

};
