// Rutas de: /perfil

// Modulos
var express = require('express')
var router = express.Router()

const fs = require('fs');
const path = require('path');

const multer = require('multer'); // Modulo para manejar la subidad de archivos
const upload = multer({ storage: multer.memoryStorage() }); 

const database = require('../Base de datos/database.js');

const { autentificar } = require('../util.js');

router.get('/', autentificar, (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET /perfil \n');

    const usuario = req.session;
    const titulo  = 'Mi perfil';
    const body    = 'perfilView';

    res.render('layout', {usuario, titulo, body} );
});


router.post('/nuevaImagen', upload.single('imagen'), async (req, res) => { // Indico que se sube solo un archivo

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /perfil/nuevaImagen \n');

    if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen.' });

    const imagen = req.file.buffer;
    const nombre = req.body.nombre;
    
    try 
    {
        fs.writeFileSync(path.join(__dirname, '../public/images/fotos de perfil', req.file.originalname), imagen);

        const resultado = await database.query('UPDATE usuario SET urlFotoPerfil = ? WHERE nombre = ?', [path.join('/images/fotos de perfil', req.file.originalname), nombre]);
        console.log('Resultado de la query');
        console.log(resultado);

        req.session.fotoPerfil = path.join('/images/fotos de perfil', req.file.originalname);

        res.status(200).json({ message: 'Perfil actualizado con éxito.'});
    }
    catch(error)
    {
        console.error(error); 
        res.status(500).json({ error: 'Ocurrió un error al actualizar la foto de perfil.'});
    }
    
});


router.post('/nuevoNombre', async (req, res) => { 

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /perfil/nuevoNombre \n');
    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    if (!req.body.nuevoNombre) return res.status(400).json({ error: 'No se recibió ningun nombre' });
    
    const nuevoNombre = req.body.nuevoNombre;
    const viejoNombre = req.body.viejoNombre;
    
    try 
    {
        // Reviso si el nombre ya esta siendo usado por otro usuario
        let existeNombre = false;

        let resultado = await database.query('SELECT nombre FROM usuario WHERE nombre = ?', [nuevoNombre]);
        console.log('Resultado de la query');
        console.log(resultado);

        if (resultado[0].length > 0) existeNombre = true;


        if(existeNombre) res.status(500).json({ error: 'El nombre ya existe'});
        else
        {
            resultado = await database.query('UPDATE usuario SET nombre = ? WHERE nombre = ?', [nuevoNombre, viejoNombre]);
            console.log('Resultado de la query');
            console.log(resultado);

            req.session.nombre = nuevoNombre;

            res.status(200).json({ message: 'Nombre actualizado con éxito.'});
        }

    }
    catch(error)
    {
        console.error(error); 
        res.status(500).json({ error: 'Ocurrió un error al actualizar el nombre'});
    }
    
});


router.post('/nuevaContrasenia', async (req, res) => { 

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /perfil/nuevaContrasenia \n');
    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    if (!req.body.nuevaContrasenia) return res.status(400).json({ error: 'No se recibió ninguna contraseña' });
    
    const nuevaContrasenia = req.body.nuevaContrasenia;
    const nombre = req.body.nombre;
    
    try 
    {
        resultado = await database.query('UPDATE usuario SET contrasenia = ? WHERE nombre = ?', [nuevaContrasenia, nombre]);
        console.log('Resultado de la query');
        console.log(resultado);

        req.session.contrasenia = nuevaContrasenia;

        res.status(200).json({ message: 'Nombre actualizado con éxito.'});
    }
    catch(error)
    {
        console.error(error); 
        res.status(500).json({ error: 'Ocurrió un error al actualizar el nombre'});
    }
    
});

module.exports = router