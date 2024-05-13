export function generarIdAleatorio() {
    // Genera un número aleatorio entre 0 y 9999
    let randomNumber = Math.floor(Math.random() * 10000);
    // Convierte el número a una cadena de 4 dígitos rellenando con ceros a la izquierda si es necesario
    let randomId = randomNumber.toString().padStart(4, '0');
    return randomId;
  }
  
  // Ejemplo de uso
  //let idAleatorio = generarIdAleatorio();
  //console.log(idAleatorio); // Imprime un ID de 4 dígitos aleatorio
  