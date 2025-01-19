// Redirige a la página de login si el usuario no está logueado 
function autentificar(req, res, next) {
    if (req.session && req.session.nombre) return next();
    else                                          res.redirect('/login');   
}


// Redirige al Home si el usuario no está logueado y si no es admin   
function autentificarAdmin(req, res, next) {
    if (req.session && req.session.nombre && req.session.rol == 'admin') return next();
    else                                                                 res.redirect('/'); 
}


// Crea un código al azar de 10 caracteres (sin números ni simbolos, solo caracteres en minuscula y mayuscula)
function generadorCodigo()
{
    var generator = require('generate-password');

    var codigo = generator.generate({
        length: 10,      // Longitud de la contraseña
        numbers: false,  // Incluir números
        symbols: false,  // Incluir símbolos
        uppercase: true, // Incluir letras mayúsculas
        lowercase: true  // Incluir letras minúsculas
    });

    return codigo;
}


module.exports = { 
    autentificar,
    autentificarAdmin,
    generadorCodigo,
};