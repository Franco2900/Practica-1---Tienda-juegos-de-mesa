// Rutas de: /

// Modulos
var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET / \n');

    const usuario = req.session; 
    const titulo  = 'Home';
    const body    = 'homeView';

    res.render('layout', {usuario, titulo, body} ); 
});

module.exports = router