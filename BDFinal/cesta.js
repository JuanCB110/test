// Importa las funciones que necesitas de los SDK que necesitas
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
    return () => unsubscribe();
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

//Eliminar Producto de la cesta
async function eliminarProducto(productId) {
  try {
    // Eliminar el producto de la base de datos
    await deleteDoc(doc(firestore, 'cesta', productId));
    console.log(`Producto con ID ${productId} eliminado exitosamente.`);
    //window.location.reload();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
}

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

// Función para actualizar el stock de un producto en Firebase
async function actualizarStock(idProducto, nuevoStock) {
  try {
    // Crear una referencia al documento del producto que se desea actualizar
    const productoRef = doc(firestore, 'productos', idProducto); // Suponiendo que 'productos' es el nombre de la colección en Firestore

    // Actualizar el campo 'stock' del documento del producto
    await updateDoc(productoRef, {
      stock: nuevoStock
    });

    console.log('Stock actualizado correctamente para el producto con ID:', idProducto);
  } catch (error) {
    // Manejar errores en caso de que ocurran
    console.error('Error al actualizar el stock del producto:', error);
    throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
  }
}

//Dar Bienvenida
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

});

// Función para obtener los productos en la cesta de un usuario específico
async function obtenerProductosEnCesta(usuarioId) {
  try {
    const cestaSnapshot = await getDocs(query(collection(firestore, 'cesta'), where('id_usuario', '==', usuarioId)));
    const productosEnCesta = [];
    cestaSnapshot.forEach((doc) => {
      productosEnCesta.push({ id: doc.id, data: doc.data() });
    });
    return productosEnCesta; 
  } catch (error) {
    console.log('Error al obtener productos en la cesta', error.message);
  }
}

