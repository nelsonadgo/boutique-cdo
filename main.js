console.log("¡El sistema está activo!");
const formLogin = document.getElementById('form-login');
const seccionLogin = document.getElementById('acceso-club');
const seccionDashboard = document.getElementById('dashboard');
const spanNombre = document.getElementById('nombre-usuario');
const logOut = document.getElementById('btn-logout');
const seccionRegistro = document.getElementById('seccion-registro');
const btnIrARegistro = document.getElementById('btn-registro');
const btnVolverALogin = document.getElementById('btn-volver-login');
const formRegistro = document.getElementById('form-registro');
const btnNavLogin = document.getElementById('btn-nav-login');
const seccionProductos = document.getElementById('productos');
const navInicio = document.getElementById('nav-inicio');
const navProductos = document.getElementById('nav-productos');
const navContacto = document.getElementById('nav-contacto');
const seccionContacto = document.getElementById('contacto');
let usuarioId = null; // Aquí guardaremos el ID del usuario conectado
let usuarioRol = null; // Aquí guardaremos el rol del usuario conectado
const panelAdmin = document.getElementById('panel-admin');
const panelSocio = document.getElementById('panel-socio');
const tablaPedidosBody = document.getElementById('tabla-pedidos-body');
// Elementos del menú inteligente
const liIngresar = document.getElementById('li-ingresar');
const liPanel = document.getElementById('li-panel');
const btnNavPanel = document.getElementById('btn-nav-panel');
const tablaProductosAdmin = document.getElementById('tabla-productos-admin');
// Memoria para el carrito de compras
let productosDisponibles = []; // Aquí guardaremos los productos que cargamos desde Python
let carrito = []; // Aquí guardaremos los productos que el usuario agregue al carrito
// Lógica para mostrar la ventana del carrito
const modalCarrito = document.getElementById('modal-carrito');
const btnNavCarrito = document.getElementById('btn-nav-carrito');
const btnCerrarCarrito = document.getElementById('cerrar-carrito');
// Finalizar compra
const btnComprar = document.getElementById('btn-comprar');
// Respuesta del ChatBot
const inputChat = document.getElementById('input-chat');
const btnEnviarChat = document.getElementById('btn-enviar-chat');
const chatMensajes = document.getElementById('chat-mensajes');

formLogin.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto  
    
    console.log("¡Formulario enviado sin recargar!");
    
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    console.log("Enviando Datos a Python");

    // Aqui uso fetch para enviar los datos al servidor Python
    fetch('https://nelsonadgo.pythonanywhere.com/login', {
        method: 'POST', // indicamos que vamos a enviar Datos
        headers: {
            'Content-Type': 'application/json' // Avisamos que enviamos formato JSON
        },
        body: JSON.stringify({ // Empaquetamos los datos en una "caja" JSON
            usuario: usuario,
            password: password
        })
    })
    .then(response => response.json()) // Convertimos la respuesta de Python a JSON
    .then(data => {
        console.log("¡Respuesta recibida de Python!", data);
        
        // Si Python nos dice "ok", podríamos redirigir al usuario aquí
        if(data.status === 'ok') {
            Swal.fire({
                title: `¡Bienvenido de nuevo, ${data.nombre}!`,
                text: "Has iniciado sesión exitosamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            usuarioId = data.id; // Guardamos el ID del usuario conectado
            console.log("ID guardado en memoria:", usuarioId);
            usuarioRol = data.rol; // Guardamos el rol del usuario conectado
            console.log("Rol guardado en memoria:", usuarioRol);
            spanNombre.textContent = data.nombre; // Mostramos el nombre en el dashboard
            
            // Actualizar el menu
            liIngresar.style.display = 'none'; // Ocultamos "Ingresar"
            liPanel.style.display = 'block';   // Mostramos "Mi Panel"
            // Ocultamos el Login
            seccionLogin.style.display = 'none';
            seccionRegistro.style.display = 'none'; // Por si acaso

            // Mostramos la pantalla de Inicio (Productos)
            seccionProductos.style.display = 'grid'; // Usamos 'grid' por las tarjetas
            seccionContacto.style.display = 'block';
            
            // Limpiamos el formulario para que no quede escrito
            document.getElementById('usuario').value = '';
            document.getElementById('password').value = '';

            // Mostramos/Ocultamos paneles según rol
            if (usuarioRol === 'admin') {
                panelAdmin.style.display = 'block';
                panelSocio.style.display = 'none';
                cargarUsuarios(); // Cargamos la lista de usuarios
                cargarProductosAdmin(); // Cargamos los productos en el panel admin
            } else {
                panelAdmin.style.display = 'none';
                panelSocio.style.display = 'block';
                cargarPedidos(); // Cargamos los pedidos del socio
            }
        } else {
            Swal.fire({
                title: "Error de autenticación",
                text: "Usuario o contraseña incorrectos.",
                icon: "error",
                timer: 1500,
                showConfirmButton: false
            });
        }
    })
    .catch(error => {
        console.error("Hubo un error:", error);
    });
});

