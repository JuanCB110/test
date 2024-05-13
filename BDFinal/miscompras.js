// Importa las funciones que necesitas de los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
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
    if (!user || user.uid == 'juQtZaawawYYNHxg7bwNj4XqC4t2') {
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

    // Ejemplo de uso:
    /*Proveedor()
    .then((proveedores) => {
      if (proveedores) {
        console.log("Proveedores encontrados:", proveedores);
      } else {
        console.log("No se encontraron proveedores");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });*/

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
      window.location.href = "menuproductos.html";
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
async function obtenerHistorialDeCompras(usuarioId) {
    try {
        // Realizar la consulta a Firebase para obtener el historial de compras
        const querySnapshot = await getDocs(query(collection(firestore, 'detalles_compras'), where('id_usuario', '==', usuarioId), orderBy('fecha')));

        // Inicializar un array para almacenar las compras
        const historialCompras = [];
        const idexcluido = 'juQtZaawawYYNHxg7bwNj4XqC4t2';
        
        // Iterar sobre los documentos obtenidos en la consulta
        querySnapshot.forEach((doc) => {
            // Obtener los datos de cada documento y agregarlos al array de historialCompras
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

      const historialCompras = await obtenerHistorialDeCompras(usuarioid); // Suponiendo que tienes una función para obtener el historial de compras
  
      // Obtener el contenedor donde se agregarán los elementos del historial de compras
      const contenedorCompras = document.getElementById('compras');
      contenedorCompras.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos elementos
  
      // Iterar sobre cada compra en el historial
      historialCompras.forEach(async (compra, index) => {
        // Crear un nuevo div para cada compra en el historial
        const divCompra = document.createElement('div');
        divCompra.classList.add('historial');
        //console.log(compra.id_producto);
        const prodid = await obtenerProducto(compra.data.id_producto);
        //console.log("Imagen: ", prodid.imagenUrl);
  
        // Crear elementos HTML con los datos de la compra y agregarlos al div de la compra
        divCompra.innerHTML = `
          <div class="historialimg">
            <img id="imagenCompras${index + 1}" src="${prodid.imagenUrl}" alt="pantalo">
          </div>
          <div style="width: 100%;">
            <h2 id="nomreprodCompras${index + 1}">${compra.data.nombre_producto}</h2>
            <h5 id="nombreprovCompras${index + 1}">${compra.data.nombre_proveedor}</h5>
            <p id="precioCompras${index + 1}">$${compra.data.precio_unitario}</p><br><br>
            <h4 id="fechaCompras${index + 1}">Fecha de Compra: ${compra.data.fecha}</h4>
            <h4 id="estadoCompras${index + 1}">Estatus del pedido: ${compra.data.estado}</h4>
            <h4 id="cantidadCompras${index + 1}" style="text-align: right;">x${compra.data.cantidad}</h4>
            <h4 style="text-align: right;">Envio: $400</h4>
            <h4 style="text-align: right;">Subtotal: $${compra.data.subtotal}</h4>
            <p id="totalCompras${index + 1}" style="text-align: right;">Total: $${compra.data.subtotal+400}</p>
          </div>
        `;
  
        // Agregar el div de la compra al contenedor principal
        contenedorCompras.appendChild(divCompra);
      });
    } catch (error) {
      console.error('Error al mostrar historial de compras:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', DashboardPage());