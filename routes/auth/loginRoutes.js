// RUTAS DE: /login

// Modulos
var express = require('express')
var router = express.Router()

const database = require('../../Base de datos/database.js');

// Permite loguearse con un usuario ya existente
router.get('/', function (req, res) {

  // Logging
  console.log('***********************************************************');
  console.log('Ruta: GET /login \n');

  const usuario = req.session; 
  const titulo  = 'Login';
  const body    = 'auth/loginView';

  res.render('layout', {usuario, titulo, body} );
});


router.post('/', async function (req, res) {
  // Logging
  console.log('***********************************************************');
  console.log('Ruta: POST /login \n');
  console.log('Datos ingresados por el usuario');
  console.log(req.body);

  const { nombre, contrasenia } = req.body;

  try 
  {
    // Verifico si el usuario y la contraseña existen
    const resultado = await database.query('SELECT id, email, rol, urlFotoPerfil, dinero FROM usuario WHERE nombre = ? AND contrasenia = ?', [nombre, contrasenia]);
    console.log('Resultado de la query');
    console.log(resultado);

    if (resultado[0].length > 0) 
    {
      req.session.id_usuario    = resultado[0][0].id;
      req.session.nombre        = nombre;
      req.session.contrasenia   = contrasenia;
      req.session.email         = resultado[0][0].email;
      req.session.rol           = resultado[0][0].rol;
      req.session.fotoPerfil    = resultado[0][0].urlFotoPerfil;
      req.session.dinero        = resultado[0][0].dinero;

      res.send(`<script>
          alert("Sesion iniciada");
          window.location.href = "/";
          </script>`);
    } 
    else 
    {
      res.send(`<script>
          alert("Nombre o contraseña incorrectos");
          window.location.href = "/login/";
          </script>`);
    }

  } 
  catch (error) 
  {
    console.log('Hubo un error al intentar hacer un SELECT en la tabla usuario');
    console.log(error);
    res.send(`<script>
        alert('Hubo un error al procesar su solicitud. Intente nuevamente más tarde.');
        window.location.href = "/login";
        </script>`);
  }

});


module.exports = router