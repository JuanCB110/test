// Importa las funciones que necesitas de los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, onAuthStateChanged  } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { doc, orderBy, setDoc, getFirestore, getDoc, updateDoc, getDocs, collection, addDoc, query, where, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';
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
        if (!user || user.uid != 'juQtZaawawYYNHxg7bwNj4XqC4t2') {
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

// Función para obtener el historial de compras desde Firebase
async function obtenerMensajes() {
    try {
        // Realizar la consulta a Firebase para obtener los mensajes ordenados por fecha y hora
        const querySnapshot = await getDocs(query(collection(firestore, 'mensajes'), orderBy('fechaHora')));

        // Inicializar un array para almacenar los mensajes ordenados
        const mensajesOrdenados = [];

        // Iterar sobre los documentos obtenidos en la consulta
        querySnapshot.forEach((doc) => {
            // Obtener los datos de cada documento y agregarlos al array de mensajesOrdenados
            mensajesOrdenados.push({ id: doc.id, data: doc.data() });
        });

        // Devolver el array con los mensajes ordenados por fecha y hora
        return mensajesOrdenados;
    } catch (error) {
        // Manejar errores en caso de que ocurran
        console.error('Error al obtener mensajes ordenados por fecha y hora desde Firebase:', error);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}


// Función para obtener elementos del historial de compras y crear formularios dinámicos
async function mostrarMensajes() {
    try {
      // Obtener historial de compras desde Firebase

      const mensajes = await obtenerMensajes(); // Suponiendo que tienes una función para obtener el historial de compras

      // Obtener el contenedor donde se agregarán los elementos del historial de compras
    const contenedorMensajes = document.getElementById('mensajes');
      contenedorMensajes.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos elementos

      // Iterar sobre cada compra en el historial
    mensajes.forEach(async (mensaje, index) => {
        // Crear un nuevo div para cada compra en el historial
        const divMensajes = document.createElement('div');
        divMensajes.classList.add('historial');
        //console.log(compra.id_producto);
        //const prodid = await obtenerProducto(compra.data.id_producto);
        //console.log("Imagen: ", prodid.imagenUrl);
        let actividad = "";
        if(mensaje.data.leido == true){
        actividad = "Visto";
        } else {
        actividad = "No visto";
        }

        // Crear elementos HTML con los datos de la compra y agregarlos al div de la compra
        divMensajes.innerHTML = `
        <div style="width: 100%;">

            <p>Correo Nuevo</p>
            <h2 id="nombreUsuario${index + 1}">De: ${mensaje.data.nombre_usuario}</h2>
            <p id="precioCompras${index + 1}">${mensaje.data.correo}</p><br>
            <h4 id="estadoUsuario${index + 1}">Lectura: ${actividad}</h4>
            <h4 id="fecha${index + 1}">Fecha de Recibido: ${mensaje.data.fechaHora}</h4>
            

            <button id="leer${index + 1}" class="botones">Ver</button>
            <button id="borrar${index + 1}" class="botones">Eliminar</button>
            
        </div>
        `;

        // Agregar el div de la compra al contenedor principal
        contenedorMensajes.appendChild(divMensajes);

        const eliminar = document.getElementById(`borrar${index + 1}`);
        eliminar.addEventListener('click', async function(){

            try {
                // Eliminar el producto de la base de datos
                await deleteDoc(doc(firestore, 'mensajes', mensaje.id));
                alert('Mensaje Eliminado Exitosamente');
                console.log(`Mensaje con ID ${mensaje.id} eliminado exitosamente.`);
                window.location.reload();
            } catch (error) {
                console.error('Error al eliminar el mensaje:', error);
            }

        });

        const leer = document.getElementById(`leer${index + 1}`);
        leer.addEventListener('click', async function(){
        

            try {
                // Obtener la referencia al documento del usuario en la base de datos
                const mensajeRef = doc(firestore, 'mensajes', mensaje.id);
        
                // Obtener los datos actuales del usuario
                const mensajeSnapshot = await getDoc(mensajeRef);
                if (mensajeSnapshot.exists()) {
                    // Actualizar el campo 'activo' a false para deshabilitar la cuenta
                    await updateDoc(mensajeRef, {
                        leido: true
                    });
                    console.log('Mensaje Leido:', mensaje.id);
                } else {
                    console.error('No se encontró el usuario con ID:', mensaje.id);
                }
            } catch (error) {
                console.error('Error al deshabilitar la cuenta del usuario:', error);
            }

            contenedorMensajes.innerHTML = '';

        divMensajes.innerHTML = `
        <div style="width: 100%;">

            <h2>Mensaje:</h2>
            <h5 id="correoMensaje${index + 1}">De: ${mensaje.data.correo}</h5>
            <br>
            <p id="mensaje${index + 1}" style="overflow-y: auto; max-height: 100%; white-space: pre-wrap;">${mensaje.data.mensaje}</p>
            <br>
            <h4 id="nombre${index + 1}">Nombre: ${mensaje.data.nombre}</h4>
            <br>
            <button id="volver${index + 1}" class="botones">Regresar</button>
            <button id="responder${index + 1}" class="botones">Responder</button>
            
        </div>
        `;

        // Agregar el div de la compra al contenedor principal
        contenedorMensajes.appendChild(divMensajes);

        const volver = document.getElementById(`volver${index + 1}`);
        volver.addEventListener('click', async function(){
            window.location.reload();
        });

        const responder = document.getElementById(`responder${index + 1}`);
        responder.addEventListener('click', async function(){

        contenedorMensajes.innerHTML = '';

        // Agregar el div de la compra al contenedor principal
        contenedorMensajes.innerHTML = `
            
            <div class="historial">

            <div style="width: 100%;">

            <h2>Mensaje:</h2>
            <h5 id="correoMensaje${index + 1}">De: ${mensaje.data.correo}</h5>
            <br>
            <p id="mensaje${index + 1}" style="overflow-y: auto; max-height: 100%; white-space: pre-wrap;">${mensaje.data.mensaje}</p>
            <br>
            <h4 id="nombre${index + 1}">Nombre: ${mensaje.data.nombre}</h4>
            <br>
            <br>

            <h2>Respuesta:</h2><br>
            
            <textarea name="answer" id="answer${index + 1}" cols="70" rows="8" style="font-size: 14px; resize: none; overflow: auto; background-color: #f5f5f5; border-color: #9f79ff"></textarea>
            <br>
            <button id="responderR${index + 1}" class="botones">Enviar</button>
            <button id="cancelarR${index + 1}" class="botones">Cancelar</button>

            </div>
            </div>

            `;

            const cancelar = document.getElementById(`cancelarR${index + 1}`);
            cancelar.addEventListener('click', async function(){
                window.location.reload();
            });

            const res = document.getElementById(`responderR${index + 1}`);
            res.addEventListener('click', async function(){

                const answer = document.getElementById(`answer${index + 1}`).value;
                console.log(answer);

                // Función para actualizar el stock de un producto en Firebase
                try {
                // Crear una referencia al documento del producto que se desea actualizar
                const mensajeRef = doc(firestore, 'mensajes', mensaje.id); // Suponiendo que 'productos' es el nombre de la colección en Firestore
                
                // Actualizar el campo 'stock' del documento del producto
                await updateDoc(mensajeRef, {
                    resadmin: answer
                });
                
                console.log('ResAdmin actualizado correctamente para el producto con ID:', mensaje.id);
                window.location.reload();
                } catch (error) {
                // Manejar errores en caso de que ocurran
                console.error('Error al actualizar el ResAdmin del producto:', error);
                throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
                }


            });

        });

        });


    });
    } catch (error) {
    console.error('Error al mostrar historial de compras:', error);
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
    document.getElementById("cuentaCC").textContent = usuarioC.usuario;

    } catch (error) {
    console.log("Error al cargar el usuario: ", error.message);
    }

    //Cerrar Sesion
    const cerrarSesionLink = document.getElementById('csesion');
    cerrarSesionLink.addEventListener('click', function(event) {
        event.preventDefault(); // Evita que el enlace redirija a otra página

        cerrarSesion();
        localStorage.clear();
    });

    const logo = document.getElementById('logoMarca');
    logo.addEventListener('click', function(){
    window.location.href = "menuproductosadmin.html";
    });

    await mostrarMensajes();

});

}

document.addEventListener('DOMContentLoaded', DashboardPage());