logOut.addEventListener('click', function() {
    console.log("Click Detectado en el Boton");
    // Ocultamos el dashboard
    seccionDashboard.style.display = 'none';
    
    // Mostramos el login de nuevo
    seccionLogin.style.display = 'block';
    
    // Limpiamos el nombre
    spanNombre.textContent = '';

    // RESTAURAMOS EL MENÚ:
    liIngresar.style.display = 'block'; // Vuelve el botón de Ingresar
    liPanel.style.display = 'none';     // Se va "Mi Panel"
});

btnIrARegistro.addEventListener('click', function() {
    console.log("Click Detectado en el Boton de Registro");
    // Ocultamos la seccion de login
    seccionLogin.style.display = 'none';
    
    // Mostramos la seccion de registro
    seccionRegistro.style.display = 'block';
});

formRegistro.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    console.log("¡Formulario de registro enviado sin recargar!");
    
    const nombreCompleto = document.getElementById('nuevo-nombre').value;
    const dni = document.getElementById('nuevo-dni').value;
    const direccion = document.getElementById('nueva-direccion').value;
    const telefono = document.getElementById('nuevo-telefono').value;
    const nuevoUsuario = document.getElementById('nuevo-usuario').value;
    const nuevoPassword = document.getElementById('nuevo-password').value;
    console.log("Enviando Datos de Registro a Python");

    // Aqui uso fetch para enviar los datos al servidor Python
    fetch('https://nelsonadgo.pythonanywhere.com/registro', {
        method: 'POST', // indicamos que vamos a enviar Datos
        headers: {
            'Content-Type': 'application/json' // Avisamos que enviamos formato JSON
        },
        body: JSON.stringify({ // Empaquetamos los datos en una "caja" JSON 
            nombreCompleto: nombreCompleto,
            dni: dni,
            direccion: direccion,
            telefono: telefono,
            usuario: nuevoUsuario,
            password: nuevoPassword
        })
    })
    .then(response => response.json()) // Convertimos la respuesta de Python a JSON
    .then(data => {
        console.log("¡Respuesta recibida de Python!", data);
        if(data.status === 'ok') {
            Swal.fire({
                icon: "success",
                title: "¡Registro exitoso!",
                text: data.mensaje,
                confirmButtonColor: '2e8b57',
                timer: 1500,
                showConfirmButton: false
            });

            // volvemos al login automáticamente
            seccionRegistro.style.display = 'none';
            seccionLogin.style.display = 'block';
        } else {
            Swal.fire({
                icon: "error",
                title: "Error en el registro",
                text: data.mensaje,
                confirmButtonColor: '#333'
            });
        }
    })
    .catch(error => {
        console.error("Hubo un error:", error);
    });


});

btnVolverALogin.addEventListener('click', function() {
    console.log("Click Detectado en el Boton de Volver al Login");
    // Ocultamos la seccion de registro
    seccionRegistro.style.display = 'none';
    // Mostramos la seccion de login
    seccionLogin.style.display = 'block';
});

// Funcionalidad para el botón de navegación al Login
btnNavLogin.addEventListener('click', function() {
    // Ocultamos los productos
    seccionProductos.style.display = 'none';
    
    // Mostramos el Login
    seccionLogin.style.display = 'block';
    
    // Aseguramos que el registro esté oculto por si acaso
    seccionRegistro.style.display = 'none';
});

