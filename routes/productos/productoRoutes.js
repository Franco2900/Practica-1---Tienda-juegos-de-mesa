// Rutas de: /producto

// Modulos
var express = require('express')
var router = express.Router()

const database = require('../../Base de datos/database.js');

router.get('/:idProducto', async (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET /producto/:idProducto \n');

    const idProducto = req.params.idProducto;

    // Obtengo los datos de los productos
    let resultado = await database.query('SELECT * FROM producto WHERE id = ?', [idProducto]);
    console.log('Resultado de la query');
    console.log(resultado);

    let producto = { 
        id:                      resultado[0][0].id,
        nombre:                  resultado[0][0].nombre, 
        urlFotoProducto:         resultado[0][0].urlFotoProducto, 
        precio:                  resultado[0][0].precio, 
        stock:                   resultado[0][0].stock, 
        descripcion:             resultado[0][0].descripcion, 
        cantidadJugadoresMinimo: resultado[0][0].cantidadJugadoresMinimo, 
        cantidadJugadoresMaximo: resultado[0][0].cantidadJugadoresMaximo, 
        duracionPartida:         resultado[0][0].duracionPartida 
    };
    

    // Obtengo los datos de los comentarios
    resultado = await database.query(`SELECT comentario.id, texto, fecha_creacion, nombre, urlFotoPerfil 
        FROM comentario
        INNER JOIN usuario
        ON comentario.id_usuario = usuario.id
        WHERE id_producto = ?`, [idProducto]);
    console.log('Resultado de la query');
    console.log(resultado);

    let comentarios = resultado[0].map(comentario => ({
        id:             comentario.id,
        texto:          comentario.texto,
        fecha_creacion: new Date(comentario.fecha_creacion).toISOString().split('.')[0].replace('T', ' '),
        nombre:         comentario.nombre,
        urlFotoPerfil:  comentario.urlFotoPerfil,
    }));


    // Obtengo los datos para los subcomentarios
    resultado = await database.query(`SELECT subcomentario.id, id_comentario_padre, subcomentario.texto, subcomentario.fecha_creacion, nombre, urlFotoPerfil 
        FROM subcomentario
        INNER JOIN comentario ON subcomentario.id_comentario_padre = comentario.id
        INNER JOIN usuario    ON subcomentario.id_usuario = usuario.id`);
    console.log('Resultado de la query');
    console.log(resultado);

    let subcomentarios = resultado[0].map(subcomentario => ({
        id:                  subcomentario.id,
        id_comentario_padre: subcomentario.id_comentario_padre,
        texto:               subcomentario.texto,
        fecha_creacion:      new Date(subcomentario.fecha_creacion).toISOString().split('.')[0].replace('T', ' '),
        nombre:              subcomentario.nombre,
        urlFotoPerfil:       subcomentario.urlFotoPerfil,
    }));


    // Obtengo la valoración en estrellas que le dio el usuario al producto
    let estrellasUsuario = 0
    if(req.session.id_usuario)
    {
        resultado = await database.query(`SELECT estrellas FROM valoracion WHERE id_producto = ? AND id_usuario = ?`, [idProducto, req.session.id_usuario]);
        if (resultado[0].length > 0) estrellasUsuario = resultado[0][0].estrellas
    }
        

    // Obtengo la valoración en estrellas que le dio el publico al producto
    let estrellasPublico = 0
    resultado = await database.query(`SELECT estrellas FROM valoracion WHERE id_producto = ?`, [idProducto]);
    
    if (resultado[0].length > 0) 
    {
        let cantidadValoraciones = 0;
        let cantidadEstrellas    = 0;

        resultado[0].forEach(r => {
            cantidadValoraciones++;
            cantidadEstrellas += r.estrellas
        })

        estrellasPublico = Math.ceil(cantidadEstrellas / cantidadValoraciones);
    }
    

    // Obtengo los datos para el layout
    const usuario = req.session; 
    const titulo  = `${producto.nombre}`;
    const body    = 'productos/productoView';


    res.render('layout', {usuario, titulo, body, producto, comentarios, subcomentarios, estrellasUsuario, estrellasPublico} );
});


router.post('/:idProducto/nuevoComentario', async (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /producto/:idProducto/nuevoComentario \n');
    console.log('Datos ingresados por el usuario');
    console.log(req.body)

    try 
    {
        let resultado = await database.query('INSERT INTO comentario SET texto = ?, id_usuario = ?, id_producto = ?', [req.body.comentario, req.session.id_usuario, req.params.idProducto]);
        console.log('Resultado de la query');
        console.log(resultado);

        res.status(200).json({ message: 'Comentario añadido correctamente'});
    }
    catch(error)
    {
        console.error(error); 
        res.status(500).json({ error: 'Ocurrió un error al añadir el comentario'});
    }
});


router.post('/:idProducto/nuevoSubcomentario', async (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /producto/:idProducto/nuevoSubcomentario \n');
    console.log('Datos ingresados por el usuario');
    console.log(req.body)

    try 
    {
        let resultado = await database.query('INSERT INTO subcomentario SET texto = ?, id_comentario_padre = ?, id_usuario = ?', [req.body.subcomentario, req.body.comentarioPadreId , req.session.id_usuario]);
        console.log('Resultado de la query');
        console.log(resultado);

        res.status(200).json({ message: 'Subcomentario añadido correctamente'});
    }
    catch(error)
    {
        console.error(error); 
        res.status(500).json({ error: 'Ocurrió un error al añadir el subcomentario'});
    }
});


router.post('/:idProducto/estrellas', async (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /producto/:idProducto/estrellas \n');
    console.log('Datos ingresados por el usuario');
    console.log(req.body)

    try 
    {
        let resultado = await database.query('SELECT estrellas FROM valoracion WHERE id_usuario = ? AND id_producto = ?', [req.session.id_usuario, req.params.idProducto]);

        if (resultado[0].length > 0) // Si ya hay una valoración del usuario para dicho producto, actualizo dicha reseña 
        {
            await database.query('UPDATE valoracion SET estrellas = ? WHERE id_usuario = ? AND id_producto = ?', [req.body.estrellas, req.session.id_usuario, req.params.idProducto]);
        }
        else // Si no hay una valoración, la añado
        {
            await database.query('INSERT INTO valoracion SET id_usuario = ?, id_producto = ?, estrellas = ?', [req.session.id_usuario, req.params.idProducto, req.body.estrellas]);
        }

        res.status(200).json({ message: 'Estrellas añadidas correctamente'});
    }
    catch(error)
    {
        console.error(error); 
        res.status(500).json({ error: 'Ocurrió un error al añadir las estrellas'});
    }
});


router.post('/:idProducto/compra', async (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /producto/:idProducto/compra \n');
    console.log('Datos ingresados por el usuario');
    console.log(req.body)

    try 
    {
        let resultado = await database.query('SELECT precio FROM producto WHERE id = ?', [req.params.idProducto]);
        let precioProducto = resultado[0][0].precio;
        let costoTotal = precioProducto * req.body.cantidadCompra;

        resultado = await database.query('SELECT dinero FROM usuario WHERE id = ?', [req.session.id_usuario]);
        let dineroUsuario = resultado[0][0].dinero;

        if(dineroUsuario >= costoTotal) res.status(200).json({ message: 'Producto comprado correctamente'});
        else                            res.status(500).json({ error: 'No hay suficiente fondos'});
    }
    catch(error)
    {
        console.error(error); 
        res.status(500).json({ error: 'Ocurrió un error al comprar los productos'});
    }

});


module.exports = router