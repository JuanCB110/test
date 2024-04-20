document.addEventListener("DOMContentLoaded", function() {
    const primerFormulario = document.getElementById('primerFormulario');
    const segundoFormulario = document.getElementById('segundoFormulario');
    const siguienteBtn = document.getElementById('siguienteBtn');
    const retrocederBtn = document.getElementById('retrocederBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const finalizarBtn = document.getElementById('finalizarBtn');

    // Mostrar el segundo formulario y ocultar el primero
    siguienteBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Detener el envío del formulario
        primerFormulario.style.display = 'none';
        segundoFormulario.style.display = 'block';
    });

    // Retroceder al primer formulario
    retrocederBtn.addEventListener('click', function() {
        primerFormulario.style.display = 'block';
        segundoFormulario.style.display = 'none';
    });

    // Cancelar y regresar al menú principal
    cancelarBtn.addEventListener('click', function() {
        window.location.href = 'Menuprincip.html';
    });

    // Aquí puedes agregar la lógica para enviar los datos del segundo formulario al servidor al finalizar
    // y realizar cualquier otra acción necesaria.
    finalizarBtn.addEventListener('click', function() {
        // Aquí puedes agregar el código para enviar los datos del segundo formulario al servidor
        // y realizar cualquier otra acción necesaria, como redireccionar a otra página.
        alert('Formulario completado y enviado correctamente.');
    });
});