// Función para volver a la vista principal (Landing Page)
function mostrarLandingPage() {
    // Ocultamos las pantallas de "App"
    seccionLogin.style.display = 'none';
    seccionRegistro.style.display = 'none';
    seccionDashboard.style.display = 'none';

    // Mostramos las secciones de la Landing
    // IMPORTANTE: Productos usa 'grid', no 'block'
    seccionProductos.style.display = 'grid'; 
    seccionContacto.style.display = 'block';

    
}

// Botón INICIO
navInicio.addEventListener('click', function(e) {
    e.preventDefault(); // Evita que recargue o salte bruscamente
    mostrarLandingPage();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube suavemente al tope
});

// El botón de PRODUCTOS
navProductos.addEventListener('click', function(e) {
    mostrarLandingPage();
    // No necesitamos preventDefault aquí porque queremos que el href="#productos" funcione
});

// Botón CONTACTO
navContacto.addEventListener('click', function(e) {
    mostrarLandingPage();
    // Dejamos que el href="#contacto" haga el scroll automático
});

// Dashboard Admin - Gestión de Usuarios
const tablaUsuariosBody = document.getElementById('tabla-usuarios-body');
const btnCargarUsuarios = document.getElementById('btn-cargar-usuarios');

function cargarUsuarios() {
    console.log("Solicitando lista de usuarios...");

    fetch('https://nelsonadgo.pythonanywhere.com/usuarios')
        .then(response => response.json())
        .then(data => {
            console.log("Usuarios recibidos:", data);
            
            // Limpiamos la tabla para no duplicar si damos clic varias veces
            tablaUsuariosBody.innerHTML = '';

            // Recorremos la lista de usuarios
            data.forEach(usuario => {
                
                // Preparamos el botón: Solo si es ADMIN mostramos el botón rojo
                let botonEliminar = '';
                
                if (usuarioRol === 'admin') {
                    botonEliminar = `
                        <button onclick="eliminarUsuario(${usuario.id})" style="color:red; cursor:pointer;">
                            🗑️ Eliminar
                        </button>
                    `;
                }

                // Creamos la fila usando la variable botonEliminar
                const fila = `
                    <tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.usuario}</td>
                        <td><span style="color: green;">Activo</span></td>
                        <td>${botonEliminar} </td>
                    </tr>
                `;
                
                tablaUsuariosBody.innerHTML += fila;
            });
        })
        .catch(error => console.error("Error al cargar usuarios:", error));
}

// Asignamos el evento al botón
btnCargarUsuarios.addEventListener('click', cargarUsuarios);

