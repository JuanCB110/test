import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { doc, setDoc, getFirestore, getDoc, updateDoc, getDocs, collection, addDoc, query, where, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';
import { obtenerDatosUsuario, cerrarSesion } from "../BDFinal/conexion.js";

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

function DashboardPage() {
    const auth = getAuth(); // Obtener la instancia de autenticación

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.uid == 'juQtZaawawYYNHxg7bwNj4XqC4t2') {
        cerrarSesion();
        window.location.href = '../InicioSesion.html'; // Redirigir a la página de inicio de sesión si no hay un usuario autenticado
      }

    // Devuelve una función de limpieza para limpiar el efecto
    //return () => unsubscribe();
  }, [auth]); // Agregar auth como una dependencia para que useEffect se ejecute cada vez que auth cambie

//Obtener Usuario
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

//Dar bienvenida
document.addEventListener('DOMContentLoaded', async function() {
    const profileBtn = document.querySelector('.header .btn');
    const verticalNavbar = document.getElementById('verticalNavbar');

    // profileBtn.addEventListener('click', function() {
    //     verticalNavbar.classList.toggle('show');
    // });

    //Dar la bienvenida al Usuario
    try {
      const datosUsuario = await obtenerDatosUsuario(); // Obtener el objeto de usuario
      const usuarioid = datosUsuario.uid; // Obtener el UID del usuario
      //const idsuario = localStorage.getItem('usuario'); // Obtiene el nombre de usuario del almacenamiento local
        console.log('ID Usuario: ' + usuarioid);
      //Obtener ID del usuario
        const usuarioC = await obtenerUsuario(usuarioid);
      //localStorage.clear();
        document.getElementById("cuentaCC").textContent = "¡Bienvenido " + usuarioC.usuario + "!";

        document.getElementById("email_id").value = usuarioC.correo;
        document.getElementById("from_name").value = usuarioC.nombre + " " + usuarioC.apellidos;

    } catch (error) {
        console.log("Error al cargar el usuario: ", error.message);
    }

    //Cerrar Sesion
    const cerrarSesionLink = document.getElementById('csesion');

    cerrarSesionLink.addEventListener('click', function(event) {
        event.preventDefault(); // Evita que el enlace redirija a otra página

        cerrarSesion();
        alert('Sesion Cerrada Correctamente');
        localStorage.clear();
    });

    const logo = document.getElementById('logoMarca');
    logo.addEventListener('click', function(){
    window.location.href = "menuproductos.html";
    });

    const reset = document.getElementById('reset') ;
    reset.addEventListener('click', function(){
      window.location.reload();
    });

});

async function obtenerMensajesPorUsuarioId(usuarioId) {
  try {
      // Realizar la consulta a Firebase para obtener los mensajes del usuario especificado
      const querySnapshot = await getDocs(query(collection(firestore, 'mensajes'), where('id_usuario', '==', usuarioId)));

      // Inicializar un array para almacenar los mensajes
      const mensajesRecibidos = [];
      
      // Iterar sobre los documentos obtenidos en la consulta
      querySnapshot.forEach((doc) => {
          // Obtener los datos de cada documento y agregarlos al array de mensajesRecibidos
          mensajesRecibidos.push({ id: doc.id, data: doc.data() });
      });
      
      // Devolver el array con los mensajes recibidos
      return mensajesRecibidos;
  } catch (error) {
      // Manejar errores en caso de que ocurran
      console.error('Error al obtener mensajes por usuario ID desde Firebase:', error);
      throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
  }
}


//Actualizar Soporte
document.addEventListener('DOMContentLoaded', async function(){

      const datosUsuario = await obtenerDatosUsuario(); // Obtener el objeto de usuario
      const usuarioid = datosUsuario.uid; // Obtener el UID del usuario

      //console.log(usuarioid);

      const respuesta = await obtenerMensajesPorUsuarioId(usuarioid);
      // Verificar si la respuesta contiene algún mensaje
      if (respuesta.length > 0) {
          // Si hay al menos un mensaje, obtener el valor de 'resadmin'
          const resadmin = respuesta[0].data.resadmin;
          console.log(resadmin);
          document.getElementById('contestar').value = resadmin;
      } else {
          // Si no hay mensajes, imprimir un mensaje indicando que no hay mensajes
          console.log('No se encontraron mensajes para el usuario.');
      }


      //document.getElementById('contestar').value = respuesta.data.resadmin;

});

async function guardarMensajeBD(nombre, nombre_usuario, id_usuario, mensaje, correo){
  try {
    // Obtener la fecha actual
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}/${month}/${day}`;
    const formattedHour = `${hours}:${minutes}:${seconds}`;

    // Agrega el mensaje a la colección 'mensajes' con un ID generado automáticamente
    await addDoc(collection(firestore, 'mensajes'), {
      nombre: nombre,
      nombre_usuario: nombre_usuario,
      id_usuario: id_usuario,
      mensaje: mensaje,
      fechaHora: (formattedDate + ' ' + formattedHour),
      correo: correo,
      resadmin: "",
      leido: false
    });
    console.log('Mensaje guardado exitosamente.');
    window.location.reload();
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
  }
}


async function guardarMensaje(){

  try {
    const datosUsuario = await obtenerDatosUsuario(); // Obtener el objeto de usuario
    const usuarioid = datosUsuario.uid;

    const user = await obtenerUsuario(usuarioid);


    const mensaje = document.getElementById('message').value;
    const correo = document.getElementById('email_id').value;
    const nombre = document.getElementById('from_name').value;

    // console.log('Datos del mensaje: ', mensaje," ", correo," ", nombre, " ", usuarioid, " ", user.usuario);
    await guardarMensajeBD(nombre, user.usuario, usuarioid, mensaje, correo);

  } catch (error) {
    console.log('Error: ', error.message);
  }

}

const btn = document.getElementById('button');

document.getElementById('form')
.addEventListener('submit', function(event) {
  event.preventDefault();

  btn.value = 'Enviando...';

  const serviceID = 'default_service';
  const templateID = 'template_gfzx03l';

  emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      guardarMensaje();
      btn.value = 'Enviado';
      alert('¡Mensaje Enviado!');
      // window.location.reload();
    }, (err) => {
      btn.value = 'Enviado';
      console.log('Error', JSON.stringify(err));
    });
});

}

document.addEventListener('DOMContentLoaded', DashboardPage());