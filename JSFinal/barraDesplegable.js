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
    // return () => unsubscribe();
  }, [auth]); // Agregar auth como una dependencia para que useEffect se ejecute cada vez que auth cambie

//Funciones para agregar
//Funcion para guardar productos
async function agregarProductos(descripcion, id_proveedor, imagenUrl, nombre, preciounitario, stock){

  // Guarda la información del producto en Firestore
  await setDoc(doc(firestore, 'productos'), {
    descripcion: descripcion,
    id_proveedor: id_proveedor,
    imagenUrl: imagenUrl,
    nombre: nombre,
    preciounitario: Number(preciounitario),
    stock: Number(stock)
  });
}

//Funcion para guardar productos
async function agregarCesta(cantidad, id_producto, id_usuario, nombre_producto, nombre_proveedor, preciounitario, imagenUrl){


  const user = await obtenerDatosUsuario();  
  const userid = user.uid;
  //console.log(userid);
  const cantt = await obtenerProductosEnCesta(userid);
  let cantbd = 0;
  const juntoid = id_producto + id_usuario;

  for(let i = 0; i < cantt.length; i++){
    const cant = cantt[i];

    if(cant.data.id_producto == id_producto){
      cantbd = parseInt(cant.data.cantidad);
    }

  }
  cantidad = parseInt(cantidad);
  cantidad += cantbd;
  //console.log(cantbd);
  //console.log(cantidad);
  //console.log(juntoid);

  try {
    // Agrega el producto a la colección 'cesta' con un ID generado automáticamente
    await setDoc(doc(firestore, 'cesta', juntoid), {
      cantidad: Number(cantidad),
      id_producto: id_producto,
      id_usuario: id_usuario,
      nombre_producto: nombre_producto,
      nombre_proveedor: nombre_proveedor,
      preciounitario: Number(preciounitario),
      imagenUrl: imagenUrl
    });
    // alert("Producto Añadido a la Cesta");
    Swal.fire({
      title: 'Producto añadido a la cesta',
      icon: 'success',
      iconColor: '#9F79FF', // Cambia el color del ícono de éxito
      showConfirmButton: false, // Evita que se muestre el botón de confirmación
      timer: 2000
  });
    console.log('Producto agregado a la cesta exitosamente.');
    //console.log(juntoid);
    //window.location.reload();
  } catch (error) {
    console.error('Error al agregar producto a la cesta:', error);
  }
}

//Funciones para obtencion
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

//Funcion para obtener los datos de proveedor nube
async function Proveedor() {
  try {
    const proveedoresSnapshot = await getDocs(collection(firestore, 'proveedor'));
    const proveedores = [];
    proveedoresSnapshot.forEach((doc) => {
      proveedores.push({ id: doc.id, data: doc.data() });
    });
    return proveedores;
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    return null;
  }
}

//Funcion para obtener los datos de productos nube
async function Productos() {
  try {
    const productosSnapshot = await getDocs(collection(firestore, 'productos'));
    const productos = [];
    productosSnapshot.forEach((doc) => {
      productos.push({ id: doc.id, data: doc.data() });
    });
    return productos;
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    return null;
  }
}

//Funcion para obtener datos del proveedor
async function obtenerProveedor(idProveedor) {
    try {
      // Realizar la consulta a la base de datos para obtener el producto
      const proveedorSnapshot = await getDoc(doc(firestore, 'proveedor', idProveedor));
  
      // Verificar si el producto existe
      if (proveedorSnapshot.exists()) {
        const proveedor = proveedorSnapshot.data();
        return proveedor;
      } else {
        console.log("El proveedor no existe.");
        return null;
      }
    } catch (error) {
      console.log('Error al obtener el proveedor:', error.message);
      return null;
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

//Funcion pra obtener datos del producto destacado
async function obtenerProductoD(idProducto) {
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
    window.location.reload();
  } catch (error) {
    // Manejar errores en caso de que ocurran
    console.error('Error al actualizar el stock del producto:', error);
    throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
  }
}

//Dar bienvenida
document.addEventListener('DOMContentLoaded', async function() {
    const profileBtn = document.querySelector('.header .btn');
    const verticalNavbar = document.getElementById('verticalNavbar');

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
        alert('Sesion Cerrada Correctamente'); 
        localStorage.clear();
    });

    const logo = document.getElementById('logoMarca');
    logo.addEventListener('click', function(){
      window.location.href = "menuproductos.html";
    });

});

