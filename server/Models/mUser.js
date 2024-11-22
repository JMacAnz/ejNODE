const { default: mongoose } = require('mongoose');

var schema = mongoose.Schema;

var schUser = new schema(
    {
        usuario: {type:String,Required:"usuario es obligatorio"},
        password: {type:String,Required:"password es obligatorio"}
    }
);

module.exports = mongoose.model('User',schUser) ;
