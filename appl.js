// Lógica de registro y login para Cafetería 2.0

// --- REGISTRO ---
const formRegistro = document.getElementById('formRegistro');
if (formRegistro) {
  formRegistro.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const fotoInput = document.getElementById('foto');
    let fotoBase64 = '';
    if (fotoInput.files[0]) {
      fotoBase64 = await toBase64(fotoInput.files[0]);
    }
    // Validaciones
    if (!validateEmail(email)) {
      alert('Correo electrónico no válido');
      return;
    }
    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    // Obtener usuarios actuales
    let usuarios = JSON.parse(localStorage.getItem('cafeteria_usuarios')) || [];
    if (!Array.isArray(usuarios)) usuarios = [];
    // Verificar si el email ya está registrado
    if (usuarios.some(u => u.email === email)) {
      alert('Este correo ya está registrado.');
      return;
    }
    // Guardar usuario en el array
    const usuario = { nombre, email, password, foto: fotoBase64, tipo: (email === 'fer@gmail.com' ? 'admin' : 'cliente') };
    usuarios.push(usuario);
    localStorage.setItem('cafeteria_usuarios', JSON.stringify(usuarios));
    // También guardar el usuario actual para la sesión
    localStorage.setItem('cafeteria_usuario', JSON.stringify(usuario));
    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    window.location.href = 'iniciars.html';
  });
}

// --- LOGIN ---
const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    // Validación admin
    if (email === 'fer@gmail.com' && password === 'fernando123F$') {
      const admin = { nombre: 'Administrador', email, password, tipo: 'admin', foto: '' };
      localStorage.setItem('cafeteria_usuario', JSON.stringify(admin));
      alert('Bienvenido Administrador');
      window.location.href = 'panelA.html';
      return;
    }
    // Validación usuario registrado
    const usuarios = JSON.parse(localStorage.getItem('cafeteria_usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (usuario) {
      localStorage.setItem('cafeteria_usuario', JSON.stringify(usuario));
      alert('Bienvenido ' + usuario.nombre);
      window.location.href = 'cliente.html';
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  });
}

// --- Utilidades ---
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