// Función para borrar un usuario
function eliminarUsuario(id) {
    // Preguntamos para confirmar (Seguridad)
    if (!confirm(`¿Estás seguro de eliminar al socio con ID ${id}?`)) {
        return; // Si dice que no, cancelamos
    }

    console.log("Eliminando usuario ID:", id);

    // Enviamos la orden DELETE a Python
    fetch(`https://nelsonadgo.pythonanywhere.com/usuarios/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            alert('Usuario eliminado correctamente');
            cargarUsuarios(); // Recargamos la tabla para ver que desapareció
        } else {
            alert('Error al eliminar: ' + data.mensaje);
        }
    })
    .catch(error => console.error('Error:', error));
}

function inscribirUsuario(producto) {
    // Verificamos si el usuario está logueado
    console.log("Intentando inscribir. ID actual del usuario:", usuarioId);
    console.log("Producto seleccionado:", producto);

    if (usuarioId === null) {
        alert("Debes iniciar sesión para inscribirte.");
        
        seccionProductos.style.display = 'none';
        seccionLogin.style.display = 'block';
        return;
    }

    // Enviamos la inscripción
    if (confirm(`¿Quieres inscribirte en ${producto.nombre}?`)) {
        fetch('https://nelsonadgo.pythonanywhere.com/inscribir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: usuarioId,
                producto: producto.nombre
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
        })
        .catch(error => console.error('Error:', error));
    }
}

// Función para cargar los pedidos del cliente desde la Base de Datos
function cargarPedidos() {
    fetch(`https://nelsonadgo.pythonanywhere.com/pedidos/${usuarioId}`)
        .then(response => response.json())
        .then(data => {
            const tablaPedidosBody = document.getElementById('tabla-pedidos-body');
            tablaPedidosBody.innerHTML = ''; 

            if (data.status === 'error' || !Array.isArray(data)) {
                console.error("Error del servidor:", data);
                
                tablaPedidosBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Error: ${data.mensaje || 'Respuesta inesperada del servidor'}</td></tr>`;
                return;
            }

            // Si está vacío
            if (data.length === 0) {
                tablaPedidosBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Aún no tienes compras realizadas.</td></tr>';
                return;
            }

            // Si todo está OK, recorremos y dibujamos
            data.forEach(pedido => {
                const fila = `
                    <tr>
                        <td><strong>#${pedido.id}</strong></td>
                        <td>${pedido.fecha_texto}</td>
                        <td><strong style="color: #2e8b57;">$${pedido.total}</strong></td>
                        <td><span style="background: #e9ecef; padding: 5px 10px; border-radius: 15px; font-size: 0.9em;">${pedido.estado}</span>
                        <button onclick="verDetallePedido(${pedido.id})" style="margin-left: 10px; background: none; border: none; cursor: pointer; font-size: 0.9rem;" title="Ver detalles del pedido">🧾</button>
                        </td>
                    </tr>
                `;
                tablaPedidosBody.innerHTML += fila;
            });
        })
        .catch(error => console.error("Error al cargar pedidos:", error));
}

// Botón "Mi Panel" del menú
btnNavPanel.addEventListener('click', function() {
    // Ocultamos la landing page
    seccionProductos.style.display = 'none';
    seccionContacto.style.display = 'none';
    seccionLogin.style.display = 'none';
    seccionRegistro.style.display = 'none';

    // Mostramos el Dashboard principal
    seccionDashboard.style.display = 'block';

    // Decidimos qué tabla mostrar según el rol del usuario
    if (usuarioRol === 'admin') {
        panelAdmin.style.display = 'block';
        panelSocio.style.display = 'none';
        cargarUsuarios();
    } else {
        panelAdmin.style.display = 'none';
        panelSocio.style.display = 'block';
        cargarPedidos(); // Recargamos la lista
    }
});

// Memoria para saber qué filtro está mirando el cliente
let categoriaActual = 'todos'; 

// Función para descargar productos desde la Base de Datos
function cargarProductos() {
    fetch('https://nelsonadgo.pythonanywhere.com/productos')
        .then(response => response.json())
        .then(data => {
            productosDisponibles = data; // Guardamos los productos disponibles en memoria
            renderizarProductosPantalla(); // Llamamos a la función que dibuja
        }) 
        .catch(error => console.error("Error al cargar productos:", error));
}

// Función que se activa al presionar los botones de categorías
function filtrarProductos(categoria, botonClickeado) {
    categoriaActual = categoria;

    if (botonClickeado) {
        //Buscamos todos los botones y les quitamos la clase 'activo'
        const botones = document.querySelectorAll('.btn-filtro');
        botones.forEach(btn => btn.classList.remove('activo'));
        
        // Le ponemos la clase 'activo' solo al que tocaste
        botonClickeado.classList.add('activo');
    }

    renderizarProductosPantalla(); // Volvemos a dibujar las tarjetas
}

// Función exclusiva para dibujar las tarjetas
function renderizarProductosPantalla() {
    // AHORA buscamos el contenedor de las tarjetas
    const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
    
    // Limpiamos solo las tarjetas viejas
    contenedorTarjetas.innerHTML = ''; 

    // Filtramos la lista según el botón que esté presionado
    const productosFiltrados = categoriaActual === 'todos' 
        ? productosDisponibles 
        : productosDisponibles.filter(p => p.categoria === categoriaActual);

    // Si la categoría no tiene productos, mostramos un mensaje
    if (productosFiltrados.length === 0) {
        contenedorTarjetas.innerHTML = '<p style="text-align: center; width: 100%; color: #666;">Aún no hay productos en esta categoría.</p>';
        return; // Cortamos la función acá
    }

    // Recorremos los productos filtrados y creamos las tarjetas
    productosFiltrados.forEach(producto => {
        // Verificamos si hay stock para cambiar el botón y el diseño
        const hayStock = producto.stock > 0;
        const textoStock = hayStock ? `Stock disponible: ${producto.stock}` : `<span style="color: red; font-weight: bold;">¡Agotado!</span>`;
        
        // Si no hay stock, el botón se vuelve gris y no hace nada
        const botonHTML = hayStock 
            ? `<button class="btn-carrito" onclick="agregarAlCarrito(${producto.id})">🛒 Agregar al Carrito</button>`
            : `<button class="btn-carrito" style="background-color: #ccc; cursor: not-allowed;" disabled>🚫 Sin Stock</button>`;

        const tarjetaHTML = `
            <div class="tarjeta-producto" ${!hayStock ? 'style="opacity: 0.7;"' : ''}>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <h4 class="precio">$${producto.precio}</h4>
                <p class="stock-info"><small>${textoStock}</small></p>
                <p style="margin-top: 5px;"><span style="background: #e9ecef; padding: 3px 10px; border-radius: 12px; font-size: 0.8em; color: #555;">${producto.categoria}</span></p>
                ${botonHTML}
            </div>
        `;
        
        contenedorTarjetas.innerHTML += tarjetaHTML;
    });
}

// Ejecutamos la función apenas carga la página
cargarProductos();

// Cargar la tabla de gestión (similar a cargarProductos pero con botón borrar)
function cargarProductosAdmin() {
    fetch('https://nelsonadgo.pythonanywhere.com/productos')
        .then(response => response.json())
        .then(data => {
            tablaProductosAdmin.innerHTML = '';
            data.forEach(producto => {
                const fila = `
                    <tr>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>
                            <button onclick="eliminarProducto(${producto.id})" style="color:red; cursor:pointer;">🗑️ Borrar</button>
                        </td>
                    </tr>
                `;
                tablaProductosAdmin.innerHTML += fila;
            });
        });
}

// Crear nuevo producto
function crearProducto() {
    const nombre = document.getElementById('nombre-producto').value;
    const desc = document.getElementById('desc-producto').value;
    const img = document.getElementById('img-producto').value;
    const categoria = document.getElementById('cat-producto').value;

    if (!nombre || !desc || !img || !categoria) {
        alert("Por favor completa todos los campos");
        return;
    }

    fetch('https://nelsonadgo.pythonanywhere.com/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre, descripcion: desc, imagen: img, categoria: categoria })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        cargarProductosAdmin(); // Recargar la tabla admin
        cargarProductos(); // Recargar la portada también
        
        // Limpiar inputs
        document.getElementById('nombre-producto').value = '';
        document.getElementById('desc-producto').value = '';
        document.getElementById('img-producto').value = '';
    });
}

// Eliminar producto
function eliminarProducto(id) {
    if (confirm("¿Seguro que quieres borrar este producto?")) {
        fetch(`https://nelsonadgo.pythonanywhere.com/productos/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            cargarProductosAdmin();
            cargarProductos(); // Actualiza la portada
        });
    }
}

// Agregar producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = productosDisponibles.find(p => p.id === idProducto);

    if (!producto) return alert("Producto no encontrado");
    if (producto.stock <= 0) return alert("Lo sentimos, este producto está agotado.");

    const itemEnCarrito = carrito.find(item => item.id === idProducto);

    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < producto.stock) {
            itemEnCarrito.cantidad++;
            console.log(`Aumentamos cantidad de ${producto.nombre} en el carrito. Cantidad actual: ${itemEnCarrito.cantidad}`);
        }else {
            alert(`Lo sentimos, no hay más stock disponible de ${producto.nombre}.`);
        }
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
        console.log(`Agregamos ${producto.nombre} al carrito.`);
    }

    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const spancontador = document.getElementById('contador-carrito');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    spancontador.textContent = totalItems;
}

