// Mostrar usuarios registrados en usuariosr.html

document.addEventListener('DOMContentLoaded', function() {
  const usuariosTableBody = document.getElementById('usuariosTableBody');
  if (usuariosTableBody) {
    renderUsuarios();
  }
});

function renderUsuarios() {
  const usuariosTableBody = document.getElementById('usuariosTableBody');
  let usuarios = JSON.parse(localStorage.getItem('cafeteria_usuarios')) || [];
  if (!Array.isArray(usuarios) && usuarios) {
    usuarios = [usuarios];
  }
  if (!usuarios || usuarios.length === 0) {
    usuariosTableBody.innerHTML = '<tr><td colspan="6">No hay usuarios registrados.</td></tr>';
    return;
  }
  usuariosTableBody.innerHTML = usuarios.map((u, i) => `
    <tr>
      <td><img src="${u.foto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="foto" width="50" height="50" class="rounded-circle"></td>
      <td>${u.nombre}</td>
      <td>${u.email}</td>
      <td>${btoa(u.password)}</td>
      <td>${u.tipo || 'cliente'}</td>
      <td><button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${i})"><i class="bi bi-trash"></i> Eliminar</button></td>
    </tr>
  `).join('');
}

window.eliminarUsuario = function(index) {
  let usuarios = JSON.parse(localStorage.getItem('cafeteria_usuarios')) || [];
  if (!Array.isArray(usuarios) && usuarios) {
    usuarios = [usuarios];
  }
  if (confirm('¿Seguro que deseas eliminar este usuario?')) {
    usuarios.splice(index, 1);
    localStorage.setItem('cafeteria_usuarios', JSON.stringify(usuarios));
    renderUsuarios();
  }
}
