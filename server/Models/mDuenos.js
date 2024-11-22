const { default: mongoose } = require('mongoose');

var schema = mongoose.Schema;

var schDuenos = new schema(
    {
        nomdue: {type:String,Required:"nombre es obligatorio"},
        teldue: {type:Number,Required:"telefono es obligatorio"},
        dirdue: {type:String,Required:"direccion es obligatoria"},
        cordue: {type:String,Required:"correo es obligatorio"},
    }
) ;

module.exports = mongoose.model('Duen',schDuenos) ;
