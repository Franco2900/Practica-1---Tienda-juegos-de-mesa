// Rutas de: /productos/compra

// Modulos
var express = require('express')
var router = express.Router()

const database = require('../../Base de datos/database.js');

router.get('/', async (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET /productos/compra \n');

    let resultado = await database.query('SELECT * FROM producto');
    console.log('Resultado de la query');
    console.log(resultado);

    const usuario = req.session; 
    const titulo  = 'Compra';
    const body    = 'productos/compraView';

    let productos = resultado[0].map(producto => ({ 
        link: '/producto/' + producto.id + '/', 
        nombre: producto.nombre, 
        urlFotoProducto: producto.urlFotoProducto, 
        precio: producto.precio, 
        stock: producto.stock, 
        //descripcion: producto.descripcion, 
        cantidadJugadoresMinimo: producto.cantidadJugadoresMinimo, 
        cantidadJugadoresMaximo: producto.cantidadJugadoresMaximo, 
        duracionPartida: producto.duracionPartida 
    }));

    res.render('layout', {usuario, titulo, body, productos} );
});

module.exports = router