//Cargar Productos a la Pagina
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // ID del producto que deseas obtener
    // Producto destacado
    const idProductoDestacado = 'KQyCDBDsNOZbGY3L7yOE';

    // Obtener el producto destacado
    const productosD = await obtenerProductoD(idProductoDestacado);
    console.log("ID_Proveedor Destacado: " + productosD.id_proveedor);
    
    //Array Proveedores
    //const proveedores = await Proveedor();
    //const idsProveedores = proveedores.map((proveedor) => proveedor.id);
    //const dataProveedores = proveedores.map((proveedor) => proveedor.data);


    //Array Productos
    //const productos = await Productos();
    //const idsProductos = productos.map((producto) => producto.id);
    //const dataProductos = productos.map((producto) => producto.data);

    const proveedorD = await obtenerProveedor(productosD.id_proveedor);

    // Actualizar los elementos HTML con los datos del producto
    document.getElementById("nombreProductoD").textContent = productosD.nombre;
    document.getElementById("marcaProductoD").textContent = proveedorD.nombre;
    document.getElementById("precioProductoD").textContent = "$" + productosD.preciounitario;
    document.getElementById("cantidadProductoD").textContent = productosD.stock + " Disponibles";
    document.getElementById("descripcionProductoD").textContent = productosD.descripcion;
    document.getElementById("imagenProductoD").src = productosD.imagenUrl;

    //Tomar datos y activar los contadores en el mismo evento
    const mas = document.getElementById('masD');
    const menos = document.getElementById('menosD');
    const cantidad = document.getElementById('cantidadD');
    let contador = 0;
    const max = productosD.stock;
    //console.log(max);

    mas.addEventListener('click', function(){
      if(contador < max){
        contador++;
        cantidad.textContent = contador;
      }
    });

    menos.addEventListener('click', function(){
      if(contador > 0){
        contador--;
        cantidad.textContent = contador;
      }
    });


    //Funcion para agregar a la cesta
    const agregar = document.getElementById('agregarD');

    agregar.addEventListener('click', async function(){
      
      const cantidadE = document.getElementById('cantidadD');
      const cantidad = cantidadE.textContent;
      const prodid = idProductoDestacado;

      const datosUsuario = await obtenerDatosUsuario(); // Obtener el objeto de usuario
      const usuid = datosUsuario.uid; // Obtener el UID del usuario
      //console.log(usuid);

      const nomprod = productosD.nombre;
      const nomprov = proveedorD.nombre;
      const precio = productosD.preciounitario;
      const imagen = productosD.imagenUrl;
      console.log(cantidad + " " + prodid + " " + usuid + " " + nomprod + " " + nomprov + " " +  precio + " " + imagen);

      //console.log("Cantidad: ", cantidad);

      //Agregar a la base de datos
      if(cantidad > 0){
        await agregarCesta(cantidad, prodid, usuid, nomprod, nomprov, precio, imagen);//Agregar a la base de datos
      } else {
        // alert("Seleccione al menos mas de un producto");
        Swal.fire({
          title: 'Seleccione almenos un producto',
          icon: 'info',
          // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
          showConfirmButton: false, // Evita que se muestre el botón de confirmación
          timer: 2000
      });
      }

      cantidadE.textContent = '0';
      contador = 0;
    });

    let comprar = document.getElementById('comprarD');
    comprar.addEventListener('click', async function(){

            const cantidadE = document.getElementById('cantidadD');
            const cantidad = cantidadE.textContent

            const prodid = idProductoDestacado;

            const datosUsuario = await obtenerDatosUsuario(); // Obtener el objeto de usuario
            const usuid = datosUsuario.uid; // Obtener el UID del usuario

            const nomprod = productosD.nombre;
            const precio = productosD.preciounitario;

            let subtotal = precio * parseInt(cantidad);

            let newstock = parseInt(productosD.stock) -parseInt(cantidad);

            if(cantidad > 0){
              Swal.fire({
                title: 'Compra exitosa!',
                icon: 'Success',
                // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
                showConfirmButton: false, // Evita que se muestre el botón de confirmación
                timer: 2000
            });
              await agregarCompraD(usuid, prodid, nomprod, proveedorD.nombre, precio, cantidad, subtotal, 'Completado');
              // alert("¡Compra Exitosa!");
              
              await actualizarStock(prodid, newstock);
            } else {
              // alert("Seleccione al menos mas de un producto");
              Swal.fire({
                title: 'Seleccione almenos un producto',
                icon: 'info',
                // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
                showConfirmButton: false, // Evita que se muestre el botón de confirmación
                timer: 2000
            });
            }

            cantidadE.textContent = '0';
            contador = 0;

    });
    

  } catch (error) {
    console.log('Error al cargar el producto destacado:', error.message);
  }
});

