// Definición de elementos iniciales
const carritoElement = document.getElementById("carrito");
const totalElement = document.querySelector(".total");

const [productos, agregarCarritoBotones] = [
  document.querySelectorAll(".producto"),
  document.querySelectorAll(".agregar-carrito")
];

let carrito = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : [];

agregarCarritoBotones.forEach(btn => {
  btn.addEventListener("click", agregarAlCarrito);
});

// Obtener carrito almacenado en localStorage al cargar la página
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
  actualizarCarrito();
}

// Función para agregar los productos al carrito
function agregarAlCarrito(event) {
  const productoElement = event.target.closest(".producto");
  const { id: productoId, nombre: productoNombre, precio: productoPrecio } = productoElement.dataset;

  const existeEnCarrito = carrito.some(item => item.id === productoId);

  carrito = existeEnCarrito
    ? carrito.map(item => (item.id === productoId ? { ...item, cantidad: item.cantidad + 1 } : item))
    : [
        ...carrito,
        {
          id: productoId,
          nombre: productoNombre,
          precio: parseFloat(productoPrecio),
          cantidad: 1
        }
      ];

  // Guardar carrito en localStorage después de cada actualización
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
}

// Función para eliminar los productos del carrito
function eliminarDelCarrito(productoId) {
  carrito = carrito.filter(item => item.id != productoId);

  // Guardar carrito en localStorage después de cada actualización
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
}

// Función para actualizar el carrito
function actualizarCarrito() {
  carritoElement.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    // Definición y creación del botón eliminar
    const productoHTML = `
    <div class="card mb-3 card-total">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 class="card-title">${item.nombre}</h5>
          <p class="card-text">Cantidad: ${item.cantidad}</p>
        </div>
        <div>
          <p class="card-text">$${subtotal.toFixed(2)}</p>
          <button class="eliminar btn btn-danger" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        </div>
      </div>
    </div>`;

    carritoElement.innerHTML += productoHTML;
  });

  totalElement.textContent = `Total: $${total.toFixed(2)}`;

  // Obtener los botones eliminar después de actualizar el carrito
  const botonesEliminar = document.querySelectorAll('.eliminar');
  botonesEliminar.forEach(btn => {
    btn.addEventListener('click', () => {
      const productoId = parseInt(btn.dataset.id);
      eliminarDelCarrito(productoId);
    });
  });
}


// Función para diligenciar el formulario de registro
function submitForm() {
  // Obtener los valores de los campos
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validar que ambos campos estén llenos
  if (email.trim() === '' || password.trim() === '') {
    // Si alguno de los campos está vacío, muestra un mensaje de error
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    // Si el formato del correo electrónico no es válido, muestra un mensaje de error
    alert('Por favor, introduce un correo electrónico válido.');
    return;
  }

  // Validar que la contraseña contenga al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    // Si la contraseña no contiene al menos una letra mayúscula, muestra un mensaje de error
    alert('La contraseña debe contener al menos una letra mayúscula.');
    return;
  }

  // Almacenar el correo electrónico en el localStorage
  localStorage.setItem('lastEmail', email);

  // Reiniciar el formulario después de enviar los datos
  document.getElementById('userForm').reset();
}

// Verificar si hay un correo electrónico almacenado en el localStorage al cargar la página
window.addEventListener('load', () => {
  const lastEmail = localStorage.getItem('lastEmail');
  if (lastEmail) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `<span style="font-family: 'Montserrat', sans-serif; font-weight: bold; display: block; text-align: center; margin-top: 20px; margin-bottom: -50px; font-size: 20px; color: #db4547e1;">Bienvenido ${lastEmail}</span>`;
  }
});

// Definición de elementos
let cita = document.getElementById('cita');
let autor = document.getElementById('autor');
let btn = document.getElementById('btn');
const url = 'https://api.quotable.io/random';
let favoritos = [];

// Función para actualizar la cita y el autor mostrados
const actualizarCita = (contenido, nombreAutor) => {
  cita.innerText = contenido;
  autor.innerText = nombreAutor;
};

// Función para obtener una cita aleatoria de la API
const obtenerCita = () => {
  fetch(url)
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error(`La respuesta de la red no fue correcta: ${respuesta.status}`);
      }
      return respuesta.json();
    })
    .then((item) => {
      actualizarCita(item.content, item.author);
    })
    .catch((error) => {
      console.error('Error al obtener la cita:', error);
    });
};

// Event listeners
window.addEventListener('load', obtenerCita);

btn.addEventListener('click', obtenerCita);