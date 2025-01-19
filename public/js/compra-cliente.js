// Codigo que se ejecuta al cargarse la pagina
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.precio').forEach(function(element) {
        let precio = parseInt(element.innerText);
        let precioFormateado = precio.toLocaleString('es-AR');
        element.innerText = precioFormateado;
    });
});