// Array para almacenar los elementos del carrito con sus cantidades
let carrito = [];

// Función para agregar elementos al carrito
function addItem(nombre, precio) {
    // Buscar si el producto ya existe en el carrito
    const itemIndex = carrito.findIndex(item => item.nombre === nombre);

    // Si el producto ya está en el carrito, incrementa su cantidad
    if (itemIndex > -1) {
        carrito[itemIndex].cantidad += 1;
    } else {
        // Si no está, agrega un nuevo objeto con nombre, precio y cantidad inicial de 1
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    actualizarCarrito(); // Actualiza el carrito en la interfaz
    alert(`${nombre} añadido al carrito.`); // Alerta de confirmación
}

// Función para actualizar el contenido del carrito en la interfaz
function actualizarCarrito() {
    const cartItems = document.getElementById("cartItems"); // Elemento HTML donde se muestra el carrito
    const totalPriceElement = document.getElementById("totalPrice"); // Elemento HTML para el total
    cartItems.innerHTML = ""; // Limpia el contenido actual del carrito

    let total = 0; // Variable para acumular el total de la compra
    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad; // Calcula el total multiplicando precio por cantidad

        // Obtiene la descripción correspondiente del producto
        const descripcion = obtenerDescripcion(item.nombre);

        // Agrega el HTML del producto al carrito con opciones para modificar cantidad
        cartItems.innerHTML += `
            <div class="d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center">
                    <p style="text-align: center; color:white">${item.nombre} (x${item.cantidad})</p>
                    <p style="text-align: center; color:white">$${(item.precio * item.cantidad).toLocaleString()}</p>
                    <div style="color: white;">
                        <button class="btn-agregar" onclick="cambiarCantidad(${index}, -1)">-</button>
                        <button class="btn-agregar" onclick="cambiarCantidad(${index}, 1)">+</button>
                        <button class="btn-agregar" onclick="eliminarItem(${index})">Borrar</button>
                        <button class="btn-agregar" onclick="toggleDescripcion(${index})">Detalles</button>
                    </div>
                </div>
                <div id="descripcion-${index}" class="descripcion" style="display: none;">
                    <p style="text-align: center; color:white">${descripcion}</p>
                </div>
            </div>
        `;
    });

    totalPriceElement.innerText = total.toLocaleString(); // Muestra el total en el elemento correspondiente
}

// Función para cambiar la cantidad de un producto en el carrito
function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta; // Incrementa o decrementa la cantidad según el valor de delta
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1); // Si la cantidad es 0, elimina el producto del carrito
    }
    actualizarCarrito(); // Actualiza el carrito en la interfaz
}

// Función para eliminar un producto del carrito
function eliminarItem(index) {
    carrito.splice(index, 1); // Elimina el producto del carrito
    actualizarCarrito(); // Actualiza el carrito en la interfaz
}

// Función para abrir el modal de confirmación de compra
function abrirCheckout() {
    const checkoutItems = document.getElementById("checkoutItems"); // Elemento HTML donde se listan los items
    const checkoutTotal = document.getElementById("checkoutTotal"); // Elemento HTML para el total en el modal
    const emptyCartMessage = document.getElementById("emptyCartMessage"); // Mensaje de carrito vacío

    checkoutItems.innerHTML = ""; // Limpia los items en el modal de checkout

    let total = 0; // Variable para calcular el total de la compra en el checkout
    carrito.forEach(item => {
        total += item.precio * item.cantidad; // Calcula el total multiplicando precio por cantidad

        // HTML para cada item en el modal de checkout
        checkoutItems.innerHTML += `
            <div class="checkout-item">
                <div class="d-flex justify-content-between align-items-center">
                    <p>${item.nombre} (x${item.cantidad})</p>
                    <p>$${(item.precio * item.cantidad).toLocaleString()}</p>
                </div>
            </div>
        `;
    });

    checkoutTotal.innerText = total.toLocaleString(); // Muestra el total en el modal de checkout

    // Muestra el mensaje de carrito vacío si no hay productos
    emptyCartMessage.classList.toggle("d-none", carrito.length > 0);
}

// Función para obtener la descripción del producto
function obtenerDescripcion(nombre) {
    // Objeto con las descripciones de cada producto
    const descripciones = {
        'SKOOT - Gelus Custom': 'Tamaño de manga larga (cm): Talla Única <br> Longitud de cuello: 22cm <br> Longitud de la manga: 64 cm...',
        'SKOOT - Harmony Longsleeve': 'Tamaño de manga larga (cm): Talla Única <br> Longitud de cuello: 22cm...',
        // (Otras descripciones aquí)
    };
    return descripciones[nombre] || 'Descripción no disponible.'; // Retorna la descripción o un mensaje de falta
}

// Función para alternar la visibilidad de la descripción
function toggleDescripcion(index) {
    const descripcionElement = document.getElementById(`descripcion-${index}`);
    descripcionElement.style.display = descripcionElement.style.display === "none" ? "block" : "none";
}

// Función para confirmar la compra (vacía el carrito y muestra modal de agradecimiento)
function confirmarCompra() {
    if (carrito.length > 0) {
        carrito = []; // Vacía el carrito
        actualizarCarrito(); // Actualiza la interfaz del carrito

        // Cierra el modal de checkout
        const checkoutModalEl = document.getElementById('checkoutModal');
        const checkoutModal = bootstrap.Modal.getInstance(checkoutModalEl);
        checkoutModal.hide();

        // Muestra el modal de agradecimiento
        const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'));
        thankYouModal.show();
    } else {
        alert("El carrito está vacío.");
    }
}

// Función para guardar los datos del cliente en un objeto
function guardarDatosCliente() {
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const rut = document.getElementById('rut').value.trim();
    const region = document.getElementById('region').value.trim();
    const comuna = document.getElementById('comuna').value.trim();
    const address = document.getElementById('address').value.trim();

    // Validación de campos requeridos
    if (!fullName || !phone || !rut || !region || !comuna || !address) {
        alert("Por favor, ingrese sus datos.");
        return false;
    }

    const customerData = {
        fullName,
        phone,
        rut,
        region,
        comuna,
        address,
        addressReference: document.getElementById('addressReference').value.trim(),
        postalCode: document.getElementById('postalCode').value.trim()
    };

    console.log("Datos del cliente:", customerData);

    // Cerrar el modal después de guardar los datos
    const customerInfoModalEl = document.getElementById('customerInfoModal');
    const customerInfoModal = bootstrap.Modal.getInstance(customerInfoModalEl);
    customerInfoModal.hide();

    alert("Información de cliente guardada exitosamente.");
    return true;
}

// Objeto con las regiones y comunas para llenar los select
const regionesComunas = {
    "Región de Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    // (Otras regiones aquí)
};

// Función para llenar el select de regiones al cargar la página
function cargarRegiones() {
    const regionSelect = document.getElementById("region");
    for (const region in regionesComunas) {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    }
}

// Función para actualizar el select de comunas basado en la región seleccionada
function actualizarComunas() {
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");
    const comunas = regionesComunas[regionSelect.value] || [];

    // Limpia las opciones anteriores y agrega las nuevas
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    comunas.forEach(comuna => {
        const option = document.createElement("option");
        option.value = comuna;
        option.textContent = comuna;
        comunaSelect.appendChild(option);
    });
}

// Llama a cargarRegiones cuando la página ha cargado
document.addEventListener("DOMContentLoaded", cargarRegiones);
