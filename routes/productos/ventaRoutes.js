// Rutas de: /productos/venta

// Modulos
var express = require('express')
var router = express.Router()

const fs = require('fs');
const path = require('path');

const multer = require('multer'); // Modulo para manejar la subidad de archivos
const upload = multer({ storage: multer.memoryStorage() });

const database = require('../../Base de datos/database.js');

const { autentificarAdmin, generadorCodigo } = require('../../util.js');

router.get('/', autentificarAdmin, (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET / /productos/venta \n');

    const usuario = req.session; 
    const titulo  = 'Venta';
    const body    = 'productos/ventaView';

    res.render('layout', {usuario, titulo, body} ); 
});


router.post('/', upload.single('imagen'), async function (req, res) {
    
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /productos/venta \n');
    console.log('Datos ingresados por el usuario');
    console.log(req.body)
    console.log(req.file)

    if (!req.body || !req.file) return res.status(400).json({ error: 'Datos incompletos' });

    const { nombre, precio, stock, descripcion, cantidadJugadoresMinimo, cantidadJugadoresMaximo, duracionPartida } = req.body; 
    const imagen = req.file.buffer;

    try
    {
        let nombreImagen = generadorCodigo() + req.file.originalname;
        let lugarGuardado = path.join(__dirname, '../../public/images/fotos de productos', nombreImagen);

        fs.writeFileSync(lugarGuardado, imagen);

        // Verifico si el producto ya existe
        let existeNombre = false;

        let resultado = await database.query('SELECT nombre FROM producto WHERE nombre = ?', [nombre]);
        console.log('Resultado de la query');
        console.log(resultado);

        if (resultado[0].length > 0) 
        { 
            console.log(`El nombre del "${nombre}" ya existe`); 
            existeNombre = true;
        }


        // Inserto el nuevo producto en la base de datos (solo si no existe el nombre)
        if(!existeNombre)
        {
            console.log('Datos validos. Creando un producto nuevo');

            const resultado = await database.query('INSERT INTO producto SET ?', { nombre, urlFotoProducto: path.join('/images/fotos de productos', nombreImagen), precio, stock, descripcion, cantidadJugadoresMinimo, cantidadJugadoresMaximo, duracionPartida, id_usuario: req.session.id_usuario });            
            console.log('Inserción exitosa:');
            console.log(resultado);

            res.send(`<script>
                alert("Producto agregado para la venta");
                window.location.href = "/";
                </script>`);
        }
        else
        {
            console.log('Nombre invalido. Ya existe un producto con dicho nombre');
            res.send(`
                <script>
                alert('${mensaje}Intente de vuelta con otros datos.');
                document.getElementById('nombre').innerText = '';
                </script>`);
        }

    }
    catch(error)
    {
        console.log('Hubo un error en PRODUCTOS/VENTA'); 
        console.log(error);
    }


});

module.exports = router