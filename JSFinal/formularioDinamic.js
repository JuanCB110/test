import { createUserAndSendVerificationEmail } from "../BDFinal/conexion.js";

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

    // Handle registration form submission
    segundoFormulario.addEventListener('submit', async (e) => {

        const usuario = document.getElementById("nombreUsuarioR");
        const correo = document.getElementById("correoR");
        const contra = document.getElementById("contraR");
        const contrac = document.getElementById("confirmContraR");
        const nombrec = document.getElementById("nombreR");
        const apellidos = document.getElementById("apellidosR");
        const fechaNacimiento = document.getElementById("fechaNacR");

        var errores = [];

        // Validar el nombre (solo letras y espacios)
        if (!/^[a-zA-Z\s]+$/.test(nombrec.value)) {
            errores.push('Ingrese un nombre válido (solo letras y espacios).');
            nombrec.style.borderColor = 'red';
        }

        // Validar la edad (solo números, mayores a 0, menores a 100)
        var edad = parseInt(fechaNacimiento.value, 10);
        if (isNaN(edad) || edad <= 0 || edad >= 100) {
            errores.push('Ingrese una edad válida (solo números, mayores a 0, menores a 100).');
            fechaNacimiento.style.borderColor = 'red';
        }

        // Validar el correo electrónico
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(correo.value)) {
            errores.push('Ingrese un correo electrónico válido.');
            correo.style.borderColor = 'red';
        }

        // Validar el nombre de usuario (sin espacios, solo letras y números, al menos 5 caracteres)
        if (!/^[a-zA-Z0-9]{5,}$/.test(usuario.value)) {
            errores.push('Ingrese un nombre de usuario válido (sin espacios, solo letras y números, al menos 5 caracteres).');
            usuario.style.borderColor = 'red';
        }

        // Validar la contraseña (combinar letras, al menos un número, al menos un símbolo especial, al menos 8 caracteres)
        var contraseña = contra.value;
        if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(contraseña)) {
            errores.push('Ingrese una contraseña válida (combinar letras, al menos un número, al menos un símbolo especial, al menos 8 caracteres).');
            contra.style.borderColor = 'red';
        }

        // Confirmar la contraseña
        if (contraseña !== contrac.value) {
            errores.push('Las contraseñas no coinciden.');
            contrac.style.borderColor = 'red';
        }

        // Mostrar mensajes de error y cambiar el color de la caja a rojo
        if (errores.length > 0) {
            e.preventDefault();
            var mensajeError = errores.join('\n');
            alert('Por favor, corrija los siguientes errores:\n\n' + mensajeError);
        } else {

            // Restaurar el color de las cajas
            nombrec.style.borderColor = '';
            fechaNacimiento.style.borderColor = '';
            correo.style.borderColor = '';
            usuario.style.borderColor = '';
            contra.style.borderColor = '';
            contrac.style.borderColor = '';

            await createUserAndSendVerificationEmail(correo, contra, nombrec, apellidos, fechaNacimiento, usuario);
            window.location.reload();
            window.location.href = 'InicioSesion.html';

        }

    });
});