//Contenedor Dinamico
document.addEventListener('DOMContentLoaded', async function() {
  try {
      const productos = await Productos(); // Obtener datos de los productos

      // Obtener el contenedor principal donde se agregarán los contenedores individuales de productos
      const contenedorProductos = document.getElementById('contenedorProductos');

      // Iterar sobre cada producto
      for (let index = 0; index < productos.length; index++) {
          const producto = productos[index]; // Obtener el producto actual

          // Crear un nuevo contenedor div para el producto
          const nuevoProducto = document.createElement('div');
          nuevoProducto.classList.add('indivtodosLP');
          nuevoProducto.id = `producto${index + 1}`;

          // Obtener datos del proveedor
          const proveid = await obtenerProveedor(producto.data.id_proveedor);
          //console.log(index);
          let precio = parseInt(producto.data.preciounitario);

          // Asignar los datos del producto y del proveedor a los elementos HTML dentro del contenedor
          nuevoProducto.innerHTML = `
                
                <img id="imagenProducto${index + 1}" src="${producto.data.imagenUrl}" alt="casco">
                <h1 id="nombreProducto${index + 1}">${producto.data.nombre}</h1>
                <h4 id="marcaProducto${index + 1}">${proveid.nombre}</h4>
                <p id="descripcionProducto${index + 1}">${producto.data.descripcion}</p>
                <br><br><br><br><br><br>
                <div class="absoluto">
                <h3 id="precioProducto${index + 1}">$${precio} MXN</h3>
                <h5 id="cantidadProducto${index + 1}">${producto.data.stock} Disponibles</h5>
                
                
                  <div class="divbotonmenos">
                      <button class="botonmenos"><img src="ImgFinal/minus.png" alt="menos" id="menos${index + 1}"></button>
                      <pre id="cantidad${index + 1}">0</pre>
                      <button class="botonmenos"><img src="ImgFinal/plus.png" alt="mas" id="mas${index + 1}"></button>
                  </div>

                  <button class="boton1indivtodosLP" id="comprar${index + 1}">Comprar</button>
                  <button class="boton2indivtodosLP" id="agregar${index + 1}"><span class="material-symbols-outlined" style=" vertical-align: bottom;">add_shopping_cart</span></button>
                </div>
                
          `;

          let actividad = "";
          if(producto.data.activo == true){
            actividad = "Habilitado";
            console.log(actividad);
            // Agregar el nuevo contenedor al contenedor principal
            contenedorProductos.appendChild(nuevoProducto);
          } else {
            actividad = "Deshabilitado";
            console.log(actividad);
          }

          //Tomar datos y activar los contadores en el mismo evento
          let mas = document.getElementById(`mas${index + 1}`);
          let menos = document.getElementById(`menos${index + 1}`);
          let cantidad = document.getElementById(`cantidad${index + 1}`);
          let contador = 0;
          let max = producto.data.stock;
          //console.log(max);

          mas.addEventListener('click', function(){
            if(contador < max){
              contador++;
              cantidad.textContent = contador;
            }
          });

          menos.addEventListener('click', function(){
            if(contador > 0){
              contador--;
              cantidad.textContent = contador;
            }
          });

          //Funcion para agregar a la cesta
          let agregar = document.getElementById(`agregar${index + 1}`);
          agregar.addEventListener('click', async function(){
            
            const cantidadE = document.getElementById(`cantidad${index + 1}`);
            const cantidad = cantidadE.textContent
            const prodid = producto.id;

            const datosUsuario = await obtenerDatosUsuario(); // Obtener el objeto de usuario
            const usuid = datosUsuario.uid; // Obtener el UID del usuario
            //console.log(usuid);

            const nomprod = document.getElementById(`nombreProducto${index + 1}`).textContent;
            const nomprov = document.getElementById(`marcaProducto${index + 1}`).textContent;
            const precio = parseInt(producto.data.preciounitario);
            const imagen = producto.data.imagenUrl;
            //console.log(cantidad + " " + prodid + " " + usuid + " " + nomprod + " " + nomprov + " " +  precio + " " + imagen);

            //console.log("Cantidad: ", cantidad);

            //Agregar a la base de datos
            if(cantidad > 0){
              await agregarCesta(cantidad, prodid, usuid, nomprod, nomprov, precio, imagen);
            } else {
              // alert("Seleccione al menos mas de un producto");
              Swal.fire({
                title: 'Seleccione al menos un producto',
                icon: 'info',
                // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
                showConfirmButton: false, // Evita que se muestre el botón de confirmación
                timer: 2000
            });
            }

            cantidadE.textContent = '0';
            contador = 0;

          });

          let comprar = document.getElementById(`comprar${index + 1}`);
          comprar.addEventListener('click', async function(){

            const cantidadE = document.getElementById(`cantidad${index + 1}`);
            const cantidad = cantidadE.textContent

            const datosUsuario = await obtenerDatosUsuario(); // Obtener el objeto de usuario
            const usuid = datosUsuario.uid; // Obtener el UID del usuario

            const nomprod = document.getElementById(`nombreProducto${index + 1}`).textContent;
            const precio = parseInt(producto.data.preciounitario);

            let subtotal = precio * parseInt(cantidad);
            //console.log(producto.id);
            let newstock = parseInt(producto.data.stock) -parseInt(cantidad);
            //console.log(newstock, 'ID Usuario', producto.id);
            if(cantidad > 0){
              Swal.fire({
                title: 'Compra exitosa!',
                icon: 'success',
                // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
                showConfirmButton: false, // Evita que se muestre el botón de confirmación
                timer: 3000
            });
              await agregarCompraD(usuid, producto.id, nomprod, proveid.nombre, precio, cantidad, subtotal, 'Completado');
              // alert("¡Compra Exitosa!");
              
              await actualizarStock(producto.id, newstock);
            } else {
              // alert("Seleccione al menos mas de un producto");
              Swal.fire({
                title: 'Seleccione almenos un producto',
                icon: 'info',
                // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
                showConfirmButton: false, // Evita que se muestre el botón de confirmación
                timer: 2000
            });
            }

            cantidadE.textContent = '0';
            contador = 0;

          });

      }

  } catch (error) {
      console.error("Error al obtener productos:", error);
  }
});


// Función para agregar una compra a la colección de compras
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

}

document.addEventListener('DOMContentLoaded', DashboardPage());