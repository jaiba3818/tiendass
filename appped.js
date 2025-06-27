// Lógica de pedidos para admin

document.addEventListener('DOMContentLoaded', function() {
  renderPedidos();
  llenarUsuarios();

  document.getElementById('formPedido').addEventListener('submit', function(e) {
    e.preventDefault();
    const index = document.getElementById('pedidoIndex').value;
    const fecha = document.getElementById('fecha').value;
    const monto = document.getElementById('monto').value;
    const metodo = document.getElementById('metodo').value;
    const usuario = document.getElementById('usuario').value;
    let pedidos = JSON.parse(localStorage.getItem('cafeteria_pedidos')) || [];
    const pedido = { fecha, monto, metodo, usuario };
    if (index === '') {
      pedidos.push(pedido);
    } else {
      pedidos[index] = pedido;
    }
    localStorage.setItem('cafeteria_pedidos', JSON.stringify(pedidos));
    renderPedidos();
    document.getElementById('formPedido').reset();
    document.getElementById('pedidoIndex').value = '';
    var modal = bootstrap.Modal.getInstance(document.getElementById('modalPedido'));
    modal.hide();
  });
});

function renderPedidos() {
  const pedidosTableBody = document.getElementById('pedidosTableBody');
  let pedidos = JSON.parse(localStorage.getItem('cafeteria_pedidos')) || [];
  if (!pedidos.length) {
    pedidosTableBody.innerHTML = '<tr><td colspan="5">No hay pedidos registrados.</td></tr>';
    return;
  }
  pedidosTableBody.innerHTML = pedidos.map((p, i) => `
    <tr>
      <td>${p.fecha}</td>
      <td>$${parseFloat(p.monto).toFixed(2)}</td>
      <td>${p.metodo}</td>
      <td>${p.usuario}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarPedido(${i})"><i class="bi bi-pencil"></i> Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarPedido(${i})"><i class="bi bi-trash"></i> Eliminar</button>
      </td>
    </tr>
  `).join('');
}

window.editarPedido = function(index) {
  let pedidos = JSON.parse(localStorage.getItem('cafeteria_pedidos')) || [];
  const p = pedidos[index];
  document.getElementById('pedidoIndex').value = index;
  document.getElementById('fecha').value = p.fecha;
  document.getElementById('monto').value = p.monto;
  document.getElementById('metodo').value = p.metodo;
  document.getElementById('usuario').value = p.usuario;
  var modal = new bootstrap.Modal(document.getElementById('modalPedido'));
  modal.show();
}

window.eliminarPedido = function(index) {
  console.log('Intentando eliminar pedido en índice:', index);
  const sweet = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-secondary mx-3",
      denyButton: "btn btn-dark"
    },
    buttonsStyling: false
  });
  sweet.fire({
    title: "¿Estás seguro de eliminar este pedido?",
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      let pedidos = JSON.parse(localStorage.getItem('cafeteria_pedidos')) || [];
      console.log('Pedidos antes de eliminar:', pedidos.length);
      pedidos.splice(index, 1);
      localStorage.setItem('cafeteria_pedidos', JSON.stringify(pedidos));
      console.log('Pedidos después de eliminar:', pedidos.length);
      renderPedidos();
      Swal.fire("¡Éxito!", "Pedido eliminado correctamente", "success");
    }
  });
}

function llenarUsuarios() {
  const selectUsuario = document.getElementById('usuario');
  let usuarios = JSON.parse(localStorage.getItem('cafeteria_usuarios')) || [];
  if (!Array.isArray(usuarios) && usuarios) usuarios = [usuarios];
  selectUsuario.innerHTML = usuarios.map(u => `<option value="${u.nombre}">${u.nombre}</option>`).join('');
} 