// Lógica de productos para admin

document.addEventListener('DOMContentLoaded', function() {
  renderProductos();
  llenarCategorias();

  document.getElementById('foto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        document.getElementById('previewImg').src = evt.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      document.getElementById('previewImg').src = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
      if (file) alert('Solo se permiten imágenes PNG, JPG o JPEG');
    }
  });

  document.getElementById('formProducto').addEventListener('submit', function(e) {
    e.preventDefault();
    const index = document.getElementById('productoIndex').value;
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;
    const categoria = document.getElementById('categoria').value;
    const fotoInput = document.getElementById('foto');
    let foto = document.getElementById('previewImg').src;
    if (fotoInput.files[0]) {
      // Ya se actualizó la preview
      foto = document.getElementById('previewImg').src;
    }
    let productos = JSON.parse(localStorage.getItem('cafeteria_productos')) || [];
    const producto = { foto, nombre, precio, stock, categoria };
    if (index === '') {
      productos.push(producto);
    } else {
      productos[index] = producto;
    }
    localStorage.setItem('cafeteria_productos', JSON.stringify(productos));
    renderProductos();
    document.getElementById('formProducto').reset();
    document.getElementById('productoIndex').value = '';
    document.getElementById('previewImg').src = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png';
    var modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
    modal.hide();
  });
});

function renderProductos() {
  const productosTableBody = document.getElementById('productosTableBody');
  let productos = JSON.parse(localStorage.getItem('cafeteria_productos')) || [];
  if (!productos.length) {
    productosTableBody.innerHTML = '<tr><td colspan="6">No hay productos registrados.</td></tr>';
    return;
  }
  productosTableBody.innerHTML = productos.map((p, i) => `
    <tr>
      <td><img src="${p.foto}" alt="foto" width="50" height="50" class="rounded"></td>
      <td>${p.nombre}</td>
      <td>$${parseFloat(p.precio).toFixed(2)}</td>
      <td>${p.stock}</td>
      <td>${p.categoria}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarProducto(${i})"><i class="bi bi-pencil"></i> Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${i})"><i class="bi bi-trash"></i> Eliminar</button>
      </td>
    </tr>
  `).join('');
}

window.editarProducto = function(index) {
  let productos = JSON.parse(localStorage.getItem('cafeteria_productos')) || [];
  const p = productos[index];
  document.getElementById('productoIndex').value = index;
  document.getElementById('nombre').value = p.nombre;
  document.getElementById('precio').value = p.precio;
  document.getElementById('stock').value = p.stock;
  document.getElementById('categoria').value = p.categoria;
  document.getElementById('previewImg').src = p.foto;
  var modal = new bootstrap.Modal(document.getElementById('modalProducto'));
  modal.show();
}

window.eliminarProducto = function(index) {
  console.log('Intentando eliminar producto en índice:', index);
  const sweet = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-secondary mx-3",
      denyButton: "btn btn-dark"
    },
    buttonsStyling: false
  });
  sweet.fire({
    title: "¿Estás seguro de eliminar este producto?",
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      let productos = JSON.parse(localStorage.getItem('cafeteria_productos')) || [];
      console.log('Productos antes de eliminar:', productos.length);
      productos.splice(index, 1);
      localStorage.setItem('cafeteria_productos', JSON.stringify(productos));
      console.log('Productos después de eliminar:', productos.length);
      renderProductos();
      Swal.fire("¡Éxito!", "Producto eliminado correctamente", "success");
    }
  });
}

function llenarCategorias() {
  const selectCategoria = document.getElementById('categoria');
  let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
  if (!Array.isArray(categorias) && categorias) categorias = [categorias];
  selectCategoria.innerHTML = categorias.map(c => `<option value="${c}">${c}</option>`).join('');
} 