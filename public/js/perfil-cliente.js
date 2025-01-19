function cambiarImagen(event) {
    const input = event.target; // Referencia al input html

    if (input.files && input.files[0]) // Si se selecciono archivos y si se selecciona al menos un archivo
    {
        const reader = new FileReader(); // Objeto que permite leer el contenido de los archivos

        reader.onload = function (e) {   // Defino lo que se hara cuando se termine de leer el contenido del archivo
            document.getElementById('fotoPerfil').src = e.target.result; // Cambio el atributo src del elemento html con dicho ID con el resultado del archivo leido

            const formData = new FormData();
            formData.append('imagen', input.files[0]);
            formData.append('nombre', document.getElementById('nombre').innerText.replace("Nombre: ", ""));

            console.log('Haciendo solicitud');

            // Petición al servidor usando fetch 
            fetch('http://localhost:6812/perfil/nuevaImagen', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    console.log('Éxito:', data);
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        }

        reader.readAsDataURL(input.files[0]); // Leo el primer archivo
    }
}


function cambiarNombre() {
    const etiquetaConNombre = document.getElementById('nombre');
    const viejoNombre = etiquetaConNombre.innerText.replace('Nombre: ', '');

    // Solicita nuevo nombre al usuario 
    const nuevoNombre = prompt('Introduce tu nuevo nombre: ', viejoNombre);

    if (nuevoNombre) // Si se ingresa un nombre 
    {
        const datos = { viejoNombre: viejoNombre, nuevoNombre: nuevoNombre };

        // Petición al servidor usando fetch 
        fetch('http://localhost:6812/perfil/nuevoNombre', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Ocurrió un error: ' + data.error);
                }
                else {
                    console.log('Éxito:', data);
                    etiquetaConNombre.innerText = 'Nombre: ' + nuevoNombre;
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error: ' + error.message);
            });
    }
}


function cambiarContrasenia() {
    const etiquetaContrasenia = document.getElementById('contrasenia').getElementsByTagName('input')[0];
    const viejaContrasenia = etiquetaContrasenia.value;

    const nombre = document.getElementById('nombre').innerText.replace('Nombre: ', '');

    // Solicita nueva contraseña al usuario 
    const nuevaContrasenia = prompt('Introduce tu nueva contraseña:', viejaContrasenia);

    if (nuevaContrasenia) {
        const datos = { nombre: nombre, nuevaContrasenia: nuevaContrasenia };

        // Petición al servidor usando fetch 
        fetch('http://localhost:6812/perfil/nuevaContrasenia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Ocurrió un error: ' + data.error);
                } else {
                    console.log('Éxito:', data);
                    etiquetaContrasenia.value = nuevaContrasenia;
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error: ' + error.message);
            });
    }
}