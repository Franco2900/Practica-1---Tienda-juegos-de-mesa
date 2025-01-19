// RUTAS DE: /register

// Modulos
var express = require('express')
var router = express.Router()

const database = require('../../Base de datos/database.js');

// Permite crear un nuevo usuario indicando el nombre, email y contraseña
router.get('/', function (req, res) {
    
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET /register \n');

    const usuario = req.session; 
    const titulo  = 'Register';
    const body    = 'auth/registerView';

    res.render('layout', {usuario, titulo, body} );
});


router.post('/', async function (req, res) {
    
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /register \n');
    console.log('Datos ingresados por el usuario');
    console.log(req.body)

    const nombre       = req.body.nombre;
    const email        = req.body.email;
    const contrasenia  = req.body.contrasenia;

    let mensaje = ""; // Mensaje para el usuario en caso de error

    try
    {
        // Verifico si el usuario ya existe
        let existeNombre = false;

        let resultado = await database.query('SELECT nombre FROM usuario WHERE nombre = ?', [nombre]);
        console.log('Resultado de la query');
        console.log(resultado);

        if (resultado[0].length > 0) 
        { 
            console.log(`El nombre de usuario "${nombre}" ya existe`); 
            mensaje += `El nombre de usuario "${nombre}" ya existe. `;
            existeNombre = true;
        }


        // Verifico si el email ya existe
        let existeEmail = false;
        
        resultado = await database.query('SELECT email FROM usuario WHERE email = ?', [email]);
        console.log('Resultado de la query');
        console.log(resultado);

        if (resultado[0].length > 0) 
        { 
            console.log(`El email "${email}" ya existe`); 
            mensaje += `El email "${email}" ya existe. `; 
            existeEmail = true;
        }


        // Inserto el nuevo usuario en la base de datos (solo si no existe el nombre y/o el email)
        if(!existeNombre && !existeEmail)
        {
            console.log('Usuario y email validos. Creando un usuario nuevo');

            const resultado = await database.query('INSERT INTO usuario SET nombre = ?, email = ?, contrasenia = ?', [nombre, email, contrasenia] ); 
            console.log('Inserción exitosa:');
            console.log(resultado);

            res.send(`<script>
                alert("Usuario creado");
                window.location.href = "/";
                </script>`);
        }
        else
        {
            console.log('Usuario y email invalidos. No se creara un usuario nuevo');
            res.send(`
                <script>
                alert('${mensaje}Intente de vuelta con otros datos.');
                window.location.href = "/register/";
                </script>`);
        }
        
    }
    catch(error)
    {
        console.log('Hubo un error en REGISTER'); 
        console.log(error);

        res.send(`<script> 
            alert('Hubo un error al procesar su solicitud. Intente nuevamente más tarde.'); 
            window.location.href = "/register/"; 
            </script>`);
    }

});


module.exports = router