btnNavCarrito.addEventListener('click', () => {
    dibujarTicketCarrito();
    modalCarrito.style.display = 'flex';
});

btnCerrarCarrito.addEventListener('click', () => {
    modalCarrito.style.display = 'none';
});

// Dibujar el ticket del carrito
function dibujarTicketCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const spanTotal = document.getElementById('total-pago');

    // Limpiamos SIEMPRE el carrito antes de volver a dibujarlo
    listaCarrito.innerHTML = ''; 
    let total = 0;

    // Si está vacío, mostramos el mensaje
    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p style="text-align:center; color: #666;">Tu carrito está vacío. ¡Agrega productos!</p>';
        spanTotal.textContent = '0.00';
        return; // Cortamos la función aquí
    }
    
    // Si hay productos, los recorremos
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        listaCarrito.innerHTML += `
            <div class="item-carrito">
                <div>
                    <strong>${item.nombre}</strong><br>
                    <small>$${item.precio} x ${item.cantidad} unidades</small>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <strong>$${subtotal}</strong>
                    <button onclick="eliminarDelCarrito(${item.id})" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 1.2rem; padding: 0;" title="Eliminar producto">✖️</button>
                </div>
            </div>
        `;
    });

    // Actualizamos el número grande del total al final
    spanTotal.innerText = total;   
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarContadorCarrito();
    dibujarTicketCarrito();
}

