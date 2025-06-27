var categorias=JSON.parse(localStorage.getItem("categorias"))||[]

document.addEventListener('DOMContentLoaded', function() {
  cargarCategorias();
  
  // Evento para el formulario de agregar categoría
  document.getElementById('formCategoria').addEventListener('submit', function(e) {
    e.preventDefault();
    agregarCategoria();
  });
  
  // Evento para el botón de guardar cambios en editar
  document.getElementById('guardarCambiosBtn').onclick = function() {
    const nuevoNombre = document.getElementById('editarCategoriaInput').value.trim();
    if (nuevoNombre === '') {
      Swal.fire({title: "ERROR",text:"Falta llenar campos!!!", icon: "error"});
      return;
    }
    categorias[indiceEditar] = nuevoNombre;
    localStorage.setItem("categorias",JSON.stringify(categorias));
    cargarCategorias();
    var modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
    modal.hide();
    Swal.fire({title: "Éxito", text: "Categoría editada correctamente", icon: "success"});
  }
});

const agregarCategoria=()=>{
  let cat=document.getElementById('categoria').value
  if(cat.trim()===''){
    Swal.fire({title: "ERROR",text:"Falta llenar campos!!!", icon: "error"});
    return;
  }
  
  categorias.push(cat);
  localStorage.setItem("categorias",JSON.stringify(categorias))
  document.getElementById('categoria').value=""
  cargarCategorias()
  
  // Cerrar el modal
  var modal = bootstrap.Modal.getInstance(document.getElementById('modalCategoria'));
  modal.hide();
  
  Swal.fire({title: "Éxito", text: "Categoría agregada correctamente", icon: "success"});
}
  
const cargarCategorias=()=>{
  categorias=JSON.parse(localStorage.getItem("categorias"))||[]
  let tablita="";
  let index=0;
  categorias.map(categoria=>{
    tablita+=`
    <tr>
      <td>${categoria}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarCategoria(${index})"><i class="bi bi-pencil"></i> Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarCategoria(${index})"><i class="bi bi-trash"></i> Eliminar</button>
      </td>
    </tr>
    `
    index++;
 } )
 document.getElementById("lista").innerHTML=tablita
}

const eliminarCategoria=(index)=>{
  const sweet = Swal.mixin({
      customClass: {
          confirmButton: "btn btn-secondary mx-3",
          denyButton: "btn btn-dark"
      },
      buttonsStyling: false
  });
  sweet.fire({
      title: "¿Estás seguro de eliminar esta categoría?",
      showDenyButton: true,
      confirmButtonText: "Sí",
      denyButtonText: 'No'
      }).then((result) => {
      if (result.isConfirmed) { 
        categorias.splice(index,1)
        localStorage.setItem("categorias",JSON.stringify(categorias))
        cargarCategorias()
        Swal.fire("¡Éxito!", "Se eliminó correctamente", "success");
      } 
  });
}

// Variable global para saber qué índice se está editando
let indiceEditar = null;

function editarCategoria(index) {
  indiceEditar = index;
  document.getElementById('editarCategoriaInput').value = categorias[index];
  var modal = new bootstrap.Modal(document.getElementById('modalEditar'));
  modal.show();
}
  
