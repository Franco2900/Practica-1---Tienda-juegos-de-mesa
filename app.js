// Modulos
const express = require('express'); // Modulo para la navegación web y creación del servidor
const bodyParser = require('body-parser');
const session    = require('express-session'); // Modulo para usar variables de sesions
const cors       = require('cors'); // CORS (Cross-Origin Resource Sharing) permite las solicitudes entre diferentes dominios

// Variables globales
const app  = express();
const puerto = 6812;


// Motor de plantillas a usar
app.set('view engine', 'ejs');


// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Permite el uso de formularios
app.use(cors());
app.use(express.json()); // Permite parsear JSON

app.use(express.static('public'));  // Permite usar archivos estaticos de la carpeta public
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/bootstrapCSS', express.static('node_modules/bootstrap/dist/css'));  // Bootstrap
app.use('/bootstrapJS', express.static('node_modules/bootstrap/dist/js'));
app.use('/bootstrapICONS', express.static('node_modules/bootstrap-icons/font'));

app.use(session({            // Permite el uso de variables de sesión
    secret: '12345',         // Clave secreta usada para firmar la cookie de sesión.
    resave: false,           // Evita que la sesión se guarde de nuevo en el servidor si no ha sido modificada.
    saveUninitialized: true, // Guarda la sesión nueva aun si no ha sido modificada.
    cookie: { secure: false }
}));


// Rutas
app.use('/', require('./routes/homeRoutes.js') );
app.use('/register', require('./routes/auth/registerRoutes.js') );
app.use('/login', require('./routes/auth/loginRoutes.js') );
app.use('/logout', require('./routes/auth/logoutRoutes.js') );
app.use('/contacto', require('./routes/contactoRoutes.js') );
app.use('/perfil', require('./routes/perfilRoutes.js') );
app.use('/productos/venta', require('./routes/productos/ventaRoutes.js') );
app.use('/productos/compra', require('./routes/productos/compraRoutes.js') );
app.use('/producto', require('./routes/productos/productoRoutes.js') );

// Inicio el servidor
const servidor = app.listen(puerto, () => {
    console.log('Servidor web iniciado en el puerto ' + puerto);
});

module.exports = app;