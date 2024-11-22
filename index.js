var mongoose = require('mongoose');
const express = require('express');
var cors = require('cors')

const http = require('http');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const hostname = '127.0.0.1';
const port = 3001;

//Conexión a MongoDB
var bdUrl ='mongodb://127.0.0.1:27017/paseadores';
mongoose.connect(bdUrl);
//Eventos de conexión y desconexión

mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to'+ bdUrl);
});

mongoose.connection.on('error', function (err) {
    console.error('Mongoose default connection error:'+ err);
    process.exit();
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// Procesos para cerrar la conexión al finalizar

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

const app = express();
const LogFile = fs.createWriteStream(path.join(__dirname, 'logFile.log'), { flags: 'a' });

//app.use(morgan('dev')); //modo dev
//app.use(morgan('combined')); //modo combined
//app.use(morgan('tiny')); //modo tiny
//app.use(morgan('common')); //modo common

morgan.token('Ex', function GetEx(){
    return("Información extra log");
})
app.use(cors())
app.use(morgan(':Ex :date[iso] :method :url :status :remote-addr :response-time ms - :res[content-length] :res[content-type]', {stream: LogFile}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Definimos los modelos de datos, aca le decimos al express donde buscar las rutas
require('./server/Routes/rPaseadores')(app);
require('./server/Routes/rduenos')(app);
require('./server/Routes/rUser')(app);
require('./server/Routes/rMascotas')(app);
require('./server/Routes/rPaseo')(app);

/*
* GENERACIÓN TOKEN*
*/
//require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    // Simulación de base de datos
    const users = [
        { id: 1, usuario: 'admin', password: 'admin123' },
        { id: 2, usuario: 'user', password: 'user456' }
    ];

    const user = users.find(u => u.usuario === usuario && u.password === password);

    if (!user) {
        //return res.status(401).json({ message: 'Invalid credentials' });
        return res.send({ msg: "Error", info: "Credenciales inválidas" });
    }

    // Generar el token
    const token = generateToken(user);

    res.send({ msg: "OK", info:token });

    //res.json({ token });
});

function generateToken(user) {
    return jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
}

app.get('/ValidToken', (req, res) => {
    const token = req.headers['token'];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Error", info: 'Invalid token' });
        }
        res.send({ msg: "OK", info:"token válido" });
    });
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end("<html><head><title>Pag-1</title></head><body>Respuesta servidor</body></html>");
    next(); // Llama a next() si deseas que otros middleware se ejecuten
});


// const server = http.createServer((req, res) => {
//     // console.log("Url--->", req.url);
//     // console.log("Method--->", req.method);

//     var arch = "";
//     if (req.method == 'GET') {
//         if (req.url == '/') {        // localhost:2000/
//             arch = '/pag1.html';
//         } else {                      // localhost:2000/pagina1.html
//             arch = req.url;
//         }

//         var pathArch = path.resolve('./public' + arch);
//         var extArch = path.extname(pathArch);
//         //console.log("Archivo--->", pathArch);
//         //console.log("Extensión--->", extArch);

//         if (extArch == '.html') {
//             fs.exists(pathArch, (exists) => {
//                 res.setHeader('Content-Type', 'text/html');
//                 if (!exists) {
//                     res.statusCode = 404;                    
//                     res.end("<hmtl><head><title>Servidor-1</title></head><body><h1>ERROR archivo no encontrado:" + arch + "</h1></body></html>");
//                 } else {
//                     res.statusCode = 200;
//                     fs.createReadStream(pathArch).pipe(res);
//                 }
//             })
//             // fs.readFile(pathArch, 'utf8', (err, data) => {
//             //     if (err) {
//             //         res.statusCode = 500;
//             //         res.setHeader('Content-Type', 'text/html');
//             //         res.end("<hmtl><head><title>Servidor-1</title></head><body><h1>ERROR al cargar archivo:" + err + "</h1></body></html>");
//             //     } else {
//             //         res.statusCode = 200;
//             //         res.setHeader('Content-Type', 'text/html');
//             //         res.end(data);
//             //     }
//             // });
//         }
//         else {
//             res.statusCode = 404;
//             res.setHeader('Content-Type', 'text/html');
//             res.end("<hmtl><head><title>Servidor-1</title></head><body><h1>ERROR archivo debe ser html:" + extArch + "</h1></body></html>");            
//         }
//     } else {
//         res.statusCode = 404;
//         res.setHeader('Content-Type', 'text/html');
//         res.end("<hmtl><head><title>Servidor-1</title></head><body><h1>ERROR metodo no permitido:" + req.method + "</h1></body></html>");
//     }

// });

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});