function vaciarCarrito() {
    carrito = [];
    actualizarContadorCarrito();
    dibujarTicketCarrito();
}

const btnVaciar = document.getElementById('btn-vaciar-carrito');
if (btnVaciar) {
    btnVaciar.addEventListener('click', function() {
       Swal.fire({
            title: "¿Vaciar Carrito?",
            text: "Estás a punto de vaciar todo tu carrito de compras.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, vaciar carrito",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito();
                Swal.fire({
                    title: "Carrito Vacío",
                    text: "Tu carrito ha sido vaciado exitosamente.",
                    icon: "success",
                });
            }
        });
    });
}

// Finalizar Compra
if (btnComprar) {
    btnComprar.addEventListener('click', () => {
        if (carrito.length === 0) {
            Swal.fire({
                title: "Carrito Vacío",
                text: "Tu carrito está vacío. Agrega productos antes de comprar.",
                icon: "warning",
            });
            return;
        }

        // Validamos que el usuario esté logueado
        if (!usuarioId) {
            Swal.fire({
                title: "!Atencion¡",
                text: "Debes iniciar sesión para finalizar tu compra.",
                icon: "warning",
                confirmButtonText: "Iniciar Sesión",
                confirmButtonColor: "#2e8b57"
            }).then((result) => {
                modalCarrito.style.display = 'none';
                document.getElementById('productos').style.display = 'none';
                document.getElementById('acceso-club').style.display = 'block';
            });
            return;
        }

        // Enviar el carrito a Python para procesar la compra
        const datosCompra = {
            usuario_id: usuarioId,
            total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
            detalles: carrito
        };

        console.log("Enviando datos de compra a Python:", datosCompra);

        // Cambiamos el texto del botón para dar feedback visual
        const textoOriginal = btnComprar.innerText;
        btnComprar.innerText = "Procesando compra...";
        btnComprar.disabled = true;

        // Enviamos el paquete de compra a Python
        fetch('https://nelsonadgo.pythonanywhere.com/comprar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosCompra)
        })
        .then(response => response.json())
        .then(data => {
            // Restauramos el texto del botón y lo habilitamos
            btnComprar.innerText = textoOriginal;
            btnComprar.disabled = false;
            console.log("Respuesta del servidor:", data);
            if (data.status === 'ok') {
                Swal.fire({
                    icon: "success",
                    title: "¡Compra Exitosa!",
                    text: 'Tu compra ha sido procesada correctamente. ¡Gracias por elegir Boutique CDO!',
                    confirmButtonColor: '2e8b57',
                    timer: 1500,
                    showConfirmButton: false
                });
                vaciarCarrito();
                modalCarrito.style.display = 'none';
                cargarProductos(); // Recargamos los productos para actualizar stock
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error en la compra",
                    text: data.mensaje,
                    timer: 2000,
                });
            }
        })
        .catch(error => {
            console.error("Error al procesar la compra:", error);
        });
    });
}

