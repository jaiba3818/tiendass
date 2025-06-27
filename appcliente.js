// Lógica del catálogo para clientes

let productos = [];
let categorias = [];

document.addEventListener('DOMContentLoaded', function() {
  cargarProductos();
  cargarCategorias();
  mostrarInfoUsuario();
  
  // Eventos para búsqueda y filtros
  document.getElementById('buscarProducto').addEventListener('input', filtrarProductos);
  document.getElementById('filtroCategoria').addEventListener('change', filtrarProductos);
});

function cargarProductos() {
  productos = JSON.parse(localStorage.getItem('cafeteria_productos')) || [];
  mostrarProductos(productos);
}

function cargarCategorias() {
  categorias = JSON.parse(localStorage.getItem('categorias')) || [];
  const selectCategoria = document.getElementById('filtroCategoria');
  selectCategoria.innerHTML = '<option value="">Todas las categorías</option>' + 
    categorias.map(c => `<option value="${c}">${c}</option>`).join('');
}

function mostrarInfoUsuario() {
  const usuario = JSON.parse(localStorage.getItem('cafeteria_usuario'));
  const infoUsuario = document.getElementById('infoUsuario');
  if (usuario) {
    infoUsuario.innerHTML = `
      <i class="bi bi-person-circle"></i> 
      Bienvenido <strong>${usuario.nombre}</strong> al catálogo de productos
    `;
  }
}

function mostrarProductos(productosAMostrar) {
  const container = document.getElementById('productosContainer');
  const noProductos = document.getElementById('noProductos');
  
  if (productosAMostrar.length === 0) {
    container.innerHTML = '';
    noProductos.style.display = 'block';
    return;
  }
  
  noProductos.style.display = 'none';
  container.innerHTML = productosAMostrar.map(producto => `
    <div class="col-md-4 col-lg-3 mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${producto.foto}" class="card-img-top" alt="${producto.nombre}" 
             style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text text-muted">Categoría: ${producto.categoria}</p>
          <div class="mt-auto">
            <div class="d-flex justify-content-between align-items-center">
              <span class="h5 text-success mb-0">$${parseFloat(producto.precio).toFixed(2)}</span>
              <span class="badge bg-${producto.stock > 0 ? 'success' : 'danger'}">
                ${producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
              </span>
            </div>
            <button class="btn ${producto.stock > 0 ? 'btn-primary' : 'btn-secondary'} w-100 mt-2" 
                    onclick="${producto.stock > 0 ? `agregarAlCarrito('${producto.nombre}')` : ''}" 
                    ${producto.stock <= 0 ? 'disabled' : ''}>
              <i class="bi bi-cart-plus"></i> 
              ${producto.stock > 0 ? 'Comprar ahora' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function filtrarProductos() {
  const busqueda = document.getElementById('buscarProducto').value.toLowerCase();
  const categoria = document.getElementById('filtroCategoria').value;
  
  let productosFiltrados = productos.filter(producto => {
    const coincideNombre = producto.nombre.toLowerCase().includes(busqueda);
    const coincideCategoria = !categoria || producto.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });
  
  mostrarProductos(productosFiltrados);
}

function limpiarFiltros() {
  document.getElementById('buscarProducto').value = '';
  document.getElementById('filtroCategoria').value = '';
  mostrarProductos(productos);
}

function agregarAlCarrito(nombreProducto) {
  // Buscar el producto en el array de productos
  const productoIndex = productos.findIndex(p => p.nombre === nombreProducto);
  
  if (productoIndex === -1) {
    alert('Producto no encontrado');
    return;
  }
  
  const producto = productos[productoIndex];
  
  // Verificar si hay stock disponible
  if (producto.stock <= 0) {
    alert('No hay stock disponible para este producto');
    return;
  }
  
  // Mostrar confirmación antes de comprar
  const sweet = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success mx-3",
      denyButton: "btn btn-secondary"
    },
    buttonsStyling: false
  });
  
  sweet.fire({
    title: "¿Confirmar compra?",
    html: `
      <div class="text-start">
        <p><strong>Producto:</strong> ${producto.nombre}</p>
        <p><strong>Precio:</strong> $${parseFloat(producto.precio).toFixed(2)}</p>
        <p><strong>Stock disponible:</strong> ${producto.stock}</p>
        <p><strong>Categoría:</strong> ${producto.categoria}</p>
      </div>
    `,
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Sí, comprar",
    denyButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      // Reducir el stock en 1
      producto.stock -= 1;
      
      // Actualizar el producto en localStorage
      localStorage.setItem('cafeteria_productos', JSON.stringify(productos));
      
      // Simular una compra y agregarla al historial
      const usuario = JSON.parse(localStorage.getItem('cafeteria_usuario'));
      if (usuario) {
        const nuevaCompra = {
          fecha: new Date().toISOString().split('T')[0],
          monto: parseFloat(producto.precio),
          metodo: ['Efectivo', 'Tarjeta', 'Transferencia'][Math.floor(Math.random() * 3)],
          usuario: usuario.nombre,
          estado: 'Completado',
          producto: nombreProducto
        };
        
        // Guardar en localStorage
        let misCompras = JSON.parse(localStorage.getItem('mis_compras_' + usuario.email)) || [];
        misCompras.push(nuevaCompra);
        localStorage.setItem('mis_compras_' + usuario.email, JSON.stringify(misCompras));
        
        // Actualizar la vista de productos
        mostrarProductos(productos);
        
        Swal.fire({
          title: "¡Compra exitosa!",
          html: `
            <p>Producto: <strong>${nombreProducto}</strong></p>
            <p>Precio: <strong>$${parseFloat(producto.precio).toFixed(2)}</strong></p>
            <p>Stock restante: <strong>${producto.stock}</strong></p>
          `,
          icon: "success"
        });
      }
    }
  });
}

// Funciones para cambiar entre secciones
function mostrarMisCompras() {
  document.getElementById('seccionCatalogo').style.display = 'none';
  document.getElementById('seccionMisCompras').style.display = 'block';
  cargarMisCompras();
}

function mostrarCatalogo() {
  document.getElementById('seccionCatalogo').style.display = 'block';
  document.getElementById('seccionMisCompras').style.display = 'none';
}

function cargarMisCompras() {
  const usuario = JSON.parse(localStorage.getItem('cafeteria_usuario'));
  const misComprasTable = document.getElementById('misComprasTable');
  const noCompras = document.getElementById('noCompras');
  
  if (!usuario) {
    misComprasTable.innerHTML = '<tr><td colspan="5">No hay usuario logueado</td></tr>';
    return;
  }
  
  let misCompras = JSON.parse(localStorage.getItem('mis_compras_' + usuario.email)) || [];
  
  if (misCompras.length === 0) {
    misComprasTable.innerHTML = '';
    noCompras.style.display = 'block';
    return;
  }
  
  noCompras.style.display = 'none';
  misComprasTable.innerHTML = misCompras.map(compra => `
    <tr>
      <td>${compra.fecha}</td>
      <td>$${parseFloat(compra.monto).toFixed(2)}</td>
      <td>${compra.metodo}</td>
      <td>${compra.producto || 'Producto no especificado'}</td>
      <td><span class="badge bg-success">${compra.estado}</span></td>
    </tr>
  `).join('');
}

function cerrarSesion() {
  localStorage.removeItem('cafeteria_usuario');
  window.location.href = 'iniciars.html';
} 