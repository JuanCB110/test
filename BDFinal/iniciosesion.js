// Importa las funciones que necesitas de los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { doc, setDoc, getFirestore, getDoc, updateDoc, getDocs, collection, addDoc, query, where, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';
import { validateUser, obtenerDatosUsuario } from "../BDFinal/conexion.js";

// Tu configuración de Firebase
const firebaseConfig = {
apiKey: "AIzaSyDk8tT0LuETuAyxWKaMkpoKBAz9gmw6q5c",
authDomain: "koki-shop-f251b.firebaseapp.com",
projectId: "koki-shop-f251b",
storageBucket: "koki-shop-f251b.appspot.com",
messagingSenderId: "440785549096",
appId: "1:440785549096:web:f4f8a882dde5aaed60c21d",
measurementId: "G-WZFRE87BK7"
};  

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

document.addEventListener("DOMContentLoaded", function(){

  mostrarOcultarPassword();

    const iniciarsesion = document.getElementById('formIniciarSesion');

    iniciarsesion.addEventListener('submit', async (e) =>{

        e.preventDefault();

        const email = document.getElementById("CorreoI").value;
        const pass = document.getElementById("ContraseñaI").value;

        try {
        const isValidUser = await validateUser(email, pass);
        if (isValidUser.uid == 'juQtZaawawYYNHxg7bwNj4XqC4t2') {
            console.log(isValidUser.uid);
            Swal.fire({
                title: 'Sesión Iniciada correctamente Administrador',
                icon: 'success',
                  iconColor: '#9F79FF', // Cambia el color del ícono de éxito
                  showConfirmButton: false, // Evita que se muestre el botón de confirmación
                timer: 2000
            });
            window.location.href = 'menuproductosadmin.html';
        } else {
            console.log(isValidUser.uid);
              //alert("Sesion iniciada Correctamente");
            Swal.fire({
                title: 'Sesión Iniciada correctamente',
                icon: 'success',
                  iconColor: '#9F79FF', // Cambia el color del ícono de éxito
                  showConfirmButton: false, // Evita que se muestre el botón de confirmación
                timer: 2000
            });

              // Redirige a la página de menú de productos después de 2 segundos
            setTimeout(function() {
                window.location.href = 'menuproductos.html';
            }, 2000);
        }
    } catch (error) {
          // alert("Error al validar usuario. Por favor, inténtelo de nuevo más tarde.", error.messge);
    }
    
    

    });

    const olvidar = document.getElementById("olvidar");
    olvidar.addEventListener('click', function(){

      // Obtén la dirección de correo electrónico del usuario
    var email = document.getElementById('CorreoI').value;

      // Enviar un correo electrónico para restablecer la contraseña
    sendPasswordResetEmail(auth, email)
    .then(() => {
        // El correo electrónico ha sido enviado correctamente
        Swal.fire({
            title: 'Se ha enviado un correo electrónico para restablecer tu contraseña.',
            icon: 'info',
            iconColor: '#9F79FF', // Color del ícono personalizado
            showConfirmButton: false, // Evita que se muestre el botón de confirmación
            timer: 3000 // Duración en milisegundos que quieres que se muestre el mensaje de éxito
        });
    })
    .catch((error) => {
        // Ocurrió un error al enviar el correo electrónico
        // console.log("Error al enviar el correo electrónico:", error.message);
        // alert("Ocurrió un error al enviar el correo electrónico. Por favor, inténtalo de nuevo más tarde.");
        Swal.fire({
        title: 'Ocurrió un error al enviar el correo electrónico. Por favor, inténtalo de nuevo más tarde.',
        icon: 'error',
          showConfirmButton: false, // Evita que se muestre el botón de confirmación
          timer: 3000 // Duración en milisegundos que quieres que se muestre el mensaje de éxito
    });
    });



    });

    // Escuchar cambios en el estado del checkbox
    const mostrarPasswordCheckbox = document.getElementById("mostrarPassword");
    mostrarPasswordCheckbox.addEventListener("change", mostrarOcultarPassword);

});

function mostrarOcultarPassword() {
  const mostrarPasswordCheckbox = document.getElementById("mostrarPassword");
  const pass = document.getElementById("ContraseñaI");

  if (mostrarPasswordCheckbox.checked) {
      pass.type = "text";
  } else {
      pass.type = "password";
  }
}
