// Importa las funciones que necesitas de los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, updateProfile, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
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
      if (!user || user.uid != 'juQtZaawawYYNHxg7bwNj4XqC4t2') {
        cerrarSesion();
        window.location.href = '../InicioSesion.html'; // Redirigir a la página de inicio de sesión si no hay un usuario autenticado
    }

    // Devuelve una función de limpieza para limpiar el efecto
    return () => unsubscribe();
  }, [auth]); // Agregar auth como una dependencia para que useEffect se ejecute cada vez que auth cambie

//Cargar usuario
document.addEventListener('DOMContentLoaded', async function() {
    const profileBtn = document.querySelector('.header .btn');
    const verticalNavbar = document.getElementById('verticalNavbar');

    // Ejemplo de uso

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

    await mostrarHistorialDeCompras();

});

//Funcion pra obtener datos de los productos
async function obtenerProducto(idProducto) {
    try {
      // Realizar la consulta a la base de datos para obtener el producto
      const productosSnapshot = await getDoc(doc(firestore, 'productos', idProducto));
  
      // Verificar si el producto existe
      if (productosSnapshot.exists()) {
        const producto = productosSnapshot.data();
        return producto;
      } else {
        console.log("El producto no existe.");
        return null;
      }
    } catch (error) {
      console.log('Error al obtener el producto:', error.message);
      return null;
    }
  }

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

