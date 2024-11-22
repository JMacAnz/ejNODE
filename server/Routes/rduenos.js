module.exports = (app) => {
    const dueCtrl = require('../Controllers/cDuenos');
    const { authMiddleware } = require('../middleware/auth');

    app.route('/due/getAllDue')
        .get(authMiddleware,dueCtrl.getAllDue) // Método GET para obtener todos los Duenos

    app.route('/due/insDue')
        .post(authMiddleware,dueCtrl.insDue);         // Método POST para crear un Duenos

    app.route('/due/getDue')
        .post(authMiddleware,dueCtrl.getDue);         // Método POST para obtener un Duenos por ID

    app.route('/due/updDue')
        .post(authMiddleware,dueCtrl.updDue);         // Método POST para actualizar un Duenos

    app.route('/due/eliDue')
       .post(authMiddleware,dueCtrl.eliDue);         // Método POST para eliminar un Duenos

};
