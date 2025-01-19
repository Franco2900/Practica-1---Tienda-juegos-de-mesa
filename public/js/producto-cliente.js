// Codigo que se ejecuta al cargarse la pagina
let precio = parseInt(document.getElementById('precio').innerText);
let precioFormateado = precio.toLocaleString('es-AR');
document.getElementById('precio').innerText = precioFormateado;

// Codigo para estrellas
document.querySelectorAll('.stars input').forEach(estrella => {
    estrella.addEventListener('change', () => {
        
        var estrellas = estrella.value;

        // Obtengo la URL y extraigo el producto ID 
        const path = window.location.pathname; 
        const productoId = path.split('/')[2]; // Asume que la URL tiene el formato /producto/{:idProducto}/

        fetch(`http://localhost:6812/producto/${productoId}/estrellas`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ estrellas }) 
        }) 
        .then(response => response.json()) 
        .then(data => { 
    
            if (data.error) alert('Error: ' + data.error); 
            else
            {
                console.log('Exito:', data); 
            }
        }) 
        .catch(error => { 
            console.error('Error al enviar la valoracion:', error); 
        }); 
    });
});


// Codigo para el precio
document.getElementById('cantidadCompra').addEventListener('change', function(event){
    
    let cantidadCompra = document.getElementById('cantidadCompra').value;
    let precio         = parseFloat(document.getElementById('precio').innerText.replace(/\./g, '') );

    let precioTotal = cantidadCompra * precio;

    document.getElementById('precioCompra').innerText = precioTotal.toLocaleString('es-AR');
});


// Codigo para comprar
function comprar()
{
    // Obtengo la URL y extraigo el producto ID 
    const path = window.location.pathname; 
    const productoId = path.split('/')[2]; // Asume que la URL tiene el formato /producto/{:idProducto}/

    let cantidadCompra = document.getElementById('cantidadCompra').value;

    fetch(`http://localhost:6812/producto/${productoId}/compra`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ cantidadCompra }) 
    }) 
    .then(response => response.json()) 
    .then(data => { 

        if (data.error) alert('Error: ' + data.error); 
        else
        {
            alert('Producto comprado');
        }
    }) 
    .catch(error => { 
        console.error('Error al realizar la compra:', error); 
    });
}



// Codigo para comentarios
document.getElementById('comment-form').addEventListener('submit', function(event) { 

    event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional 
    const comentario = document.getElementById('comentario').value; // Obtengo el texto del comentario

    // Obtengo la URL y extraigo el producto ID 
    const path = window.location.pathname; 
    const productoId = path.split('/')[2]; // Asume que la URL tiene el formato /producto/{:idProducto}/

    fetch(`http://localhost:6812/producto/${productoId}/nuevoComentario`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ comentario }) 
    }) 
    .then(response => response.json()) 
    .then(data => { 

        if (data.error) alert('Error: ' + data.error); 
        else
        {
            console.log('Exito:', data); 
            const listaComentarios = document.getElementById('listaComentarios'); // Obtengo la lista de comentarios

            const nuevoComentario = document.createElement('li'); // Creo un nuevo elemento HTML para el nuevo comentario
            nuevoComentario.classList.add('list-group-item');     // Le agrego las clases
            nuevoComentario.innerHTML = `<strong>Tú:</strong> ${comentario}`; // Le agrego el texto al nuevo comentario

            listaComentarios.appendChild(nuevoComentario); // Le agrego el nuevo comentario a la lista de comentario
        }
    }) 
    .catch(error => { 
        console.error('Error al enviar el comentario:', error); 
    }); 
});


// Codigo para subcomentarios
document.querySelectorAll('.subcomment-form').forEach(function(form) { 
    form.addEventListener('submit', function(event) { 

        event.preventDefault(); 
        const subcomentario = form.querySelector('textarea').value; // Obtengo el texto del subcomentario
        const comentarioPadreId = form.getAttribute('comentarioPadreId'); // Obtengo el id del comentario padre

        // Obtengo la URL y extraigo el producto ID 
        const path = window.location.pathname; 
        const productoId = path.split('/')[2]; 

        fetch(`http://localhost:6812/producto/${productoId}/nuevoSubcomentario`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ subcomentario, comentarioPadreId }) 
        }) 
        .then(response => response.json()) 
        .then(data => { 

            if (data.error) alert('Error: ' + data.error); 
            else
            {
                console.log('Exito:', data); 
                const listaSubcomentarios = document.querySelector(`#listaSubcomentarios-${comentarioPadreId}`);

                const nuevoSubcomentario = document.createElement('li');
                nuevoSubcomentario.classList.add('list-group-item');     
                nuevoSubcomentario.innerHTML = `<strong>Tú:</strong> ${subcomentario}`; 

                listaSubcomentarios.appendChild(nuevoSubcomentario); 
            }
        }) 
        .catch(error => { 
            console.error('Error al enviar el comentario:', error); 
        });
    });
});