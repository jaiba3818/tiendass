// Lógica de productos para admin

document.addEventListener('DOMContentLoaded', function() {
  renderProductos();
  llenarUsuarios();

  document.getElementById('formProducto').addEventListener('submit', function(e) {
    e.preventDefault();
    const fecha = document.getElementById('fecha').value;
    const monto = document.getElementById('monto').value;
    const metodo = document.getElementById('metodo').value;
    const usuario = document.getElementById('usuario').value;
    let productos = JSON.parse(localStorage.getItem('cafeteria_productos')) || [];
    productos.push({ fecha, monto, metodo, usuario });
    localStorage.setItem('cafeteria_productos', JSON.stringify(productos));
    renderProductos();
    document.getElementById('formProducto').reset();
    var modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
    modal.hide();
  });
});

function renderProductos() {
  const productosTableBody = document.getElementById('productosTableBody');
  let productos = JSON.parse(localStorage.getItem('cafeteria_productos')) || [];
  if (!productos.length) {
    productosTableBody.innerHTML = '<tr><td colspan="5">No hay productos registrados.</td></tr>';
    return;
  }
  productosTableBody.innerHTML = productos.map((p, i) => `
    <tr>
      <td>${p.fecha}</td>
      <td>$${parseFloat(p.monto).toFixed(2)}</td>
      <td>${p.metodo}</td>
      <td>${p.usuario}</td>
      <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto(${i})"><i class="bi bi-trash"></i> Eliminar</button></td>
    </tr>
  `).join('');
}

window.eliminarProducto = function(index) {
  let productos = JSON.parse(localStorage.getItem('cafeteria_productos')) || [];
  productos.splice(index, 1);
  localStorage.setItem('cafeteria_productos', JSON.stringify(productos));
  renderProductos();
}

function llenarUsuarios() {
  const selectUsuario = document.getElementById('usuario');
  let usuarios = JSON.parse(localStorage.getItem('cafeteria_usuarios')) || [];
  if (!Array.isArray(usuarios) && usuarios) usuarios = [usuarios];
  selectUsuario.innerHTML = usuarios.map(u => `<option value="${u.nombre}">${u.nombre}</option>`).join('');
} 