// Función para mostrar los productos en la cesta en HTML
async function mostrarProductosEnCesta(usuarioId) {
  const productosEnCesta = await obtenerProductosEnCesta(usuarioId);
  const contenedorCesta = document.getElementById('contenedorCesta');
  let totalparcial = 0;
  let cont = 0;

  for (let index = 0; index < productosEnCesta.length; index++){

    const producto = productosEnCesta[index];

    // Crear un nuevo contenedor div para el producto
    const nuevoProducto = document.createElement('section');
    nuevoProducto.classList.add('p2mitad1flex');
    nuevoProducto.id = `producto${index + 1}`;

    nuevoProducto.innerHTML = `

    <div class="p2mitad1foto">
    <img id="imagenCesta${index + 1}" src="${producto.data.imagenUrl}" alt="foto">
    </div>
    
    <div class="p2mitad1">
      <h1 id="nombreprodCesta${index + 1}">${producto.data.nombre_producto}</h1>
      <h2 id="nombreprovCesta${index + 1}">${producto.data.nombre_proveedor}</h2><br>
      <h3 id="precioCesta${index + 1}">$${producto.data.preciounitario}</h3>

      <div class="divbotonmenos">
      <button class="botonmenos"><img src="ImgFinal/minus.png" alt="menos" id="menos${index + 1}"></button>
      <p id="cantidadCesta${index + 1}">Cantidad: ${producto.data.cantidad}</p>
      <button class="botonmenos"><img src="ImgFinal/plus.png" alt="mas" id="mas${index + 1}"></button>
      </div>

      <button class="botonesy" id="borrar${index + 1}">Eliminar</button>
      <button class="botonesy" id="act${index + 1}" style="display: none;">Actualizar</button>

    </div>
    
    `;

    contenedorCesta.appendChild(nuevoProducto);

    const prod = await obtenerProducto(producto.data.id_producto);
    console.log(prod.nombre, "Stock: ", prod.stock);

    //Tomar datos y activar los contadores en el mismo evento
    let mas = document.getElementById(`mas${index + 1}`);
    let menos = document.getElementById(`menos${index + 1}`);
    let cantidad = document.getElementById(`cantidadCesta${index + 1}`);
    let contador = producto.data.cantidad;
    let max = prod.stock;
    //console.log(max);

    mas.addEventListener('click', function(){
      if(contador < max){
        contador++;
        cantidad.textContent = "Cantidad: " + contador;
        console.log(contador);

        if(contador > 0){
          const act = document.getElementById(`act${index + 1}`);
          act.style.display = "block";
          act.addEventListener('click', async function(){
            producto.data.cantidad = contador;

            const cestaRef = doc(firestore, 'cesta', (producto.data.id_producto + producto.data.id_usuario)); // Suponiendo que 'productos' es el nombre de la colección en Firestore
            // Actualizar el campo 'stock' del documento del producto
            await updateDoc(cestaRef, {
              cantidad: producto.data.cantidad
            });
            // alert("Producto Actualizado");
            console.log('Actualizao');
            window.location.reload();

          });
        } else {
          const act = document.getElementById(`act${index + 1}`);
          act.style.display = "none";
          alert("Agregue mas de un producto");
        }

        // producto.data.cantidad = contador;
        // console.log(producto.data.cantidad, producto.data.nombre_producto);
      }
    });

    menos.addEventListener('click', function(){
      if(contador > 0){
        contador--;
        cantidad.textContent = "Cantidad: " + contador;
        console.log(contador);

        if(contador > 0){
          const act = document.getElementById(`act${index + 1}`);
          act.style.display = "block";
          act.addEventListener('click', async function(){
            producto.data.cantidad = contador;

            const cestaRef = doc(firestore, 'cesta', (producto.data.id_producto + producto.data.id_usuario)); // Suponiendo que 'productos' es el nombre de la colección en Firestore
            // Actualizar el campo 'stock' del documento del producto
            await updateDoc(cestaRef, {
              cantidad: producto.data.cantidad
            });
            // alert("Producto Actualizado");
            console.log('Actualizao');
            window.location.reload();

          });
        } else {
          const act = document.getElementById(`act${index + 1}`);
          act.style.display = "none";
          alert("Agregue mas de un producto");
        }

        // producto.data.cantidad = contador;
        // console.log(producto.data.cantidad, producto.data.nombre_producto);
      }
    });

      //Mostrar total parcial y a pagar
      let preciop = parseInt(producto.data.preciounitario);
      let cantidadp = parseInt(producto.data.cantidad);
      //console.log(preciop, cantidadp);
      let totalp = preciop * cantidadp;
      //totalp += totalp;
      //console.log(totalp);
      totalparcial += totalp;

    const borrar = document.getElementById(`borrar${index + 1}`);
    borrar.addEventListener('click', async function(){
      const cestaid = producto.id;
      //console.log(cestaid);
      await eliminarProducto(cestaid);
      alert('Producto Eliminado de la Cesta Correctamente');
      window.location.reload();
    });

    const pagar = document.getElementById('pagar');
    pagar.addEventListener('click', async function(){
      Swal.fire({
        title: 'Compra exitosa!',
        icon: 'success',
        // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
        showConfirmButton: false, // Evita que se muestre el botón de confirmación
        timer: 2000
    });

      const datosUsuario = await obtenerDatosUsuario(); // Obtener el objeto de usuario
      const usuarioid = datosUsuario.uid; // Obtener el UID del usuario
      const cestaid = producto.id;
      const prodid = await obtenerProducto(producto.data.id_producto);
      const proid = producto.data.id_producto;
        //console.log(cestaid);
  
      let newstock = parseInt(prodid.stock) - parseInt(producto.data.cantidad);
      cont++;
      await agregarCompraD(usuarioid, proid, producto.data.nombre_producto, producto.data.nombre_proveedor, producto.data.preciounitario, producto.data.cantidad, totalp, 'Completado');
      console.log(cont, " " , index+1);
      await eliminarProducto(cestaid);
      await actualizarStock(proid, newstock);
      if(cont == (index+1)){
        
        // alert("¡Compra Exitosa!");
        window.location.reload();
      }

    });

  }

  
  
  if(totalparcial > 0){
    document.getElementById('totalParcial').textContent = 'Total parcial: ------------------ $' + totalparcial;
    document.getElementById('envio').textContent = 'Gastos de envio: ------------------ $' + 400;
    document.getElementById('totalPagar').textContent = 'Total a pagar: ------------------ $' + (totalparcial+400);
  } else {
    document.getElementById('envio').textContent = 'Total parcial: ------------------ $' + 0;
    document.getElementById('totalParcial').textContent = 'Gastos de envio: ------------------ $' + 0;
    document.getElementById('totalPagar').textContent = 'Total a pagar: ------------------ $' + 0;
  }

  //Poner la cantidad de productos en cesta
  const articulos = document.getElementById('articulos');
  articulos.textContent = `Articulos en la cesta (${productosEnCesta.length})`;

}

//Agregar a compras con detalles
async function agregarCompraD(idUsuario, idProducto, nombre_producto, nombre_proveedor, precio_unitario, cantidad, subtotal, estado) {
  try {
    // Generar un ID único para la compra
    //const idCompra = idUsuario + idProducto; // Esta función debe generar un ID único
    
    // Obtener la fecha actual del cliente
    const fechaActual = new Date();

    // Formatear la fecha como "YYYY-MM-DD"
    const fechaFormateada = fechaActual.toISOString().split('T')[0];

    // Agregar la compra a la colección 'compras' con el ID generado automáticamente
    await addDoc(collection(firestore, 'detalles_compras'), {
      id_usuario: idUsuario,
      id_producto: idProducto,
      nombre_producto:nombre_producto,
      nombre_proveedor:nombre_proveedor,
      precio_unitario:Number(precio_unitario),
      cantidad:Number(cantidad),
      fecha: fechaFormateada,
      subtotal: Number(subtotal),
      estado:estado
    });
    console.log('Compra agregada correctamente.');
  } catch (error) {
    console.error('Error al agregar la compra:', error);
  }
}

// Llama a la función para mostrar los productos en la cesta cuando se cargue la página
document.addEventListener('DOMContentLoaded', async () => {
  const usuarioActual = await obtenerDatosUsuario(); // Función para obtener el usuario actual, reemplázala según sea necesario
  if (usuarioActual) {
    await mostrarProductosEnCesta(usuarioActual.uid);
  }
});
}

document.addEventListener('DOMContentLoaded', DashboardPage());