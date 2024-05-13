// Importa las funciones que necesitas de los SDK que necesitas
//import { get } from "firebase/database";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, sendPasswordResetEmail  } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { doc, setDoc, getFirestore, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';
import { actualizarUsuario, obtenerDatosUsuario, cerrarSesion } from '../BDFinal/conexion.js';

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




  async function obtenerUsuario(idUsuario){
    try {
      //const user = auth.currentUser;
      const usuario = await getDoc(doc(firestore, 'usuario', idUsuario));
  
      //console.log(user.uid);
  
      if (usuario.exists()) {
        const usuarios = usuario.data();
        return usuarios;
      } else {
        console.log("El usuario no existe");
      }
    } catch (error) {
      console.log('Erro al obtener al Usuario: ', error.message);
    }
  }

document.addEventListener('DOMContentLoaded', async function(){

    try {
        const idUsuario = await obtenerDatosUsuario();
        const userid = idUsuario.uid;
        
        //Obtener usuario
        const usuarios = await obtenerUsuario(userid);

        //Mostrar datos a actualizar
        document.getElementById("nombreC").value = usuarios.nombre;
        document.getElementById("apellidoC").value = usuarios.apellidos;
        document.getElementById("fechaC").value = usuarios.nacimiento;
        document.getElementById("correoC").value = usuarios.correo;
        document.getElementById("nombUsC").value = usuarios.usuario;

    } catch (error) {
        console.log("Error: ", error.message)
    }

    const cancelar = document.getElementById('cancelarB');
    // Agregar un evento de clic al botón "Cancelar"
    cancelar.addEventListener('click', function() {
      // Navegar hacia atrás en el historial del navegador
      window.history.back();
    });

    const olvidar = document.getElementById("change");
    olvidar.addEventListener('click', function(){

      // Obtén la dirección de correo electrónico del usuario
      var email = document.getElementById('correoC').value;

      // Enviar un correo electrónico para restablecer la contraseña
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // El correo electrónico ha sido enviado correctamente
          // alert("Se ha enviado un correo electrónico para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.");
          Swal.fire({
            title: 'Se ha enviado un correo electrónico para reestablecer tu contraseña. Por favor revisa tu bandeja de entrada',
            icon: 'info',
            // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
            showConfirmButton: false, // Evita que se muestre el botón de confirmación
            timer: 2000
        });
        })
        .catch((error) => {
          // Ocurrió un error al enviar el correo electrónico
          console.log("Error al enviar el correo electrónico:", error.message);
          // alert("Ocurrió un error al enviar el correo electrónico. Por favor, inténtalo de nuevo más tarde.");
          Swal.fire({
            title: 'Ocurrió un error al enviar el correo electrónico. Por favor, inténtalo de nuevo más tarde.',
            icon: 'error',
            // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
            showConfirmButton: false, // Evita que se muestre el botón de confirmación
            timer: 2000
        });
        });


    });

});

const formActualizarUsuario = document.getElementById('formActualizarUsuario');
        formActualizarUsuario.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nuevoNombre = document.getElementById('nombreC').value;
            const nuevoApellido = document.getElementById('apellidoC').value;
            const nuevoNombreUsuario = document.getElementById('nombUsC').value;

            console.log(nuevoNombre, nuevoApellido, nuevoNombreUsuario);
            await actualizarUsuario(nuevoNombre, nuevoApellido, nuevoNombreUsuario);
        });