//Obtener historial de mis compras
// Función para obtener el historial de compras desde Firebase
async function obtenerHistorialDeCompras() {
    try {
        // Realizar la consulta a Firebase para obtener el historial de compras
        const querySnapshot = await getDocs(query(collection(firestore, 'usuario')));

        // Inicializar un array para almacenar las compras
        const historialCompras = [];
        const idexcluido = 'juQtZaawawYYNHxg7bwNj4XqC4t2';
        
        // Iterar sobre los documentos obtenidos en la consulta
        querySnapshot.forEach((doc) => {
            // Obtener los datos de cada documento y agregarlos al array de historialCompras
            //console.log(doc.id);
            if(doc.id == idexcluido){
                console.log('non entro');
            } else {
                historialCompras.push({ id: doc.id, data: doc.data() });
            }

        });
        
        // Devolver el array con el historial de compras
        return historialCompras;
    } catch (error) {
        // Manejar errores en caso de que ocurran
        console.error('Error al obtener historial de compras desde Firebase:', error);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}

// Función para obtener elementos del historial de compras y crear formularios dinámicos
async function mostrarHistorialDeCompras() {
    try {
      // Obtener historial de compras desde Firebase

      const datosUsuario = await obtenerDatosUsuario(); // Obtener el objeto de usuario
      const usuarioid = datosUsuario.uid; // Obtener el UID del usuario

      console.log('ID USuario', usuarioid);

      const historialCompras = await obtenerHistorialDeCompras(); // Suponiendo que tienes una función para obtener el historial de compras
  
      // Obtener el contenedor donde se agregarán los elementos del historial de compras
      const contenedorCompras = document.getElementById('usuarios');
      contenedorCompras.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos elementos
  
      // Iterar sobre cada compra en el historial
      historialCompras.forEach(async (usuario, index) => {
        // Crear un nuevo div para cada compra en el historial
        const divCompra = document.createElement('div');
        divCompra.classList.add('historial');
        //console.log(compra.id_producto);
        //const prodid = await obtenerProducto(compra.data.id_producto);
        //console.log("Imagen: ", prodid.imagenUrl);
        let actividad = "";
        if(usuario.data.activo == true){
          actividad = "Habilitado";
        } else {
          actividad = "Deshabilitado";
        }
  
        // Crear elementos HTML con los datos de la compra y agregarlos al div de la compra
        divCompra.innerHTML = `
          <div style="width: 100%;">
            <h2 id="nombreUsuario${index + 1}">${usuario.data.usuario}</h2>
            <h5 id="nombreprovCompras${index + 1}">${usuario.data.nombre + "    " + usuario.data.apellidos}</h5>
            <p id="precioCompras${index + 1}">${usuario.data.correo}</p><br><br>
            <h4 id="estadoCompras${index + 1}">Fecha de Nacimiento: ${usuario.data.nacimiento}</h4>
            <h4 id="estadoUsuario${index + 1}">Estado de Actividad: ${actividad}</h4>
            <button id="baja${index + 1}" class="botones">Deshabilitar</button>
            <button id="alta${index + 1}" class="botones">Habilitar</button>
            <button id="modi${index + 1}" class="botones">Modificar</button>
            
          </div>
        `;
  
        // Agregar el div de la compra al contenedor principal
        contenedorCompras.appendChild(divCompra);

        const baja = document.getElementById(`baja${index + 1}`);
        baja.addEventListener('click', async function(){

          //console.log(usuario.id);

          try {
            // Obtener la referencia al documento del usuario en la base de datos
            const usuarioRef = doc(firestore, 'usuario', usuario.id);
    
            // Obtener los datos actuales del usuario
            const usuarioSnapshot = await getDoc(usuarioRef);
            if (usuarioSnapshot.exists()) {
                // Actualizar el campo 'activo' a false para deshabilitar la cuenta
                await updateDoc(usuarioRef, {
                    activo: false
                });
                alert('Cuenta deshabilitada exitosamente');
                console.log('Cuenta deshabilitada exitosamente para el usuario con ID:', usuario.id);
                window.location.reload();
            } else {
                console.error('No se encontró el usuario con ID:', usuario.id);
            }
        } catch (error) {
            console.error('Error al deshabilitar la cuenta del usuario:', error);
        }
        });

        const alta = document.getElementById(`alta${index + 1}`);
        alta.addEventListener('click', async function(){

          console.log(usuario.id);

          try {
            // Obtener la referencia al documento del usuario en la base de datos
            const usuarioRef = doc(firestore, 'usuario', usuario.id);
    
            // Obtener los datos actuales del usuario
            const usuarioSnapshot = await getDoc(usuarioRef);
            if (usuarioSnapshot.exists()) {
                // Actualizar el campo 'activo' a false para deshabilitar la cuenta
                await updateDoc(usuarioRef, {
                    activo: true
                });
                alert('Cuenta habilitada exitosamente');
                console.log('Cuenta habilitada exitosamente para el usuario con ID:', usuario.id);
                window.location.reload();
            } else {
                console.error('No se encontró el usuario con ID:', usuario.id);
            }
        } catch (error) {
            console.error('Error al habilitar la cuenta del usuario:', error);
        }
        });

        const modificar = document.getElementById(`modi${index + 1}`);
        modificar.addEventListener('click', async function(){
        
          contenedorCompras.innerHTML = '';

          divCompra.innerHTML = `
          <div style="width: 100%;">

            <h2>Modificar Usuario</h2>
            <label for="nuevoUsuario"><b>Ingrese Nuevo Nombre de Usuario</b></label><br><br>
            <input type="text" name="nuevoUsuario" id="nuevoUsuario" required><br><br>
            <label for="nuevoNombre"><b>Ingrese Nuevo(s) Nombre(s)</b></label><br><br>
            <input type="text" name="nuevoNombre" id="nuevoNombre" required><br><br>
            <label for="nuevoApellidos"><b>Ingrese Nuevos Apellidos</b></label><br><br>
            <input type="text" name="nuevoApellidos" id="nuevoApellidos" required><br><br>
            <br>

            <p id="precioCompras${index + 1}">${usuario.data.correo}</p>
            <b style="cursor: pointer;" id="cambiar">¿Cambiar Contraseña?</b>
            <br>
            <br>
            <h4 id="estadoCompras${index + 1}">Fecha de Nacimiento: ${usuario.data.nacimiento}</h4>
            <h4 id="estadoUsuario${index + 1}">Estado de Actividad: ${actividad}</h4>
            <button id="guardar${index + 1}" class="botones">Guardar</button>
            <button id="regresar${index + 1}" class="botones">Cancelar</button>
            
          </div>
        `;
  
        // Agregar el div de la compra al contenedor principal
        contenedorCompras.appendChild(divCompra);

        //Mostrar datos a actualizar
        document.getElementById("nuevoUsuario").value = usuario.data.usuario;
        document.getElementById("nuevoNombre").value = usuario.data.nombre;
        document.getElementById("nuevoApellidos").value = usuario.data.apellidos;


        const olvidar = document.getElementById("cambiar");
        olvidar.addEventListener('click', async function(){

          // Obtén la dirección de correo electrónico del usuario
          var email = usuario.data.correo;

          // Enviar un correo electrónico para restablecer la contraseña
          sendPasswordResetEmail(auth, email)
            .then(() => {
              // El correo electrónico ha sido enviado correctamente
              alert("Se ha enviado un correo electrónico para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.");
              window.location.reload();
            })
            .catch((error) => {
              // Ocurrió un error al enviar el correo electrónico
              console.log("Error al enviar el correo electrónico:", error.message);
              alert("Ocurrió un error al enviar el correo electrónico. Por favor, inténtalo de nuevo más tarde.");
            });

        });

        const guardar = document.getElementById(`guardar${index + 1}`);
          guardar.addEventListener('click', async function(){

            const productoRef = doc(firestore, 'usuario', usuario.id); // Suponiendo que 'productos' es el nombre de la colección en Firestore

            const apellidos = document.getElementById("nuevoApellidos").value;
            const nombre = document.getElementById("nuevoNombre").value;
            const usuarion = document.getElementById("nuevoUsuario").value;

            // Actualizar el campo 'stock' del documento del producto
            await updateDoc(productoRef, {
              apellidos: apellidos,
              nombre: nombre,
              usuario: usuarion
            });
            window.location.reload();

          });

        const regresar = document.getElementById(`regresar${index + 1}`);
        regresar.addEventListener('click', async function(){
          window.location.reload();
        });
          


        });


      });
    } catch (error) {
      console.error('Error al mostrar historial de compras:', error);
    }
}



}

//Entras o no
document.addEventListener('DOMContentLoaded', DashboardPage());