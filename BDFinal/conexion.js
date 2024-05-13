// Importa las funciones que necesitas de los SDK que necesitas
//import { get } from "firebase/database";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
import { doc, setDoc, getDoc, getFirestore, updateDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

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

// Función para crear un usuario y enviar el correo de verificación
export async function createUserAndSendVerificationEmail(correo, contra, nombrec, apellidos, fechaNacimiento, usuario) {
  try {
    // Crea el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, correo, contra);
    const user = userCredential.user;

    // Envía el correo de verificación
    await sendEmailVerification(user);

    // Guarda la información del usuario en Firestore
    await setDoc(doc(firestore, 'usuario', user.uid), {
      activo: true,
      correo: correo,
      nombre: nombrec,
      apellidos: apellidos,
      nacimiento: fechaNacimiento,
      usuario: usuario,
    });
    // Alerta de éxito
    alert('Usuario registrado exitosamente. Se ha enviado un correo de verificación a tu dirección de correo electrónico.');
  } catch (error) {
    // Si hay un error, muestra una alerta con el mensaje de error
    alert('Error al registrar el usuario:', error.message);
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

// Función para validar las credenciales del usuario al iniciar sesión
export async function validateUser(correo, pass) {
  try {
    // Intenta iniciar sesión con el correo electrónico y la contraseña proporcionados
    const userCredential = await signInWithEmailAndPassword(auth, correo, pass);
    const user = userCredential.user; // Obtiene el usuario si la autenticación es exitosa  

    const userin = await obtenerUsuario(user.uid);
    console.log(userin.activo);

    // Verifica si el correo electrónico del usuario ha sido verificado
    if (!user.emailVerified && userin.activo == false) {
      // alert('El correo electrónico no ha sido verificado. Por favor, verifica tu correo electrónico antes de iniciar sesión.');
      Swal.fire({
        title: 'El correo electronico no ha sido verificado. Por favor verifica tu correo electronico antes de iniciar Sesión',
        icon: 'info',
        // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
        showConfirmButton: false, // Evita que se muestre el botón de confirmación
        timer: 2000
    });
      throw new Error('El correo electrónico no ha sido verificado. Por favor, verifica tu correo electrónico antes de iniciar sesión.');
      return null;
    } else if(user.emailVerified && userin.activo == true){
      console.log('Usuario autenticado:', user.uid); // Agrega esto para verificar si el usuario se autentica correctamente
      return user; // Devuelve el usuario autenticado
    } else {
      // alert('Al parecer fuiste baneado temporalmente :/');
      Swal.fire({
        title: 'Al parecer fuiste baneado temporalmente',
        icon: 'warning',
        // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
        showConfirmButton: false, // Evita que se muestre el botón de confirmación
        timer: 2000
    });
      cerrarSesion();
      return null;
    }
    
  } catch (error) {
    // Si hay un error durante el inicio de sesión, muestra una alerta con el mensaje de error
    // alert('Datos incorrectos o Espacios Vacios.');
    Swal.fire({
      title: 'Error, datos incorrectos o espacios vacios',
      icon: 'error',
      // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
      showConfirmButton: false, // Evita que se muestre el botón de confirmación
      timer: 2000
  });
    console.error('Error al iniciar sesión:', error.message); // Agrega esto para imprimir el error en la consola
    return null; // Devuelve null para indicar que no se pudo autenticar al usuario
  }
}

  //Actualizar datos del usuario
  export async function actualizarUsuario(nuevoNombre, nuevoApellido, nuevoNombreUsuario) {
    try {
      // Obtiene el usuario actualmente autenticado
      const user = auth.currentUser;
  
      // Verifica si el usuario está autenticado
      if (!user) {
        throw new Error('No hay usuario autenticado.');
      }
  
      // Verifica que los datos no estén vacíos o nulos
      if (!nuevoNombre || !nuevoApellido || !nuevoNombreUsuario) {
        throw new Error('Por favor, completa todos los campos.');
      }
      Swal.fire({
        title: 'Datos Actualizados Correctamente',
        icon: 'success',
        // iconColor: '#9F79FF', // Cambia el color del ícono de éxito
        showConfirmButton: false, // Evita que se muestre el botón de confirmación
        timer: 2000
    });
      // Actualiza los datos del usuario en Firestore
      await updateDoc(doc(firestore, 'usuario', user.uid), {
        nombre: nuevoNombre,
        apellidos: nuevoApellido,
        usuario: nuevoNombreUsuario
      });
  
      // Alerta de éxito
      // alert('Datos del usuario actualizados correctamente.');
      
      setTimeout(function() {
        window.location.reload();
    }, 1000);
    } catch (error) {
      // Si hay un error, muestra una alerta con el mensaje de error
      console.log('Error al actualizar los datos del usuario: ' + error.message);
    }
  }

//Funcion de Cerrar Sesion
  //Cerrar Sesion funcion
export async function cerrarSesion() {
    try {
        await signOut(auth);
        // Redirige a la página de inicio después de cerrar sesión
        window.location.href = 'Menuprincip.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
    }
}

// Función para obtener los datos del usuario actualmente autenticado
export function obtenerDatosUsuario() {
  return new Promise((resolve, reject) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
          if (user) {
              // El usuario está autenticado, puedes acceder a sus datos
              const { uid, displayName, email, photoURL } = user;
              resolve({
                  uid,
                  displayName,
                  email,
                  photoURL
              });
          } else {
              // El usuario no está autenticado
              reject(new Error('No hay usuario autenticado.'));
          }
      });
  });
}