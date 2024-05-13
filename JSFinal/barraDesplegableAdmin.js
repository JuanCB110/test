// Importa las funciones que necesitas de los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, onAuthStateChanged  } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { doc, setDoc, getFirestore, getDoc, updateDoc, getDocs, collection, addDoc, query, where, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';
import { ref, getStorage, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";
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



  //Funciones para agregar

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
    alert("Producto Añadido a la Cesta");
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

//Funcion para atualizar el stock de un producto en firebase
async function actualizarStockD(idProducto, nuevoStock) {
  try {
    // Crear una referencia al documento del producto que se desea actualizar
    const productoRef = doc(firestore, 'productoD', idProducto); // Suponiendo que 'productos' es el nombre de la colección en Firestore

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

// Obtener el producto mas compradp
async function obtenerProductosMasCompradosPorFecha(fecha) {
    try {
        // Crear un objeto para almacenar la cantidad de cada producto
        const cantidadPorProducto = {};

        // Realizar la consulta a Firebase para obtener los detalles de todas las compras
        const querySnapshot = await getDocs(query(collection(firestore, 'detalles_compras'), where('fecha', '==', fecha)));

        //console.log(querySnapshot);
        
        // Iterar sobre los documentos obtenidos en la consulta
        querySnapshot.forEach((doc) => {
            // Obtener los datos de cada documento
            const detalleCompra = doc.data();
            //console.log(detalleCompra.fecha);
            //const nombreprod = detalleCompra.nombre_producto;
            //console.log(nombreprod);
            
            // Verificar si el producto ya ha sido registrado en el objeto cantidadPorProducto
            if (detalleCompra.id_producto in cantidadPorProducto) {
                // Si ya existe, sumar la cantidad actual a la cantidad registrada
                cantidadPorProducto[detalleCompra.id_producto] += detalleCompra.cantidad;
            } else {
                // Si no existe, agregar el producto al objeto con su cantidad
                cantidadPorProducto[detalleCompra.id_producto] = detalleCompra.cantidad;
            }
        });

        // Ordenar los productos por la cantidad de compras de mayor a menor
        const productosMasComprados = Object.entries(cantidadPorProducto)
            .sort(([, cantidadA], [, cantidadB]) => cantidadB - cantidadA)
            .map(([idProducto, cantidad]) => ({ idProducto, cantidad }));

        // Devolver la lista de productos más comprados
        return productosMasComprados;
    } catch (error) {
        console.error('Error al obtener los productos más comprados:', error);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}

// Crear el gráfico con los datos obtenidos de la base de datos producto con mas venta
async function crearTablaProductosMasVendidosPorFecha() { 
    // Llamar a la función para obtener los productos más comprados

    
    const generar = document.getElementById('generar');
    generar.addEventListener('click', async function(){
      const fechita = document.getElementById('Porfecha').value;
      //console.log(fechita);
      try {
        // Obtener los productos más comprados por la fecha especificada
        const productosMasComprados = await obtenerProductosMasCompradosPorFecha(fechita);
        //console.log(productosMasComprados);
        
        // Crear la tabla HTML
        const tabla = document.createElement('table');
        tabla.classList.add('productos-table');

        // Crear la cabecera de la tabla
        const cabecera = tabla.createTHead();
        const filaCabecera = cabecera.insertRow();
        const thProducto = document.createElement('th');
        thProducto.textContent = 'Producto';
        const thCantidad = document.createElement('th');
        thCantidad.textContent = 'Cantidad';
        const thFecha = document.createElement('th');
        thFecha.textContent = 'Fecha';
        filaCabecera.appendChild(thProducto);
        filaCabecera.appendChild(thCantidad);
        filaCabecera.appendChild(thFecha);

        const nombres = [];
        let cont = 0;

        for (let i = 0; i < productosMasComprados.length && i < 10; i++) {
          const prodid = await obtenerProducto(productosMasComprados[i].idProducto);
      
          // Verificar si prodid.nombre es nulo, indefinido o una cadena vacía
          if (prodid.nombre === null || prodid.nombre === undefined || prodid.nombre === '') {
              // Si es nulo, indefinido o una cadena vacía, detener el ciclo
              break;
          } else {
              // Si no es nulo, indefinido o una cadena vacía, asignar el nombre
              nombres[i] = prodid.nombre;
              //console.log(prodid.nombre);
          }
      }
      

        // Crear el cuerpo de la tabla
        const cuerpo = tabla.createTBody();
        productosMasComprados.forEach(producto => {
            const fila = cuerpo.insertRow();
            const celdaProducto = fila.insertCell();
            celdaProducto.textContent = nombres[cont]; // Puedes cambiar esto por el nombre del producto
            //console.log(productosMasComprados.length);
            const celdaCantidad = fila.insertCell();
            celdaCantidad.textContent = producto.cantidad;
            const celdaFecha = fila.insertCell();
            celdaFecha.textContent = fechita;
            cont++;
        });

        // Obtener el elemento donde se insertará la tabla
        const contenedorTabla = document.getElementById('tablaVentas');
        // Limpiar el contenedor antes de agregar la nueva tabla
        contenedorTabla.innerHTML = '';
        // Agregar la tabla al contenedor
        contenedorTabla.appendChild(tabla);
    } catch (error) {
        console.error('Error al obtener los productos más comprados por fecha:', error);
    }

    })

}

// Obtener el producto mas compradp
async function obtenerProductosMasCompradosPorMes(fecha) {
  try {
      // Crear un objeto para almacenar la cantidad de cada producto
      const cantidadPorProducto = {};

      // Realizar la consulta a Firebase para obtener los detalles de todas las compras
      const querySnapshot = await getDocs(query(collection(firestore, 'detalles_compras')));

      // Extraer mes y año de la fecha
      const fechas = new Date(fecha);
      const mes = fechas.toLocaleString('default', { month: 'long' });
      const año = fechas.getFullYear();
      //console.log('Mes: ', mes, ' Año: ', año);

      //console.log(querySnapshot);
      
      // Iterar sobre los documentos obtenidos en la consulta
      querySnapshot.forEach((doc) => {
          // Obtener los datos de cada documento
          const detalleCompra = doc.data();
          const fechota = new Date(detalleCompra.fecha);
          const meso = fechota.toLocaleString('default', { month: 'long' });
          const añoo = fechota.getFullYear();
          //console.log('Mes: ', meso, ' Año: ', añoo);
          //console.log(detalleCompra.fecha);
          //const nombreprod = detalleCompra.nombre_producto;
          //console.log(nombreprod);
          
          if(mes == meso && año == añoo){
            //console.log('Trabaja :D');
            // Verificar si el producto ya ha sido registrado en el objeto cantidadPorProducto
            if (detalleCompra.id_producto in cantidadPorProducto) {
            // Si ya existe, sumar la cantidad actual a la cantidad registrada
            cantidadPorProducto[detalleCompra.id_producto] += detalleCompra.cantidad;
            } else {
            // Si no existe, agregar el producto al objeto con su cantidad
            cantidadPorProducto[detalleCompra.id_producto] = detalleCompra.cantidad;
            }
          } else {
            console.log('No trabajo :(');
          }

      });

      // Ordenar los productos por la cantidad de compras de mayor a menor
      const productosMasComprados = Object.entries(cantidadPorProducto)
          .sort(([, cantidadA], [, cantidadB]) => cantidadB - cantidadA)
          .map(([idProducto, cantidad]) => ({ idProducto, cantidad }));

      // Devolver la lista de productos más comprados
      return productosMasComprados;
  } catch (error) {
      console.error('Error al obtener los productos más comprados:', error);
      throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
  }
}

// Crear el gráfico con los datos obtenidos de la base de datos producto con mas venta
async function crearTablaProductosMasVendidosPorMes() {
  const generar = document.getElementById('generarMes');
  generar.addEventListener('click', async function () {
      const fechita = document.getElementById('PorMes').value;
      try {
          const productosMasComprados = await obtenerProductosMasCompradosPorMes(fechita);
          const tabla = document.createElement('table');
          tabla.classList.add('productos-table');

          // Crear cabecera de la tabla
          const cabecera = tabla.createTHead();
          const filaCabecera = cabecera.insertRow();
          const thProducto = document.createElement('th');
          thProducto.textContent = 'Producto';
          const thCantidad = document.createElement('th');
          thCantidad.textContent = 'Cantidad';
          const thMes = document.createElement('th');
          thMes.textContent = 'Mes';
          const thAño = document.createElement('th');
          thAño.textContent = 'Año';
          filaCabecera.appendChild(thProducto);
          filaCabecera.appendChild(thCantidad);
          filaCabecera.appendChild(thMes);
          filaCabecera.appendChild(thAño);

          // Crear cuerpo de la tabla
          const cuerpo = tabla.createTBody();
          for (let i = 0; i < productosMasComprados.length && i < 10; i++) {
              const producto = productosMasComprados[i];
              const prodid = await obtenerProducto(producto.idProducto);
              const fila = cuerpo.insertRow();
              const celdaProducto = fila.insertCell();
              celdaProducto.textContent = prodid.nombre;
              const celdaCantidad = fila.insertCell();
              celdaCantidad.textContent = producto.cantidad;
              const celdaFecha = fila.insertCell();
              // Extraer mes y año de la fecha
              const fecha = new Date(fechita);
              const mes = fecha.toLocaleString('default', { month: 'long' });
              const año = fecha.getFullYear();
              celdaFecha.textContent = mes;
              const celdaAño = fila.insertCell();
              celdaAño.textContent = año;
          }

          // Obtener el elemento donde se insertará la tabla
          const contenedorTabla = document.getElementById('tablaVentasMes');
          // Limpiar el contenedor antes de agregar la nueva tabla
          contenedorTabla.innerHTML = '';
          // Agregar la tabla al contenedor
          contenedorTabla.appendChild(tabla);
      } catch (error) {
          console.error('Error al obtener los productos más comprados por fecha:', error);
      }
  });
}

// Obtener los productos más comprados dentro de un rango de fechas
async function obtenerProductosMasCompradosPorRangoFechas(fechaInicial, fechaFinal) {
  try {
      // Crear un objeto para almacenar la cantidad de cada producto
      const cantidadPorProducto = {};

      // Realizar la consulta a Firebase para obtener los detalles de todas las compras dentro del rango de fechas
      const querySnapshot = await getDocs(query(collection(firestore, 'detalles_compras'), where('fecha', '>=', fechaInicial), where('fecha', '<=', fechaFinal)));

      // Iterar sobre los documentos obtenidos en la consulta
      querySnapshot.forEach((doc) => {
          // Obtener los datos de cada documento
          const detalleCompra = doc.data();
          
          // Verificar si el producto ya ha sido registrado en el objeto cantidadPorProducto
          if (detalleCompra.id_producto in cantidadPorProducto) {
              // Si ya existe, sumar la cantidad actual a la cantidad registrada
              cantidadPorProducto[detalleCompra.id_producto] += detalleCompra.cantidad;
          } else {
              // Si no existe, agregar el producto al objeto con su cantidad
              cantidadPorProducto[detalleCompra.id_producto] = detalleCompra.cantidad;
          }
      });

      // Ordenar los productos por la cantidad de compras de mayor a menor
      const productosMasComprados = Object.entries(cantidadPorProducto)
          .sort(([, cantidadA], [, cantidadB]) => cantidadB - cantidadA)
          .map(([idProducto, cantidad]) => ({ idProducto, cantidad }));

      // Devolver la lista de productos más comprados
      return productosMasComprados;
  } catch (error) {
      console.error('Error al obtener los productos más comprados por rango de fechas:', error);
      throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
  }
}

// Crear el gráfico con los productos más comprados dentro de un rango de fechas
async function crearTablaProductosMasVendidosPorRangoFechas() { 
  const generar = document.getElementById('generarRango');
  generar.addEventListener('click', async function(){
      const fechaInicial = document.getElementById('PorRango1').value;
      const fechaFinal = document.getElementById('PorRango2').value;
      try {
          // Obtener los productos más comprados dentro del rango de fechas especificado
          const productosMasComprados = await obtenerProductosMasCompradosPorRangoFechas(fechaInicial, fechaFinal);

          // Crear la tabla HTML
          const tabla = document.createElement('table');
          tabla.classList.add('productos-table');

          // Crear la cabecera de la tabla
          const cabecera = tabla.createTHead();
          const filaCabecera = cabecera.insertRow();
          const thProducto = document.createElement('th');
          thProducto.textContent = 'Producto';
          const thCantidad = document.createElement('th');
          thCantidad.textContent = 'Cantidad';
          const thFecha1 = document.createElement('th');
          thFecha1.textContent = 'Fecha Inicial';
          const thFecha2 = document.createElement('th');
          thFecha2.textContent = 'Fecha Final';  
          filaCabecera.appendChild(thProducto);
          filaCabecera.appendChild(thCantidad);
          filaCabecera.appendChild(thFecha1);
          filaCabecera.appendChild(thFecha2);

          const nombres = [];

          for (let i = 0; i < productosMasComprados.length && i < 10; i++) {
              const prodid = await obtenerProducto(productosMasComprados[i].idProducto);
          
              // Verificar si prodid.nombre es nulo, indefinido o una cadena vacía
              if (prodid.nombre === null || prodid.nombre === undefined || prodid.nombre === '') {
                  // Si es nulo, indefinido o una cadena vacía, detener el ciclo
                  break;
              } else {
                  // Si no es nulo, indefinido o una cadena vacía, asignar el nombre
                  nombres.push(prodid.nombre);
              }
          }

          // Crear el cuerpo de la tabla
          const cuerpo = tabla.createTBody();
          productosMasComprados.forEach((producto, index) => {
              const fila = cuerpo.insertRow();
              const celdaProducto = fila.insertCell();
              celdaProducto.textContent = nombres[index]; // Puedes cambiar esto por el nombre del producto
              const celdaCantidad = fila.insertCell();
              celdaCantidad.textContent = producto.cantidad;
              const celdaFecha1 = fila.insertCell();
              celdaFecha1.textContent = fechaInicial;
              const celdaFecha2 = fila.insertCell();
              celdaFecha2.textContent = fechaFinal;
          });

          // Obtener el elemento donde se insertará la tabla
          const contenedorTabla = document.getElementById('tablaVentasRango');
          // Limpiar el contenedor antes de agregar la nueva tabla
          contenedorTabla.innerHTML = '';
          // Agregar la tabla al contenedor
          contenedorTabla.appendChild(tabla);
      } catch (error) {
          console.error('Error al obtener los productos más comprados por rango de fechas:', error);
      }
  });
}



//Graficos Descnendentes
// Obtener el producto mas compradp
async function obtenerProductosMasComprados() {
  try {
      // Crear un objeto para almacenar la cantidad de cada producto
      const cantidadPorProducto = {};

      // Realizar la consulta a Firebase para obtener los detalles de todas las compras
      const querySnapshot = await getDocs(collection(firestore, 'detalles_compras'));

      // Iterar sobre los documentos obtenidos en la consulta
      querySnapshot.forEach((doc) => {
          // Obtener los datos de cada documento
          const detalleCompra = doc.data();
          //const nombreprod = detalleCompra.nombre_producto;
          //console.log(nombreprod);
          
          // Verificar si el producto ya ha sido registrado en el objeto cantidadPorProducto
          if (detalleCompra.id_producto in cantidadPorProducto) {
              // Si ya existe, sumar la cantidad actual a la cantidad registrada
              cantidadPorProducto[detalleCompra.id_producto] += detalleCompra.cantidad;
          } else {
              // Si no existe, agregar el producto al objeto con su cantidad
              cantidadPorProducto[detalleCompra.id_producto] = detalleCompra.cantidad;
          }
      });

      // Ordenar los productos por la cantidad de compras de mayor a menor
      const productosMasComprados = Object.entries(cantidadPorProducto)
          .sort(([, cantidadA], [, cantidadB]) => cantidadB - cantidadA)
          .map(([idProducto, cantidad]) => ({ idProducto, cantidad }));

      // Devolver la lista de productos más comprados
      return productosMasComprados;
  } catch (error) {
      console.error('Error al obtener los productos más comprados:', error);
      throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
  }
}

// Crear el gráfico con los datos obtenidos de la base de datos producto con mas venta
async function crearGraficoProductosMasVendidos() {
  // Llamar a la función para obtener los productos más comprados
  obtenerProductosMasComprados().then(async (productosMasComprados) => {
  // Extraer los nombres de los productos y las cantidades
  const nombresProductos = productosMasComprados.map(producto => producto.idProducto);
  const cantidades = productosMasComprados.map(producto => producto.cantidad);
  //console.log(nombresProductos);
  const nombres = [];

  for(let i = 0; i < productosMasComprados.length && i < 5; i++){
      const prodid = await obtenerProducto(nombresProductos[i]);
      nombres[i] = prodid.nombre; 
      //console.log(prodid.nombre);
  }
  //const nombreprod = prodid.data.nombre;

  // Crear la configuración para la gráfica de barras
  const ctx = document.getElementById('graficoProductos').getContext('2d');
  const chart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: nombres,
          datasets: [{
              label: 'Productos más comprados',
              data: cantidades,
              backgroundColor: 'rgba(159, 121, 255, 0.2)',
              borderColor: 'rgba(134, 87, 253, 1)',
              borderWidth: 2
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}).catch(error => {
  console.error('Error al obtener los productos más comprados:', error);
});

}

// Obtener el producto mas compradp
async function obtenerProductosConMasIngresos() {
    try {
        // Crear un objeto para almacenar la cantidad de cada producto
        const ingresoPorProducto = {};

        // Realizar la consulta a Firebase para obtener los detalles de todas las compras
        const querySnapshot = await getDocs(collection(firestore, 'detalles_compras'));

        // Iterar sobre los documentos obtenidos en la consulta
        querySnapshot.forEach((doc) => {
            // Obtener los datos de cada documento
            const detalleCompra = doc.data();
            //const nombreprod = detalleCompra.nombre_producto;
            //console.log(nombreprod);
            
            // Verificar si el producto ya ha sido registrado en el objeto ingresoPorProducto
            if (detalleCompra.id_producto in ingresoPorProducto) {
                // Si ya existe, sumar la cantidad actual a la cantidad registrada
                ingresoPorProducto[detalleCompra.id_producto] += detalleCompra.subtotal;
            } else {
                // Si no existe, agregar el producto al objeto con su cantidad
                ingresoPorProducto[detalleCompra.id_producto] = detalleCompra.subtotal;
            }
        });

        // Ordenar los productos por la cantidad de compras de mayor a menor
        const productosConMasIngresos = Object.entries(ingresoPorProducto)
            .sort(([, subtotalA], [, subtotalB]) => subtotalB - subtotalA)
            .map(([idProducto, subtotal]) => ({ idProducto, subtotal }));

        // Devolver la lista de productos más comprados
        return productosConMasIngresos;
    } catch (error) {
        console.error('Error al obtener los productos más comprados:', error);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}

// Crear el gráfico con los datos obtenidos de la base de datos con el cliente con mas compras
async function crearGraficoProductosConMasIngresos() {
    // Llamar a la función para obtener los productos más comprados
    obtenerProductosConMasIngresos().then(async (productosConMasIngreso) => {
    // Extraer los nombres de los productos y las cantidades
    const nombresProductos = productosConMasIngreso.map(producto => producto.idProducto);
    const cantidades = productosConMasIngreso.map(producto => producto.subtotal);
    //console.log(nombresProductos);
    const nombres = [];

    for(let i = 0; i < 5; i++){
        const prodid = await obtenerProducto(nombresProductos[i]);
        nombres[i] = prodid.nombre; 
        //console.log(prodid.nombre);
    }
    //const nombreprod = prodid.data.nombre;

    // Crear la configuración para la gráfica de barras
    const ctx = document.getElementById('graficoProductosIng').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombres,
            datasets: [{
                label: 'Producto con mas ingresos',
                data: cantidades,
                backgroundColor: 'rgba(159, 121, 255, 0.2)',
                borderColor: 'rgba(134, 87, 253, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}).catch(error => {
    console.error('Error al obtener los productos más comprados:', error);
});

}

// Obtener el cliente con mas compras
async function obtenerClienteConMasCompras() {
    try {
        // Crear un objeto para almacenar la cantidad de cada producto
        const clienteConMasCompras = {};

        // Realizar la consulta a Firebase para obtener los detalles de todas las compras
        const querySnapshot = await getDocs(collection(firestore, 'detalles_compras'));

        // Iterar sobre los documentos obtenidos en la consulta
        querySnapshot.forEach((doc) => {
            // Obtener los datos de cada documento
            const detalleCompra = doc.data();
            //const nombreprod = detalleCompra.nombre_producto;
            //console.log(nombreprod);
            
            // Verificar si el producto ya ha sido registrado en el objeto clienteConMasCompras
            if (detalleCompra.id_usuario in clienteConMasCompras) {
                // Si ya existe, sumar la cantidad actual a la cantidad registrada
                clienteConMasCompras[detalleCompra.id_usuario] += detalleCompra.cantidad;
            } else {
                // Si no existe, agregar el producto al objeto con su cantidad
                clienteConMasCompras[detalleCompra.id_usuario] = detalleCompra.cantidad;
            }
        });

        // Ordenar los productos por la cantidad de compras de mayor a menor
        const clienteConMasCompra = Object.entries(clienteConMasCompras)
            .sort(([, cantidadA], [, cantidadB]) => cantidadB - cantidadA)
            .map(([idUsuario, cantidad]) => ({ idUsuario, cantidad }));

        // Devolver la lista de productos más comprados
        return clienteConMasCompra;
    } catch (error) {
        console.error('Error al obtener los productos más comprados:', error);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}

// Crear el gráfico con los datos obtenidos de la base de datos con el cliente con mas compras
async function crearGraficoClienteConMasCompras() {
    // Llamar a la función para obtener los productos más comprados
    obtenerClienteConMasCompras().then(async (clienteConMasCompra) => {
    // Extraer los nombres de los productos y las cantidades
    const clientazos = clienteConMasCompra.map(cliente => cliente.idUsuario);
    const cantidades = clienteConMasCompra.map(cliente => cliente.cantidad);
    //console.log(nombresProductos);
    const nombres = [];

    for(let i = 0; i < clientazos.length; i++){
        const prodid = await obtenerUsuario(clientazos[i]);
        nombres[i] = prodid.usuario; 
        //console.log(prodid.nombre);
    }
    //const nombreprod = prodid.data.nombre;

    // Crear la configuración para la gráfica de barras
    const ctx = document.getElementById('graficoClientes').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombres,
            datasets: [{
                label: 'Cliente con mas Compras',
                data: cantidades,
                backgroundColor: 'rgba(159, 121, 255, 0.2)',
                borderColor: 'rgba(134, 87, 253, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}).catch(error => {
    console.error('Error al obtener los productos más comprados:', error);
});

}

// Obtener el cliente con mas ingresos
async function obtenerClienteConMasIngresos() {
    try {
        // Crear un objeto para almacenar la cantidad de cada producto
        const clienteConMasIngresos = {};

        // Realizar la consulta a Firebase para obtener los detalles de todas las compras
        const querySnapshot = await getDocs(collection(firestore, 'detalles_compras'));

        // Iterar sobre los documentos obtenidos en la consulta
        querySnapshot.forEach((doc) => {
            // Obtener los datos de cada documento
            const detalleCompra = doc.data();
            //const nombreprod = detalleCompra.nombre_producto;
            //console.log(nombreprod);
            
            // Verificar si el producto ya ha sido registrado en el objeto clienteConMasIngresos
            if (detalleCompra.id_usuario in clienteConMasIngresos) {
                // Si ya existe, sumar la cantidad actual a la cantidad registrada
                clienteConMasIngresos[detalleCompra.id_usuario] += detalleCompra.subtotal;
            } else {
                // Si no existe, agregar el producto al objeto con su cantidad
                clienteConMasIngresos[detalleCompra.id_usuario] = detalleCompra.subtotal;
            }
        });

        // Ordenar los productos por la cantidad de compras de mayor a menor
        const clienteConMasIngreso = Object.entries(clienteConMasIngresos)
            .sort(([, subtotalA], [, subtotalB]) => subtotalB - subtotalA)
            .map(([idUsuario, subtotal]) => ({ idUsuario, subtotal }));

        // Devolver la lista de productos más comprados
        return clienteConMasIngreso;
    } catch (error) {
        console.error('Error al obtener los productos más comprados:', error);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}

// Crear el gráfico con los datos obtenidos de la base de datos con el cliente con mas compras
async function crearGraficoClienteConMasIngresos() {
    // Llamar a la función para obtener los productos más comprados
    obtenerClienteConMasIngresos().then(async (clienteConMasIngresos) => {
    // Extraer los nombres de los productos y las cantidades
    const clientazos = clienteConMasIngresos.map(cliente => cliente.idUsuario);
    const cantidades = clienteConMasIngresos.map(cliente => cliente.subtotal);
    //console.log(nombresProductos);
    const nombres = [];

    for(let i = 0; i < clientazos.length; i++){
        const prodid = await obtenerUsuario(clientazos[i]);
        nombres[i] = prodid.usuario; 
        //console.log(prodid.nombre);
    }
    //const nombreprod = prodid.data.nombre;

    // Crear la configuración para la gráfica de barras
    const ctx = document.getElementById('graficoClientesIng').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombres,
            datasets: [{
                label: 'Cliente con mas Ingresos',
                data: cantidades,
                backgroundColor: 'rgba(159, 121, 255, 0.2)',
                borderColor: 'rgba(134, 87, 253, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}).catch(error => {
    console.error('Error al obtener los productos más comprados:', error);
});

}



//Graficos Ascendentes
// Obtener el producto mas comprado (de menor a mayor)
async function obtenerProductosMasCompradosA() {
  try {
      // Crear un objeto para almacenar la cantidad de cada producto
      const cantidadPorProducto = {};

      // Realizar la consulta a Firebase para obtener los detalles de todas las compras
      const querySnapshot = await getDocs(collection(firestore, 'detalles_compras'));

      // Iterar sobre los documentos obtenidos en la consulta
      querySnapshot.forEach((doc) => {
          // Obtener los datos de cada documento
          const detalleCompra = doc.data();
          
          // Verificar si el producto ya ha sido registrado en el objeto cantidadPorProducto
          if (detalleCompra.id_producto in cantidadPorProducto) {
              // Si ya existe, sumar la cantidad actual a la cantidad registrada
              cantidadPorProducto[detalleCompra.id_producto] += detalleCompra.cantidad;
          } else {
              // Si no existe, agregar el producto al objeto con su cantidad
              cantidadPorProducto[detalleCompra.id_producto] = detalleCompra.cantidad;
          }
      });

      // Ordenar los productos por la cantidad de compras de menor a mayor
      const productosMasCompradosA = Object.entries(cantidadPorProducto)
          .sort(([, cantidadA], [, cantidadB]) => cantidadB - cantidadA)
          .map(([idProducto, cantidad]) => ({ idProducto, cantidad }));

      // Devolver la lista de productos más comprados
      return productosMasCompradosA;
  } catch (error) {
      console.error('Error al obtener los productos más comprados:', error);
      throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
  }
}

// Crear el gráfico con los datos obtenidos de la base de datos producto con mas venta
async function crearGraficoProductosMasVendidosA() {
  // Llamar a la función para obtener los productos más comprados
  obtenerProductosMasCompradosA().then(async (productosMasCompradosA) => {
  // Extraer los nombres de los productos y las cantidades
  const nombresProductos = productosMasCompradosA.map(producto => producto.idProducto);
  const cantidades = productosMasCompradosA.map(producto => producto.cantidad);
  //console.log(nombresProductos);
  const nombres = [];

  for(let i = 0; i < productosMasCompradosA.length && i < 5; i++){
      const prodid = await obtenerProducto(nombresProductos[i]);
      nombres[i] = prodid.nombre; 
      //console.log(prodid.nombre);
  }
  //const nombreprod = prodid.data.nombre;

  // Crear la configuración para la gráfica de barras
  const ctx = document.getElementById('graficoProductosA').getContext('2d');
  const chart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: nombres,
          datasets: [{
              label: 'Productos más comprados',
              data: cantidades,
              backgroundColor: 'rgba(159, 121, 255, 0.2)',
              borderColor: 'rgba(134, 87, 253, 1)',
              borderWidth: 2
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              },
              x: {
                reverse: true // Agregar esta línea para invertir el eje y
              }
          }
      }
  });
}).catch(error => {
  console.error('Error al obtener los productos más comprados:', error);
});

}


// Obtener el producto mas compradp
async function obtenerProductosConMasIngresosA() {
    try {
        // Crear un objeto para almacenar la cantidad de cada producto
        const ingresoPorProducto = {};

        // Realizar la consulta a Firebase para obtener los detalles de todas las compras
        const querySnapshot = await getDocs(collection(firestore, 'detalles_compras'));

        // Iterar sobre los documentos obtenidos en la consulta
        querySnapshot.forEach((doc) => {
            // Obtener los datos de cada documento
            const detalleCompra = doc.data();
            //const nombreprod = detalleCompra.nombre_producto;
            //console.log(nombreprod);
            
            // Verificar si el producto ya ha sido registrado en el objeto ingresoPorProducto
            if (detalleCompra.id_producto in ingresoPorProducto) {
                // Si ya existe, sumar la cantidad actual a la cantidad registrada
                ingresoPorProducto[detalleCompra.id_producto] += detalleCompra.subtotal;
            } else {
                // Si no existe, agregar el producto al objeto con su cantidad
                ingresoPorProducto[detalleCompra.id_producto] = detalleCompra.subtotal;
            }
        });

        // Ordenar los productos por la cantidad de compras de mayor a menor
        const productosConMasIngresosA = Object.entries(ingresoPorProducto)
            .sort(([, subtotalA], [, subtotalB]) => subtotalB - subtotalA)
            .map(([idProducto, subtotal]) => ({ idProducto, subtotal }));

        // Devolver la lista de productos más comprados
        return productosConMasIngresosA;
    } catch (error) {
        console.error('Error al obtener los productos más comprados:', error);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}

// Crear el gráfico con los datos obtenidos de la base de datos con el cliente con mas compras
async function crearGraficoProductosConMasIngresosA() {
    // Llamar a la función para obtener los productos más comprados
    obtenerProductosConMasIngresosA().then(async (productosConMasIngresoA) => {
    // Extraer los nombres de los productos y las cantidades
    const nombresProductos = productosConMasIngresoA.map(producto => producto.idProducto);
    const cantidades = productosConMasIngresoA.map(producto => producto.subtotal);
    //console.log(nombresProductos);
    const nombres = [];

    for(let i = 0; i < 5; i++){
        const prodid = await obtenerProducto(nombresProductos[i]);
        nombres[i] = prodid.nombre; 
        //console.log(prodid.nombre);
    }
    //const nombreprod = prodid.data.nombre;

    // Crear la configuración para la gráfica de barras
    const ctx = document.getElementById('graficoProductosIngA').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombres,
            datasets: [{
                label: 'Producto con mas ingresos',
                data: cantidades,
                backgroundColor: 'rgba(159, 121, 255, 0.2)',
                borderColor: 'rgba(134, 87, 253, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                  reverse: true // Agregar esta línea para invertir el eje y
                }
            }
        }
    });
}).catch(error => {
    console.error('Error al obtener los productos más comprados:', error);
});

}


// Obtener el cliente con mas compras
async function obtenerClienteConMasComprasA() {
    try {
        // Crear un objeto para almacenar la cantidad de cada producto
        const clienteConMasCompras = {};

        // Realizar la consulta a Firebase para obtener los detalles de todas las compras
        const querySnapshot = await getDocs(collection(firestore, 'detalles_compras'));

        // Iterar sobre los documentos obtenidos en la consulta
        querySnapshot.forEach((doc) => {
            // Obtener los datos de cada documento
            const detalleCompra = doc.data();
            //const nombreprod = detalleCompra.nombre_producto;
            //console.log(nombreprod);
            
            // Verificar si el producto ya ha sido registrado en el objeto clienteConMasCompras
            if (detalleCompra.id_usuario in clienteConMasCompras) {
                // Si ya existe, sumar la cantidad actual a la cantidad registrada
                clienteConMasCompras[detalleCompra.id_usuario] += detalleCompra.cantidad;
            } else {
                // Si no existe, agregar el producto al objeto con su cantidad
                clienteConMasCompras[detalleCompra.id_usuario] = detalleCompra.cantidad;
            }
        });

        // Ordenar los productos por la cantidad de compras de mayor a menor
        const clienteConMasCompraA = Object.entries(clienteConMasCompras)
            .sort(([, cantidadA], [, cantidadB]) => cantidadB - cantidadA)
            .map(([idUsuario, cantidad]) => ({ idUsuario, cantidad }));

        // Devolver la lista de productos más comprados
        return clienteConMasCompraA;
    } catch (error) {
        console.error('Error al obtener los productos más comprados:', error);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}

// Crear el gráfico con los datos obtenidos de la base de datos con el cliente con mas compras
async function crearGraficoClienteConMasComprasA() {
    // Llamar a la función para obtener los productos más comprados
    obtenerClienteConMasComprasA().then(async (clienteConMasCompraA) => {
    // Extraer los nombres de los productos y las cantidades
    const clientazos = clienteConMasCompraA.map(cliente => cliente.idUsuario);
    const cantidades = clienteConMasCompraA.map(cliente => cliente.cantidad);
    //console.log(nombresProductos);
    const nombres = [];

    for(let i = 0; i < clientazos.length; i++){
        const prodid = await obtenerUsuario(clientazos[i]);
        nombres[i] = prodid.usuario; 
        //console.log(prodid.nombre);
    }
    //const nombreprod = prodid.data.nombre;

    // Crear la configuración para la gráfica de barras
    const ctx = document.getElementById('graficoClientesA').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombres,
            datasets: [{
                label: 'Cliente con mas Compras',
                data: cantidades,
                backgroundColor: 'rgba(159, 121, 255, 0.2)',
                borderColor: 'rgba(134, 87, 253, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                  reverse: true // Agregar esta línea para invertir el eje y
                }
            }
        }
    });
}).catch(error => {
    console.error('Error al obtener los productos más comprados:', error);
});

}


// Obtener el cliente con mas ingresos
async function obtenerClienteConMasIngresosA() {
    try {
        // Crear un objeto para almacenar la cantidad de cada producto
        const clienteConMasIngresos = {};

        // Realizar la consulta a Firebase para obtener los detalles de todas las compras
        const querySnapshot = await getDocs(collection(firestore, 'detalles_compras'));

        // Iterar sobre los documentos obtenidos en la consulta
        querySnapshot.forEach((doc) => {
            // Obtener los datos de cada documento
            const detalleCompra = doc.data();
            //const nombreprod = detalleCompra.nombre_producto;
            //console.log(nombreprod);
            
            // Verificar si el producto ya ha sido registrado en el objeto clienteConMasIngresos
            if (detalleCompra.id_usuario in clienteConMasIngresos) {
                // Si ya existe, sumar la cantidad actual a la cantidad registrada
                clienteConMasIngresos[detalleCompra.id_usuario] += detalleCompra.subtotal;
            } else {
                // Si no existe, agregar el producto al objeto con su cantidad
                clienteConMasIngresos[detalleCompra.id_usuario] = detalleCompra.subtotal;
            }
        });

        // Ordenar los productos por la cantidad de compras de mayor a menor
        const clienteConMasIngresoA = Object.entries(clienteConMasIngresos)
            .sort(([, subtotalA], [, subtotalB]) => subtotalB - subtotalA)
            .map(([idUsuario, subtotal]) => ({ idUsuario, subtotal }));

        // Devolver la lista de productos más comprados
        return clienteConMasIngresoA;
    } catch (error) {
        console.error('Error al obtener los productos más comprados:', error);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}

// Crear el gráfico con los datos obtenidos de la base de datos con el cliente con mas compras
async function crearGraficoClienteConMasIngresosA() {
    // Llamar a la función para obtener los productos más comprados
    obtenerClienteConMasIngresosA().then(async (clienteConMasIngresosA) => {
    // Extraer los nombres de los productos y las cantidades
    const clientazos = clienteConMasIngresosA.map(cliente => cliente.idUsuario);
    const cantidades = clienteConMasIngresosA.map(cliente => cliente.subtotal);
    //console.log(nombresProductos);
    const nombres = [];

    for(let i = 0; i < clientazos.length; i++){
        const prodid = await obtenerUsuario(clientazos[i]);
        nombres[i] = prodid.usuario; 
        //console.log(prodid.nombre);
    }
    //const nombreprod = prodid.data.nombre;

    // Crear la configuración para la gráfica de barras
    const ctx = document.getElementById('graficoClientesIngA').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombres,
            datasets: [{
                label: 'Cliente con mas Ingresos',
                data: cantidades,
                backgroundColor: 'rgba(159, 121, 255, 0.2)',
                borderColor: 'rgba(134, 87, 253, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                  reverse: true // Agregar esta línea para invertir el eje y
                }
            }
        }
    });
}).catch(error => {
    console.error('Error al obtener los productos más comprados:', error);
});

}



async function agregarProducto(descripcion, imagenUrl, id_proveedor, nombre, preciounitario, stock) {
  try {

    console.log(imagenUrl);

      // Añade un nuevo documento a la colección 'productos'
      await addDoc(collection(firestore, 'productos'), {
          activo: true,
          descripcion: descripcion,
          id_proveedor: id_proveedor,
          imagenUrl: String(imagenUrl),
          nombre: nombre,
          preciounitario: Number(preciounitario),
          stock: Number(stock)
      });
      console.log('Producto agregado correctamente.');
  } catch (error) {
      console.error('Error al agregar el producto:', error.message);
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

});

//Cargar Productos Destacado
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // ID del producto que deseas obtener
    // Producto destacado
    const idProductoDestacado = 'KQyCDBDsNOZbGY3L7yOE';

    // Obtener el producto destacado
    const productosD = await obtenerProducto(idProductoDestacado);
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

          let actividad = "";
          if(producto.data.activo == true){
            actividad = "Habilitado";
          } else {
            actividad = "Deshabilitado";
          }

          // Asignar los datos del producto y del proveedor a los elementos HTML dentro del contenedor
          nuevoProducto.innerHTML = `
                <img id="imagenProducto${index + 1}" src="${producto.data.imagenUrl}" alt="casco">
                <h1 id="nombreProducto${index + 1}">${producto.data.nombre}</h1>
                <h4 id="marcaProducto${index + 1}">${proveid.nombre}</h4>
                <p id="descripcionProducto${index + 1}">${producto.data.descripcion}</p>
                <br>
                <h3 id="precioProducto${index + 1}">$${precio} MXN</h3>
                <h5 id="cantidadProducto${index + 1}">${producto.data.stock} Disponibles</h5>
                <h5 id="actividad${index + 1}">Estado: ${actividad}</h5>
                
                <!--<div class="divbotonmenos">
                    <button class="botonmenos"><img src="ImgFinal/minus.png" alt="menos" id="menos${index + 1}"></button>
                    <pre id="cantidad${index + 1}">0</pre>
                    <button class="botonmenos"><img src="ImgFinal/plus.png" alt="mas" id="mas${index + 1}"></button>
                </div> -->

                <div>
                <button id="baja${index + 1}" class="botones">Deshabilitar</button>
                <button id="alta${index + 1}" class="botones">Habilitar</button>
                </div>
                <button class="boton1indivtodosLP" id="editar${index + 1}">Editar</button>
          `;

          // Agregar el nuevo contenedor al contenedor principal
          contenedorProductos.appendChild(nuevoProducto);

          document.getElementById("esconder").style.display = "show";

          const baja = document.getElementById(`baja${index + 1}`);
        baja.addEventListener('click', async function(){

          console.log(producto.id);

          try {
            // Obtener la referencia al documento del usuario en la base de datos
            const usuarioRef = doc(firestore, 'productos', producto.id);
    
            // Obtener los datos actuales del usuario
            const usuarioSnapshot = await getDoc(usuarioRef);
            if (usuarioSnapshot.exists()) {
                // Actualizar el campo 'activo' a false para deshabilitar la cuenta
                await updateDoc(usuarioRef, {
                    activo: false
                });
                alert('Producto deshabilitada exitosamente');
                console.log('Producto deshabilitada exitosamente para el usuario con ID:', producto.id);
                window.location.reload();
            } else {
                console.error('No se encontró el usuario con ID:', producto.id);
            }
        } catch (error) {
            console.error('Error al deshabilitar el producto:', error);
        }
        });

        const alta = document.getElementById(`alta${index + 1}`);
        alta.addEventListener('click', async function(){

          console.log(producto.id);

          try {
            // Obtener la referencia al documento del usuario en la base de datos
            const usuarioRef = doc(firestore, 'productos', producto.id);
    
            // Obtener los datos actuales del usuario
            const usuarioSnapshot = await getDoc(usuarioRef);
            if (usuarioSnapshot.exists()) {
                // Actualizar el campo 'activo' a false para deshabilitar la cuenta
                await updateDoc(usuarioRef, {
                    activo: true
                });
                alert('Producto habilitada exitosamente');
                console.log('Producto habilitada exitosamente para el usuario con ID:', producto.id);
                window.location.reload();
            } else {
                console.error('No se encontró el usuario con ID:', producto.id);
            }
        } catch (error) {
            console.error('Error al habilitar el producto:', error);
        }
        });

        const editar = document.getElementById(`editar${index + 1}`);
        editar.addEventListener('click', async function(){

          document.getElementById("esconder").style.display = "none";

            contenedorProductos.innerHTML = '';

            // Asignar los datos del producto y del proveedor a los elementos HTML dentro del contenedor
            nuevoProducto.innerHTML = `
            <img id="imagenProducto${index + 1}" src="${producto.data.imagenUrl}" alt="casco">

            <h2>Modificar Producto</h2><br>
            <label for="nuevoNombreProd"><b>Ingrese Nuevo Nombre del Producto</b></label><br>
            <input type="text" name="nuevoNombreProd" id="nuevoNombreProd" style="width:80%;" required><br><br>

            <label for="nuevaDescripcion"><b>Ingrese Nueva Descripcion</b></label><br>
            <textarea name="nuevaDescripcion" id="nuevaDescripcion" cols="40" rows="6" style="font-size: 14px; resize: none; overflow: auto; background-color: #f5f5f5; border-color: #9f79ff" required></textarea>

            <label for="proveedorProd"><b>Proveedor: ${proveid.nombre}</b></label><br>
            <select name="proveedorProd" id="proveedorProd${index + 1}" required></select><br>

            <label for="nuevoPrecio"><b>Ingrese Nuevo Precio</b></label><br>
            <input type="number" name="nuevoPrecio" id="nuevoPrecio" required><br>

            <label for="nuevoStock"><b>Ingrese Nuevo Stock</b></label><br>
            <input type="number" name="nuevoStock" id="nuevoStock" required><br>

            <div style="display: flex;">
            <button class="botones" id="guardar${index + 1}">Guardar</button><br>
            <button class="botones" id="cancelar${index + 1}">Cancelar</button>
            </div>

      `;

            // Agregar el nuevo contenedor al contenedor principal
            contenedorProductos.appendChild(nuevoProducto);

            // Obtener referencia al elemento select
          const proveedorSelect = document.getElementById(`proveedorProd${index + 1}`);
          // Llamar a la función para obtener los datos de los proveedores
          Proveedor().then(proveedores => {
            // Iterar sobre los proveedores obtenidos
            proveedores.forEach(proveedor => {
              // Crear un elemento option para cada proveedor y establecer el valor y texto
              const option = document.createElement('option');
              option.value = proveedor.id; // El valor es el ID del proveedor
              option.textContent = proveedor.data.nombre; // El texto es el nombre del proveedor
              // Agregar la opción al select
              proveedorSelect.appendChild(option);
            });
          }).catch(error => {
            console.error('Error al obtener proveedores:', error);
          });

            //Mostrar datos a actualizar
            document.getElementById('nuevoNombreProd').value = producto.data.nombre;
            document.getElementById('nuevaDescripcion').value = producto.data.descripcion;
            document.getElementById('nuevoPrecio').value = precio;
            document.getElementById('nuevoStock').value = producto.data.stock;
            
            const guardar = document.getElementById(`guardar${index + 1}`);
            guardar.addEventListener('click', async function(){

              const productoRef = doc(firestore, 'productos', producto.id); // Suponiendo que 'productos' es el nombre de la colección en Firestore

              const nombre = document.getElementById("nuevoNombreProd").value;
              const descripcion = document.getElementById("nuevaDescripcion").value;
              let precio = parseInt(document.getElementById("nuevoPrecio").value);
              let stock = parseInt(document.getElementById("nuevoStock").value);
              const id_proveedorp = document.getElementById(`proveedorProd${index + 1}`).value;
              console.log(id_proveedorp);

              if (!nombre || !descripcion || !precio || !stock || !id_proveedorp || precio < 0 || stock < 0) {
                alert('Por favor, completa todos los campos y asegúrate de que el precio y el stock no sean negativos.');
              } else {
                // Actualizar el campo 'stock' del documento del producto
                await updateDoc(productoRef, {
                  descripcion: descripcion,
                  id_proveedor: id_proveedorp,
                  nombre: nombre,
                  preciounitario: Number(precio),
                  stock: Number(stock)
                });
                alert('Producto Actualizado');
                window.location.reload();
              }

            });


            const cancelar = document.getElementById(`cancelar${index + 1}`);
            cancelar.addEventListener('click', async function (){
              window.location.reload();
            });



        });

      }

      const agregarp = document.getElementById('agregarProd');
        agregarp.addEventListener('click', async function(){
          console.log('Trabaja :D');
          contenedorProductos.innerHTML = '';

          document.getElementById("esconder").style.display = "none";

          contenedorProductos.innerHTML = `
          
                <div class="indivtodosLP">

                <h2>Agregar Producto</h2><br>

                <input type="file" id="fileInput" style="width: 100%;"><br>
                <!-- <button onclick="subirImagen()">Subir Imagen</button> -->


                <label for="nombreProd"><b>Ingrese Nombre del Producto</b></label><br>
                <input type="text" name="nombreProd" id="nombreProd" style="width:80%;"><br>
    
                <label for="descripcionProd"><b>Ingrese Descripcion</b></label><br>
                <textarea name="descripcionProd" id="descripcionProd" cols="28" rows="5" style="font-size: 14px; resize: none; overflow: auto;"></textarea>
    
                <label for="proveedorProd"><b>Proveedor: </b></label><br>
                <select name="proveedorProd" id="proveedorProd"></select><br>


                <label for="precioProd"><b>Ingrese Precio</b></label><br>
                <input type="number" name="precioProd" id="precioProd"><br>
    
                <label for="stockProd"><b>Ingrese Stock</b></label><br>
                <input type="number" name="stockProd" id="stockProd"<br><br>
    

                <div style="display: flex;">
                <button class="botones" id="guardarProd">Guardar</button><br>
                <button class="botones" id="cancelarProd">Cancelar</button>  
                </div>

                </div>
          
          `;

          // Obtener referencia al elemento select
          const proveedorSelect = document.getElementById('proveedorProd');
          // Llamar a la función para obtener los datos de los proveedores
          Proveedor().then(proveedores => {
            // Iterar sobre los proveedores obtenidos
            proveedores.forEach(proveedor => {
              // Crear un elemento option para cada proveedor y establecer el valor y texto
              const option = document.createElement('option');
              option.value = proveedor.id; // El valor es el ID del proveedor
              option.textContent = proveedor.data.nombre; // El texto es el nombre del proveedor
              // Agregar la opción al select
              proveedorSelect.appendChild(option);
            });
          }).catch(error => {
            console.error('Error al obtener proveedores:', error);
          });


          const cancelar = document.getElementById('cancelarProd');
            cancelar.addEventListener('click', async function (){
              window.location.reload();
            });

          const cargar = document.getElementById('guardarProd');
          cargar.addEventListener('click', async function(){
            
            const descripcionp = document.getElementById('descripcionProd').value;
            const id_proveedorp = document.getElementById('proveedorProd').value;
            const nombrep = document.getElementById('nombreProd').value;
            const preciop = document.getElementById('precioProd').value;
            const stockp = document.getElementById('stockProd').value;
            let url;

            const file = document.getElementById('fileInput').files[0];
  
            // Generar un nombre único para el archivo
            const fileName = file.name;
            
            // Obtener referencia al Storage de Firebase
            // Create a root reference
            const storage = getStorage();
            const storageRef = ref(storage, 'gs://koki-shop-f251b.appspot.com/' + fileName);
            
            // Subir el archivo al Storage
            try {
              // Subir el archivo al Storage
              const snapshot = await uploadBytes(storageRef, file);
              console.log('Imagen subida exitosamente');
              
              // Obtener la URL de descarga del archivo subido
              const downloadURL = await getDownloadURL(snapshot.ref);
              console.log('URL de descarga:', downloadURL);
              
              // Utilizar downloadURL como desees aquí
              url = downloadURL;
          } catch (error) {
              console.error('Error al subir la imagen o obtener la URL de descarga:', error);
          }
          

          if (!nombrep || !descripcionp || !url || !preciop || !stockp || !id_proveedorp || preciop < 0 || stockp < 0) {
            alert('Por favor, completa todos los campos y asegúrate de que el precio y el stock no sean negativos.');
            } else if (preciop == 0 || stockp == 0){
              alert('Pro favor introduzca un numero mayor a 0')
            } else {
              await agregarProducto(descripcionp, url, id_proveedorp, nombrep, preciop, stockp); 
              alert('Producto Agregado');
              //window.location.reload();
            }

          }); 

        });

  } catch (error) {
      console.error("Error al obtener productos:", error);
  }
  
});

// Llamar a la función para crear el gráfico una vez que la página esté completamente cargada
document.addEventListener('DOMContentLoaded', function(){
  crearTablaProductosMasVendidosPorFecha();
  crearTablaProductosMasVendidosPorMes();
  crearTablaProductosMasVendidosPorRangoFechas();
    crearGraficoProductosMasVendidos();
    crearGraficoProductosMasVendidosA();
    crearGraficoProductosConMasIngresos();
    crearGraficoProductosConMasIngresosA();
    crearGraficoClienteConMasCompras();
    crearGraficoClienteConMasComprasA();
    crearGraficoClienteConMasIngresos();
    crearGraficoClienteConMasIngresosA();
});

}

document.addEventListener('DOMContentLoaded', DashboardPage());