// Función para ver el detalle de un pedido
function verDetallePedido(pedidoId) {
    fetch(`https://nelsonadgo.pythonanywhere.com/pedidos/detalle/${pedidoId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error') {
                Swal.fire('Error', 'No se pudo cargar el detalle del pedido.', 'error');
                return;
            }

            // Empezamos a dibujar una tabla HTML en texto
            let tablaHTML = `
                <table style="width: 100%; text-align: left; border-collapse: collapse; margin-top: 15px; font-size: 0.95em;">
                    <tr style="border-bottom: 2px solid #333; color: #555;">
                        <th style="padding: 10px 5px;">Producto</th>
                        <th style="padding: 10px 5px; text-align: center;">Cant.</th>
                        <th style="padding: 10px 5px; text-align: right;">Subtotal</th>
                    </tr>
            `;

            // Llenamos la tabla con los productos que compró
            data.forEach(item => {
                tablaHTML += `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 5px;">${item.nombre}</td>
                        <td style="padding: 10px 5px; text-align: center;">${item.cantidad}</td>
                        <td style="padding: 10px 5px; text-align: right;">$${item.subtotal}</td>
                    </tr>
                `;
            });

            tablaHTML += `</table>`;

            // Disparamos la alerta mostrando nuestra tabla
            Swal.fire({
                title: `Ticket #${pedidoId}`,
                html: tablaHTML,
                icon: 'info',
                confirmButtonColor: '#2e8b57',
                confirmButtonText: 'Cerrar',
                width: '450px' // La hacemos un poquito más ancha para que entre la tabla
            });
        })
        .catch(error => console.error("Error al cargar detalle:", error));
}


// Lógica para el Chatbot (Interfaz y Eventos)
const btnChatbot = document.getElementById('btn-chatbot');
const ventanaChat = document.getElementById('ventana-chat');
const btnCerrarChat = document.getElementById('btn-cerrar-chat');

// Abrir el chat al hacer clic en el botón flotante
btnChatbot.addEventListener('click', () => {
    ventanaChat.classList.remove('chat-oculto');
    ventanaChat.classList.add('chat-visible');
});

// Cerrar el chat al hacer clic en la X
btnCerrarChat.addEventListener('click', () => {
    ventanaChat.classList.remove('chat-visible');
    ventanaChat.classList.add('chat-oculto');
});

// Manejo de envío de mensajes en el chat
function agregarMensaje(texto, remitente) {
    const div = document.createElement('div');
    // Le ponemos una clase diferente según quién envía el mensaje
    div.classList.add('mensaje', remitente);
    div.innerHTML = `<p>${texto}</p>`;
    chatMensajes.appendChild(div);
    chatMensajes.scrollTop = chatMensajes.scrollHeight; // Auto-scroll al último mensaje
}

// Las respuestas
function procesarMensajeBot(mensaje) {
    // pasamos todo a minúscula para facilitar la comparación
    let texto = mensaje.toLowerCase();
    let respuesta = "";
    // Buscamos palabras clave en el mensaje del cliente
    if (texto.includes("hola") || texto.includes("buenas") || texto.includes("dia") || texto.includes("tardes") || texto.includes("noches")) {
        respuesta = "¡Hola! 👋 Bienvenido al chatbot de CDO. ¿En qué puedo ayudarte?";
    } else if (texto.includes("envio") || texto.includes("envios") || texto.includes("envío") || texto.includes("envíos") || texto.includes("entrega") || texto.includes("entregas")) {
        respuesta = "Realizamos envíos a todo el país a través de Correo Argentino y OCA. El costo y tiempo de entrega varían según tu ubicación. Para envíos dentro de CABA, ofrecemos retiro gratuito en nuestro local.";

    }else if (texto.includes("pago") || texto.includes("pagar") || texto.includes("metodo de pago") || texto.includes("formas de pago") || texto.includes("tarjeta") || texto.includes("efectivo") || texto.includes("cuotas")) {
        respuesta = "Aceptamos tarjetas de crédito, débito, mercado pago y pagos en efectivo. También ofrecemos la opción de cuotas sin interés para compras mayores a $100.000.";
    } else if (texto.includes("gracias") || texto.includes("muchas gracias") || texto.includes("gracias por la ayuda") ) {
        respuesta = "De nada, ¿necesitas algo más?";
    } else {
        respuesta = "Mmm... 🤨 Lo siento, no entendí tu mensaje. Por favor, intenta preguntar sobre envíos, métodos de pago o cualquier otra consulta que tengas sobre nuestros productos.";
    }
    setTimeout(() => {
        agregarMensaje(respuesta, 'bot');
    }, 500); // Simulamos un tiempo de respuesta de 1/2 segundo
}

function enviarMensaje() {
    let textoUsuario = inputChat.value.trim();
    if (textoUsuario !== "") {
        agregarMensaje(textoUsuario, 'usuario');
        inputChat.value = "";
        procesarMensajeBot(textoUsuario);
    }
}

btnEnviarChat.addEventListener('click', enviarMensaje);

inputChat.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        enviarMensaje();
    }
});

// FIN